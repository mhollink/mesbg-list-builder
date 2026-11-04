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
  armyListProfileId: "other",
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
    replaceFollowerLoadouts: vi.fn(async () => {}),
  } as unknown as RosterPersistence;
}

describe("saveFollowerLoadouts", () => {
  it("creates several configurations with one batch operation", async () => {
    const actions = persistence();
    const empty = { ...warband, followers: [unrelated] };
    await saveFollowerLoadouts(
      empty,
      profile,
      [
        { optionIds: ["shield"], quantity: 2 },
        { optionIds: ["upgrade-to-kings-guard", "elf-bow"], quantity: 3 },
      ],
      actions,
    );
    expect(actions.replaceFollowerLoadouts).toHaveBeenCalledTimes(1);
    expect(actions.replaceFollowerLoadouts).toHaveBeenCalledWith(
      4,
      profile.id,
      [
        { optionIds: ["shield"], quantity: 2 },
        { optionIds: ["elf-bow", "upgrade-to-kings-guard"], quantity: 3 },
      ],
    );
  });

  it("replaces all existing variants of the profile in one operation", async () => {
    const actions = persistence();
    await saveFollowerLoadouts(
      warband,
      profile,
      [{ optionIds: ["shield", "upgrade-to-kings-guard"], quantity: 5 }],
      actions,
      [regular, upgraded],
    );
    expect(actions.replaceFollowerLoadouts).toHaveBeenCalledWith(
      4,
      profile.id,
      [{ optionIds: ["shield", "upgrade-to-kings-guard"], quantity: 5 }],
    );
  });

  it("supports reducing all of a profile's configurations to zero", async () => {
    const actions = persistence();
    await saveFollowerLoadouts(warband, profile, [], actions, [
      regular,
      upgraded,
    ]);
    expect(actions.replaceFollowerLoadouts).toHaveBeenCalledWith(
      4,
      profile.id,
      [],
    );
  });

  it("refuses to edit a narrower scope than the shown profile", async () => {
    const actions = persistence();
    await expect(
      saveFollowerLoadouts(warband, profile, [], actions, [regular]),
    ).rejects.toThrow("changed");
    expect(actions.replaceFollowerLoadouts).not.toHaveBeenCalled();
  });

  it("does not append a duplicate when adding an existing profile", async () => {
    const actions = persistence();
    await expect(
      saveFollowerLoadouts(
        warband,
        profile,
        [{ optionIds: ["shield"], quantity: 1 }],
        actions,
      ),
    ).rejects.toThrow("editing mode");
    expect(actions.replaceFollowerLoadouts).not.toHaveBeenCalled();
  });

  it("rejects invalid and duplicate configurations before submitting", async () => {
    const actions = persistence();
    await expect(
      saveFollowerLoadouts(
        warband,
        profile,
        [
          { optionIds: ["shield"], quantity: 2 },
          { optionIds: ["shield"], quantity: 4 },
        ],
        actions,
        [regular, upgraded],
      ),
    ).rejects.toThrow("Duplicate");
    expect(actions.replaceFollowerLoadouts).not.toHaveBeenCalled();
  });
});
