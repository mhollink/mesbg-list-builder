import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useAuthenticatedRosterPersistence } from "./useAuthenticatedRosterPersistence.ts";

const mocks = vi.hoisted(() => ({
  createWarband: vi.fn(),
  deleteWarband: vi.fn(),
  duplicateWarband: vi.fn(),
  moveWarband: vi.fn(),

  setLeader: vi.fn(),
  createFollower: vi.fn(),
  updateUnit: vi.fn(),
  deleteUnit: vi.fn(),
  moveUnit: vi.fn(),

  setArmyOptions: vi.fn(),
  setGeneral: vi.fn(),
  clearGeneral: vi.fn(),

  unwrap: vi.fn(),
}));

vi.mock("~/features/armies/rosters/api/roster-warband-api.ts", () => ({
  useCreateWarbandMutation: () => [mocks.createWarband],
  useDeleteWarbandMutation: () => [mocks.deleteWarband],
  useDuplicateWarbandMutation: () => [mocks.duplicateWarband],
  useMoveWarbandMutation: () => [mocks.moveWarband],
}));

vi.mock("~/features/armies/rosters/api/roster-unit-api.ts", () => ({
  useSetLeaderMutation: () => [mocks.setLeader],
  useCreateFollowerMutation: () => [mocks.createFollower],
  useUpdateUnitMutation: () => [mocks.updateUnit],
  useDeleteUnitMutation: () => [mocks.deleteUnit],
  useMoveUnitMutation: () => [mocks.moveUnit],
}));

vi.mock("~/features/armies/rosters/api/roster-composition-api.ts", () => ({
  useSetArmyOptionsMutation: () => [mocks.setArmyOptions],
  useSetGeneralMutation: () => [mocks.setGeneral],
  useClearGeneralMutation: () => [mocks.clearGeneral],
}));

describe("useAuthenticatedRosterPersistence", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mocks.unwrap.mockResolvedValue(undefined);

    mocks.createWarband.mockReturnValue({ unwrap: mocks.unwrap });
    mocks.deleteWarband.mockReturnValue({ unwrap: mocks.unwrap });
    mocks.duplicateWarband.mockReturnValue({ unwrap: mocks.unwrap });
    mocks.moveWarband.mockReturnValue({ unwrap: mocks.unwrap });

    mocks.setLeader.mockReturnValue({ unwrap: mocks.unwrap });
    mocks.createFollower.mockReturnValue({ unwrap: mocks.unwrap });
    mocks.updateUnit.mockReturnValue({ unwrap: mocks.unwrap });
    mocks.deleteUnit.mockReturnValue({ unwrap: mocks.unwrap });
    mocks.moveUnit.mockReturnValue({ unwrap: mocks.unwrap });

    mocks.setArmyOptions.mockReturnValue({ unwrap: mocks.unwrap });
    mocks.setGeneral.mockReturnValue({ unwrap: mocks.unwrap });
    mocks.clearGeneral.mockReturnValue({ unwrap: mocks.unwrap });
  });

  it("persists warband operations", async () => {
    const { result } = renderHook(() => useAuthenticatedRosterPersistence(42));

    await result.current.createWarband();
    await result.current.deleteWarband(10);
    await result.current.duplicateWarband(11);
    await result.current.moveWarband(12, 2);

    expect(mocks.createWarband).toHaveBeenCalledWith({
      rosterId: 42,
    });

    expect(mocks.deleteWarband).toHaveBeenCalledWith({
      rosterId: 42,
      warbandId: 10,
    });

    expect(mocks.duplicateWarband).toHaveBeenCalledWith({
      rosterId: 42,
      warbandId: 11,
    });

    expect(mocks.moveWarband).toHaveBeenCalledWith({
      rosterId: 42,
      warbandId: 12,
      request: {
        position: 2,
      },
    });

    expect(mocks.unwrap).toHaveBeenCalledTimes(4);
  });

  it("persists unit operations", async () => {
    const { result } = renderHook(() => useAuthenticatedRosterPersistence(42));

    await result.current.setLeader(10, "witch-king", ["horse"]);

    await result.current.addFollower(10, "orc-warrior", 4, ["shield"]);

    await result.current.updateUnit(10, 100, {
      quantity: 6,
      optionIds: ["shield"],
    });

    await result.current.deleteUnit(10, 101);

    await result.current.moveUnit(10, 102, 11, 2);

    expect(mocks.setLeader).toHaveBeenCalledWith({
      rosterId: 42,
      warbandId: 10,
      request: {
        armyListProfileId: "witch-king",
        optionIds: new Set(["horse"]),
      },
    });

    expect(mocks.createFollower).toHaveBeenCalledWith({
      rosterId: 42,
      warbandId: 10,
      request: {
        armyListProfileId: "orc-warrior",
        quantity: 4,
        optionIds: new Set(["shield"]),
      },
    });

    expect(mocks.updateUnit).toHaveBeenCalledWith({
      rosterId: 42,
      warbandId: 10,
      unitId: 100,
      request: {
        quantity: 6,
        optionIds: new Set(["shield"]),
      },
    });

    expect(mocks.deleteUnit).toHaveBeenCalledWith({
      rosterId: 42,
      warbandId: 10,
      unitId: 101,
    });

    expect(mocks.moveUnit).toHaveBeenCalledWith({
      rosterId: 42,
      warbandId: 10,
      unitId: 102,
      request: {
        targetWarbandId: 11,
        position: 2,
      },
    });

    expect(mocks.unwrap).toHaveBeenCalledTimes(5);
  });

  it("persists roster composition operations", async () => {
    const { result } = renderHook(() => useAuthenticatedRosterPersistence(42));

    await result.current.setGeneral(100);
    await result.current.clearGeneral();

    await result.current.setArmyOptions(["extra-rule", "another-rule"]);

    expect(mocks.setGeneral).toHaveBeenCalledWith({
      rosterId: 42,
      unitId: 100,
    });

    expect(mocks.clearGeneral).toHaveBeenCalledWith({
      rosterId: 42,
    });

    expect(mocks.setArmyOptions).toHaveBeenCalledWith({
      rosterId: 42,
      request: {
        optionIds: new Set(["extra-rule", "another-rule"]),
      },
    });

    expect(mocks.unwrap).toHaveBeenCalledTimes(3);
  });

  it("rejects guest warband ids", async () => {
    const { result } = renderHook(() => useAuthenticatedRosterPersistence(42));

    await expect(result.current.deleteWarband("guest-warband")).rejects.toThrow(
      'Expected an authenticated warband id, received "guest-warband".',
    );

    expect(mocks.deleteWarband).not.toHaveBeenCalled();
  });

  it("rejects guest unit ids", async () => {
    const { result } = renderHook(() => useAuthenticatedRosterPersistence(42));

    await expect(result.current.deleteUnit(10, "guest-unit")).rejects.toThrow(
      'Expected an authenticated unit id, received "guest-unit".',
    );

    expect(mocks.deleteUnit).not.toHaveBeenCalled();
  });
});
