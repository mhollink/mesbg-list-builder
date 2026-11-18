import type { RosterGroup } from "@mlb/api-client";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { EditRosterGroupDialog } from "./EditRosterGroupDialog.tsx";
import { render, screen } from "~/test/render";

const mocks = vi.hoisted(() => ({
  renameGroup: vi.fn(),
  unwrap: vi.fn(),
  state: { isLoading: false, isError: false },
}));

vi.mock("../../../api/roster-group-api", () => ({
  useUpdateRosterGroupMutation: () => [mocks.renameGroup, mocks.state],
}));

describe("EditRosterGroupDialog", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.state = { isLoading: false, isError: false };
    mocks.unwrap.mockResolvedValue(undefined);
    mocks.renameGroup.mockReturnValue({ unwrap: mocks.unwrap });
  });

  it("loads the current name and submits a trimmed replacement", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(<EditRosterGroupDialog group={group()} onClose={onClose} />);

    const input = screen.getByLabelText("Group name");
    expect(input).toHaveValue("Events");
    expect(screen.getByRole("button", { name: "Update" })).toBeDisabled();

    await user.clear(input);
    await user.type(input, "  Tournament  ");
    await user.click(screen.getByRole("button", { name: "Update" }));

    expect(mocks.renameGroup).toHaveBeenCalledWith({
      groupId: 12,
      updateRosterGroupRequest: {
        name: "Tournament",
        icon: "folder",
      },
    });
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("renders mutation errors", () => {
    mocks.state = { isLoading: false, isError: true };

    render(<EditRosterGroupDialog group={group()} onClose={vi.fn()} />);

    expect(screen.getByText("Could not update the group.")).toBeInTheDocument();
  });
});

function group(): RosterGroup {
  return {
    id: 12,
    name: "Events",
    icon: "folder",
    children: [],
  } as RosterGroup;
}
