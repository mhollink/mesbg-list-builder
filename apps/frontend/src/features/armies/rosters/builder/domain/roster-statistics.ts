import type { BuilderGameData } from "../data/builder-game-data.types.ts";
import type { BuilderRoster, BuilderUnit } from "./roster.types.ts";
import {
  getEffectiveUnitOptions,
  getUnitTotalCost,
} from "~/features/armies/rosters/builder/domain/option-rules.ts";
import type { LocalizedArmyListProfile } from "~/features/reference/army-lists/army-lists.types.ts";
import type { LocalizedProfile } from "~/features/reference/profiles/profiles.types.ts";

export interface BuilderRosterStatistics {
  points: number;
  modelCount: number;
  warbandCount: number;
  might: number;
  bowCount: number;
  throwingWeaponCount: number;
}

export function calculateRosterStatistics(
  roster: BuilderRoster,
  gameData: BuilderGameData,
): BuilderRosterStatistics {
  const statistics: BuilderRosterStatistics = {
    points: calculateArmyOptionPoints(roster, gameData),
    modelCount: 0,
    warbandCount: roster.warbands.length,
    might: 0,
    bowCount: 0,
    throwingWeaponCount: 0,
  };

  for (const warband of roster.warbands) {
    if (warband.leader) {
      addUnitStatistics(statistics, warband.leader, gameData);
    }

    for (const follower of warband.followers) {
      addUnitStatistics(statistics, follower, gameData);
    }
  }

  return statistics;
}

function addUnitStatistics(
  statistics: BuilderRosterStatistics,
  unit: BuilderUnit,
  gameData: BuilderGameData,
): void {
  const armyListProfile = gameData.armyListProfilesById.get(
    unit.armyListProfileId,
  );

  if (!armyListProfile) {
    return;
  }

  const profile = armyListProfile.profile;
  const options = getEffectiveUnitOptions(unit, armyListProfile);
  const quantity = unit.quantity;

  statistics.modelCount += quantity;

  statistics.points += getUnitTotalCost(unit, armyListProfile);
  statistics.might += getMight(profile) * quantity;

  if (armyListProfile.tier !== "warrior") {
    return;
  }

  const equipment = getEffectiveEquipment(profile, armyListProfile, options);

  if ([...equipment].some(isBow)) {
    statistics.bowCount += quantity;
  }

  if ([...equipment].some(isThrowingWeapon)) {
    statistics.throwingWeaponCount += quantity;
  }
}

function calculateArmyOptionPoints(
  roster: BuilderRoster,
  gameData: BuilderGameData,
): number {
  const selectedOptionIds = new Set(roster.armyOptionIds);

  for (const option of gameData.armyList.options ?? []) {
    if (option.preselected) {
      selectedOptionIds.add(option.id);
    }
  }

  return [...selectedOptionIds].reduce((total, optionId) => {
    const option = gameData.armyList.options?.find(
      (candidate) => candidate.id === optionId,
    );

    return total + (option?.points ?? 0);
  }, 0);
}

function getMight(profile: LocalizedProfile): number {
  if (profile.stats.type !== "hero") {
    return 0;
  }

  const might = Number(profile.stats.might);

  return Number.isFinite(might) ? might : 0;
}

function getEffectiveEquipment(
  profile: LocalizedProfile,
  armyListProfile: LocalizedArmyListProfile,
  options: LocalizedArmyListProfile["options"],
): Set<string> {
  const equipment = new Set(profile.wargear);

  for (const removed of armyListProfile.overrides?.removeWargear ?? []) {
    equipment.delete(removed);
  }

  for (const option of options) {
    equipment.add(option.optionId);
  }

  return equipment;
}

function isBow(equipmentId: string): boolean {
  return (
    equipmentId === "bow" ||
    equipmentId.endsWith("-bow") ||
    equipmentId === "crossbow"
  );
}

function isThrowingWeapon(equipmentId: string): boolean {
  return (
    equipmentId.startsWith("throwing-") ||
    equipmentId.includes("-and-throwing-")
  );
}
