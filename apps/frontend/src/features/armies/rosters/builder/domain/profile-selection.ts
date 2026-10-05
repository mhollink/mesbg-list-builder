import type { BuilderGameData } from "../data/builder-game-data.types.ts";
import type {
  BuilderRoster,
  BuilderUnit,
  BuilderUnitId,
  BuilderWarband,
} from "./roster.types.ts";
import { getAllowedFollowerProfileIds } from "./warband-rules.ts";
import type { LocalizedArmyListProfile } from "~/features/reference/army-lists/army-lists.types.ts";

export interface ProfileAvailabilityOptions {
  /**
   * Unit to ignore when checking uniqueness.
   *
   * This is primarily used while replacing a leader: a unique leader
   * must not make itself unavailable in the replacement picker.
   */
  ignoreUnitId?: BuilderUnitId;
}

export function isUniqueProfile(profile: LocalizedArmyListProfile): boolean {
  return profile.profile.unitTypes.includes("unique");
}

export function isProfilePresentInRoster(
  roster: BuilderRoster,
  profile: LocalizedArmyListProfile,
  gameData: BuilderGameData,
  options: ProfileAvailabilityOptions = {},
): boolean {
  return getRosterUnits(roster).some((unit) => {
    if (unit.id === options.ignoreUnitId) {
      return false;
    }

    const selectedProfile = gameData.armyListProfilesById.get(
      unit.armyListProfileId,
    );

    if (!selectedProfile) {
      // Defensive fallback for stale/missing game data.
      return unit.armyListProfileId === profile.id;
    }

    return selectedProfile.profileId === profile.profileId;
  });
}

export function isProfileAvailable(
  roster: BuilderRoster,
  profile: LocalizedArmyListProfile,
  gameData: BuilderGameData,
  options: ProfileAvailabilityOptions = {},
): boolean {
  if (!isUniqueProfile(profile)) {
    return true;
  }

  return !isProfilePresentInRoster(roster, profile, gameData, options);
}

export function getAvailableLeaders(
  roster: BuilderRoster,
  gameData: BuilderGameData,
  options: ProfileAvailabilityOptions = {},
): LocalizedArmyListProfile[] {
  const candidateIds = getLeaderCandidateIds(gameData);

  return candidateIds.flatMap((profileId) => {
    const profile = gameData.armyListProfilesById.get(profileId);

    if (!profile) {
      return [];
    }

    return isProfileAvailable(roster, profile, gameData, options)
      ? [profile]
      : [];
  });
}

export function getAvailableFollowers(
  roster: BuilderRoster,
  warband: BuilderWarband,
  gameData: BuilderGameData,
): LocalizedArmyListProfile[] {
  const candidateIds = getAllowedFollowerProfileIds(warband, gameData);

  return candidateIds.flatMap((profileId) => {
    const profile = gameData.armyListProfilesById.get(profileId);

    if (!profile) {
      return [];
    }

    return isProfileAvailable(roster, profile, gameData) ? [profile] : [];
  });
}

function getLeaderCandidateIds(gameData: BuilderGameData): string[] {
  const { warbands, profiles } = gameData.armyList;

  if (warbands.type === "single") {
    return profiles.filter(canLeadWarband).map((profile) => profile.id);
  }

  return [
    ...new Set(
      warbands.definitions.flatMap((definition) =>
        definition.leaderId ? [definition.leaderId] : [],
      ),
    ),
  ];
}

function canLeadWarband(profile: LocalizedArmyListProfile): boolean {
  if (profile.warbandCapabilities) {
    return profile.warbandCapabilities.includes("leader");
  }

  return profile.tier !== "warrior" && profile.tier !== "siege-engine";
}

function getRosterUnits(roster: BuilderRoster): BuilderUnit[] {
  return roster.warbands.flatMap((warband) => [
    ...(warband.leader ? [warband.leader] : []),
    ...warband.followers,
  ]);
}
