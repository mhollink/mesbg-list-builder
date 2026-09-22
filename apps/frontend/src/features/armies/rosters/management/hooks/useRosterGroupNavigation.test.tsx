import type { ReactNode } from "react";
import { MemoryRouter, Route, Routes } from "react-router";

import type { RosterGroup, RosterSummary } from "@mlb/api-client";
import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { useRosterGroupNavigation } from "./useRosterGroupNavigation.ts";

describe("useRosterGroupNavigation", () => {
  it("returns root-level groups and rosters on the root route", () => {
    const { result } = renderHook(
      () => useRosterGroupNavigation(groups, rosters),
      { wrapper: wrapper("/armies/rosters") },
    );

    expect(result.current.currentGroupId).toBeUndefined();
    expect(result.current.currentGroup).toBeUndefined();
    expect(result.current.currentGroups).toEqual(groups);
    expect(result.current.currentPath).toEqual([]);
    expect(result.current.currentRosters.map((roster) => roster.id)).toEqual([
      1,
    ]);
  });

  it("resolves nested group navigation and direct rosters", () => {
    const { result } = renderHook(
      () => useRosterGroupNavigation(groups, rosters),
      { wrapper: wrapper("/armies/rosters/groups/11") },
    );

    expect(result.current.currentGroupId).toBe(11);
    expect(result.current.currentGroup?.name).toBe("Nested");
    expect(result.current.currentPath.map((group) => group.id)).toEqual([
      10, 11,
    ]);
    expect(result.current.currentGroups).toEqual([]);
    expect(result.current.currentRosters.map((roster) => roster.id)).toEqual([
      3,
    ]);
    expect(result.current.getDirectRosterCount(10)).toBe(1);
  });

  it("marks malformed group ids as invalid", () => {
    const { result } = renderHook(
      () => useRosterGroupNavigation(groups, rosters),
      { wrapper: wrapper("/armies/rosters/groups/nope") },
    );

    expect(result.current.currentGroupId).toBeUndefined();
    expect(result.current.invalidGroupId).toBe(true);
    expect(result.current.groupNotFound).toBe(false);
  });

  it("marks valid but unknown group ids as not found", () => {
    const { result } = renderHook(
      () => useRosterGroupNavigation(groups, rosters),
      { wrapper: wrapper("/armies/rosters/groups/999") },
    );

    expect(result.current.currentGroupId).toBe(999);
    expect(result.current.invalidGroupId).toBe(false);
    expect(result.current.groupNotFound).toBe(true);
  });
});

function wrapper(initialEntry: string) {
  return function TestRouter({ children }: { children: ReactNode }) {
    return (
      <MemoryRouter initialEntries={[initialEntry]}>
        <Routes>
          <Route path="/armies/rosters" element={children} />
          <Route path="/armies/rosters/groups/:groupId" element={children} />
        </Routes>
      </MemoryRouter>
    );
  };
}

const groups: RosterGroup[] = [
  {
    id: 10,
    name: "Parent",
    children: [
      {
        id: 11,
        name: "Nested",
        children: [],
      } as RosterGroup,
    ],
  } as RosterGroup,
];

const rosters: RosterSummary[] = [
  { id: 1, groupId: null } as RosterSummary,
  { id: 2, groupId: 10 } as RosterSummary,
  { id: 3, groupId: 11 } as RosterSummary,
];
