import type {
  CreateRosterGroupRequest,
  MoveRosterGroupRequest,
  MoveRosterGroupToRootRequest,
  RosterGroup,
  UpdateRosterGroupOperationRequest,
} from "@mlb/api-client";

import { rosterGroupsApi } from "~/api/api.ts";
import { toApiError } from "~/api/api-error.ts";
import { serverApi } from "~/api/server-api.ts";

export const rosterGroupApi = serverApi.injectEndpoints({
  endpoints: (builder) => ({
    getRosterGroups: builder.query<RosterGroup[], void>({
      queryFn: async () => {
        try {
          return {
            data: await rosterGroupsApi.listRosterGroups(),
          };
        } catch (error) {
          return { error: toApiError(error) };
        }
      },
      providesTags: [{ type: "RosterGroup", id: "LIST" }],
    }),

    createRosterGroup: builder.mutation<RosterGroup, CreateRosterGroupRequest>({
      queryFn: async (request) => {
        try {
          return {
            data: await rosterGroupsApi.createRosterGroup({
              createRosterGroupRequest: request,
            }),
          };
        } catch (error) {
          return { error: toApiError(error) };
        }
      },
      invalidatesTags: [{ type: "RosterGroup", id: "LIST" }],
    }),

    updateRosterGroup: builder.mutation<
      RosterGroup,
      UpdateRosterGroupOperationRequest
    >({
      queryFn: async (request) => {
        try {
          return {
            data: await rosterGroupsApi.updateRosterGroup({
              groupId: request.groupId,
              updateRosterGroupRequest: request.updateRosterGroupRequest,
            }),
          };
        } catch (error) {
          return { error: toApiError(error) };
        }
      },
      invalidatesTags: [{ type: "RosterGroup", id: "LIST" }],
    }),

    deleteRosterGroup: builder.mutation<void, number>({
      queryFn: async (groupId) => {
        try {
          await rosterGroupsApi.deleteRosterGroup({ groupId });
        } catch (error) {
          return { error: toApiError(error) };
        }
      },
      invalidatesTags: [{ type: "RosterGroup", id: "LIST" }],
    }),

    moveRosterGroup: builder.mutation<void, MoveRosterGroupRequest>({
      queryFn: async (request) => {
        try {
          await rosterGroupsApi.moveRosterGroup({
            groupId: request.groupId,
            parentGroupId: request.parentGroupId,
          });
        } catch (error) {
          return { error: toApiError(error) };
        }
      },
      invalidatesTags: [{ type: "RosterGroup", id: "LIST" }],
    }),

    moveRosterGroupToRoot: builder.mutation<void, MoveRosterGroupToRootRequest>(
      {
        queryFn: async (request) => {
          try {
            await rosterGroupsApi.moveRosterGroupToRoot({
              groupId: request.groupId,
            });
          } catch (error) {
            return { error: toApiError(error) };
          }
        },
        invalidatesTags: [{ type: "RosterGroup", id: "LIST" }],
      },
    ),
  }),
});

export const {
  useGetRosterGroupsQuery,
  useCreateRosterGroupMutation,
  useUpdateRosterGroupMutation,
  useDeleteRosterGroupMutation,
  useMoveRosterGroupMutation,
  useMoveRosterGroupToRootMutation,
} = rosterGroupApi;
