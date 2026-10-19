import type {
  BuilderUnit,
  BuilderWarband,
} from "../../../domain/roster.types.ts";
import type { RosterPersistence } from "../../../persistence/roster-persistence.types.ts";
import {
  loadoutKey,
  normalizeOptionIds,
  type UnitLoadout,
} from "./unit-configuration.utils.ts";
import type { LocalizedArmyListProfile } from "~/features/reference/army-lists/army-lists.types.ts";

export async function saveLeaderLoadouts(
  warband: BuilderWarband,
  profile: LocalizedArmyListProfile,
  loadouts: readonly UnitLoadout[],
  actions: RosterPersistence,
): Promise<void> {
  const loadout = loadouts[0];
  if (!loadout || loadouts.length !== 1 || loadout.quantity !== 1) {
    throw new Error("A leader must have exactly one equipment configuration.");
  }

  if (warband.leader?.armyListProfileId === profile.id) {
    await actions.updateUnit(warband.id, warband.leader.id, {
      optionIds: loadout.optionIds,
    });
  } else {
    await actions.setLeader(warband.id, profile.id, loadout.optionIds);
  }
}

export async function saveFollowerLoadouts(
  warband: BuilderWarband,
  profile: LocalizedArmyListProfile,
  loadouts: readonly UnitLoadout[],
  actions: RosterPersistence,
): Promise<void> {
  const existingUnits = warband.followers.filter(
    (unit) => unit.armyListProfileId === profile.id,
  );

  const keyFor = (optionIds: readonly string[]) =>
    loadoutKey(normalizeOptionIds(profile, optionIds));

  const existingByKey = new Map<string, BuilderUnit[]>();
  for (const unit of existingUnits) {
    const key = keyFor(unit.optionIds);
    const group = existingByKey.get(key) ?? [];
    group.push(unit);
    existingByKey.set(key, group);
  }

  const desiredByKey = new Map<string, UnitLoadout>();
  for (const loadout of loadouts) {
    if (loadout.quantity <= 0) {
      continue;
    }

    const options = normalizeOptionIds(profile, loadout.optionIds);
    const key = keyFor(options);
    const previous = desiredByKey.get(key);

    desiredByKey.set(key, {
      optionIds: options,
      quantity: (previous?.quantity ?? 0) + loadout.quantity,
    });
  }

  for (const [key, desired] of desiredByKey) {
    const matches = existingByKey.get(key) ?? [];
    const retained = matches.shift();

    if (retained) {
      if (retained.quantity !== desired.quantity) {
        await actions.updateUnit(warband.id, retained.id, {
          quantity: desired.quantity,
        });
      }
    } else {
      await actions.addFollower(
        warband.id,
        profile.id,
        desired.quantity,
        desired.optionIds,
      );
    }

    existingByKey.set(key, matches);
  }

  // Remove configurations reduced to zero and duplicate existing entries.
  for (const leftovers of existingByKey.values()) {
    for (const unit of leftovers) {
      await actions.deleteUnit(warband.id, unit.id);
    }
  }
}
