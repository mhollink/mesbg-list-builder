import { describe, expect, it, vi } from "vitest";

import { RoadmapPage } from "./RoadmapPage.tsx";
import { fireEvent, render, screen } from "~/test/render";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe("RoadmapPage", () => {
  it("shows the current chapter and its nested deliverables initially", () => {
    render(<RoadmapPage />);

    expect(
      screen.getByRole("heading", { name: "hero.title" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "features.building.title" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "features.building.milestones.warbands.deliverables.create",
      ),
    ).toBeInTheDocument();
  });

  it("expands another chapter and its milestones", () => {
    render(<RoadmapPage />);

    fireEvent.click(
      screen.getByRole("button", { name: /features.reference.title/ }),
    );
    fireEvent.click(
      screen.getByRole("button", {
        name: /features.reference.milestones.rules.title/,
      }),
    );

    expect(
      screen.getByText(
        "features.reference.milestones.rules.deliverables.browse",
      ),
    ).toBeInTheDocument();
  });
});
