import type { RosterGroup, RosterSummary } from "@mlb/api-client";
import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useRosterManagementData } from "./useRosterManagementData.ts";

const mocks = vi.hoisted(() => ({
  rostersQuery: vi.fn(),
  groupsQuery: vi.fn(),
}));

vi.mock("~/features/armies/rosters/api/roster-api.ts", () => ({
  useGetRostersQuery: mocks.rostersQuery,
}));

vi.mock("~/features/armies/rosters/api/roster-group-api.ts", () => ({
  useGetRosterGroupsQuery: mocks.groupsQuery,
}));

describe("useRosterManagementData", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.rostersQuery.mockReturnValue(queryState());
    mocks.groupsQuery.mockReturnValue(queryState());
  });

  it("defaults missing query data to empty collections", () => {
    const { result } = renderHook(() => useRosterManagementData());

    expect(result.current.rosters).toEqual([]);
    expect(result.current.groups).toEqual([]);
    expect(result.current.tagSuggestions).toEqual([]);
  });

  it("collects case-insensitive unique tag suggestions in sorted order", () => {
    mocks.rostersQuery.mockReturnValue(
      queryState({
        data: [roster(["Zulu", "Alpha"]), roster(["alpha", "Event"])],
      }),
    );

    const { result } = renderHook(() => useRosterManagementData());

    expect(result.current.tagSuggestions).toEqual(["Alpha", "Event", "Zulu"]);
  });

  it("aggregates loading and error state from both queries", () => {
    mocks.rostersQuery.mockReturnValue(queryState({ isLoading: true }));
    mocks.groupsQuery.mockReturnValue(queryState({ isError: true }));

    const { result } = renderHook(() => useRosterManagementData());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.isError).toBe(true);
  });
});

function queryState(
  overrides: Partial<{
    data: RosterSummary[] | RosterGroup[];
    isLoading: boolean;
    isError: boolean;
  }> = {},
) {
  return {
    data: undefined,
    isLoading: false,
    isError: false,
    ...overrides,
  };
}

function roster(tags: string[]): RosterSummary {
  return {
    id: Math.random(),
    tags,
  } as RosterSummary;
}
