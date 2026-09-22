import type { RosterSummary } from "@mlb/api-client";
import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useRosterMetadata } from "./useRosterMetadata.ts";

const mocks = vi.hoisted(() => ({
  favorite: vi.fn(),
  unfavorite: vi.fn(),
  lock: vi.fn(),
  unlock: vi.fn(),
  useFavorite: vi.fn(),
  useUnfavorite: vi.fn(),
  useLock: vi.fn(),
  useUnlock: vi.fn(),
}));

vi.mock("~/features/armies/rosters/api/roster-api.ts", () => ({
  useFavoriteRosterMutation: mocks.useFavorite,
  useUnfavoriteRosterMutation: mocks.useUnfavorite,
  useLockRosterMutation: mocks.useLock,
  useUnlockRosterMutation: mocks.useUnlock,
}));

describe("useRosterMetadata", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mocks.useFavorite.mockReturnValue([mocks.favorite, mutationState()]);

    mocks.useUnfavorite.mockReturnValue([mocks.unfavorite, mutationState()]);

    mocks.useLock.mockReturnValue([mocks.lock, mutationState()]);

    mocks.useUnlock.mockReturnValue([mocks.unlock, mutationState()]);
  });

  it("favorites a roster that is not currently favorite", () => {
    const { result } = renderHook(() => useRosterMetadata(roster()));

    act(() => {
      result.current.onFavorite();
    });

    expect(mocks.favorite).toHaveBeenCalledWith(42);
    expect(mocks.unfavorite).not.toHaveBeenCalled();
  });

  it("unfavorites a roster that is already favorite", () => {
    const { result } = renderHook(() =>
      useRosterMetadata(
        roster({
          favorite: true,
        }),
      ),
    );

    act(() => {
      result.current.onFavorite();
    });

    expect(mocks.unfavorite).toHaveBeenCalledWith(42);
    expect(mocks.favorite).not.toHaveBeenCalled();
  });

  it("locks an unlocked roster", () => {
    const { result } = renderHook(() => useRosterMetadata(roster()));

    act(() => {
      result.current.onLock();
    });

    expect(mocks.lock).toHaveBeenCalledWith(42);
    expect(mocks.unlock).not.toHaveBeenCalled();
  });

  it("unlocks a locked roster", () => {
    const { result } = renderHook(() =>
      useRosterMetadata(
        roster({
          locked: true,
        }),
      ),
    );

    act(() => {
      result.current.onLock();
    });

    expect(mocks.unlock).toHaveBeenCalledWith(42);
    expect(mocks.lock).not.toHaveBeenCalled();
  });

  it("aggregates loading and error states", () => {
    mocks.useFavorite.mockReturnValue([
      mocks.favorite,
      mutationState({ isLoading: true }),
    ]);

    mocks.useUnlock.mockReturnValue([
      mocks.unlock,
      mutationState({ isError: true }),
    ]);

    const { result } = renderHook(() => useRosterMetadata(roster()));

    expect(result.current.isFavoriteLoading).toBe(true);
    expect(result.current.isLockLoading).toBe(false);
    expect(result.current.isError).toBe(true);
  });
});

function mutationState(
  overrides: Partial<{
    isLoading: boolean;
    isError: boolean;
  }> = {},
) {
  return {
    isLoading: false,
    isError: false,
    ...overrides,
  };
}

function roster(overrides: Partial<RosterSummary> = {}): RosterSummary {
  return {
    id: 42,
    name: "Mordor",
    favorite: false,
    locked: false,
    ...overrides,
  } as RosterSummary;
}
