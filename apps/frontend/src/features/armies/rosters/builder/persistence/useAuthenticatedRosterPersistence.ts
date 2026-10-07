import type {
  BuilderUnitId,
  BuilderWarbandId,
} from "../domain/roster.types.ts";
import type { RosterPersistence } from "./roster-persistence.types.ts";
import {
  useClearGeneralMutation,
  useSetArmyOptionsMutation,
  useSetGeneralMutation,
} from "~/features/armies/rosters/api/roster-composition-api.ts";
import {
  useCreateFollowerMutation,
  useDeleteUnitMutation,
  useMoveUnitMutation,
  useSetLeaderMutation,
  useUpdateUnitMutation,
} from "~/features/armies/rosters/api/roster-unit-api.ts";
import {
  useCreateWarbandMutation,
  useDeleteWarbandMutation,
  useDuplicateWarbandMutation,
  useMoveWarbandMutation,
} from "~/features/armies/rosters/api/roster-warband-api.ts";

export function useAuthenticatedRosterPersistence(
  rosterId: number,
): RosterPersistence {
  const [createWarband] = useCreateWarbandMutation();
  const [deleteWarband] = useDeleteWarbandMutation();
  const [duplicateWarband] = useDuplicateWarbandMutation();
  const [moveWarband] = useMoveWarbandMutation();

  const [setLeader] = useSetLeaderMutation();
  const [createFollower] = useCreateFollowerMutation();
  const [updateUnit] = useUpdateUnitMutation();
  const [deleteUnit] = useDeleteUnitMutation();
  const [moveUnit] = useMoveUnitMutation();

  const [setArmyOptions] = useSetArmyOptionsMutation();
  const [setGeneral] = useSetGeneralMutation();
  const [clearGeneral] = useClearGeneralMutation();

  return {
    async createWarband() {
      await createWarband({
        rosterId,
      }).unwrap();
    },

    async deleteWarband(warbandId) {
      await deleteWarband({
        rosterId,
        warbandId: numericWarbandId(warbandId),
      }).unwrap();
    },

    async duplicateWarband(warbandId) {
      await duplicateWarband({
        rosterId,
        warbandId: numericWarbandId(warbandId),
      }).unwrap();
    },

    async moveWarband(warbandId, position) {
      await moveWarband({
        rosterId,
        warbandId: numericWarbandId(warbandId),
        request: {
          position,
        },
      }).unwrap();
    },

    async setLeader(warbandId, armyListProfileId, optionIds) {
      await setLeader({
        rosterId,
        warbandId: numericWarbandId(warbandId),
        request: {
          armyListProfileId,
          optionIds: new Set(optionIds),
        },
      }).unwrap();
    },

    async addFollower(warbandId, armyListProfileId, quantity, optionIds) {
      await createFollower({
        rosterId,
        warbandId: numericWarbandId(warbandId),
        request: {
          armyListProfileId,
          quantity,
          optionIds: new Set(optionIds),
        },
      }).unwrap();
    },

    async updateUnit(warbandId, unitId, changes) {
      await updateUnit({
        rosterId,
        warbandId: numericWarbandId(warbandId),
        unitId: numericUnitId(unitId),
        request: {
          quantity: changes.quantity,
          optionIds: changes.optionIds ? new Set(changes.optionIds) : undefined,
        },
      }).unwrap();
    },

    async deleteUnit(warbandId, unitId) {
      await deleteUnit({
        rosterId,
        warbandId: numericWarbandId(warbandId),
        unitId: numericUnitId(unitId),
      }).unwrap();
    },

    async moveUnit(sourceWarbandId, unitId, targetWarbandId, position) {
      await moveUnit({
        rosterId,
        warbandId: numericWarbandId(sourceWarbandId),
        unitId: numericUnitId(unitId),
        request: {
          targetWarbandId: numericWarbandId(targetWarbandId),
          position,
        },
      }).unwrap();
    },

    async setGeneral(unitId) {
      await setGeneral({
        rosterId,
        unitId: numericUnitId(unitId),
      }).unwrap();
    },

    async clearGeneral() {
      await clearGeneral({
        rosterId,
      }).unwrap();
    },

    async setArmyOptions(optionIds) {
      await setArmyOptions({
        rosterId,
        request: {
          optionIds: new Set(optionIds),
        },
      }).unwrap();
    },
  };
}

function numericWarbandId(id: BuilderWarbandId): number {
  if (typeof id !== "number") {
    throw new Error(`Expected an authenticated warband id, received "${id}".`);
  }

  return id;
}

function numericUnitId(id: BuilderUnitId): number {
  if (typeof id !== "number") {
    throw new Error(`Expected an authenticated unit id, received "${id}".`);
  }

  return id;
}
