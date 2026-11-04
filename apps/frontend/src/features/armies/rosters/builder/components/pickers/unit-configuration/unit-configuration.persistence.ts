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

/** Save a complete set of configurations for one follower profile. */
export async function saveFollowerLoadouts(
  warband: BuilderWarband,
  profile: LocalizedArmyListProfile,
  loadouts: readonly UnitLoadout[],
  actions: RosterPersistence,
  existingUnits?: readonly BuilderUnit[],
): Promise<void> {
  const actual = warband.followers.filter(
    (unit) => unit.armyListProfileId === profile.id,
  );
  if (existingUnits !== undefined) {
    // Never silently replace a wider profile scope than the drawer displayed.
    const shown = new Set(existingUnits.map((unit) => unit.id));
    if (
      shown.size !== actual.length ||
      actual.some((unit) => !shown.has(unit.id))
    ) {
      throw new Error(
        "The follower configurations changed. Reopen the drawer to refresh them.",
      );
    }
  } else if (actual.length > 0) {
    throw new Error("Existing followers must be opened in editing mode.");
  }

  const seen = new Set<string>();
  const normalized = loadouts.map(({ optionIds, quantity }) => {
    if (!Number.isInteger(quantity) || quantity < 1) {
      throw new Error("Follower quantities must be positive integers.");
    }
    const options = normalizeOptionIds(profile, optionIds);
    const key = loadoutKey(options);
    if (seen.has(key)) throw new Error("Duplicate follower configuration.");
    seen.add(key);
    return { quantity, optionIds: options };
  });

  await actions.replaceFollowerLoadouts(warband.id, profile.id, normalized);
}
