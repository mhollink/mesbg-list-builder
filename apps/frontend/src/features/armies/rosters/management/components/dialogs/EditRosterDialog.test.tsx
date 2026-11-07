import type { RosterSummary } from "@mlb/api-client";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { EditRosterDialog } from "./EditRosterDialog.tsx";
import { render, screen, waitFor } from "~/test/render";

const mocks = vi.hoisted(() => ({
  update: vi.fn(),
  reset: vi.fn(),
  state: { isLoading: false, isError: false },
}));

vi.mock("~/features/armies/rosters/api/rosters-api.ts", () => ({
  useUpdateRosterMutation: () => [
    mocks.update,
    { ...mocks.state, reset: mocks.reset },
  ],
}));

const roster = {
  id: 42,
  name: "Mordor",
  armyListId: "mordor",
  pointsLimit: 750,
  tags: ["Tournament"],
} as RosterSummary;

describe("EditRosterDialog", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.state = { isLoading: false, isError: false };
    mocks.update.mockReturnValue({ unwrap: () => Promise.resolve() });
  });

  it("saves updated metadata and closes after success", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <EditRosterDialog
        roster={roster}
        onClose={onClose}
        tagSuggestions={[]}
      />,
    );

    const input = screen.getByRole("textbox", { name: "Roster name" });
    await user.clear(input);
    await user.type(input, "My Mordor");
    await user.click(screen.getByRole("button", { name: "Save changes" }));

    await waitFor(() => expect(onClose).toHaveBeenCalledOnce());
    expect(mocks.update).toHaveBeenCalledWith({
      rosterId: 42,
      request: { name: "My Mordor", pointsLimit: 750, tags: ["Tournament"] },
    });
  });

  it("explicitly clears an existing points limit", async () => {
    const user = userEvent.setup();
    render(
      <EditRosterDialog
        roster={roster}
        onClose={vi.fn()}
        tagSuggestions={[]}
      />,
    );

    await user.clear(screen.getByRole("spinbutton", { name: "Point limit" }));
    await user.click(screen.getByRole("button", { name: "Save changes" }));

    await waitFor(() => expect(mocks.update).toHaveBeenCalledOnce());
    expect(mocks.update).toHaveBeenCalledWith({
      rosterId: 42,
      request: { name: "Mordor", tags: ["Tournament"], clearPointsLimit: true },
    });
  });

  it("does not submit blank names or invalid limits", async () => {
    const user = userEvent.setup();
    render(
      <EditRosterDialog
        roster={roster}
        onClose={vi.fn()}
        tagSuggestions={[]}
      />,
    );

    await user.clear(screen.getByRole("textbox", { name: "Roster name" }));
    expect(screen.getByRole("button", { name: "Save changes" })).toBeDisabled();

    await user.type(
      screen.getByRole("textbox", { name: "Roster name" }),
      "Valid",
    );
    await user.clear(screen.getByRole("spinbutton", { name: "Point limit" }));
    await user.type(
      screen.getByRole("spinbutton", { name: "Point limit" }),
      "0",
    );
    expect(screen.getByRole("button", { name: "Save changes" })).toBeDisabled();
    expect(mocks.update).not.toHaveBeenCalled();
  });
});
