import type { Roster } from "@mlb/api-client";
import { describe, expect, it } from "vitest";

import { mapApiRoster } from "./api-roster.mapper.ts";

describe("mapApiRoster", () => {
  it("maps an API roster to the shared builder model", () => {
    const roster: Roster = {
      id: 42,
      name: "Mordor",
      armyListId: "mordor",
      groupId: 7,
      pointsLimit: 750,
      favorite: true,
      locked: false,
      tags: ["Tournament"],
      armyOptionIds: ["extra-rule"],
      generalUnitId: 100,

      points: 500,
      warbandCount: 1,
      modelCount: 5,
      might: 3,
      bowCount: 4,
      throwingWeaponCount: 0,

      warbands: [
        {
          id: 10,
          leader: {
            id: 100,
            armyListProfileId: "witch-king",
            quantity: 1,
            optionIds: ["horse"],
          },
          followers: [
            {
              id: 101,
              armyListProfileId: "orc-warrior",
              quantity: 4,
              optionIds: ["shield"],
            },
          ],
        },
      ],

      createdAt: "2026-09-01T12:00:00Z",
      updatedAt: "2026-09-02T12:00:00Z",
    };

    expect(mapApiRoster(roster)).toEqual({
      id: 42,
      name: "Mordor",
      armyListId: "mordor",
      pointsLimit: 750,
      tags: ["Tournament"],
      locked: false,
      armyOptionIds: ["extra-rule"],
      generalUnitId: 100,
      warbands: [
        {
          id: 10,
          leader: {
            id: 100,
            armyListProfileId: "witch-king",
            quantity: 1,
            optionIds: ["horse"],
          },
          followers: [
            {
              id: 101,
              armyListProfileId: "orc-warrior",
              quantity: 4,
              optionIds: ["shield"],
            },
          ],
        },
      ],
    });
  });
});
