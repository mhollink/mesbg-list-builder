import { describe, expect, it } from "vitest";

import { createWarriorDrafts, loadoutKey } from "./unit-configuration.utils.ts";
import type { BuilderUnit } from "~/features/armies/rosters/builder/domain/roster.types.ts";
import type { LocalizedArmyListProfile } from "~/features/reference/army-lists/army-lists.types.ts";

const profile = {
  id: "rivendell-warrior",
  profile: { stats: { type: "warrior" }, optionLimits: { min: 0, max: 1 } },
  options: [
    {
      id: "banner",
      name: "Banner",
      state: "available",
      category: "equipment",
      points: 1,
    },
    {
      id: "elf-bow",
      name: "Elf Bow",
      state: "available",
      category: "equipment",
      points: 2,
    },
    {
      id: "upgrade-to-kings-guard",
      name: "Upgrade to King's Guard",
      state: "available",
      category: "special-upgrade",
      points: 1,
    },
  ],
} as unknown as LocalizedArmyListProfile;

describe("warrior loadout generation", () => {
  it("offers equipment both with and without each optional upgrade", () => {
    const drafts = createWarriorDrafts(profile);
    expect(drafts).toHaveLength(6);
    expect(drafts.map(({ optionIds }) => optionIds)).toEqual([
      [],
      ["banner"],
      ["elf-bow"],
      ["upgrade-to-kings-guard"],
      ["banner", "upgrade-to-kings-guard"],
      ["elf-bow", "upgrade-to-kings-guard"],
    ]);
    expect(drafts.every((draft) => draft.quantity === 0)).toBe(true);
  });

  it("groups a mandatory upgrade without offering regular warriors", () => {
    const compulsory = {
      ...profile,
      options: profile.options.map((option) =>
        option.id === "upgrade-to-kings-guard"
          ? { ...option, state: "preselected" as const }
          : option,
      ),
    };
    const drafts = createWarriorDrafts(compulsory);
    expect(drafts).toHaveLength(3);
    expect(
      drafts.every((draft) => draft.upgradeId === "upgrade-to-kings-guard"),
    ).toBe(true);
    expect(
      drafts.every(
        (draft) => !draft.optionIds.includes("upgrade-to-kings-guard"),
      ),
    ).toBe(true);
  });

  it("keeps quantities and previously saved configurations", () => {
    const existing: BuilderUnit[] = [
      {
        id: 8,
        armyListProfileId: profile.id,
        optionIds: ["banner", "elf-bow"],
        quantity: 3,
      },
      {
        id: 9,
        armyListProfileId: profile.id,
        optionIds: ["elf-bow", "upgrade-to-kings-guard"],
        quantity: 2,
      },
    ];
    const drafts = createWarriorDrafts(profile, existing);
    expect(
      drafts.find((draft) => draft.key === loadoutKey(["banner", "elf-bow"]))
        ?.quantity,
    ).toBe(3);
    expect(
      drafts.find(
        (draft) =>
          draft.key === loadoutKey(["elf-bow", "upgrade-to-kings-guard"]),
      )?.quantity,
    ).toBe(2);
  });

  it("defaults to one model when only standard equipment exists", () => {
    const standard = { ...profile, options: [] };
    expect(createWarriorDrafts(standard)).toMatchObject([
      { quantity: 1, optionIds: [], name: "Standard equipment" },
    ]);
  });
});
