import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useBuilderGameData } from "./useBuilderGameData.ts";
import type {
  LocalizedArmyList,
  LocalizedArmyListProfile,
} from "~/features/reference/army-lists/army-lists.types.ts";
import type { LocalizedProfile } from "~/features/reference/profiles/profiles.types.ts";

const mocks = vi.hoisted(() => ({
  armyLists: [] as LocalizedArmyList[],
}));

vi.mock("~/features/reference/army-lists/hooks/useGameArmyLists.ts", () => ({
  useGameArmyLists: () => ({
    armyLists: mocks.armyLists,
    locale: "en",
  }),
}));

describe("useBuilderGameData", () => {
  beforeEach(() => {
    mocks.armyLists = [];
  });

  it("returns undefined for an unknown army list", () => {
    const { result } = renderHook(() => useBuilderGameData("missing"));

    expect(result.current).toBeUndefined();
  });

  it("indexes army-list profiles by army-list profile id", () => {
    const profile = createProfile("aragorn");

    const armyListProfile = createArmyListProfile("aragorn-king", profile);

    mocks.armyLists = [createArmyList("gondor", [armyListProfile])];

    const { result } = renderHook(() => useBuilderGameData("gondor"));

    expect(result.current?.armyListProfilesById.get("aragorn-king")).toBe(
      armyListProfile,
    );
  });

  it("indexes canonical profiles by canonical profile id", () => {
    const profile = createProfile("aragorn");

    mocks.armyLists = [
      createArmyList("gondor", [
        createArmyListProfile("aragorn-king", profile),
      ]),
    ];

    const { result } = renderHook(() => useBuilderGameData("gondor"));

    expect(result.current?.profilesById.get("aragorn")).toBe(profile);
  });

  it("supports multiple army-list profiles for the same canonical profile", () => {
    const profile = createProfile("aragorn");

    const first = createArmyListProfile("aragorn-strider", profile);
    const second = createArmyListProfile("aragorn-king", profile);

    mocks.armyLists = [createArmyList("gondor", [first, second])];

    const { result } = renderHook(() => useBuilderGameData("gondor"));

    expect(result.current?.armyListProfilesByProfileId.get("aragorn")).toEqual([
      first,
      second,
    ]);
  });
});

function createArmyList(
  id: string,
  profiles: LocalizedArmyListProfile[],
): LocalizedArmyList {
  return {
    id,
    name: id,
    sourceName: "Test Book",
    alignment: "good",
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
  };
}

function createArmyListProfile(
  id: string,
  profile: LocalizedProfile,
): LocalizedArmyListProfile {
  return {
    id,
    profileId: profile.profile,
    profile,
    tier: "hero-of-fortitude",
    tierName: "Hero of Fortitude",
    options: [],
  };
}

function createProfile(id: string): LocalizedProfile {
  return {
    profile: id,
    name: id,
    origin: "test",
    originName: "Test",
    alignment: "good",
    points: 100,

    race: ["man"],
    raceNames: ["Man"],

    factions: ["gondor"],
    factionNames: ["Gondor"],

    unitTypes: ["hero"],
    unitTypeNames: ["Hero"],

    selectable: true,

    stats: {
      type: "hero",
      mv: '6"',
      fv: "6/4+",
      sv: "-",
      s: "4",
      d: "5",
      a: "2",
      w: "2",
      c: "6+",
      i: "5+",
      might: "3",
      will: "3",
      fate: "3",
    },

    wargear: ["sword"],
    wargearNames: ["Sword"],

    source: {
      book: "test-book",
      page: 1,
    },

    options: [],
  };
}
