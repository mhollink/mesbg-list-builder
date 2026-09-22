import type { RosterGroup } from "@mlb/api-client";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { DeleteRosterGroupDialog } from "./DeleteRosterGroupDialog.tsx";

const mocks = vi.hoisted(() => ({
  deleteGroup: vi.fn(),
  unwrap: vi.fn(),
  state: { isLoading: false, isError: false },
}));

vi.mock("../../../api/roster-group-api", () => ({
  useDeleteRosterGroupMutation: () => [mocks.deleteGroup, mocks.state],
}));

describe("DeleteRosterGroupDialog", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.state = { isLoading: false, isError: false };
    mocks.unwrap.mockResolvedValue(undefined);
    mocks.deleteGroup.mockReturnValue({ unwrap: mocks.unwrap });
  });

  it("deletes an empty group and closes", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(<DeleteRosterGroupDialog group={group()} onClose={onClose} />);

    await user.click(screen.getByRole("button", { name: "Delete" }));

    expect(mocks.deleteGroup).toHaveBeenCalledWith(12);
    expect(mocks.unwrap).toHaveBeenCalledOnce();
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("explains why a group could not be deleted", () => {
    mocks.state = { isLoading: false, isError: true };

    render(<DeleteRosterGroupDialog group={group()} onClose={vi.fn()} />);

    expect(
      screen.getByText(
        "The group could not be deleted. Only empty groups can be removed.",
      ),
    ).toBeInTheDocument();
  });
});

function group(): RosterGroup {
  return { id: 12, name: "Events", children: [] } as RosterGroup;
}
