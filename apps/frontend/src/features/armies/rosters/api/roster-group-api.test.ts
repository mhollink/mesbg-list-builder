import type { RosterGroup } from "@mlb/api-client";
import { configureStore } from "@reduxjs/toolkit";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { rosterGroupApi } from "./roster-group-api.ts";
import { serverApi } from "~/api/server-api.ts";

const api = vi.hoisted(() => ({
  listRosterGroups: vi.fn(),
  createRosterGroup: vi.fn(),
  updateRosterGroup: vi.fn(),
  deleteRosterGroup: vi.fn(),
  moveRosterGroup: vi.fn(),
  moveRosterGroupToRoot: vi.fn(),
}));

vi.mock("~/api/api.ts", () => ({
  rosterGroupsApi: api,
}));

describe("rosterGroupApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("loads roster groups through the generated API client", async () => {
    const response = [group(1, "Events")];

    api.listRosterGroups.mockResolvedValue(response);

    const result = await createStore().dispatch(
      rosterGroupApi.endpoints.getRosterGroups.initiate(),
    );

    expect(api.listRosterGroups).toHaveBeenCalledOnce();
    expect(result.data).toEqual(response);
  });

  it("creates a roster group", async () => {
    const request = {
      name: "Events",
      parentGroupId: 12,
    };

    const response = group(42, "Events");

    api.createRosterGroup.mockResolvedValue(response);

    const result = await createStore().dispatch(
      rosterGroupApi.endpoints.createRosterGroup.initiate(request),
    );

    expect(api.createRosterGroup).toHaveBeenCalledWith({
      createRosterGroupRequest: request,
    });

    expect(result.data).toEqual(response);
  });

  it("updates a roster group", async () => {
    const response = group(42, "Renamed");

    api.updateRosterGroup.mockResolvedValue(response);

    const result = await createStore().dispatch(
      rosterGroupApi.endpoints.updateRosterGroup.initiate({
        groupId: 42,
        updateRosterGroupRequest: {
          name: "Renamed",
        },
      }),
    );

    expect(api.updateRosterGroup).toHaveBeenCalledWith({
      groupId: 42,
      updateRosterGroupRequest: {
        name: "Renamed",
      },
    });

    expect(result.data).toEqual(response);
  });

  it("moves a group below another group", async () => {
    api.moveRosterGroup.mockResolvedValue(undefined);

    const result = await createStore().dispatch(
      rosterGroupApi.endpoints.moveRosterGroup.initiate({
        groupId: 42,
        parentGroupId: 12,
      }),
    );

    expect(api.moveRosterGroup).toHaveBeenCalledWith({
      groupId: 42,
      parentGroupId: 12,
    });

    expect(result.data).toBeUndefined();
  });

  it("moves a group to root", async () => {
    api.moveRosterGroupToRoot.mockResolvedValue(undefined);

    const result = await createStore().dispatch(
      rosterGroupApi.endpoints.moveRosterGroupToRoot.initiate({
        groupId: 42,
      }),
    );

    expect(api.moveRosterGroupToRoot).toHaveBeenCalledWith({
      groupId: 42,
    });

    expect(result.data).toBeUndefined();
  });

  it("maps generated client failures to an ApiError", async () => {
    api.listRosterGroups.mockRejectedValue(new Error("Request failed"));

    const result = await createStore().dispatch(
      rosterGroupApi.endpoints.getRosterGroups.initiate(),
    );

    expect(result).toMatchObject({
      error: {
        message: "Request failed",
      },
    });
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

function group(id: number, name: string): RosterGroup {
  return {
    id,
    name,
    children: [],
  } as RosterGroup;
}
