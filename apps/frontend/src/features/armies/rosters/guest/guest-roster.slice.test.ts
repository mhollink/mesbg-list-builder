import { describe, expect, it } from "vitest";

import reducer, {
  addGuestFollower,
  addGuestWarband,
  clearGuestGeneral,
  clearGuestRoster,
  deleteGuestUnit,
  deleteGuestWarband,
  type GuestRosterState,
  moveGuestUnit,
  moveGuestWarband,
  replaceGuestRoster,
  setGuestArmyOptions,
  setGuestGeneral,
  setGuestLeader,
  updateGuestUnit,
} from "./guest-roster.slice.ts";
import type { GuestRoster } from "./guest-roster.types.ts";

describe("guestRosterSlice", () => {
  it("starts without a guest roster", () => {
    expect(reducer(undefined, { type: "unknown" })).toEqual({
      roster: null,
    });
  });

  it("stores a guest roster", () => {
    const roster = guestRoster();

    const state = reducer(undefined, replaceGuestRoster(roster));

    expect(state.roster).toEqual(roster);
  });

  it("replaces an existing guest roster", () => {
    const existing = guestRoster();

    const replacement: GuestRoster = {
      ...existing,
      name: "Isengard",
      armyListId: "isengard",
    };

    const state = reducer(stateWith(existing), replaceGuestRoster(replacement));

    expect(state.roster).toEqual(replacement);
  });

  it("clears the guest roster", () => {
    const state = reducer(stateWith(guestRoster()), clearGuestRoster());

    expect(state.roster).toBeNull();
  });

  describe("warbands", () => {
    it("adds an empty warband", () => {
      const state = reducer(
        stateWith(guestRoster()),
        addGuestWarband({
          id: "warband-3",
          leader: null,
          followers: [],
        }),
      );

      expect(state.roster?.warbands).toHaveLength(3);

      expect(state.roster?.warbands[2]).toEqual({
        id: "warband-3",
        leader: null,
        followers: [],
      });
    });

    it("deletes a warband", () => {
      const state = reducer(
        stateWith(guestRoster()),
        deleteGuestWarband("warband-2"),
      );

      expect(state.roster?.warbands.map(({ id }) => id)).toEqual(["warband-1"]);
    });

    it("clears the general when deleting its warband", () => {
      const state = reducer(
        stateWith(guestRoster()),
        deleteGuestWarband("warband-1"),
      );

      expect(state.roster?.generalUnitId).toBeNull();
    });

    it("leaves the general unchanged when deleting another warband", () => {
      const state = reducer(
        stateWith(guestRoster()),
        deleteGuestWarband("warband-2"),
      );

      expect(state.roster?.generalUnitId).toBe("leader-1");
    });

    it("moves a warband to another position", () => {
      const state = reducer(
        stateWith(guestRoster()),
        moveGuestWarband({
          warbandId: "warband-2",
          position: 0,
        }),
      );

      expect(state.roster?.warbands.map(({ id }) => id)).toEqual([
        "warband-2",
        "warband-1",
      ]);
    });

    it("ignores an invalid warband position", () => {
      const state = reducer(
        stateWith(guestRoster()),
        moveGuestWarband({
          warbandId: "warband-1",
          position: 99,
        }),
      );

      expect(state.roster?.warbands.map(({ id }) => id)).toEqual([
        "warband-1",
        "warband-2",
      ]);
    });

    it("ignores an unknown warband", () => {
      const state = reducer(
        stateWith(guestRoster()),
        deleteGuestWarband("missing"),
      );

      expect(state.roster).toEqual(guestRoster());
    });
  });

  describe("leaders", () => {
    it("sets a leader on a leaderless warband", () => {
      const roster = guestRoster();
      roster.warbands[1].leader = null;

      const state = reducer(
        stateWith(roster),
        setGuestLeader({
          warbandId: "warband-2",
          leader: {
            id: "new-leader",
            armyListProfileId: "gothmog",
            quantity: 1,
            optionIds: ["warg"],
          },
        }),
      );

      expect(state.roster?.warbands[1].leader).toEqual({
        id: "new-leader",
        armyListProfileId: "gothmog",
        quantity: 1,
        optionIds: ["warg"],
      });
    });

    it("replaces an existing leader", () => {
      const state = reducer(
        stateWith(guestRoster()),
        setGuestLeader({
          warbandId: "warband-2",
          leader: {
            id: "leader-2",
            armyListProfileId: "gothmog",
            quantity: 1,
            optionIds: ["warg"],
          },
        }),
      );

      expect(state.roster?.warbands[1].leader).toEqual({
        id: "leader-2",
        armyListProfileId: "gothmog",
        quantity: 1,
        optionIds: ["warg"],
      });
    });

    it("clears the general when replacing the current general leader", () => {
      const state = reducer(
        stateWith(guestRoster()),
        setGuestLeader({
          warbandId: "warband-1",
          leader: {
            id: "leader-1",
            armyListProfileId: "gothmog",
            quantity: 1,
            optionIds: [],
          },
        }),
      );

      expect(state.roster?.generalUnitId).toBeNull();
    });

    it("does not clear the general when replacing another leader", () => {
      const state = reducer(
        stateWith(guestRoster()),
        setGuestLeader({
          warbandId: "warband-2",
          leader: {
            id: "leader-2",
            armyListProfileId: "gothmog",
            quantity: 1,
            optionIds: [],
          },
        }),
      );

      expect(state.roster?.generalUnitId).toBe("leader-1");
    });
  });

  describe("followers", () => {
    it("adds a follower", () => {
      const state = reducer(
        stateWith(guestRoster()),
        addGuestFollower({
          warbandId: "warband-1",
          follower: {
            id: "follower-2",
            armyListProfileId: "orc-warrior",
            quantity: 3,
            optionIds: ["spear"],
          },
        }),
      );

      expect(state.roster?.warbands[0].followers).toHaveLength(2);

      expect(state.roster?.warbands[0].followers[1]).toEqual({
        id: "follower-2",
        armyListProfileId: "orc-warrior",
        quantity: 3,
        optionIds: ["spear"],
      });
    });

    it("updates follower quantity", () => {
      const state = reducer(
        stateWith(guestRoster()),
        updateGuestUnit({
          warbandId: "warband-1",
          unitId: "follower-1",
          changes: {
            quantity: 8,
          },
        }),
      );

      expect(state.roster?.warbands[0].followers[0].quantity).toBe(8);

      expect(state.roster?.warbands[0].followers[0].optionIds).toEqual([
        "shield",
      ]);
    });

    it("updates follower options", () => {
      const state = reducer(
        stateWith(guestRoster()),
        updateGuestUnit({
          warbandId: "warband-1",
          unitId: "follower-1",
          changes: {
            optionIds: ["spear"],
          },
        }),
      );

      expect(state.roster?.warbands[0].followers[0].quantity).toBe(4);

      expect(state.roster?.warbands[0].followers[0].optionIds).toEqual([
        "spear",
      ]);
    });

    it("updates a leader through the generic unit update action", () => {
      const state = reducer(
        stateWith(guestRoster()),
        updateGuestUnit({
          warbandId: "warband-1",
          unitId: "leader-1",
          changes: {
            optionIds: ["fell-beast"],
          },
        }),
      );

      expect(state.roster?.warbands[0].leader?.optionIds).toEqual([
        "fell-beast",
      ]);
    });

    it("deletes a follower", () => {
      const state = reducer(
        stateWith(guestRoster()),
        deleteGuestUnit({
          warbandId: "warband-1",
          unitId: "follower-1",
        }),
      );

      expect(state.roster?.warbands[0].followers).toEqual([]);
    });

    it("does not delete a leader through the follower delete action", () => {
      const state = reducer(
        stateWith(guestRoster()),
        deleteGuestUnit({
          warbandId: "warband-1",
          unitId: "leader-1",
        }),
      );

      expect(state.roster?.warbands[0].leader?.id).toBe("leader-1");
    });

    it("moves a follower within the same warband", () => {
      const roster = guestRoster();

      roster.warbands[0].followers.push({
        id: "follower-2",
        armyListProfileId: "orc-warrior",
        quantity: 2,
        optionIds: ["spear"],
      });

      const state = reducer(
        stateWith(roster),
        moveGuestUnit({
          sourceWarbandId: "warband-1",
          unitId: "follower-2",
          targetWarbandId: "warband-1",
          position: 0,
        }),
      );

      expect(state.roster?.warbands[0].followers.map(({ id }) => id)).toEqual([
        "follower-2",
        "follower-1",
      ]);
    });

    it("moves a follower to another warband", () => {
      const state = reducer(
        stateWith(guestRoster()),
        moveGuestUnit({
          sourceWarbandId: "warband-1",
          unitId: "follower-1",
          targetWarbandId: "warband-2",
          position: 0,
        }),
      );

      expect(state.roster?.warbands[0].followers).toEqual([]);

      expect(state.roster?.warbands[1].followers).toEqual([
        {
          id: "follower-1",
          armyListProfileId: "orc-warrior",
          quantity: 4,
          optionIds: ["shield"],
        },
      ]);
    });

    it("preserves the complete follower when moving between warbands", () => {
      const state = reducer(
        stateWith(guestRoster()),
        moveGuestUnit({
          sourceWarbandId: "warband-1",
          unitId: "follower-1",
          targetWarbandId: "warband-2",
          position: 0,
        }),
      );

      expect(state.roster?.warbands[1].followers[0]).toEqual({
        id: "follower-1",
        armyListProfileId: "orc-warrior",
        quantity: 4,
        optionIds: ["shield"],
      });
    });

    it("ignores an invalid move position", () => {
      const state = reducer(
        stateWith(guestRoster()),
        moveGuestUnit({
          sourceWarbandId: "warband-1",
          unitId: "follower-1",
          targetWarbandId: "warband-2",
          position: 99,
        }),
      );

      expect(state.roster?.warbands[0].followers.map(({ id }) => id)).toEqual([
        "follower-1",
      ]);

      expect(state.roster?.warbands[1].followers).toEqual([]);
    });

    it("ignores attempts to move a leader", () => {
      const state = reducer(
        stateWith(guestRoster()),
        moveGuestUnit({
          sourceWarbandId: "warband-1",
          unitId: "leader-1",
          targetWarbandId: "warband-2",
          position: 0,
        }),
      );

      expect(state.roster?.warbands[0].leader?.id).toBe("leader-1");
      expect(state.roster?.warbands[1].followers).toEqual([]);
    });
  });

  describe("general", () => {
    it("sets the general", () => {
      const state = reducer(
        stateWith(guestRoster()),
        setGuestGeneral("leader-2"),
      );

      expect(state.roster?.generalUnitId).toBe("leader-2");
    });

    it("clears the general", () => {
      const state = reducer(stateWith(guestRoster()), clearGuestGeneral());

      expect(state.roster?.generalUnitId).toBeNull();
    });
  });

  describe("army options", () => {
    it("replaces the selected army options", () => {
      const state = reducer(
        stateWith(guestRoster()),
        setGuestArmyOptions(["option-a", "option-b"]),
      );

      expect(state.roster?.armyOptionIds).toEqual(["option-a", "option-b"]);
    });

    it("can clear all army options", () => {
      const roster = guestRoster();
      roster.armyOptionIds = ["option-a"];

      const state = reducer(stateWith(roster), setGuestArmyOptions([]));

      expect(state.roster?.armyOptionIds).toEqual([]);
    });
  });
});

function stateWith(roster: GuestRoster): GuestRosterState {
  return {
    roster,
  };
}

function guestRoster(): GuestRoster {
  return {
    id: "guest",
    name: "Mordor",
    armyListId: "mordor",
    pointsLimit: 750,
    tags: ["Tournament"],

    armyOptionIds: [],
    generalUnitId: "leader-1",

    warbands: [
      {
        id: "warband-1",

        leader: {
          id: "leader-1",
          armyListProfileId: "witch-king",
          quantity: 1,
          optionIds: ["horse"],
        },

        followers: [
          {
            id: "follower-1",
            armyListProfileId: "orc-warrior",
            quantity: 4,
            optionIds: ["shield"],
          },
        ],
      },

      {
        id: "warband-2",

        leader: {
          id: "leader-2",
          armyListProfileId: "orc-captain",
          quantity: 1,
          optionIds: [],
        },

        followers: [],
      },
    ],

    createdAt: "",
    updatedAt: "",
  };
}
