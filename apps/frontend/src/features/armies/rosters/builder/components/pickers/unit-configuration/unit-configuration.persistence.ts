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

export async function saveLeaderLoadout(
  warband: BuilderWarband,
  profile: LocalizedArmyListProfile,
  loadout: UnitLoadout,
  actions: RosterPersistence,
): Promise<void> {
  if (loadout.quantity !== 1) {
    throw new Error("A warband leader must have quantity one.");
  }
  const leader = warband.leader;
  if (!leader || leader.armyListProfileId !== profile.id) {
    throw new Error("An existing warband leader cannot be replaced.");
  }

  await actions.updateUnit(warband.id, leader.id, {
    optionIds: normalizeOptionIds(profile, loadout.optionIds),
  });
}

/** Create one follower or update the selected entry without touching siblings. */
export async function saveFollowerLoadout(
  warband: BuilderWarband,
  profile: LocalizedArmyListProfile,
  loadout: UnitLoadout,
  actions: RosterPersistence,
  unit?: BuilderUnit,
): Promise<void> {
  if (!Number.isInteger(loadout.quantity) || loadout.quantity < 1) {
    throw new Error("A follower must have a positive quantity.");
  }

  const optionIds = normalizeOptionIds(profile, loadout.optionIds);
  if (unit) {
    const target = warband.followers.find(
      (follower) => follower.id === unit.id,
    );
    if (!target || target.armyListProfileId !== profile.id) {
      throw new Error("The selected follower is no longer in this warband.");
    }
    await actions.updateUnit(warband.id, target.id, {
      quantity: loadout.quantity,
      optionIds,
    });
  } else {
    await actions.addFollower(
      warband.id,
      profile.id,
      loadout.quantity,
      optionIds,
    );
  }
}

/**
 * Save several follower configurations. Without an edit scope these are additions;
 * with a scope, only the explicitly selected existing roster entries may change.
 * Each API call is independent, so failures may leave a partially applied batch.
 */
export async function saveFollowerLoadouts(
  warband: BuilderWarband,
  profile: LocalizedArmyListProfile,
  loadouts: readonly UnitLoadout[],
  actions: RosterPersistence,
  existingUnits?: readonly BuilderUnit[],
): Promise<void> {
  const desired = new Map<string, UnitLoadout>();
  for (const loadout of loadouts) {
    if (!Number.isInteger(loadout.quantity) || loadout.quantity < 1) {
      throw new Error("A saved loadout must have a positive integer quantity.");
    }
    const optionIds = normalizeOptionIds(profile, loadout.optionIds);
    const key = loadoutKey(optionIds);
    const previous = desired.get(key);
    desired.set(key, {
      optionIds,
      quantity: (previous?.quantity ?? 0) + loadout.quantity,
    });
  }

  if (existingUnits === undefined) {
    for (const loadout of desired.values()) {
      await saveFollowerLoadout(warband, profile, loadout, actions);
    }
    return;
  }

  // Check the entire edit scope before changing anything, including entries
  // that the user reduced to zero in the drawer.
  const selected = existingUnits.map((unit) => {
    const current = warband.followers.find(
      (follower) => follower.id === unit.id,
    );
    if (!current || current.armyListProfileId !== profile.id) {
      throw new Error("The selected follower is no longer in this warband.");
    }
    return current;
  });
  if (new Set(selected.map((unit) => unit.id)).size !== selected.length) {
    throw new Error("A follower may only appear once in an edit scope.");
  }

  const currentByKey = new Map<string, BuilderUnit[]>();
  for (const unit of selected) {
    const key = loadoutKey(normalizeOptionIds(profile, unit.optionIds));
    const group = currentByKey.get(key) ?? [];
    group.push(unit);
    currentByKey.set(key, group);
  }

  const unused: BuilderUnit[] = [];
  for (const [key, units] of currentByKey) {
    const target = desired.get(key);
    if (!target) {
      unused.push(...units);
      continue;
    }
    desired.delete(key);
    const currentTotal = units.reduce(
      (total, unit) => total + unit.quantity,
      0,
    );
    if (currentTotal < target.quantity) {
      const first = units[0];
      await actions.updateUnit(warband.id, first.id, {
        quantity: first.quantity + target.quantity - currentTotal,
      });
    } else if (currentTotal > target.quantity) {
      let toRemove = currentTotal - target.quantity;
      // Preserve existing roster-unit IDs whenever possible.
      for (const unit of [...units].reverse()) {
        if (toRemove === 0) break;
        if (toRemove >= unit.quantity) {
          await actions.deleteUnit(warband.id, unit.id);
          toRemove -= unit.quantity;
        } else {
          await actions.updateUnit(warband.id, unit.id, {
            quantity: unit.quantity - toRemove,
          });
          toRemove = 0;
        }
      }
    }
  }

  // Reuse removed variants when converting regular warriors to upgrades (or
  // changing their equipment), rather than unnecessarily replacing their IDs.
  for (const loadout of desired.values()) {
    const unit = unused.shift();
    if (unit) {
      await actions.updateUnit(warband.id, unit.id, {
        quantity: loadout.quantity,
        optionIds: loadout.optionIds,
      });
    } else {
      await actions.addFollower(
        warband.id,
        profile.id,
        loadout.quantity,
        loadout.optionIds,
      );
    }
  }
  for (const unit of unused) {
    await actions.deleteUnit(warband.id, unit.id);
  }
}
