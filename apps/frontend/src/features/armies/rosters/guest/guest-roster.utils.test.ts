import { describe, expect, it } from "vitest";

import type { GuestRoster } from "./guest-roster.types.ts";
import {
  calculateGuestRosterStats,
  createGuestRoster,
} from "./guest-roster.utils.ts";
import type { LocalizedProfile } from "~/features/reference/profiles/profiles.types.ts";

describe("createGuestRoster", () => {
  it("creates an empty guest roster from create values", () => {
    expect(
      createGuestRoster({
        name: "Mordor",
        armyListId: "mordor",
        pointsLimit: 750,
        tags: ["Tournament"],
      }),
    ).toEqual({
      id: "guest",
      name: "Mordor",
      armyListId: "mordor",
      pointsLimit: 750,
      tags: ["Tournament"],
      warbands: [],
      createdAt: "",
      updatedAt: "",
    });
  });
});

describe("calculateGuestRosterStats", () => {
  it("returns zero statistics for an empty roster", () => {
    const stats = calculateGuestRosterStats(guestRoster(), new Map());

    expect(stats).toEqual({
      points: 0,
      modelCount: 0,
      warbandCount: 0,
      might: 0,
      bowCount: 0,
      throwingWeaponCount: 0,
    });
  });

  it("calculates points, models, warbands and hero might", () => {
    const roster = guestRoster({
      warbands: [
        {
          id: "warband-1",
          leader: {
            id: "leader-1",
            profileId: "hero",
            quantity: 1,
          },
          followers: [
            {
              id: "follower-1",
              profileId: "warrior",
              quantity: 4,
            },
          ],
        },
        {
          id: "warband-2",
          leader: {
            id: "leader-2",
            profileId: "hero",
            quantity: 1,
          },
          followers: [],
        },
      ],
    });

    const profiles = new Map<string, LocalizedProfile>([
      [
        "hero",
        {
          profile: "hero",
          points: 75,
          stats: {
            type: "hero",
            might: "3",
          },
        } as LocalizedProfile,
      ],
      [
        "warrior",
        {
          profile: "warrior",
          points: 8,
          stats: {
            type: "warrior",
          },
        } as LocalizedProfile,
      ],
    ]);

    expect(calculateGuestRosterStats(roster, profiles)).toEqual({
      points: 182,
      modelCount: 6,
      warbandCount: 2,
      might: 6,
      bowCount: 0,
      throwingWeaponCount: 0,
    });
  });

  it("ignores units whose profile is unavailable", () => {
    const roster = guestRoster({
      warbands: [
        {
          id: "warband-1",
          leader: {
            id: "leader-1",
            profileId: "missing-profile",
            quantity: 1,
          },
          followers: [],
        },
      ],
    });

    expect(calculateGuestRosterStats(roster, new Map())).toEqual({
      points: 0,
      modelCount: 0,
      warbandCount: 1,
      might: 0,
      bowCount: 0,
      throwingWeaponCount: 0,
    });
  });
});

function guestRoster(overrides: Partial<GuestRoster> = {}): GuestRoster {
  return {
    id: "guest",
    name: "Guest roster",
    armyListId: "mordor",
    tags: [],
    warbands: [],
    createdAt: "",
    updatedAt: "",
    ...overrides,
  };
}
