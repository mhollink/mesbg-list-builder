import type {
  CreateFollowerRequest,
  LeaderInput,
  RosterUnit,
  UpdateRosterUnitRequest,
} from "@mlb/api-client";

import { rosterUnitsClient } from "~/api/api.ts";
import { toApiError } from "~/api/api-error.ts";
import { serverApi } from "~/api/server-api.ts";

export const rosterUnitApi = serverApi.injectEndpoints({
  endpoints: (builder) => ({
    setLeader: builder.mutation<
      RosterUnit,
      {
        rosterId: number;
        warbandId: number;
        request: LeaderInput;
      }
    >({
      queryFn: async ({ rosterId, warbandId, request }) => {
        try {
          return {
            data: await rosterUnitsClient.setWarbandLeader({
              rosterId,
              warbandId,
              leaderInput: request,
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
            data: await rosterUnitsClient.createWarbandFollower({
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
            data: await rosterUnitsClient.updateWarbandUnit({
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
      ],
    }),

    deleteUnit: builder.mutation<
      void,
      {
        rosterId: number;
        warbandId: number;
        unitId: number;
      }
    >({
      queryFn: async ({ rosterId, warbandId, unitId }) => {
        try {
          await rosterUnitsClient.deleteWarbandUnit({
            rosterId,
            warbandId,
            unitId,
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

      invalidatesTags: (_result, _error, { rosterId }) => [
        { type: "Roster", id: rosterId },
      ],
    }),

    moveUnit: builder.mutation<
      void,
      {
        rosterId: number;
        warbandId: number;
        unitId: number;
        request: {
          targetWarbandId?: number;
          position: number;
        };
      }
    >({
      queryFn: async ({ rosterId, warbandId, unitId, request }) => {
        try {
          await rosterUnitsClient.moveRosterUnit({
            rosterId,
            warbandId,
            unitId,
            moveRosterUnitRequest: {
              position: request.position,
              targetWarbandId: request.targetWarbandId ?? warbandId,
            },
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

      invalidatesTags: (_result, _error, { rosterId }) => [
        { type: "Roster", id: rosterId },
      ],
    }),
  }),
});

export const {
  useSetLeaderMutation,
  useCreateFollowerMutation,
  useUpdateUnitMutation,
  useDeleteUnitMutation,
  useMoveUnitMutation,
} = rosterUnitApi;
