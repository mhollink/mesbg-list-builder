import { describe, expect, it } from "vitest";

import {
  getEquipmentSelectionLimits,
  normalizeOptionIds,
  toggleUnitOption,
} from "./unit-configuration.utils.ts";
import type { LocalizedArmyListProfile } from "~/features/reference/army-lists/army-lists.types.ts";

const warrior = {
  profile: { stats: { type: "warrior" }, optionLimits: { min: 0, max: 1 } },
  options: [
    { id: "shield", state: "available", category: "equipment" },
    { id: "spear", state: "available", category: "equipment" },
    { id: "guard", state: "available", category: "special-upgrade" },
    { id: "elite", state: "available", category: "special-upgrade" },
    { id: "horse", state: "preselected", category: "equipment" },
  ],
} as unknown as LocalizedArmyListProfile;

describe("single unit configuration", () => {
  it("replaces a selected warrior equipment option with one toggle", () => {
    expect(
      toggleUnitOption(warrior, ["spear", "guard"], "shield", true),
    ).toEqual(["guard", "shield"]);
  });

  it("selects upgrades independently of equipment and only one at a time", () => {
    expect(
      toggleUnitOption(warrior, ["shield", "guard"], "elite", true),
    ).toEqual(["elite", "shield"]);
  });

  it("does not remove preselected options", () => {
    expect(
      toggleUnitOption(warrior, ["horse", "shield"], "horse", false),
    ).toEqual(["shield"]);
    expect(normalizeOptionIds(warrior, ["horse", "shield", "shield"])).toEqual([
      "shield",
    ]);
  });

  it("counts equipment but not upgrades for option limits", () => {
    expect(getEquipmentSelectionLimits(warrior, ["guard"]).count).toBe(1);
    expect(
      getEquipmentSelectionLimits(warrior, ["shield", "guard"]).valid,
    ).toBe(false); // Preselected horse already uses the one equipment slot.
  });

  it("keeps multiple equipment selections for heroes", () => {
    const hero = {
      ...warrior,
      profile: { stats: { type: "hero" }, optionLimits: { max: 3 } },
    } as unknown as LocalizedArmyListProfile;
    expect(toggleUnitOption(hero, ["spear", "guard"], "shield", true)).toEqual([
      "guard",
      "shield",
      "spear",
    ]);
  });
});
