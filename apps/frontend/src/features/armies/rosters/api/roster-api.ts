import type {
  AssignRosterToGroupRequest,
  CreateFollowerRequest,
  CreateRosterRequest,
  CreateWarbandRequest,
  Roster,
  RosterSummary,
  RosterUnit,
  UpdateRosterRequest,
  UpdateRosterUnitRequest,
  Warband,
} from "@mlb/api-client";

import { rostersApi } from "~/api/api.ts";
import { toApiError } from "~/api/api-error.ts";
import { serverApi } from "~/api/server-api.ts";

export const rosterApi = serverApi.injectEndpoints({
  endpoints: (builder) => ({
    getRosters: builder.query<RosterSummary[], void>({
      queryFn: async () => {
        try {
          return {
            data: await rostersApi.listRosters(),
          };
        } catch (error) {
          return {
            error: toApiError(error),
          };
        }
      },

      providesTags: (result) => [
        { type: "Roster", id: "LIST" },

        ...(result?.map((roster) => ({
          type: "Roster" as const,
          id: roster.id,
        })) ?? []),
      ],
    }),

    getRoster: builder.query<Roster, number>({
      queryFn: async (rosterId) => {
        try {
          return {
            data: await rostersApi.getRoster({
              rosterId,
            }),
          };
        } catch (error) {
          return {
            error: toApiError(error),
          };
        }
      },

      providesTags: (_result, _error, rosterId) => [
        { type: "Roster", id: rosterId },
      ],
    }),

    createRoster: builder.mutation<Roster, CreateRosterRequest>({
      queryFn: async (request) => {
        try {
          return {
            data: await rostersApi.createRoster({
              createRosterRequest: request,
            }),
          };
        } catch (error) {
          return {
            error: toApiError(error),
          };
        }
      },

      invalidatesTags: [{ type: "Roster", id: "LIST" }],
    }),

    updateRoster: builder.mutation<
      RosterSummary,
      { rosterId: number; request: UpdateRosterRequest }
    >({
      queryFn: async ({ rosterId, request }) => {
        try {
          return {
            data: await rostersApi.updateRoster({
              rosterId,
              updateRosterRequest: request,
            }),
          };
        } catch (error) {
          return {
            error: toApiError(error),
          };
        }
      },

      invalidatesTags: (_result, _error, { rosterId }) => [
        { type: "Roster", id: rosterId },
        { type: "Roster", id: "LIST" },
      ],
    }),

    favoriteRoster: builder.mutation<RosterSummary, number>({
      queryFn: async (rosterId) => {
        try {
          return {
            data: await rostersApi.favoriteRoster({ rosterId }),
          };
        } catch (error) {
          return {
            error: toApiError(error),
          };
        }
      },

      invalidatesTags: (_result, _error, rosterId) => [
        { type: "Roster", id: rosterId },
      ],
    }),

    unfavoriteRoster: builder.mutation<RosterSummary, number>({
      queryFn: async (rosterId) => {
        try {
          return {
            data: await rostersApi.unfavoriteRoster({ rosterId }),
          };
        } catch (error) {
          return {
            error: toApiError(error),
          };
        }
      },

      invalidatesTags: (_result, _error, rosterId) => [
        { type: "Roster", id: rosterId },
      ],
    }),

    lockRoster: builder.mutation<RosterSummary, number>({
      queryFn: async (rosterId) => {
        try {
          return {
            data: await rostersApi.lockRoster({ rosterId }),
          };
        } catch (error) {
          return {
            error: toApiError(error),
          };
        }
      },

      invalidatesTags: (_result, _error, rosterId) => [
        { type: "Roster", id: rosterId },
      ],
    }),

    unlockRoster: builder.mutation<RosterSummary, number>({
      queryFn: async (rosterId) => {
        try {
          return {
            data: await rostersApi.unlockRoster({ rosterId }),
          };
        } catch (error) {
          return {
            error: toApiError(error),
          };
        }
      },

      invalidatesTags: (_result, _error, rosterId) => [
        { type: "Roster", id: rosterId },
      ],
    }),

    deleteRoster: builder.mutation<void, number>({
      queryFn: async (rosterId) => {
        try {
          await rostersApi.deleteRoster({
            rosterId,
          });

          return {
            data: undefined,
          };
        } catch (error) {
          return {
            error: toApiError(error),
          };
        }
      },

      invalidatesTags: (_result, _error, rosterId) => [
        { type: "Roster", id: rosterId },
        { type: "Roster", id: "LIST" },
      ],
    }),

    createWarband: builder.mutation<
      Warband,
      { rosterId: number; request: CreateWarbandRequest }
    >({
      queryFn: async ({ rosterId, request }) => {
        try {
          return {
            data: await rostersApi.createWarband({
              rosterId,
              createWarbandRequest: request,
            }),
          };
        } catch (error) {
          return {
            error: toApiError(error),
          };
        }
      },

      invalidatesTags: (_result, _error, { rosterId }) => [
        { type: "Roster", id: rosterId },
        { type: "Roster", id: "LIST" },
      ],
    }),

    createFollower: builder.mutation<
      RosterUnit,
      {
        rosterId: number;
        warbandId: number;
        request: CreateFollowerRequest;
      }
    >({
      queryFn: async ({ rosterId, warbandId, request }) => {
        try {
          return {
            data: await rostersApi.createWarbandFollower({
              rosterId,
              warbandId,
              createFollowerRequest: request,
            }),
          };
        } catch (error) {
          return {
            error: toApiError(error),
          };
        }
      },

      invalidatesTags: (_result, _error, { rosterId }) => [
        { type: "Roster", id: rosterId },
        { type: "Roster", id: "LIST" },
      ],
    }),

    updateUnit: builder.mutation<
      RosterUnit,
      {
        rosterId: number;
        warbandId: number;
        unitId: number;
        request: UpdateRosterUnitRequest;
      }
    >({
      queryFn: async ({ rosterId, warbandId, unitId, request }) => {
        try {
          return {
            data: await rostersApi.updateWarbandUnit({
              rosterId,
              warbandId,
              unitId,
              updateRosterUnitRequest: request,
            }),
          };
        } catch (error) {
          return {
            error: toApiError(error),
          };
        }
      },

      invalidatesTags: (_result, _error, { rosterId }) => [
        { type: "Roster", id: rosterId },
        { type: "Roster", id: "LIST" },
      ],
    }),

    moveRosterToGroup: builder.mutation<void, AssignRosterToGroupRequest>({
      queryFn: async ({ rosterId, groupId }) => {
        try {
          await rostersApi.assignRosterToGroup({ rosterId, groupId });
          return {
            data: undefined,
          };
        } catch (error) {
          return {
            error: toApiError(error),
          };
        }
      },
      invalidatesTags: (_result, _error, { rosterId }) => [
        { type: "Roster", id: rosterId },
        { type: "Roster", id: "LIST" },
      ],
    }),

    moveRosterToRoot: builder.mutation<void, number>({
      queryFn: async (rosterId) => {
        try {
          await rostersApi.removeRosterFromGroup({ rosterId });
          return {
            data: undefined,
          };
        } catch (error) {
          return {
            error: toApiError(error),
          };
        }
      },
      invalidatesTags: (_result, _error, rosterId) => [
        { type: "Roster", id: rosterId },
        { type: "Roster", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetRostersQuery,
  useGetRosterQuery,
  useCreateRosterMutation,
  useUpdateRosterMutation,
  useDeleteRosterMutation,
  useFavoriteRosterMutation,
  useUnfavoriteRosterMutation,
  useLockRosterMutation,
  useUnlockRosterMutation,
  useCreateWarbandMutation,
  useCreateFollowerMutation,
  useUpdateUnitMutation,
  useMoveRosterToGroupMutation,
  useMoveRosterToRootMutation,
} = rosterApi;
