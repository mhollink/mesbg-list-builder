import type {
  BuilderUnitId,
  BuilderWarbandId,
} from "../domain/roster.types.ts";
import type { RosterPersistence } from "./roster-persistence.types.ts";
import { useAppDispatch, useAppSelector } from "~/app/store/hooks.ts";
import { selectGuestRoster } from "~/features/armies/rosters/guest/guest-roster.selectors.ts";
import {
  addGuestFollower,
  addGuestWarband,
  clearGuestGeneral,
  deleteGuestUnit,
  deleteGuestWarband,
  moveGuestUnit,
  moveGuestWarband,
  setGuestArmyOptions,
  setGuestGeneral,
  setGuestLeader,
  updateGuestUnit,
} from "~/features/armies/rosters/guest/guest-roster.slice.ts";
import type {
  GuestRoster,
  GuestRosterUnit,
} from "~/features/armies/rosters/guest/guest-roster.types.ts";

export function useGuestRosterPersistence(): RosterPersistence {
  const dispatch = useAppDispatch();

  const roster = useAppSelector(selectGuestRoster);

  return {
    async createWarband() {
      dispatch(
        addGuestWarband({
          id: crypto.randomUUID(),
          leader: null,
          followers: [],
        }),
      );
    },

    async deleteWarband(warbandId) {
      dispatch(deleteGuestWarband(guestWarbandId(warbandId)));
    },

    async duplicateWarband(warbandId) {
      const source = findWarband(roster, guestWarbandId(warbandId));

      dispatch(
        addGuestWarband({
          id: crypto.randomUUID(),

          leader: source.leader ? cloneUnit(source.leader) : null,

          followers: source.followers.map(cloneUnit),
        }),
      );
    },

    async moveWarband(warbandId, position) {
      dispatch(
        moveGuestWarband({
          warbandId: guestWarbandId(warbandId),
          position,
        }),
      );
    },

    async setLeader(warbandId, armyListProfileId, optionIds) {
      const id = guestWarbandId(warbandId);

      const warband = findWarband(roster, id);

      dispatch(
        setGuestLeader({
          warbandId: id,

          leader: {
            id: warband.leader?.id ?? crypto.randomUUID(),
            armyListProfileId,
            quantity: 1,
            optionIds,
          },
        }),
      );
    },

    async addFollower(warbandId, armyListProfileId, quantity, optionIds) {
      dispatch(
        addGuestFollower({
          warbandId: guestWarbandId(warbandId),

          follower: {
            id: crypto.randomUUID(),
            armyListProfileId,
            quantity,
            optionIds,
          },
        }),
      );
    },

    async updateUnit(warbandId, unitId, changes) {
      dispatch(
        updateGuestUnit({
          warbandId: guestWarbandId(warbandId),
          unitId: guestUnitId(unitId),
          changes,
        }),
      );
    },

    async deleteUnit(warbandId, unitId) {
      dispatch(
        deleteGuestUnit({
          warbandId: guestWarbandId(warbandId),
          unitId: guestUnitId(unitId),
        }),
      );
    },

    async moveUnit(sourceWarbandId, unitId, targetWarbandId, position) {
      dispatch(
        moveGuestUnit({
          sourceWarbandId: guestWarbandId(sourceWarbandId),

          unitId: guestUnitId(unitId),

          targetWarbandId: guestWarbandId(targetWarbandId),

          position,
        }),
      );
    },

    async setGeneral(unitId) {
      dispatch(setGuestGeneral(guestUnitId(unitId)));
    },

    async clearGeneral() {
      dispatch(clearGuestGeneral());
    },

    async setArmyOptions(optionIds) {
      dispatch(setGuestArmyOptions([...optionIds]));
    },
  };
}

function cloneUnit(unit: GuestRosterUnit): GuestRosterUnit {
  return {
    ...unit,
    id: crypto.randomUUID(),
    optionIds: [...unit.optionIds],
  };
}

function findWarband(roster: GuestRoster | null, warbandId: string) {
  const warband = roster?.warbands.find(
    (candidate) => candidate.id === warbandId,
  );

  if (!warband) {
    throw new Error(`Guest warband "${warbandId}" could not be found.`);
  }

  return warband;
}

function guestWarbandId(id: BuilderWarbandId): string {
  if (typeof id !== "string") {
    throw new Error(`Expected a guest warband id, received "${id}".`);
  }

  return id;
}

function guestUnitId(id: BuilderUnitId): string {
  if (typeof id !== "string") {
    throw new Error(`Expected a guest unit id, received "${id}".`);
  }

  return id;
}
