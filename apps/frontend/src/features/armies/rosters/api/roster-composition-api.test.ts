import type {
  RosterSummary,
  UpdateRosterArmyOptionsRequest,
} from "@mlb/api-client";
import { configureStore } from "@reduxjs/toolkit";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { rosterCompositionApi } from "./roster-composition-api.ts";
import { serverApi } from "~/api/server-api.ts";

const client = vi.hoisted(() => ({
  setRosterArmyOptions: vi.fn(),
  setRosterGeneral: vi.fn(),
  clearRosterGeneral: vi.fn(),
}));

vi.mock("~/api/api.ts", () => ({
  rosterCompositionClient: client,
}));

describe("rosterCompositionApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("sets army options", async () => {
    const request: UpdateRosterArmyOptionsRequest = {
      optionIds: new Set("campfire"),
    };
    const response = {
      id: 42,
      armyOptionIds: new Set("campfire"),
    } as RosterSummary;

    client.setRosterArmyOptions.mockResolvedValue(response);

    const result = await createStore().dispatch(
      rosterCompositionApi.endpoints.setArmyOptions.initiate({
        rosterId: 42,
        request,
      }),
    );

    expect(client.setRosterArmyOptions).toHaveBeenCalledWith({
      rosterId: 42,
      updateRosterArmyOptionsRequest: request,
    });
    expect(result.data).toEqual(response);
  });

  it("sets the roster general", async () => {
    client.setRosterGeneral.mockResolvedValue(undefined);

    const result = await createStore().dispatch(
      rosterCompositionApi.endpoints.setGeneral.initiate({
        rosterId: 42,
        unitId: 34,
      }),
    );

    expect(client.setRosterGeneral).toHaveBeenCalledWith({
      rosterId: 42,
      unitId: 34,
    });
    expect(result.data).toBeUndefined();
  });

  it("clears the roster general", async () => {
    client.clearRosterGeneral.mockResolvedValue(undefined);

    const result = await createStore().dispatch(
      rosterCompositionApi.endpoints.clearGeneral.initiate({
        rosterId: 42,
      }),
    );

    expect(client.clearRosterGeneral).toHaveBeenCalledWith({
      rosterId: 42,
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
