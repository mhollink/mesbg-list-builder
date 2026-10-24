import type {
  BuilderUnit,
  BuilderWarband,
} from "../../../domain/roster.types.ts";
import type { RosterPersistence } from "../../../persistence/roster-persistence.types.ts";
import {
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
