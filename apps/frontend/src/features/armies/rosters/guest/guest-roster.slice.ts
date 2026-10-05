import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type {
  GuestRoster,
  GuestRosterUnit,
  GuestWarband,
} from "./guest-roster.types.ts";

export interface GuestRosterState {
  roster: GuestRoster | null;
}

interface MoveWarbandPayload {
  warbandId: string;
  position: number;
}

interface SetLeaderPayload {
  warbandId: string;
  leader: GuestRosterUnit;
}

interface AddFollowerPayload {
  warbandId: string;
  follower: GuestRosterUnit;
}

interface UpdateUnitPayload {
  warbandId: string;
  unitId: string;
  changes: {
    quantity?: number;
    optionIds?: string[];
  };
}

interface DeleteUnitPayload {
  warbandId: string;
  unitId: string;
}

interface MoveUnitPayload {
  sourceWarbandId: string;
  unitId: string;
  targetWarbandId: string;
  position: number;
}

const initialState: GuestRosterState = {
  roster: null,
};

const guestRosterSlice = createSlice({
  name: "guestRoster",

  initialState,

  reducers: {
    replaceGuestRoster: (state, action: PayloadAction<GuestRoster>) => {
      state.roster = action.payload;
    },

    clearGuestRoster: (state) => {
      state.roster = null;
    },

    addGuestWarband: (state, action: PayloadAction<GuestWarband>) => {
      state.roster?.warbands.push(action.payload);
    },

    deleteGuestWarband: (state, action: PayloadAction<string>) => {
      if (!state.roster) {
        return;
      }

      const warband = state.roster.warbands.find(
        (candidate) => candidate.id === action.payload,
      );

      if (!warband) {
        return;
      }

      const generalUnitId = state.roster.generalUnitId;

      if (
        warband.leader?.id === generalUnitId ||
        warband.followers.some((follower) => follower.id === generalUnitId)
      ) {
        state.roster.generalUnitId = null;
      }

      state.roster.warbands = state.roster.warbands.filter(
        (candidate) => candidate.id !== action.payload,
      );
    },

    moveGuestWarband: (state, action: PayloadAction<MoveWarbandPayload>) => {
      if (!state.roster) {
        return;
      }

      const { warbandId, position } = action.payload;

      const currentIndex = state.roster.warbands.findIndex(
        (warband) => warband.id === warbandId,
      );

      if (
        currentIndex < 0 ||
        position < 0 ||
        position >= state.roster.warbands.length
      ) {
        return;
      }

      const [warband] = state.roster.warbands.splice(currentIndex, 1);

      state.roster.warbands.splice(position, 0, warband);
    },

    setGuestLeader: (state, action: PayloadAction<SetLeaderPayload>) => {
      if (!state.roster) {
        return;
      }

      const warband = state.roster.warbands.find(
        (candidate) => candidate.id === action.payload.warbandId,
      );

      if (!warband) {
        return;
      }

      if (warband.leader && warband.leader.id === state.roster.generalUnitId) {
        state.roster.generalUnitId = null;
      }

      warband.leader = action.payload.leader;
    },

    addGuestFollower: (state, action: PayloadAction<AddFollowerPayload>) => {
      const warband = state.roster?.warbands.find(
        (candidate) => candidate.id === action.payload.warbandId,
      );

      warband?.followers.push(action.payload.follower);
    },

    updateGuestUnit: (state, action: PayloadAction<UpdateUnitPayload>) => {
      const warband = state.roster?.warbands.find(
        (candidate) => candidate.id === action.payload.warbandId,
      );

      if (!warband) {
        return;
      }

      const unit =
        warband.leader?.id === action.payload.unitId
          ? warband.leader
          : warband.followers.find(
              (candidate) => candidate.id === action.payload.unitId,
            );

      if (!unit) {
        return;
      }

      const { quantity, optionIds } = action.payload.changes;

      if (quantity !== undefined) {
        unit.quantity = quantity;
      }

      if (optionIds !== undefined) {
        unit.optionIds = optionIds;
      }
    },

    deleteGuestUnit: (state, action: PayloadAction<DeleteUnitPayload>) => {
      if (!state.roster) {
        return;
      }

      const warband = state.roster.warbands.find(
        (candidate) => candidate.id === action.payload.warbandId,
      );

      if (!warband) {
        return;
      }

      const unitIndex = warband.followers.findIndex(
        (candidate) => candidate.id === action.payload.unitId,
      );

      if (unitIndex < 0) {
        return;
      }

      if (state.roster.generalUnitId === action.payload.unitId) {
        state.roster.generalUnitId = null;
      }

      warband.followers.splice(unitIndex, 1);
    },

    moveGuestUnit: (state, action: PayloadAction<MoveUnitPayload>) => {
      if (!state.roster) {
        return;
      }

      const { sourceWarbandId, targetWarbandId, unitId, position } =
        action.payload;

      const source = state.roster.warbands.find(
        (warband) => warband.id === sourceWarbandId,
      );

      const target = state.roster.warbands.find(
        (warband) => warband.id === targetWarbandId,
      );

      if (!source || !target) {
        return;
      }

      const sourceIndex = source.followers.findIndex(
        (unit) => unit.id === unitId,
      );

      if (sourceIndex < 0) {
        return;
      }

      const maximumPosition =
        source === target
          ? source.followers.length - 1
          : target.followers.length;

      if (position < 0 || position > maximumPosition) {
        return;
      }

      const [unit] = source.followers.splice(sourceIndex, 1);

      target.followers.splice(position, 0, unit);
    },

    setGuestGeneral: (state, action: PayloadAction<string>) => {
      if (state.roster) {
        state.roster.generalUnitId = action.payload;
      }
    },

    clearGuestGeneral: (state) => {
      if (state.roster) {
        state.roster.generalUnitId = null;
      }
    },

    setGuestArmyOptions: (state, action: PayloadAction<string[]>) => {
      if (state.roster) {
        state.roster.armyOptionIds = action.payload;
      }
    },
  },
});

export const {
  replaceGuestRoster,
  clearGuestRoster,

  addGuestWarband,
  deleteGuestWarband,
  moveGuestWarband,

  setGuestLeader,

  addGuestFollower,
  updateGuestUnit,
  deleteGuestUnit,
  moveGuestUnit,

  setGuestGeneral,
  clearGuestGeneral,

  setGuestArmyOptions,
} = guestRosterSlice.actions;

export default guestRosterSlice.reducer;
