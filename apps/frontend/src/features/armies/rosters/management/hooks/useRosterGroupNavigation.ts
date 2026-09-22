import { useMemo } from "react";
import { useParams } from "react-router";

import type { RosterGroup, RosterSummary } from "@mlb/api-client";

import { findRosterGroupPath } from "../roster-groups.utils";

export function useRosterGroupNavigation(
  groups: RosterGroup[],
  rosters: RosterSummary[],
): {
  currentGroupId?: number;
  currentGroup?: RosterGroup;
  currentGroups: RosterGroup[];
  currentPath: RosterGroup[];
  invalidGroupId: boolean;
  groupNotFound: boolean;
  currentRosters: RosterSummary[];
  getDirectRosterCount: (groupId: number) => number;
} {
  const { groupId: groupIdParam } = useParams();

  const parsedGroupId =
    groupIdParam === undefined ? null : Number(groupIdParam);

  const currentGroupId =
    parsedGroupId !== null &&
    Number.isInteger(parsedGroupId) &&
    parsedGroupId > 0
      ? parsedGroupId
      : null;

  const invalidGroupId = groupIdParam !== undefined && currentGroupId === null;

  const currentPath = useMemo(() => {
    if (currentGroupId === null) {
      return [];
    }

    return findRosterGroupPath(groups, currentGroupId) ?? [];
  }, [groups, currentGroupId]);

  const currentRosters = useMemo(
    () =>
      rosters.filter((roster) => (roster.groupId ?? null) === currentGroupId),
    [rosters, currentGroupId],
  );

  function getDirectRosterCount(groupId: number) {
    return rosters.filter((roster) => roster.groupId === groupId).length;
  }

  const currentGroup = currentPath.at(-1);

  const currentGroups =
    currentGroupId === null ? groups : (currentGroup?.children ?? []);

  const groupNotFound = currentGroupId !== null && currentGroup === undefined;

  return {
    currentGroupId: currentGroupId ?? undefined,
    currentGroup,
    currentGroups,
    currentPath,
    invalidGroupId,
    groupNotFound,
    currentRosters,
    getDirectRosterCount,
  };
}
