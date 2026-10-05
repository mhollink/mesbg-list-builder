import { describe, expect, it } from "vitest";

import type { BuilderGameData } from "../data/builder-game-data.types.ts";
import type { BuilderRoster, BuilderWarband } from "./roster.types.ts";
import {
  canAddWarband,
  findWarbandDefinition,
  getAllowedFollowerProfileIds,
  getFollowerCount,
  getWarbandCapacity,
  isFollowerAllowed,
} from "./warband-rules.ts";
import type {
  ArmyListWarbandDefinition,
  LocalizedArmyList,
  LocalizedArmyListProfile,
} from "~/features/reference/army-lists/army-lists.types.ts";

describe("warband rules", () => {
  it("finds the definition belonging to the selected leader", () => {
    const gameData = createGameData([
      {
        id: "captain-warband",
        leaderId: "captain",
        followerIds: ["orc"],
        maxSize: 12,
      },
    ]);

    expect(findWarbandDefinition(warband("captain"), gameData)?.id).toBe(
      "captain-warband",
    );
  });

  it("does not resolve a definition without a leader", () => {
    const gameData = createGameData([
      {
        id: "captain-warband",
        leaderId: "captain",
        followerIds: ["orc"],
      },
    ]);

    expect(findWarbandDefinition(warband(), gameData)).toBeUndefined();
  });

  it("returns the complete follower set from the definition", () => {
    const gameData = createGameData([
      {
        id: "captain-warband",
        leaderId: "captain",
        followerIds: ["orc", "warg-rider", "mordor-troll"],
      },
    ]);

    expect(getAllowedFollowerProfileIds(warband("captain"), gameData)).toEqual([
      "orc",
      "warg-rider",
      "mordor-troll",
    ]);
  });

  it("reports whether a follower is allowed", () => {
    const gameData = createGameData([
      {
        id: "captain-warband",
        leaderId: "captain",
        followerIds: ["orc"],
      },
    ]);

    const value = warband("captain");

    expect(isFollowerAllowed(value, "orc", gameData)).toBe(true);

    expect(isFollowerAllowed(value, "mordor-troll", gameData)).toBe(false);
  });

  it("counts follower quantities rather than entries", () => {
    const value: BuilderWarband = {
      id: "warband",
      leader: null,

      followers: [
        {
          id: "one",
          armyListProfileId: "orc",
          quantity: 5,
          optionIds: [],
        },
        {
          id: "two",
          armyListProfileId: "warg",
          quantity: 3,
          optionIds: [],
        },
      ],
    };

    expect(getFollowerCount(value)).toBe(8);
  });

  it("calculates warband capacity using follower quantities", () => {
    const gameData = createGameData([
      {
        id: "captain-warband",
        leaderId: "captain",
        followerIds: ["orc"],
        minSize: 2,
        maxSize: 12,
      },
    ]);

    const value = warband("captain");

    value.followers.push({
      id: "followers",
      armyListProfileId: "orc",
      quantity: 11,
      optionIds: [],
    });

    expect(getWarbandCapacity(value, gameData)).toEqual({
      current: 11,
      minimum: 2,
      maximum: 12,
      belowMinimum: false,
      overMaximum: false,
    });
  });

  it("marks a warband over capacity without blocking the state", () => {
    const gameData = createGameData([
      {
        id: "captain-warband",
        leaderId: "captain",
        followerIds: ["orc"],
        maxSize: 12,
      },
    ]);

    const value = warband("captain");

    value.followers.push({
      id: "followers",
      armyListProfileId: "orc",
      quantity: 13,
      optionIds: [],
    });

    expect(getWarbandCapacity(value, gameData)).toMatchObject({
      current: 13,
      maximum: 12,
      overMaximum: true,
    });
  });

  it("allows additional warbands for a standard army", () => {
    const gameData = createGameData([]);

    expect(canAddWarband(roster(), gameData)).toBe(true);
  });

  it("does not allow warbands to be added to a locked roster", () => {
    const gameData = createGameData([]);

    expect(
      canAddWarband(
        roster({
          locked: true,
        }),
        gameData,
      ),
    ).toBe(false);
  });

  it("allows the initial warband for a single-warband army", () => {
    const gameData = createGameData([], "single");

    expect(
      canAddWarband(
        roster({
          warbands: [],
        }),
        gameData,
      ),
    ).toBe(true);
  });

  it("does not allow a second warband for a single-warband army", () => {
    const gameData = createGameData([], "single");

    expect(canAddWarband(roster(), gameData)).toBe(false);
  });

  it("allows all other army-list profiles in a single warband", () => {
    const profiles = [
      armyProfile("hero"),
      armyProfile("warrior-a"),
      armyProfile("warrior-b"),
    ];

    const gameData = createGameData([], "single", profiles);

    expect(getAllowedFollowerProfileIds(warband("hero"), gameData)).toEqual([
      "warrior-a",
      "warrior-b",
    ]);
  });
});

function warband(leaderProfileId?: string): BuilderWarband {
  return {
    id: "warband",

    leader: leaderProfileId
      ? {
          id: "leader",
          armyListProfileId: leaderProfileId,
          quantity: 1,
          optionIds: [],
        }
      : null,

    followers: [],
  };
}

function roster(overrides: Partial<BuilderRoster> = {}): BuilderRoster {
  return {
    id: "guest",
    name: "Test",
    armyListId: "test",
    tags: [],
    locked: false,
    armyOptionIds: [],
    generalUnitId: null,
    warbands: [warband("captain")],
    ...overrides,
  };
}

function createGameData(
  definitions: ArmyListWarbandDefinition[],
  mode: "standard" | "single" | "choice" = "standard",
  suppliedProfiles?: LocalizedArmyListProfile[],
): BuilderGameData {
  const ids = new Set<string>();

  for (const definition of definitions) {
    if (definition.leaderId) {
      ids.add(definition.leaderId);
    }

    for (const followerId of definition.followerIds) {
      ids.add(followerId);
    }
  }

  const profiles = suppliedProfiles ?? [...ids].map(armyProfile);

  const armyList: LocalizedArmyList = {
    id: "test",
    name: "Test",
    sourceName: "Test",
    alignment: "evil",

    profiles,

    warbands:
      mode === "single"
        ? {
            type: "single",
          }
        : {
            type: mode,
            definitions,
          },

    specialRules: [],
    additionalRules: [],

    source: {
      book: "test",
      page: 1,
    },
  };

  return {
    armyList,

    profilesById: new Map(
      profiles.map(({ profile }) => [profile.profile, profile]),
    ),

    armyListProfilesById: new Map(
      profiles.map((profile) => [profile.id, profile]),
    ),

    armyListProfilesByProfileId: new Map(
      profiles.map((profile) => [profile.profileId, [profile]]),
    ),
  };
}

function armyProfile(id: string): LocalizedArmyListProfile {
  return {
    id,
    profileId: id,

    tier:
      id.includes("warrior") || id === "orc" || id === "warg"
        ? "warrior"
        : "hero-of-fortitude",

    tierName: "Test",

    profile: {
      profile: id,
      name: id,

      origin: "test",
      originName: "Test",

      alignment: "evil",

      race: [],
      raceNames: [],

      factions: [],
      factionNames: [],

      unitTypes: [],
      unitTypeNames: [],

      selectable: true,

      stats: {
        type: "warrior",
        mv: '6"',
        fv: "3/4+",
        sv: "-",
        s: "3",
        d: "4",
        a: "1",
        w: "1",
        c: "5+",
        i: "4+",
      },

      wargear: [],
      wargearNames: [],

      source: {
        book: "test",
        page: 1,
      },

      options: [],
    },

    options: [],
  };
}
