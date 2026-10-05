import type {
  RosterSummary,
  UpdateRosterArmyOptionsRequest,
} from "@mlb/api-client";

import { rosterCompositionClient } from "~/api/api.ts";
import { toApiError } from "~/api/api-error.ts";
import { serverApi } from "~/api/server-api.ts";

export const rosterCompositionApi = serverApi.injectEndpoints({
  endpoints: (builder) => ({
    setArmyOptions: builder.mutation<
      RosterSummary,
      { rosterId: number; request: UpdateRosterArmyOptionsRequest }
    >({
      queryFn: async ({ rosterId, request }) => {
        try {
          return {
            data: await rosterCompositionClient.setRosterArmyOptions({
              rosterId,
              updateRosterArmyOptionsRequest: request,
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

    setGeneral: builder.mutation<
      void,
      {
        rosterId: number;
        unitId: number;
      }
    >({
      queryFn: async ({ rosterId, unitId }) => {
        try {
          await rosterCompositionClient.setRosterGeneral({
            rosterId,
            unitId,
          });
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

    clearGeneral: builder.mutation<void, { rosterId: number }>({
      queryFn: async ({ rosterId }) => {
        try {
          await rosterCompositionClient.clearRosterGeneral({
            rosterId,
          });
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
  }),
});

export const {
  useSetArmyOptionsMutation,
  useSetGeneralMutation,
  useClearGeneralMutation,
} = rosterCompositionApi;
