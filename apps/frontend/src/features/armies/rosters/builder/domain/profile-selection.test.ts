import { describe, expect, it } from "vitest";

import type { BuilderGameData } from "../data/builder-game-data.types.ts";
import {
  getAvailableFollowers,
  getAvailableLeaders,
  isProfilePresentInRoster,
  isUniqueProfile,
} from "./profile-selection.ts";
import type { BuilderRoster } from "./roster.types.ts";
import type {
  ArmyListWarbandDefinition,
  LocalizedArmyList,
  LocalizedArmyListProfile,
} from "~/features/reference/army-lists/army-lists.types.ts";
import type { LocalizedProfile } from "~/features/reference/profiles/profiles.types.ts";

describe("profile selection", () => {
  it("recognizes a unique profile", () => {
    expect(
      isUniqueProfile(
        armyListProfile("witch-king", "witch-king", {
          unitTypes: ["hero", "unique"],
        }),
      ),
    ).toBe(true);
  });

  it("recognizes a non-unique profile", () => {
    expect(
      isUniqueProfile(
        armyListProfile("orc-warrior", "orc-warrior", {
          unitTypes: ["warrior"],
        }),
      ),
    ).toBe(false);
  });

  it("detects the same canonical profile through another army-list entry", () => {
    const first = armyListProfile("aragorn-strider", "aragorn", {
      unitTypes: ["hero", "unique"],
    });

    const second = armyListProfile("aragorn-king", "aragorn", {
      unitTypes: ["hero", "unique"],
    });

    const gameData = builderGameData(
      [first, second],
      [
        {
          id: "aragorn-warband",
          leaderId: first.id,
          followerIds: [],
        },
        {
          id: "aragorn-king-warband",
          leaderId: second.id,
          followerIds: [],
        },
      ],
    );

    const roster = builderRoster({
      leaderProfileId: first.id,
    });

    expect(isProfilePresentInRoster(roster, second, gameData)).toBe(true);
  });

  it("filters a unique profile that already exists from leader selection", () => {
    const witchKing = armyListProfile("witch-king", "witch-king", {
      unitTypes: ["hero", "unique"],
    });

    const captain = armyListProfile("orc-captain", "orc-captain", {
      unitTypes: ["hero"],
    });

    const gameData = builderGameData(
      [witchKing, captain],
      [
        {
          id: "witch-king-warband",
          leaderId: witchKing.id,
          followerIds: [],
        },
        {
          id: "captain-warband",
          leaderId: captain.id,
          followerIds: [],
        },
      ],
    );

    const roster = builderRoster({
      leaderProfileId: witchKing.id,
    });

    expect(getAvailableLeaders(roster, gameData).map(({ id }) => id)).toEqual([
      "orc-captain",
    ]);
  });

  it("allows a unique leader to remain available while replacing itself", () => {
    const witchKing = armyListProfile("witch-king", "witch-king", {
      unitTypes: ["hero", "unique"],
    });

    const gameData = builderGameData(
      [witchKing],
      [
        {
          id: "witch-king-warband",
          leaderId: witchKing.id,
          followerIds: [],
        },
      ],
    );

    const roster = builderRoster({
      leaderProfileId: witchKing.id,
    });

    expect(
      getAvailableLeaders(roster, gameData, {
        ignoreUnitId: "leader",
      }).map(({ id }) => id),
    ).toEqual(["witch-king"]);
  });

  it("returns only followers allowed by the selected leader", () => {
    const leader = armyListProfile("orc-captain", "orc-captain", {
      unitTypes: ["hero"],
    });

    const orc = armyListProfile("orc-warrior", "orc-warrior", {
      unitTypes: ["warrior"],
    });

    const warg = armyListProfile("warg-rider", "warg-rider", {
      unitTypes: ["warrior"],
    });

    const troll = armyListProfile("mordor-troll", "mordor-troll", {
      unitTypes: ["warrior"],
    });

    const gameData = builderGameData(
      [leader, orc, warg, troll],
      [
        {
          id: "captain-warband",
          leaderId: leader.id,
          followerIds: [orc.id, warg.id],
        },
      ],
    );

    const roster = builderRoster({
      leaderProfileId: leader.id,
    });

    expect(
      getAvailableFollowers(roster, roster.warbands[0], gameData).map(
        ({ id }) => id,
      ),
    ).toEqual(["orc-warrior", "warg-rider"]);
  });

  it("filters an already selected unique follower", () => {
    const leader = armyListProfile("hero", "hero", {
      unitTypes: ["hero"],
    });

    const uniqueFollower = armyListProfile(
      "unique-follower",
      "unique-follower",
      {
        unitTypes: ["warrior", "unique"],
      },
    );

    const gameData = builderGameData(
      [leader, uniqueFollower],
      [
        {
          id: "warband",
          leaderId: leader.id,
          followerIds: [uniqueFollower.id],
        },
      ],
    );

    const roster = builderRoster({
      leaderProfileId: leader.id,
      followerProfileId: uniqueFollower.id,
    });

    expect(getAvailableFollowers(roster, roster.warbands[0], gameData)).toEqual(
      [],
    );
  });

  it("does not offer followers for a leaderless warband", () => {
    const follower = armyListProfile("orc-warrior", "orc-warrior", {
      unitTypes: ["warrior"],
    });

    const gameData = builderGameData([follower], []);

    const roster = builderRoster();

    expect(getAvailableFollowers(roster, roster.warbands[0], gameData)).toEqual(
      [],
    );
  });
});

function builderRoster(
  options: { leaderProfileId?: string; followerProfileId?: string } = {},
): BuilderRoster {
  return {
    id: "guest",
    name: "Test",
    armyListId: "test",
    tags: [],
    locked: false,
    armyOptionIds: [],
    generalUnitId: null,

    warbands: [
      {
        id: "warband",

        leader: options.leaderProfileId
          ? {
              id: "leader",
              armyListProfileId: options.leaderProfileId,
              quantity: 1,
              optionIds: [],
            }
          : null,

        followers: options.followerProfileId
          ? [
              {
                id: "follower",
                armyListProfileId: options.followerProfileId,
                quantity: 1,
                optionIds: [],
              },
            ]
          : [],
      },
    ],
  };
}

function builderGameData(
  profiles: LocalizedArmyListProfile[],
  definitions: ArmyListWarbandDefinition[] = [],
): BuilderGameData {
  const armyList: LocalizedArmyList = {
    id: "test",
    name: "Test",
    sourceName: "Test",
    alignment: "evil",

    profiles,

    warbands: {
      type: "standard",
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

function armyListProfile(
  id: string,
  profileId: string,
  options: {
    unitTypes: string[];
  },
): LocalizedArmyListProfile {
  const profile: LocalizedProfile = {
    profile: profileId,
    name: profileId,

    origin: "test",
    originName: "Test",

    alignment: "evil",

    race: [],
    raceNames: [],

    factions: [],
    factionNames: [],

    unitTypes: options.unitTypes,
    unitTypeNames: options.unitTypes,

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
  };

  return {
    id,
    profileId,

    tier: options.unitTypes.includes("warrior")
      ? "warrior"
      : "hero-of-fortitude",

    tierName: "Test",

    profile,
    options: [],
  };
}
