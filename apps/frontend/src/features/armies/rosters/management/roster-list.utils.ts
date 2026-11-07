import type { RosterGroup, RosterSummary } from "@mlb/api-client";

import { flattenRosterGroups } from "./roster-groups.utils.ts";
import { normalizeSearchText } from "~/utils/normalize.ts";

export type RosterSort =
  | "recent"
  | "name-asc"
  | "name-desc"
  | "army-asc"
  | "army-desc"
  | "points-desc"
  | "points-asc"
  | "models-desc"
  | "models-asc";

/** Returns matching groups at any nesting depth, without changing their stored order. */
export function filterRosterGroups(
  groups: RosterGroup[],
  query: string,
): RosterGroup[] {
  const terms = normalizeSearchText(query).split(" ").filter(Boolean);
  return flattenRosterGroups(groups)
    .map(({ group }) => group)
    .filter((group) => {
      const name = normalizeSearchText(group.name);
      return terms.every((term) => name.includes(term));
    });
}

/** Filters across all groups when searching, without changing the server's default order. */
export function filterAndSortRosters(
  rosters: readonly RosterSummary[],
  query: string,
  sort: RosterSort,
  armyListNames: ReadonlyMap<string, string>,
): RosterSummary[] {
  const terms = normalizeSearchText(query).split(" ").filter(Boolean);
  const filtered = rosters.filter((roster) => {
    const searchable = normalizeSearchText(
      [
        roster.name,
        armyListNames.get(roster.armyListId) ?? roster.armyListId,
        ...(roster.tags ?? []),
      ].join(" "),
    );

    return terms.every((term) => searchable.includes(term));
  });

  if (sort === "recent") {
    return filtered;
  }

  return filtered.sort((a, b) => {
    let comparison = 0;

    switch (sort) {
      case "name-asc":
        comparison = a.name.localeCompare(b.name);
        break;
      case "name-desc":
        comparison = b.name.localeCompare(a.name);
        break;
      case "army-asc":
        comparison = (
          armyListNames.get(a.armyListId) ?? a.armyListId
        ).localeCompare(armyListNames.get(b.armyListId) ?? b.armyListId);
        break;
      case "army-desc":
        comparison = (
          armyListNames.get(b.armyListId) ?? b.armyListId
        ).localeCompare(armyListNames.get(a.armyListId) ?? a.armyListId);
        break;
      case "points-desc":
        comparison = b.points - a.points;
        break;
      case "points-asc":
        comparison = a.points - b.points;
        break;
      case "models-desc":
        comparison = b.modelCount - a.modelCount;
        break;
      case "models-asc":
        comparison = a.modelCount - b.modelCount;
        break;
    }

    return comparison || a.name.localeCompare(b.name) || a.id - b.id;
  });
}
