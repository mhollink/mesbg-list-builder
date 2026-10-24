import { describe, expect, it, vi } from "vitest";

import { supporterTiers } from "../types/support-tiers.types.ts";
import type { Supporter } from "../types/supporter.types.ts";
import { sortSupporters } from "../utils/supporter-sorting.utils.ts";
import { SupporterWall } from "./SupporterWall.tsx";
import { fireEvent, render, screen } from "~/test/render";

const supporters: Supporter[] = [
  { id: "aragorn", name: "Supporter 1", tier: "Hero of Legend" },
  { id: "boromir", name: "Supporter 2" },
  { id: "eowyn", name: "Supporter 3", tier: "Minor Hero" },
  { id: "faramir", name: "Supporter 4" },
  { id: "gandalf", name: "Supporter 5" },
  { id: "gimli", name: "Supporter 6" },
  { id: "legolas", name: "Supporter 7" },
  { id: "pippin", name: "Supporter 8" },
];

function renderedNames() {
  return screen
    .getAllByText(/^Supporter \d+$/)
    .map((element) => element.textContent);
}

describe("SupporterWall", () => {
  it("renders all supporters and the tier legend", () => {
    render(<SupporterWall supporters={supporters} />);

    for (const supporter of supporters) {
      expect(screen.getByText(supporter.name)).toBeInTheDocument();
    }
    for (const tier of supporterTiers) {
      expect(screen.getByText(tier)).toBeInTheDocument();
    }
  });

  it("renders an initial for supporters without an avatar or a tier", () => {
    render(<SupporterWall supporters={[{ id: "bilbo", name: "Bilbo" }]} />);

    expect(
      screen.getByText("B", { selector: ".MuiAvatar-root" }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("renders a supporter avatar URL when one is provided", () => {
    const { container } = render(
      <SupporterWall
        supporters={[
          { id: "bilbo", name: "Bilbo", avatarUrl: "/supporters/bilbo.webp" },
        ]}
      />,
    );

    expect(container.querySelector(".MuiAvatar-img")).toHaveAttribute(
      "src",
      "/supporters/bilbo.webp",
    );
  });

  it("links only supporters who have a public profile URL", () => {
    render(
      <SupporterWall
        supporters={[
          {
            id: "bilbo",
            name: "Bilbo",
            profileUrl: "https://example.com/bilbo",
          },
          { id: "frodo", name: "Frodo" },
        ]}
      />,
    );

    expect(screen.getByRole("link", { name: /Bilbo/ })).toHaveAttribute(
      "href",
      "https://example.com/bilbo",
    );
    expect(screen.getByRole("link", { name: /Bilbo/ })).toHaveAttribute(
      "target",
      "_blank",
    );
    expect(screen.getByRole("link", { name: /Bilbo/ })).toHaveAttribute(
      "rel",
      "noopener noreferrer",
    );
    expect(
      screen.queryByRole("link", { name: /Frodo/ }),
    ).not.toBeInTheDocument();
  });

  it("shows the Patreon tier in the avatar tooltip", async () => {
    render(
      <SupporterWall
        supporters={[{ id: "bilbo", name: "Bilbo", tier: "Hero of Legend" }]}
      />,
    );

    fireEvent.mouseOver(screen.getByText("B", { selector: ".MuiAvatar-root" }));

    expect(await screen.findByRole("tooltip")).toHaveTextContent(
      "Hero of Legend",
    );
  });

  it("uses a stable daily ordering regardless of the original data order", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-10-21T12:00:00Z"));

    try {
      const { rerender } = render(<SupporterWall supporters={supporters} />);
      const expected = sortSupporters(supporters, "2026-10-21").map(
        (supporter) => supporter.name,
      );

      expect(renderedNames()).toEqual(expected);

      rerender(<SupporterWall supporters={[...supporters].reverse()} />);
      expect(renderedNames()).toEqual(expected);
    } finally {
      vi.useRealTimers();
    }
  });

  it("rotates when the UTC day changes and new data triggers a recalculation", () => {
    vi.useFakeTimers();

    try {
      vi.setSystemTime(new Date("2026-10-21T12:00:00Z"));
      const { rerender } = render(<SupporterWall supporters={supporters} />);
      const firstDay = renderedNames();

      vi.setSystemTime(new Date("2026-10-22T12:00:00Z"));
      rerender(<SupporterWall supporters={[...supporters]} />);
      const secondDay = renderedNames();

      expect(secondDay).toEqual(
        sortSupporters(supporters, "2026-10-22").map(({ name }) => name),
      );
      expect(secondDay).not.toEqual(firstDay);
    } finally {
      vi.useRealTimers();
    }
  });
});
