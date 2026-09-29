import { describe, expect, it } from "vitest";

import { createGuestRoster } from "./guest-roster.utils.ts";

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
      armyOptionIds: [],
      tags: ["Tournament"],
      generalUnitId: null,
      warbands: [],
      createdAt: "",
      updatedAt: "",
    });
  });
});
