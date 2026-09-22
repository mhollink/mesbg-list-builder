import type { RosterGroup, RosterSummary } from "@mlb/api-client";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { RosterGrid } from "./RosterGrid.tsx";

vi.mock("~/features/reference/army-lists/hooks/useGameArmyLists.ts", () => ({
  useGameArmyLists: () => ({
    armyLists: [{ id: "mordor", name: "Mordor" }],
  }),
}));

vi.mock("./cards/RosterGroupCard", () => ({
  RosterGroupCard: ({
    group,
    rosterCount,
  }: {
    group: RosterGroup;
    rosterCount: number;
  }) => (
    <div>
      group:{group.name}:{rosterCount}
    </div>
  ),
}));

vi.mock("./cards/RosterCard", () => ({
  RosterCard: ({
    roster,
    armyList,
  }: {
    roster: RosterSummary;
    armyList: string;
  }) => (
    <div>
      roster:{roster.name}:{armyList}
    </div>
  ),
}));

describe("RosterGrid", () => {
  it("shows the empty group state", () => {
    renderGrid([], []);

    expect(screen.getByText("This group is empty")).toBeInTheDocument();
    expect(
      screen.getByText("Create a roster or another group to get started."),
    ).toBeInTheDocument();
  });

  it("renders groups, direct counts and localized army list names", () => {
    const getRosterCount = vi.fn().mockReturnValue(2);

    renderGrid(
      [{ id: 12, name: "Events", children: [] } as RosterGroup],
      [
        { id: 42, name: "List", armyListId: "mordor" } as RosterSummary,
        { id: 43, name: "Legacy", armyListId: "unknown" } as RosterSummary,
      ],
      getRosterCount,
    );

    expect(screen.getByText("group:Events:2")).toBeInTheDocument();
    expect(screen.getByText("roster:List:Mordor")).toBeInTheDocument();
    expect(screen.getByText("roster:Legacy:unknown")).toBeInTheDocument();
    expect(getRosterCount).toHaveBeenCalledWith(12);
  });
});

function renderGrid(
  groups: RosterGroup[],
  rosters: RosterSummary[],
  getRosterCount = vi.fn(),
) {
  return render(
    <RosterGrid
      groups={groups}
      rosters={rosters}
      getRosterCount={getRosterCount}
      onRenameGroup={vi.fn()}
      onDeleteGroup={vi.fn()}
      onMoveRoster={vi.fn()}
      onDeleteRoster={vi.fn()}
    />,
  );
}
