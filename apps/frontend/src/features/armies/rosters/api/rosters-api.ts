import type {
  AssignRosterToGroupRequest,
  CreateRosterRequest,
  Roster,
  RosterSummary,
  UpdateRosterRequest,
} from "@mlb/api-client";

import { rostersClient } from "~/api/api.ts";
import { toApiError } from "~/api/api-error.ts";
import { serverApi } from "~/api/server-api.ts";

export const rostersApi = serverApi.injectEndpoints({
  endpoints: (builder) => ({
    getRosters: builder.query<RosterSummary[], void>({
      queryFn: async () => {
        try {
          return {
            data: await rostersClient.listRosters(),
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
            data: await rostersClient.getRoster({
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
            data: await rostersClient.createRoster({
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
            data: await rostersClient.updateRoster({
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
            data: await rostersClient.favoriteRoster({ rosterId }),
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
            data: await rostersClient.unfavoriteRoster({ rosterId }),
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
            data: await rostersClient.lockRoster({ rosterId }),
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
            data: await rostersClient.unlockRoster({ rosterId }),
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
          await rostersClient.deleteRoster({
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

    moveRosterToGroup: builder.mutation<void, AssignRosterToGroupRequest>({
      queryFn: async ({ rosterId, groupId }) => {
        try {
          await rostersClient.assignRosterToGroup({ rosterId, groupId });
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
          await rostersClient.removeRosterFromGroup({ rosterId });
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
  useMoveRosterToGroupMutation,
  useMoveRosterToRootMutation,
} = rostersApi;
