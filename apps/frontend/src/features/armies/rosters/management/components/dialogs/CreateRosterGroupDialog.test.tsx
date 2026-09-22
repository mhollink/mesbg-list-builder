import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { CreateRosterGroupDialog } from "./CreateRosterGroupDialog.tsx";

const mocks = vi.hoisted(() => ({
  createGroup: vi.fn(),
  unwrap: vi.fn(),
  state: { isLoading: false, isError: false },
}));

vi.mock("../../../api/roster-group-api", () => ({
  useCreateRosterGroupMutation: () => [mocks.createGroup, mocks.state],
}));

describe("CreateRosterGroupDialog", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.state = { isLoading: false, isError: false };
    mocks.unwrap.mockResolvedValue(undefined);
    mocks.createGroup.mockReturnValue({ unwrap: mocks.unwrap });
  });

  it("creates a trimmed nested group and closes", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <CreateRosterGroupDialog open parentGroupId={12} onClose={onClose} />,
    );

    await user.type(screen.getByLabelText("Group name"), "  Events  ");
    await user.click(screen.getByRole("button", { name: "Create" }));

    expect(mocks.createGroup).toHaveBeenCalledWith({
      name: "Events",
      parentGroupId: 12,
    });
    expect(mocks.unwrap).toHaveBeenCalledOnce();
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("omits the parent id when creating a root group", async () => {
    const user = userEvent.setup();

    render(
      <CreateRosterGroupDialog open parentGroupId={null} onClose={vi.fn()} />,
    );

    await user.type(screen.getByLabelText("Group name"), "Root");
    await user.click(screen.getByRole("button", { name: "Create" }));

    expect(mocks.createGroup).toHaveBeenCalledWith({
      name: "Root",
      parentGroupId: undefined,
    });
  });

  it("renders mutation errors", () => {
    mocks.state = { isLoading: false, isError: true };

    render(
      <CreateRosterGroupDialog open parentGroupId={null} onClose={vi.fn()} />,
    );

    expect(screen.getByText("Could not create the group.")).toBeInTheDocument();
  });
});
