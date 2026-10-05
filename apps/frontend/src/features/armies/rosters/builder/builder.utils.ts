import type { BuilderRoster } from "~/features/armies/rosters/builder/domain/roster.types.ts";
import type { BuilderRosterStatistics } from "~/features/armies/rosters/builder/domain/roster-statistics.ts";

export function formatPoints(
  roster: BuilderRoster,
  statistics: BuilderRosterStatistics,
): string {
  return roster.pointsLimit
    ? `${statistics.points}/${roster.pointsLimit} pts`
    : `${statistics.points} pts`;
}

export function formatIssueCount(count: number): string {
  if (count === 0) {
    return "No issues";
  }

  if (count === 1) {
    return "1 issue";
  }

  return `${count} issues`;
}
