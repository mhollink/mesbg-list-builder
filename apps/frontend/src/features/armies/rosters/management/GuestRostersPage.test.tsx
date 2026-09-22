import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { GuestRostersPage } from "./GuestRostersPage.tsx";
import type { GuestRoster } from "~/features/armies/rosters/guest/guest-roster.types.ts";

const mocks = vi.hoisted(() => ({
  dispatch: vi.fn(),
  roster: null as GuestRoster | null,
  showCreateRoster: vi.fn(),
  closeCreateRoster: vi.fn(),
  createRosterOpen: false,
}));

vi.mock("~/app/store/hooks.ts", () => ({
  useAppDispatch: () => mocks.dispatch,
  useAppSelector: () => mocks.roster,
}));

vi.mock(
  "~/features/armies/rosters/guest/components/GuestRosterCard.tsx",
  () => ({
    GuestRosterCard: ({
      roster,
      onDelete,
    }: {
      roster: GuestRoster;
      onDelete: () => void;
    }) => (
      <div>
        <span>guest-card:{roster.name}</span>
        <button type="button" onClick={onDelete}>
          delete guest roster
        </button>
      </div>
    ),
  }),
);

vi.mock(
  "~/features/armies/rosters/management/components/dialogs/CreateRosterDialog.tsx",
  () => ({
    CreateRosterDialog: ({ open }: { open: boolean }) => (
      <div>create-dialog:{String(open)}</div>
    ),
  }),
);

vi.mock(
  "~/features/armies/rosters/management/hooks/useRosterDialogs.ts",
  () => ({
    useRosterDialogs: () => ({
      createRoster: {
        open: mocks.createRosterOpen,
        show: mocks.showCreateRoster,
        close: mocks.closeCreateRoster,
      },
    }),
  }),
);

describe("GuestRostersPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.roster = null;
    mocks.createRosterOpen = false;
  });

  it("shows the guest empty state", () => {
    render(<GuestRostersPage />);

    expect(
      screen.getByRole("heading", { name: "My Rosters" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Create a roster to get started."),
    ).toBeInTheDocument();
  });

  it("renders an existing guest roster and clears it on delete", () => {
    mocks.roster = guestRoster();

    render(<GuestRostersPage />);

    expect(screen.getByText("guest-card:Guest Mordor")).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: "delete guest roster" }),
    );

    expect(mocks.dispatch).toHaveBeenCalledWith({
      type: "guestRoster/clearGuestRoster",
    });
  });

  it("opens the create roster dialog from the floating action button", () => {
    render(<GuestRostersPage />);

    fireEvent.click(screen.getByRole("button", { name: "add guest roster" }));

    expect(mocks.showCreateRoster).toHaveBeenCalledOnce();
  });
});

function guestRoster(): GuestRoster {
  return {
    id: "guest",
    name: "Guest Mordor",
    armyListId: "mordor",
    tags: [],
    warbands: [],
    createdAt: "",
    updatedAt: "",
  };
}
