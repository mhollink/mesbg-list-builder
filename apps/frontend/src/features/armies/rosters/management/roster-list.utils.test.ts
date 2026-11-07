import type { RosterGroup, RosterSummary } from "@mlb/api-client";
import { describe, expect, it } from "vitest";

import {
  filterAndSortRosters,
  filterRosterGroups,
  type RosterSort,
} from "./roster-list.utils.ts";

const names = new Map([["mordor", "Mordor"]]);
const rosters = [
  {
    id: 3,
    name: "Zulu",
    armyListId: "mordor",
    tags: ["Friendly"],
    points: 300,
    modelCount: 7,
  },
  {
    id: 1,
    name: "Alpha",
    armyListId: "mordor",
    tags: ["Tournament"],
    points: 700,
    modelCount: 12,
  },
  {
    id: 2,
    name: "Beta",
    armyListId: "angmar",
    tags: [],
    points: 500,
    modelCount: 22,
  },
] as RosterSummary[];

const view = (query: string, sort: RosterSort) =>
  filterAndSortRosters(rosters, query, sort, names).map((roster) => roster.id);

describe("filterRosterGroups", () => {
  it("searches group names at every nesting level", () => {
    const groups = [
      {
        id: 10,
        name: "Events",
        children: [{ id: 11, name: "Tournaments", children: [] }],
      },
      { id: 12, name: "Casual", children: [] },
    ] as RosterGroup[];
    expect(
      filterRosterGroups(groups, "tournament").map((group) => group.id),
    ).toEqual([11]);
    expect(
      filterRosterGroups(groups, "casual").map((group) => group.id),
    ).toEqual([12]);
    expect(filterRosterGroups(groups, "no match")).toEqual([]);
  });
});

describe("filterAndSortRosters", () => {
  it("preserves the server's original order by default", () => {
    expect(view("", "recent")).toEqual([3, 1, 2]);
    expect(rosters.map((roster) => roster.id)).toEqual([3, 1, 2]);
  });

  it("finds rosters by name, localized army list and tags", () => {
    expect(view("alpha", "recent")).toEqual([1]);
    expect(view("MORDOR", "recent")).toEqual([3, 1]);
    expect(view("tournament mordor", "recent")).toEqual([1]);
    expect(view("missing", "recent")).toEqual([]);
  });

  it.each([
    ["name-asc", [1, 2, 3]],
    ["name-desc", [3, 2, 1]],
    ["army-asc", [2, 1, 3]],
    ["army-desc", [1, 3, 2]],
    ["points-asc", [3, 2, 1]],
    ["points-desc", [1, 2, 3]],
    ["models-asc", [3, 1, 2]],
    ["models-desc", [2, 1, 3]],
  ] as const)("sorts using %s", (sort, expected) => {
    expect(view("", sort)).toEqual(expected);
  });
});
