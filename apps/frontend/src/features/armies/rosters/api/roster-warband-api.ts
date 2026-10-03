import type { MoveWarbandRequest, Warband } from "@mlb/api-client";

import { rosterWarbandsClient } from "~/api/api.ts";
import { toApiError } from "~/api/api-error.ts";
import { serverApi } from "~/api/server-api.ts";

export const rosterWarbandApi = serverApi.injectEndpoints({
  endpoints: (builder) => ({
    createWarband: builder.mutation<Warband, { rosterId: number }>({
      queryFn: async ({ rosterId }) => {
        try {
          return {
            data: await rosterWarbandsClient.createWarband({
              rosterId,
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

    deleteWarband: builder.mutation<
      void,
      { rosterId: number; warbandId: number }
    >({
      queryFn: async ({ rosterId, warbandId }) => {
        try {
          await rosterWarbandsClient.deleteWarband({ rosterId, warbandId });
          return { data: undefined };
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

    duplicateWarband: builder.mutation<
      Warband,
      { rosterId: number; warbandId: number }
    >({
      queryFn: async ({ rosterId, warbandId }) => {
        try {
          return {
            data: await rosterWarbandsClient.duplicateWarband({
              rosterId,
              warbandId,
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

    moveWarband: builder.mutation<
      void,
      { rosterId: number; warbandId: number; request: MoveWarbandRequest }
    >({
      queryFn: async ({ rosterId, warbandId, request }) => {
        try {
          await rosterWarbandsClient.moveWarband({
            rosterId,
            warbandId,
            moveWarbandRequest: request,
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
  useCreateWarbandMutation,
  useDeleteWarbandMutation,
  useDuplicateWarbandMutation,
  useMoveWarbandMutation,
} = rosterWarbandApi;
