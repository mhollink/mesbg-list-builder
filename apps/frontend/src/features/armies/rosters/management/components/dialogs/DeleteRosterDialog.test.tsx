import type { RosterSummary } from "@mlb/api-client";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { DeleteRosterDialog } from "./DeleteRosterDialog.tsx";

const mocks = vi.hoisted(() => ({
  deleteRoster: vi.fn(),
  unwrap: vi.fn(),
  state: { isLoading: false, isError: false },
}));

vi.mock("../../../api/roster-api.ts", () => ({
  useDeleteRosterMutation: () => [mocks.deleteRoster, mocks.state],
}));

describe("DeleteRosterDialog", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.state = { isLoading: false, isError: false };
    mocks.unwrap.mockResolvedValue(undefined);
    mocks.deleteRoster.mockReturnValue({ unwrap: mocks.unwrap });
  });

  it("deletes the selected roster and closes", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(<DeleteRosterDialog roster={roster()} onClose={onClose} />);

    expect(
      screen.getByText('Delete "Mordor"? This cannot be undone.'),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Delete" }));

    expect(mocks.deleteRoster).toHaveBeenCalledWith(42);
    expect(mocks.unwrap).toHaveBeenCalledOnce();
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("renders a deletion error", () => {
    mocks.state = { isLoading: false, isError: true };

    render(<DeleteRosterDialog roster={roster()} onClose={vi.fn()} />);

    expect(
      screen.getByText("The roster could not be deleted."),
    ).toBeInTheDocument();
  });
});

function roster(): RosterSummary {
  return { id: 42, name: "Mordor" } as RosterSummary;
}
