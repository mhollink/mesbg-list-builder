import { MemoryRouter } from "react-router";

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import type { GuestRoster } from "../guest-roster.types.ts";
import { GuestRosterCard } from "./GuestRosterCard.tsx";

vi.mock("~/components/heraldry/HeraldryIcon.tsx", () => ({
  HeraldryIcon: () => <span data-testid="heraldry-icon" />,
}));

vi.mock("~/features/reference/profiles/hooks/useGameProfiles.ts", () => ({
  useGameProfiles: () => ({
    profiles: [],
  }),
}));

vi.mock("~/features/reference/army-lists/hooks/useGameArmyLists.ts", () => ({
  useGameArmyLists: () => ({
    armyLists: [
      {
        id: "mordor",
        name: "Mordor",
      },
    ],
  }),
}));

vi.mock("~/features/armies/rosters/guest/guest-roster.utils.ts", async () => {
  const actual = await vi.importActual<
    typeof import("~/features/armies/rosters/guest/guest-roster.utils.ts")
  >("~/features/armies/rosters/guest/guest-roster.utils.ts");

  return {
    ...actual,
    calculateGuestRosterStats: () => ({
      points: 500,
      modelCount: 24,
      warbandCount: 2,
      might: 6,
      bowCount: 8,
      throwingWeaponCount: 3,
    }),
  };
});

describe("GuestRosterCard", () => {
  it("renders the guest roster and its calculated statistics", () => {
    renderCard();

    expect(screen.getByText("Guest Mordor")).toBeInTheDocument();
    expect(screen.getByText("Mordor")).toBeInTheDocument();
    expect(screen.getByText("500")).toBeInTheDocument();
    expect(screen.getByText("24")).toBeInTheDocument();
    expect(screen.getByText("6")).toBeInTheDocument();
    expect(screen.getByText("8")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();

    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      "/armies/rosters/guest",
    );
  });

  it("invokes delete from the card action", async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();

    renderCard(onDelete);

    await user.click(
      screen.getByRole("button", {
        name: "Actions for Guest Mordor",
      }),
    );

    expect(onDelete).toHaveBeenCalledOnce();
  });
});

function renderCard(onDelete = vi.fn()) {
  return render(
    <MemoryRouter>
      <GuestRosterCard roster={guestRoster} onDelete={onDelete} />
    </MemoryRouter>,
  );
}

const guestRoster: GuestRoster = {
  id: "guest",
  name: "Guest Mordor",
  armyListId: "mordor",
  tags: [],
  warbands: [],
  createdAt: "",
  updatedAt: "",
};
