import type {
  CreateRosterRequest,
  Roster,
  RosterSummary,
  UpdateRosterRequest,
} from "@mlb/api-client";
import { configureStore } from "@reduxjs/toolkit";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { rosterApi } from "./roster-api.ts";
import { serverApi } from "~/api/server-api.ts";

const api = vi.hoisted(() => ({
  listRosters: vi.fn(),
  getRoster: vi.fn(),
  createRoster: vi.fn(),
  updateRoster: vi.fn(),
  favoriteRoster: vi.fn(),
  unfavoriteRoster: vi.fn(),
  lockRoster: vi.fn(),
  unlockRoster: vi.fn(),
  deleteRoster: vi.fn(),
  createWarband: vi.fn(),
  createWarbandFollower: vi.fn(),
  updateWarbandUnit: vi.fn(),
  assignRosterToGroup: vi.fn(),
  removeRosterFromGroup: vi.fn(),
}));

vi.mock("~/api/api.ts", () => ({
  rostersApi: api,
}));

describe("rosterApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("loads roster summaries through the generated API client", async () => {
    const response = [
      summary({
        id: 42,
      }),
    ];

    api.listRosters.mockResolvedValue(response);

    const result = await createStore().dispatch(
      rosterApi.endpoints.getRosters.initiate(),
    );

    expect(api.listRosters).toHaveBeenCalledOnce();
    expect(result.data).toEqual(response);
  });

  it("loads a roster by id", async () => {
    const response = {
      id: 42,
      name: "Mordor",
    } as Roster;

    api.getRoster.mockResolvedValue(response);

    const result = await createStore().dispatch(
      rosterApi.endpoints.getRoster.initiate(42),
    );

    expect(api.getRoster).toHaveBeenCalledWith({
      rosterId: 42,
    });

    expect(result.data).toEqual(response);
  });

  it("creates a roster with the expected generated client request", async () => {
    const request: CreateRosterRequest = {
      name: "Mordor",
      armyListId: "mordor",
      pointsLimit: 750,
      tags: ["Tournament"],
      groupId: 12,
    };

    const response = {
      id: 42,
      ...request,
    } as Roster;

    api.createRoster.mockResolvedValue(response);

    const result = await createStore().dispatch(
      rosterApi.endpoints.createRoster.initiate(request),
    );

    expect(api.createRoster).toHaveBeenCalledWith({
      createRosterRequest: request,
    });

    expect(result.data).toEqual(response);
  });

  it("updates roster metadata with the expected generated client request", async () => {
    const request: UpdateRosterRequest = {
      name: "Updated",
      tags: [],
    };

    const response = summary({
      name: "Updated",
    });

    api.updateRoster.mockResolvedValue(response);

    const result = await createStore().dispatch(
      rosterApi.endpoints.updateRoster.initiate({
        rosterId: 42,
        request,
      }),
    );

    expect(api.updateRoster).toHaveBeenCalledWith({
      rosterId: 42,
      updateRosterRequest: request,
    });

    expect(result.data).toEqual(response);
  });

  it("favorites a roster", async () => {
    const response = summary({ favorite: true });
    api.favoriteRoster.mockResolvedValue(response);

    const result = await createStore().dispatch(
      rosterApi.endpoints.favoriteRoster.initiate(42),
    );

    expect(api.favoriteRoster).toHaveBeenCalledWith({
      rosterId: 42,
    });
    expect(result.data).toEqual(response);
  });

  it("unfavorites a roster", async () => {
    const response = summary({ favorite: false });
    api.unfavoriteRoster.mockResolvedValue(response);

    const result = await createStore().dispatch(
      rosterApi.endpoints.unfavoriteRoster.initiate(42),
    );

    expect(api.unfavoriteRoster).toHaveBeenCalledWith({
      rosterId: 42,
    });
    expect(result.data).toEqual(response);
  });

  it("locks a roster", async () => {
    const response = summary({ locked: true });
    api.lockRoster.mockResolvedValue(response);

    const result = await createStore().dispatch(
      rosterApi.endpoints.lockRoster.initiate(42),
    );

    expect(api.lockRoster).toHaveBeenCalledWith({
      rosterId: 42,
    });
    expect(result.data).toEqual(response);
  });

  it("unlocks a roster", async () => {
    const response = summary({ locked: false });
    api.unlockRoster.mockResolvedValue(response);

    const result = await createStore().dispatch(
      rosterApi.endpoints.unlockRoster.initiate(42),
    );

    expect(api.unlockRoster).toHaveBeenCalledWith({
      rosterId: 42,
    });
    expect(result.data).toEqual(response);
  });

  it("maps generated client failures to an ApiError", async () => {
    api.getRoster.mockRejectedValue(new Error("Request failed"));

    const result = await createStore().dispatch(
      rosterApi.endpoints.getRoster.initiate(42),
    );

    expect(result).toMatchObject({
      error: {
        message: "Request failed",
      },
    });
  });

  it("moves a roster to a group", async () => {
    api.assignRosterToGroup.mockResolvedValue(undefined);

    const result = await createStore().dispatch(
      rosterApi.endpoints.moveRosterToGroup.initiate({
        rosterId: 42,
        groupId: 12,
      }),
    );

    expect(api.assignRosterToGroup).toHaveBeenCalledWith({
      rosterId: 42,
      groupId: 12,
    });

    expect(result.data).toBeUndefined();
  });

  it("moves a roster back to root", async () => {
    api.removeRosterFromGroup.mockResolvedValue(undefined);

    const result = await createStore().dispatch(
      rosterApi.endpoints.moveRosterToRoot.initiate(42),
    );

    expect(api.removeRosterFromGroup).toHaveBeenCalledWith({
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

function summary(overrides: Partial<RosterSummary> = {}): RosterSummary {
  return {
    id: 42,
    name: "Mordor",
    armyListId: "mordor",
    favorite: false,
    locked: false,
    tags: [],
    points: 750,
    warbandCount: 3,
    modelCount: 32,
    might: 8,
    bowCount: 10,
    throwingWeaponCount: 4,
    createdAt: "2026-09-22T12:00:00Z",
    updatedAt: "2026-09-22T12:00:00Z",
    ...overrides,
  } as RosterSummary;
}
