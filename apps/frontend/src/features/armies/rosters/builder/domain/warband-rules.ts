import type { BuilderGameData } from "../data/builder-game-data.types.ts";
import type { BuilderRoster, BuilderWarband } from "./roster.types.ts";
import type { ArmyListWarbandDefinition } from "~/features/reference/army-lists/army-lists.types.ts";

export interface WarbandCapacity {
  current: number;
  minimum?: number;
  maximum?: number;

  belowMinimum: boolean;
  overMaximum: boolean;
}

export function getWarbandDefinitions(
  gameData: BuilderGameData,
): readonly ArmyListWarbandDefinition[] {
  const warbands = gameData.armyList.warbands;

  return warbands.type === "single" ? [] : warbands.definitions;
}

export function findWarbandDefinition(
  warband: BuilderWarband,
  gameData: BuilderGameData,
): ArmyListWarbandDefinition | undefined {
  if (!warband.leader) {
    return undefined;
  }

  return getWarbandDefinitions(gameData).find(
    (definition) => definition.leaderId === warband.leader?.armyListProfileId,
  );
}

export function getAllowedFollowerProfileIds(
  warband: BuilderWarband,
  gameData: BuilderGameData,
): readonly string[] {
  if (!warband.leader) {
    return [];
  }

  const structure = gameData.armyList.warbands;

  if (structure.type === "single") {
    return gameData.armyList.profiles
      .filter((profile) => profile.id !== warband.leader?.armyListProfileId)
      .map((profile) => profile.id);
  }

  return findWarbandDefinition(warband, gameData)?.followerIds ?? [];
}

export function isFollowerAllowed(
  warband: BuilderWarband,
  armyListProfileId: string,
  gameData: BuilderGameData,
): boolean {
  return getAllowedFollowerProfileIds(warband, gameData).includes(
    armyListProfileId,
  );
}

export function getFollowerCount(warband: BuilderWarband): number {
  return warband.followers.reduce(
    (total, follower) => total + follower.quantity,
    0,
  );
}

export function getWarbandCapacity(
  warband: BuilderWarband,
  gameData: BuilderGameData,
): WarbandCapacity {
  const current = getFollowerCount(warband);
  const definition = findWarbandDefinition(warband, gameData);

  const minimum = definition?.minSize;
  const maximum = definition?.maxSize;

  return {
    current,
    minimum,
    maximum,

    belowMinimum: minimum !== undefined && current < minimum,

    overMaximum: maximum !== undefined && current > maximum,
  };
}

export function canAddWarband(
  roster: BuilderRoster,
  gameData: BuilderGameData,
): boolean {
  if (roster.locked) {
    return false;
  }

  switch (gameData.armyList.warbands.type) {
    case "standard":
    case "choice":
      return true;

    case "single":
      return roster.warbands.length === 0;
  }
}
