import type { MoveWarbandRequest, Warband } from "@mlb/api-client";
import { configureStore } from "@reduxjs/toolkit";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { rosterWarbandApi } from "./roster-warband-api.ts";
import { serverApi } from "~/api/server-api.ts";

const client = vi.hoisted(() => ({
  createWarband: vi.fn(),
  deleteWarband: vi.fn(),
  duplicateWarband: vi.fn(),
  moveWarband: vi.fn(),
}));

vi.mock("~/api/api.ts", () => ({
  rosterWarbandsClient: client,
}));

describe("rosterWarbandApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates an empty warband", async () => {
    const response = {
      id: 23,
      leader: null,
      followers: [],
    } as Warband;

    client.createWarband.mockResolvedValue(response);

    const result = await createStore().dispatch(
      rosterWarbandApi.endpoints.createWarband.initiate({
        rosterId: 42,
      }),
    );

    expect(client.createWarband).toHaveBeenCalledWith({
      rosterId: 42,
    });
    expect(result.data).toEqual(response);
  });

  it("deletes a warband", async () => {
    client.deleteWarband.mockResolvedValue(undefined);

    const result = await createStore().dispatch(
      rosterWarbandApi.endpoints.deleteWarband.initiate({
        rosterId: 42,
        warbandId: 23,
      }),
    );

    expect(client.deleteWarband).toHaveBeenCalledWith({
      rosterId: 42,
      warbandId: 23,
    });
    expect(result.data).toBeUndefined();
  });

  it("duplicates a warband", async () => {
    const response = {
      id: 24,
      leader: null,
      followers: [],
    } as Warband;

    client.duplicateWarband.mockResolvedValue(response);

    const result = await createStore().dispatch(
      rosterWarbandApi.endpoints.duplicateWarband.initiate({
        rosterId: 42,
        warbandId: 23,
      }),
    );

    expect(client.duplicateWarband).toHaveBeenCalledWith({
      rosterId: 42,
      warbandId: 23,
    });
    expect(result.data).toEqual(response);
  });

  it("moves a warband", async () => {
    const request: MoveWarbandRequest = {
      position: 1,
    };

    client.moveWarband.mockResolvedValue(undefined);

    const result = await createStore().dispatch(
      rosterWarbandApi.endpoints.moveWarband.initiate({
        rosterId: 42,
        warbandId: 23,
        request,
      }),
    );

    expect(client.moveWarband).toHaveBeenCalledWith({
      rosterId: 42,
      warbandId: 23,
      moveWarbandRequest: request,
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
