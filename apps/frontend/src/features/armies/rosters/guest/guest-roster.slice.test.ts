import { describe, expect, it } from "vitest";

import reducer, {
  clearGuestRoster,
  replaceGuestRoster,
} from "./guest-roster.slice.ts";
import type { GuestRoster } from "./guest-roster.types.ts";

const guestRoster: GuestRoster = {
  id: "guest",
  name: "Ugluk's Scouts",
  armyListId: "ugluks-scouts",
  pointsLimit: 500,
  tags: ["Tournament"],
  warbands: [],
  createdAt: "",
  updatedAt: "",
};

describe("guestRosterSlice", () => {
  it("starts without a guest roster", () => {
    expect(reducer(undefined, { type: "unknown" })).toEqual({
      roster: null,
    });
  });

  it("stores a guest roster", () => {
    const state = reducer(undefined, replaceGuestRoster(guestRoster));

    expect(state.roster).toEqual(guestRoster);
  });

  it("replaces an existing guest roster", () => {
    const existingState = {
      roster: guestRoster,
    };

    const replacement: GuestRoster = {
      ...guestRoster,
      name: "Mordor",
      armyListId: "mordor",
    };

    const state = reducer(existingState, replaceGuestRoster(replacement));

    expect(state.roster).toEqual(replacement);
  });

  it("clears the guest roster", () => {
    const state = reducer({ roster: guestRoster }, clearGuestRoster());

    expect(state.roster).toBeNull();
  });
});
