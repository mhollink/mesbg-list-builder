import { MemoryRouter } from "react-router";

import type { RosterGroup } from "@mlb/api-client";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { RosterBreadcrumbs } from "./RosterBreadcrumbs.tsx";

vi.mock("@dnd-kit/react", () => ({
  useDroppable: () => ({
    ref: vi.fn(),
    isDropTarget: false,
  }),
}));

describe("RosterBreadcrumbs", () => {
  it("renders nothing at the root", () => {
    renderBreadcrumbs([]);

    expect(
      screen.queryByLabelText("Roster group navigation"),
    ).not.toBeInTheDocument();
  });

  it("renders root and parent links while leaving the current group as text", () => {
    renderBreadcrumbs([group(10, "Events"), group(11, "Tournament")]);

    expect(screen.getByRole("link", { name: "My Rosters" })).toHaveAttribute(
      "href",
      "/armies/rosters",
    );

    expect(screen.getByRole("link", { name: "Events" })).toHaveAttribute(
      "href",
      "/armies/rosters/groups/10",
    );

    expect(screen.getByText("Tournament")).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: "Tournament" }),
    ).not.toBeInTheDocument();
  });
});

function renderBreadcrumbs(path: RosterGroup[]) {
  return render(
    <MemoryRouter>
      <RosterBreadcrumbs path={path} />
    </MemoryRouter>,
  );
}

function group(id: number, name: string): RosterGroup {
  return { id, name, children: [] } as RosterGroup;
}
