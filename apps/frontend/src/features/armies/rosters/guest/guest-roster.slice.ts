import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { GuestRoster } from "./guest-roster.types.ts";

export interface GuestRosterState {
  roster: GuestRoster | null;
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
  },
});

export const { replaceGuestRoster, clearGuestRoster } =
  guestRosterSlice.actions;

export default guestRosterSlice.reducer;
