import { describe, expect, it } from "vitest";

import type { BuilderGameData } from "../data/builder-game-data.types.ts";
import type { BuilderRoster } from "./roster.types.ts";
import { calculateRosterStatistics } from "./roster-statistics.ts";
import type {
  LocalizedArmyList,
  LocalizedArmyListProfile,
} from "~/features/reference/army-lists/army-lists.types.ts";
import type { LocalizedProfile } from "~/features/reference/profiles/profiles.types.ts";

describe("calculateRosterStatistics", () => {
  it("calculates profile, option, army-option and quantity points", () => {
    const hero = heroProfile("hero", 100, 3);

    const warrior = warriorProfile("warrior", 8, [
      "orc-bow",
      "throwing-spears",
    ]);

    const heroEntry: LocalizedArmyListProfile = {
      id: "hero-entry",
      profileId: "hero",
      profile: hero,
      tier: "hero-of-fortitude",
      tierName: "Hero of Fortitude",
      options: [
        {
          id: "horse",
          optionId: "horse",
          state: "available",
          name: "Horse",
          points: 10,
        },
      ],
    };

    const warriorEntry: LocalizedArmyListProfile = {
      id: "warrior-entry",
      profileId: "warrior",
      profile: warrior,
      tier: "warrior",
      tierName: "Warrior",
      options: [
        {
          id: "shield",
          optionId: "shield",
          state: "available",
          name: "Shield",
          points: 1,
        },
        {
          id: "mandatory-kit",
          optionId: "mandatory-kit",
          state: "preselected",
          name: "Mandatory kit",
          points: 2,
        },
      ],
    };

    const gameData = createGameData([heroEntry, warriorEntry], {
      options: [
        {
          id: "banner-rule",
          name: "Banner Rule",
          points: 20,
        },
        {
          id: "mandatory-rule",
          name: "Mandatory Rule",
          points: 5,
          preselected: true,
        },
      ],
    });

    const roster: BuilderRoster = {
      id: 42,
      name: "Test",
      armyListId: "test",
      tags: [],
      locked: false,
      armyOptionIds: ["banner-rule"],
      generalUnitId: 1,
      warbands: [
        {
          id: 10,
          leader: {
            id: 1,
            armyListProfileId: "hero-entry",
            quantity: 1,
            optionIds: ["horse"],
          },
          followers: [
            {
              id: 2,
              armyListProfileId: "warrior-entry",
              quantity: 4,
              optionIds: ["shield"],
            },
          ],
        },
      ],
    };

    expect(calculateRosterStatistics(roster, gameData)).toEqual({
      points: 179,
      modelCount: 5,
      warbandCount: 1,
      might: 3,
      bowCount: 4,
      throwingWeaponCount: 4,
    });
  });

  it("applies army-list wargear removals before weapon statistics", () => {
    const warrior = warriorProfile("warrior", 8, [
      "orc-bow",
      "throwing-spears",
    ]);

    const entry: LocalizedArmyListProfile = {
      id: "warrior-entry",
      profileId: "warrior",
      profile: warrior,
      tier: "warrior",
      tierName: "Warrior",
      options: [],
      overrides: {
        removeWargear: ["orc-bow"],
      },
    };

    const roster: BuilderRoster = {
      id: 42,
      name: "Test",
      armyListId: "test",
      tags: [],
      locked: false,
      armyOptionIds: [],
      generalUnitId: null,
      warbands: [
        {
          id: 10,
          leader: null,
          followers: [
            {
              id: 1,
              armyListProfileId: "warrior-entry",
              quantity: 3,
              optionIds: [],
            },
          ],
        },
      ],
    };

    const result = calculateRosterStatistics(roster, createGameData([entry]));

    expect(result.bowCount).toBe(0);
    expect(result.throwingWeaponCount).toBe(3);
  });

  it("ignores roster units whose army-list profile cannot be resolved", () => {
    const roster: BuilderRoster = {
      id: 42,
      name: "Test",
      armyListId: "test",
      tags: [],
      locked: false,
      armyOptionIds: [],
      generalUnitId: null,
      warbands: [
        {
          id: 10,
          leader: null,
          followers: [
            {
              id: 1,
              armyListProfileId: "missing",
              quantity: 10,
              optionIds: [],
            },
          ],
        },
      ],
    };

    expect(calculateRosterStatistics(roster, createGameData([]))).toEqual({
      points: 0,
      modelCount: 0,
      warbandCount: 1,
      might: 0,
      bowCount: 0,
      throwingWeaponCount: 0,
    });
  });
});

function createGameData(
  profiles: LocalizedArmyListProfile[],
  overrides: Partial<LocalizedArmyList> = {},
): BuilderGameData {
  const armyList: LocalizedArmyList = {
    id: "test",
    name: "Test",
    sourceName: "Test Book",
    alignment: "evil",
    profiles,
    warbands: {
      type: "standard",
      definitions: [],
    },
    specialRules: [],
    additionalRules: [],
    source: {
      book: "test-book",
      page: 1,
    },
    ...overrides,
  };

  return {
    armyList,
    profilesById: new Map(
      profiles.map((entry) => [entry.profile.profile, entry.profile]),
    ),
    armyListProfilesById: new Map(profiles.map((entry) => [entry.id, entry])),
    armyListProfilesByProfileId: new Map(
      profiles.map((entry) => [entry.profileId, [entry]]),
    ),
  };
}

function heroProfile(
  id: string,
  points: number,
  might: number,
): LocalizedProfile {
  return {
    ...baseProfile(id, points),
    unitTypes: ["hero"],
    unitTypeNames: ["Hero"],
    stats: {
      type: "hero",
      mv: '6"',
      fv: "6/4+",
      sv: "-",
      s: "4",
      d: "6",
      a: "2",
      w: "2",
      c: "6+",
      i: "5+",
      might: String(might),
      will: "3",
      fate: "3",
    },
  };
}

function warriorProfile(
  id: string,
  points: number,
  wargear: string[],
): LocalizedProfile {
  return {
    ...baseProfile(id, points),
    unitTypes: ["warrior"],
    unitTypeNames: ["Warrior"],
    wargear,
    wargearNames: wargear,
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
  };
}

function baseProfile(id: string, points: number): LocalizedProfile {
  return {
    profile: id,
    name: id,
    origin: "test",
    originName: "Test",
    alignment: "evil",
    points,
    race: [],
    raceNames: [],
    factions: [],
    factionNames: [],
    unitTypes: [],
    unitTypeNames: [],
    selectable: true,
    source: {
      book: "test-book",
      page: 1,
    },
    wargear: [],
    wargearNames: [],
    options: [],
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
  };
}
