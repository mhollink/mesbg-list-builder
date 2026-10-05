import type { BuilderGameData } from "../data/builder-game-data.types.ts";
import type {
  BuilderRoster,
  BuilderUnitId,
  BuilderWarbandId,
} from "./roster.types.ts";
import type { BuilderRosterStatistics } from "./roster-statistics.ts";
import { getWarbandCapacity, isFollowerAllowed } from "./warband-rules.ts";

export type RosterValidationIssue =
  | {
      code: "points-limit";
      points: number;
      pointsLimit: number;
    }
  | {
      code: "warband-capacity";
      warbandId: BuilderWarbandId;
      current: number;
      maximum: number;
    }
  | {
      code: "leaderless-followers";
      warbandId: BuilderWarbandId;
    }
  | {
      code: "invalid-follower";
      warbandId: BuilderWarbandId;
      unitId: BuilderUnitId;
    };

export function validateRoster(
  roster: BuilderRoster,
  gameData: BuilderGameData,
  statistics: BuilderRosterStatistics,
): RosterValidationIssue[] {
  const issues: RosterValidationIssue[] = [];

  if (
    roster.pointsLimit !== undefined &&
    statistics.points > roster.pointsLimit
  ) {
    issues.push({
      code: "points-limit",
      points: statistics.points,
      pointsLimit: roster.pointsLimit,
    });
  }

  for (const warband of roster.warbands) {
    const capacity = getWarbandCapacity(warband, gameData);

    if (capacity.overMaximum && capacity.maximum !== undefined) {
      issues.push({
        code: "warband-capacity",
        warbandId: warband.id,
        current: capacity.current,
        maximum: capacity.maximum,
      });
    }

    if (!warband.leader && warband.followers.length > 0) {
      issues.push({
        code: "leaderless-followers",
        warbandId: warband.id,
      });

      continue;
    }

    for (const follower of warband.followers) {
      if (!isFollowerAllowed(warband, follower.armyListProfileId, gameData)) {
        issues.push({
          code: "invalid-follower",
          warbandId: warband.id,
          unitId: follower.id,
        });
      }
    }
  }

  return issues;
}
