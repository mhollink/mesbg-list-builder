import type { RosterGroup } from "@mlb/api-client";
import { describe, expect, it } from "vitest";

import {
  findRosterGroupPath,
  flattenRosterGroups,
} from "./roster-groups.utils.ts";

describe("flattenRosterGroups", () => {
  it("flattens groups in tree order with their depth", () => {
    const grandchild = group(3, "Grandchild");
    const child = group(2, "Child", [grandchild]);
    const root = group(1, "Root", [child]);
    const secondRoot = group(4, "Second root");

    expect(
      flattenRosterGroups([root, secondRoot]).map(
        ({ group: entry, depth }) => ({
          id: entry.id,
          depth,
        }),
      ),
    ).toEqual([
      { id: 1, depth: 0 },
      { id: 2, depth: 1 },
      { id: 3, depth: 2 },
      { id: 4, depth: 0 },
    ]);
  });
});

describe("findRosterGroupPath", () => {
  it("returns the full path to a nested group", () => {
    const grandchild = group(3, "Grandchild");
    const child = group(2, "Child", [grandchild]);
    const root = group(1, "Root", [child]);

    expect(findRosterGroupPath([root], 3)?.map((entry) => entry.id)).toEqual([
      1, 2, 3,
    ]);
  });

  it("returns undefined when the group cannot be found", () => {
    expect(findRosterGroupPath([group(1, "Root")], 999)).toBeUndefined();
  });
});

function group(
  id: number,
  name: string,
  children: RosterGroup[] = [],
): RosterGroup {
  return {
    id,
    name,
    children,
  } as RosterGroup;
}
