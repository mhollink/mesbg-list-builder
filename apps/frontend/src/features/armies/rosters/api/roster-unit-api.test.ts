import type {
  CreateFollowerRequest,
  LeaderInput,
  RosterUnit,
  UpdateRosterUnitRequest,
} from "@mlb/api-client";
import { configureStore } from "@reduxjs/toolkit";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { rosterUnitApi } from "./roster-unit-api.ts";
import { serverApi } from "~/api/server-api.ts";

const client = vi.hoisted(() => ({
  setWarbandLeader: vi.fn(),
  createWarbandFollower: vi.fn(),
  updateWarbandUnit: vi.fn(),
  deleteWarbandUnit: vi.fn(),
  moveRosterUnit: vi.fn(),
}));

vi.mock("~/api/api.ts", () => ({
  rosterUnitsClient: client,
}));

describe("rosterUnitApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("sets a warband leader", async () => {
    const request: LeaderInput = {
      armyListProfileId: "orc-captain",
      optionIds: new Set("shield"),
    };
    const response = unit({
      armyListProfileId: "orc-captain",
      optionIds: new Set("shield"),
    });

    client.setWarbandLeader.mockResolvedValue(response);

    const result = await createStore().dispatch(
      rosterUnitApi.endpoints.setLeader.initiate({
        rosterId: 42,
        warbandId: 23,
        request,
      }),
    );

    expect(client.setWarbandLeader).toHaveBeenCalledWith({
      rosterId: 42,
      warbandId: 23,
      leaderInput: request,
    });
    expect(result.data).toEqual(response);
  });

  it("creates a follower", async () => {
    const request: CreateFollowerRequest = {
      armyListProfileId: "orc-warrior",
      quantity: 4,
      optionIds: new Set("shield"),
    };
    const response = unit({
      armyListProfileId: "orc-warrior",
      quantity: 4,
      optionIds: new Set("shield"),
    });

    client.createWarbandFollower.mockResolvedValue(response);

    const result = await createStore().dispatch(
      rosterUnitApi.endpoints.createFollower.initiate({
        rosterId: 42,
        warbandId: 23,
        request,
      }),
    );

    expect(client.createWarbandFollower).toHaveBeenCalledWith({
      rosterId: 42,
      warbandId: 23,
      createFollowerRequest: request,
    });
    expect(result.data).toEqual(response);
  });

  it("updates a unit", async () => {
    const request: UpdateRosterUnitRequest = {
      quantity: 6,
      optionIds: new Set("shield"),
    };
    const response = unit({
      quantity: 6,
      optionIds: new Set("shield"),
    });

    client.updateWarbandUnit.mockResolvedValue(response);

    const result = await createStore().dispatch(
      rosterUnitApi.endpoints.updateUnit.initiate({
        rosterId: 42,
        warbandId: 23,
        unitId: 34,
        request,
      }),
    );

    expect(client.updateWarbandUnit).toHaveBeenCalledWith({
      rosterId: 42,
      warbandId: 23,
      unitId: 34,
      updateRosterUnitRequest: request,
    });
    expect(result.data).toEqual(response);
  });

  it("deletes a unit", async () => {
    client.deleteWarbandUnit.mockResolvedValue(undefined);

    const result = await createStore().dispatch(
      rosterUnitApi.endpoints.deleteUnit.initiate({
        rosterId: 42,
        warbandId: 23,
        unitId: 34,
      }),
    );

    expect(client.deleteWarbandUnit).toHaveBeenCalledWith({
      rosterId: 42,
      warbandId: 23,
      unitId: 34,
    });
    expect(result.data).toBeUndefined();
  });

  it("moves a unit within its current warband", async () => {
    client.moveRosterUnit.mockResolvedValue(undefined);

    const result = await createStore().dispatch(
      rosterUnitApi.endpoints.moveUnit.initiate({
        rosterId: 42,
        warbandId: 23,
        unitId: 34,
        request: {
          position: 1,
        },
      }),
    );

    expect(client.moveRosterUnit).toHaveBeenCalledWith({
      rosterId: 42,
      warbandId: 23,
      unitId: 34,
      moveRosterUnitRequest: {
        position: 1,
        targetWarbandId: 23,
      },
    });
    expect(result.data).toBeUndefined();
  });

  it("moves a unit to another warband", async () => {
    client.moveRosterUnit.mockResolvedValue(undefined);

    const result = await createStore().dispatch(
      rosterUnitApi.endpoints.moveUnit.initiate({
        rosterId: 42,
        warbandId: 23,
        unitId: 34,
        request: {
          targetWarbandId: 24,
          position: 1,
        },
      }),
    );

    expect(client.moveRosterUnit).toHaveBeenCalledWith({
      rosterId: 42,
      warbandId: 23,
      unitId: 34,
      moveRosterUnitRequest: {
        targetWarbandId: 24,
        position: 1,
      },
    });
    expect(result.data).toBeUndefined();
  });
});

function createStore() {
  return configureStore({
    reducer: {
      [serverApi.reducerPath]: serverApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(serverApi.middleware),
  });
}

function unit(overrides: Partial<RosterUnit> = {}): RosterUnit {
  return {
    id: 34,
    armyListProfileId: "orc-warrior",
    quantity: 1,
    optionIds: new Set(),
    ...overrides,
  };
}
