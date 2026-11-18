import type { RosterSummary } from "@mlb/api-client";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { DuplicateRosterDialog } from "./DuplicateRosterDialog.tsx";
import { fireEvent, render, screen, waitFor } from "~/test/render";

const mocks = vi.hoisted(() => ({
  duplicate: vi.fn(),
  navigate: vi.fn(),
  reset: vi.fn(),
  state: { isLoading: false, isError: false },
}));

vi.mock("react-router", async (importOriginal) => ({
  ...(await importOriginal<typeof import("react-router")>()),
  useNavigate: () => mocks.navigate,
}));

vi.mock("~/features/armies/rosters/api/rosters-api.ts", () => ({
  useDuplicateRosterMutation: () => [
    mocks.duplicate,
    { ...mocks.state, reset: mocks.reset },
  ],
}));

const roster = {
  id: 42,
  name: "Mordor",
  favorite: true,
  locked: true,
} as RosterSummary;

describe("DuplicateRosterDialog", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.state = { isLoading: false, isError: false };
    mocks.duplicate.mockReturnValue({
      unwrap: () => Promise.resolve({ id: 99 }),
    });
  });

  it("initializes the copy with a suggested name and disabled options", () => {
    renderDialog();

    expect(screen.getByRole("textbox", { name: "Roster name" })).toHaveValue(
      "Mordor (copy)",
    );

    expect(
      screen.getByRole("switch", { name: "Add to favorites" }),
    ).not.toBeChecked();

    expect(
      screen.getByRole("switch", { name: "Lock new roster" }),
    ).not.toBeChecked();

    expect(mocks.reset).toHaveBeenCalledOnce();
  });

  it("duplicates a roster and navigates to the new roster", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    renderDialog(roster, onClose);

    const name = screen.getByRole("textbox", { name: "Roster name" });
    await user.clear(name);
    await user.type(name, "  My Mordor  ");

    await user.click(screen.getByRole("button", { name: "Duplicate roster" }));

    await waitFor(() => {
      expect(mocks.navigate).toHaveBeenCalledWith("/armies/rosters/99");
    });

    expect(mocks.duplicate).toHaveBeenCalledWith({
      rosterId: 42,
      request: {
        name: "My Mordor",
        favorite: false,
        locked: false,
      },
    });

    expect(onClose).toHaveBeenCalledOnce();
  });

  it("includes the selected favorite and locked options", async () => {
    const user = userEvent.setup();

    renderDialog();

    await user.click(
      screen.getByRole("switch", {
        name: "Add to favorites",
      }),
    );

    await user.click(
      screen.getByRole("switch", {
        name: "Lock new roster",
      }),
    );

    await user.click(screen.getByRole("button", { name: "Duplicate roster" }));

    await waitFor(() => {
      expect(mocks.duplicate).toHaveBeenCalledWith({
        rosterId: 42,
        request: {
          name: "Mordor (copy)",
          favorite: true,
          locked: true,
        },
      });
    });
  });

  it("prevents duplication with an invalid name", async () => {
    const user = userEvent.setup();

    renderDialog();

    const name = screen.getByRole("textbox", { name: "Roster name" });
    const submit = screen.getByRole("button", { name: "Duplicate roster" });

    await user.clear(name);
    expect(submit).toBeDisabled();

    await user.type(name, "   ");
    expect(submit).toBeDisabled();

    fireEvent.change(name, {
      target: { value: "x".repeat(256) },
    });
    expect(submit).toBeDisabled();

    expect(mocks.duplicate).not.toHaveBeenCalled();
  });

  it("resets its fields when another roster is selected", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    const { rerender } = renderDialog(roster, onClose);

    await user.clear(screen.getByRole("textbox", { name: "Roster name" }));
    await user.type(
      screen.getByRole("textbox", { name: "Roster name" }),
      "Custom name",
    );

    await user.click(
      screen.getByRole("switch", {
        name: "Add to favorites",
      }),
    );

    const anotherRoster = {
      id: 43,
      name: "Isengard",
    } as RosterSummary;

    rerender(
      <DuplicateRosterDialog roster={anotherRoster} onClose={onClose} />,
    );

    expect(screen.getByRole("textbox", { name: "Roster name" })).toHaveValue(
      "Isengard (copy)",
    );

    expect(
      screen.getByRole("switch", { name: "Add to favorites" }),
    ).not.toBeChecked();

    expect(
      screen.getByRole("switch", { name: "Lock new roster" }),
    ).not.toBeChecked();

    expect(mocks.reset).toHaveBeenCalledTimes(2);
  });

  it("keeps the dialog open when duplication fails", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    mocks.duplicate.mockReturnValue({
      unwrap: () => Promise.reject(new Error("Request failed")),
    });

    const { rerender } = renderDialog(roster, onClose);

    await user.click(screen.getByRole("button", { name: "Duplicate roster" }));

    await waitFor(() => {
      expect(mocks.duplicate).toHaveBeenCalledOnce();
    });

    // Simulate the mutation returning its error state.
    mocks.state = { isLoading: false, isError: true };
    rerender(<DuplicateRosterDialog roster={roster} onClose={onClose} />);

    expect(screen.getByRole("alert")).toHaveTextContent(
      "The roster could not be duplicated",
    );

    expect(onClose).not.toHaveBeenCalled();
    expect(mocks.navigate).not.toHaveBeenCalled();
  });

  it("disables actions while duplication is in progress", () => {
    mocks.state = { isLoading: true, isError: false };

    renderDialog();

    expect(screen.getByRole("button", { name: "Cancel" })).toBeDisabled();

    expect(
      screen.getByRole("button", { name: "Duplicate roster" }),
    ).toBeDisabled();
  });

  it("does not display the dialog without a selected roster", () => {
    renderDialog(null);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(mocks.duplicate).not.toHaveBeenCalled();
  });
});

function renderDialog(value: RosterSummary | null = roster, onClose = vi.fn()) {
  return render(<DuplicateRosterDialog roster={value} onClose={onClose} />);
}
