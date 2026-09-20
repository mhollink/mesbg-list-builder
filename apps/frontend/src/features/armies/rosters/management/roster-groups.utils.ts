import type { RosterGroup } from "@mlb/api-client";

export interface FlatRosterGroup {
  group: RosterGroup;
  depth: number;
}

export function flattenRosterGroups(
  groups: RosterGroup[],
  depth = 0,
): FlatRosterGroup[] {
  return groups.flatMap((group) => [
    { group, depth },
    ...flattenRosterGroups(group.children ?? [], depth + 1),
  ]);
}

export function findRosterGroupPath(
  groups: RosterGroup[],
  groupId: number,
  path: RosterGroup[] = [],
): RosterGroup[] | undefined {
  for (const group of groups) {
    const currentPath = [...path, group];

    if (group.id === groupId) {
      return currentPath;
    }

    const childPath = findRosterGroupPath(
      group.children ?? [],
      groupId,
      currentPath,
    );

    if (childPath) {
      return childPath;
    }
  }

  return undefined;
}
