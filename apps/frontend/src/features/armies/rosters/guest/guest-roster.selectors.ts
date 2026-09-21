import type { RootState } from "~/app/store/store.ts";

export const selectGuestRoster = (state: RootState) => state.guestRoster.roster;

export const selectHasGuestRoster = (state: RootState) =>
  state.guestRoster.roster !== null;
