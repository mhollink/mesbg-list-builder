import type { RosterGroup, RosterSummary } from "@mlb/api-client";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { MoveRosterDialog } from "./MoveRosterDialog.tsx";

const mocks = vi.hoisted(() => ({
  moveToGroup: vi.fn(),
  moveToGroupUnwrap: vi.fn(),
  moveToRoot: vi.fn(),
  moveToRootUnwrap: vi.fn(),
  groupState: { isLoading: false },
  rootState: { isLoading: false },
}));

vi.mock("../../../api/roster-api", () => ({
  useMoveRosterToGroupMutation: () => [mocks.moveToGroup, mocks.groupState],
  useMoveRosterToRootMutation: () => [mocks.moveToRoot, mocks.rootState],
}));

describe("MoveRosterDialog", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.groupState = { isLoading: false };
    mocks.rootState = { isLoading: false };
    mocks.moveToGroupUnwrap.mockResolvedValue(undefined);
    mocks.moveToRootUnwrap.mockResolvedValue(undefined);
    mocks.moveToGroup.mockReturnValue({ unwrap: mocks.moveToGroupUnwrap });
    mocks.moveToRoot.mockReturnValue({ unwrap: mocks.moveToRootUnwrap });
  });

  it("moves a grouped roster to root", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <MoveRosterDialog
        roster={roster(12)}
        groups={groups}
        onClose={onClose}
      />,
    );

    expect(screen.getByRole("button", { name: "Move" })).toBeDisabled();

    await user.click(screen.getByLabelText("My Rosters"));
    await user.click(screen.getByRole("button", { name: "Move" }));

    expect(mocks.moveToRoot).toHaveBeenCalledWith(42);
    expect(mocks.moveToRootUnwrap).toHaveBeenCalledOnce();
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("moves a roster into a nested group", async () => {
    const user = userEvent.setup();

    render(
      <MoveRosterDialog
        roster={roster(null)}
        groups={groups}
        onClose={vi.fn()}
      />,
    );

    await user.click(screen.getByLabelText("Nested"));
    await user.click(screen.getByRole("button", { name: "Move" }));

    expect(mocks.moveToGroup).toHaveBeenCalledWith({
      rosterId: 42,
      groupId: 13,
    });
    expect(mocks.moveToGroupUnwrap).toHaveBeenCalledOnce();
  });
});

function roster(groupId: number | null): RosterSummary {
  return {
    id: 42,
    name: "Mordor",
    groupId,
  } as RosterSummary;
}

const groups: RosterGroup[] = [
  {
    id: 12,
    name: "Events",
    children: [
      {
        id: 13,
        name: "Nested",
        children: [],
      } as RosterGroup,
    ],
  } as RosterGroup,
];
