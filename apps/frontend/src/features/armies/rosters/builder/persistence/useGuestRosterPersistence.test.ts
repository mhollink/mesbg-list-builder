import { renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useGuestRosterPersistence } from "./useGuestRosterPersistence.ts";
import {
  addGuestFollower,
  addGuestWarband,
  clearGuestGeneral,
  deleteGuestUnit,
  deleteGuestWarband,
  moveGuestUnit,
  moveGuestWarband,
  setGuestArmyOptions,
  setGuestGeneral,
  updateGuestUnit,
} from "~/features/armies/rosters/guest/guest-roster.slice.ts";
import type { GuestRoster } from "~/features/armies/rosters/guest/guest-roster.types.ts";

const mocks = vi.hoisted(() => ({
  dispatch: vi.fn(),
  roster: null as GuestRoster | null,
}));

vi.mock("~/app/store/hooks.ts", () => ({
  useAppDispatch: () => mocks.dispatch,
  useAppSelector: () => mocks.roster,
}));

describe("useGuestRosterPersistence", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mocks.roster = guestRoster();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("creates a new warband", async () => {
    mockUuid("00000000-0000-4000-8000-000000000001");

    const { result } = renderHook(() => useGuestRosterPersistence());

    await result.current.createWarband({
        armyListProfileId: "gothmog",
        optionIds: ["warg"],
    });

    expect(mocks.dispatch).toHaveBeenCalledWith(
      addGuestWarband({
        id: "00000000-0000-4000-8000-000000000001",
        leader: {
          id: "00000000-0000-4000-8000-000000000001",
          armyListProfileId: "gothmog",
          optionIds: ["warg"],
          quantity: 1
        },
        followers: [],
      }),
    );
  });

  it("deletes and moves warbands", async () => {
    const { result } = renderHook(() => useGuestRosterPersistence());

    await result.current.deleteWarband("warband-1");
    await result.current.moveWarband("warband-2", 0);

    expect(mocks.dispatch).toHaveBeenNthCalledWith(
      1,
      deleteGuestWarband("warband-1"),
    );

    expect(mocks.dispatch).toHaveBeenNthCalledWith(
      2,
      moveGuestWarband({
        warbandId: "warband-2",
        position: 0,
      }),
    );
  });

  it("duplicates a warband with new ids", async () => {
    const randomUuid = vi.spyOn(globalThis.crypto, "randomUUID");

    randomUuid
      .mockReturnValueOnce("00000000-0000-4000-8000-000000000010")
      .mockReturnValueOnce("00000000-0000-4000-8000-000000000011")
      .mockReturnValueOnce("00000000-0000-4000-8000-000000000012");

    const { result } = renderHook(() => useGuestRosterPersistence());

    await result.current.duplicateWarband("warband-1");

    expect(mocks.dispatch).toHaveBeenCalledWith(
      addGuestWarband({
        id: "00000000-0000-4000-8000-000000000010",

        leader: {
          id: "00000000-0000-4000-8000-000000000011",
          armyListProfileId: "witch-king",
          quantity: 1,
          optionIds: ["horse"],
        },

        followers: [
          {
            id: "00000000-0000-4000-8000-000000000012",
            armyListProfileId: "orc-warrior",
            quantity: 4,
            optionIds: ["shield"],
          },
        ],
      }),
    );
  });

  it("adds a follower with a generated id", async () => {
    mockUuid("00000000-0000-4000-8000-000000000030");

    const { result } = renderHook(() => useGuestRosterPersistence());

    await result.current.addFollower("warband-1", "orc-warrior", 6, ["spear"]);

    expect(mocks.dispatch).toHaveBeenCalledWith(
      addGuestFollower({
        warbandId: "warband-1",

        follower: {
          id: "00000000-0000-4000-8000-000000000030",
          armyListProfileId: "orc-warrior",
          quantity: 6,
          optionIds: ["spear"],
        },
      }),
    );
  });

  it("updates and deletes units", async () => {
    const { result } = renderHook(() => useGuestRosterPersistence());

    await result.current.updateUnit("warband-1", "follower-1", {
      quantity: 8,
      optionIds: ["spear"],
    });

    await result.current.deleteUnit("warband-1", "follower-1");

    expect(mocks.dispatch).toHaveBeenNthCalledWith(
      1,
      updateGuestUnit({
        warbandId: "warband-1",
        unitId: "follower-1",
        changes: {
          quantity: 8,
          optionIds: ["spear"],
        },
      }),
    );

    expect(mocks.dispatch).toHaveBeenNthCalledWith(
      2,
      deleteGuestUnit({
        warbandId: "warband-1",
        unitId: "follower-1",
      }),
    );
  });

  it("moves a unit between warbands", async () => {
    const { result } = renderHook(() => useGuestRosterPersistence());

    await result.current.moveUnit("warband-1", "follower-1", "warband-2", 1);

    expect(mocks.dispatch).toHaveBeenCalledWith(
      moveGuestUnit({
        sourceWarbandId: "warband-1",
        unitId: "follower-1",
        targetWarbandId: "warband-2",
        position: 1,
      }),
    );
  });

  it("updates roster-level composition", async () => {
    const { result } = renderHook(() => useGuestRosterPersistence());

    await result.current.setGeneral("leader-1");
    await result.current.clearGeneral();

    await result.current.setArmyOptions(["option-a", "option-b"]);

    expect(mocks.dispatch).toHaveBeenNthCalledWith(
      1,
      setGuestGeneral("leader-1"),
    );

    expect(mocks.dispatch).toHaveBeenNthCalledWith(2, clearGuestGeneral());

    expect(mocks.dispatch).toHaveBeenNthCalledWith(
      3,
      setGuestArmyOptions(["option-a", "option-b"]),
    );
  });

  it("rejects authenticated warband ids", async () => {
    const { result } = renderHook(() => useGuestRosterPersistence());

    await expect(result.current.deleteWarband(42)).rejects.toThrow(
      'Expected a guest warband id, received "42".',
    );

    expect(mocks.dispatch).not.toHaveBeenCalled();
  });

  it("rejects authenticated unit ids", async () => {
    const { result } = renderHook(() => useGuestRosterPersistence());

    await expect(result.current.deleteUnit("warband-1", 100)).rejects.toThrow(
      'Expected a guest unit id, received "100".',
    );

    expect(mocks.dispatch).not.toHaveBeenCalled();
  });

  it("rejects operations for a missing guest warband", async () => {
    const { result } = renderHook(() => useGuestRosterPersistence());

    await expect(result.current.duplicateWarband("missing")).rejects.toThrow(
      'Guest warband "missing" could not be found.',
    );

    expect(mocks.dispatch).not.toHaveBeenCalled();
  });
});

function mockUuid(value: `${string}-${string}-${string}-${string}-${string}`) {
  vi.spyOn(globalThis.crypto, "randomUUID").mockReturnValue(value);
}

function guestRoster(): GuestRoster {
  return {
    id: "guest",
    name: "Mordor",
    armyListId: "mordor",
    pointsLimit: 750,
    tags: [],

    armyOptionIds: [],
    generalUnitId: "leader-1",

    warbands: [
      {
        id: "warband-1",

        leader: {
          id: "leader-1",
          armyListProfileId: "witch-king",
          quantity: 1,
          optionIds: ["horse"],
        },

        followers: [
          {
            id: "follower-1",
            armyListProfileId: "orc-warrior",
            quantity: 4,
            optionIds: ["shield"],
          },
        ],
      },

      {
        id: "warband-2",

        leader: {
          id: "leader-2",
          armyListProfileId: "orc-captain",
          quantity: 1,
          optionIds: [],
        },

        followers: [],
      },
    ],

    createdAt: "",
    updatedAt: "",
  };
}
