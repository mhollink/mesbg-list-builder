import { describe, expect, it, vi } from "vitest";

import type {
  BuilderUnit,
  BuilderWarband,
} from "../../../domain/roster.types.ts";
import type { RosterPersistence } from "../../../persistence/roster-persistence.types.ts";
import { saveFollowerLoadouts } from "./unit-configuration.persistence.ts";
import type { LocalizedArmyListProfile } from "~/features/reference/army-lists/army-lists.types.ts";

const regular: BuilderUnit = {
  id: 10,
  armyListProfileId: "rivendell-warrior",
  optionIds: ["shield"],
  quantity: 2,
};
const upgraded: BuilderUnit = {
  id: 11,
  armyListProfileId: "rivendell-warrior",
  optionIds: ["elf-bow", "upgrade-to-kings-guard"],
  quantity: 3,
};
const unrelated: BuilderUnit = {
  id: 12,
  armyListProfileId: "another-warrior",
  optionIds: [],
  quantity: 4,
};
const warband = {
  id: 4,
  followers: [regular, upgraded, unrelated],
} as BuilderWarband;
const profile = {
  id: "rivendell-warrior",
  options: [
    { id: "shield", category: "equipment", state: "available" },
    { id: "elf-bow", category: "equipment", state: "available" },
    {
      id: "upgrade-to-kings-guard",
      category: "special-upgrade",
      state: "available",
    },
  ],
} as unknown as LocalizedArmyListProfile;

function persistence() {
  return {
    addFollower: vi.fn(async () => {}),
    updateUnit: vi.fn(async () => {}),
    deleteUnit: vi.fn(async () => {}),
  } as unknown as RosterPersistence;
}

describe("saveFollowerLoadouts", () => {
  it("adds multiple configurations in one submission", async () => {
    const actions = persistence();
    await saveFollowerLoadouts(
      warband,
      profile,
      [
        { optionIds: ["shield"], quantity: 2 },
        { optionIds: ["upgrade-to-kings-guard", "elf-bow"], quantity: 3 },
      ],
      actions,
    );
    expect(actions.addFollower).toHaveBeenCalledTimes(2);
    expect(actions.addFollower).toHaveBeenCalledWith(4, profile.id, 2, [
      "shield",
    ]);
    expect(actions.addFollower).toHaveBeenCalledWith(4, profile.id, 3, [
      "elf-bow",
      "upgrade-to-kings-guard",
    ]);
    expect(actions.updateUnit).not.toHaveBeenCalled();
  });

  it("preserves matching upgraded entries while adjusting regular quantities", async () => {
    const actions = persistence();
    await saveFollowerLoadouts(
      warband,
      profile,
      [
        { optionIds: ["shield"], quantity: 5 },
        { optionIds: ["elf-bow", "upgrade-to-kings-guard"], quantity: 3 },
      ],
      actions,
      [regular, upgraded],
    );
    expect(actions.updateUnit).toHaveBeenCalledTimes(1);
    expect(actions.updateUnit).toHaveBeenCalledWith(4, regular.id, {
      quantity: 5,
    });
    expect(actions.addFollower).not.toHaveBeenCalled();
    expect(actions.deleteUnit).not.toHaveBeenCalled();
  });

  it("converts the selected unit's options instead of creating a replacement", async () => {
    const actions = persistence();
    await saveFollowerLoadouts(
      warband,
      profile,
      [{ optionIds: ["upgrade-to-kings-guard", "shield"], quantity: 2 }],
      actions,
      [regular],
    );
    expect(actions.updateUnit).toHaveBeenCalledWith(4, regular.id, {
      quantity: 2,
      optionIds: ["shield", "upgrade-to-kings-guard"],
    });
    expect(actions.addFollower).not.toHaveBeenCalled();
    expect(actions.deleteUnit).not.toHaveBeenCalled();
  });

  it("deletes only selected entries set to zero", async () => {
    const actions = persistence();
    await saveFollowerLoadouts(warband, profile, [], actions, [
      regular,
      upgraded,
    ]);
    expect(actions.deleteUnit).toHaveBeenCalledTimes(2);
    expect(actions.deleteUnit).toHaveBeenCalledWith(4, regular.id);
    expect(actions.deleteUnit).toHaveBeenCalledWith(4, upgraded.id);
    expect(actions.deleteUnit).not.toHaveBeenCalledWith(4, unrelated.id);
  });

  it("rejects stale edit scopes before making changes", async () => {
    const actions = persistence();
    await expect(
      saveFollowerLoadouts(warband, profile, [], actions, [unrelated]),
    ).rejects.toThrow("no longer");
    expect(actions.updateUnit).not.toHaveBeenCalled();
    expect(actions.deleteUnit).not.toHaveBeenCalled();
  });
});
