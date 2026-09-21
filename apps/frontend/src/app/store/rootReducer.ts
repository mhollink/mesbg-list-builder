import { combineReducers } from "@reduxjs/toolkit";

import { serverApi } from "~/api/server-api.ts";
import guestRosterReducer from "~/features/armies/rosters/guest/guest-roster.slice.ts";
import generalSettingsReducer from "~/features/settings/state/general/generalSettingsSlice.ts";
import themeReducer from "~/features/settings/state/theme/themeSlice.ts";

export const rootReducer = combineReducers({
  guestRoster: guestRosterReducer,
  settings: generalSettingsReducer,
  theme: themeReducer,

  [serverApi.reducerPath]: serverApi.reducer,
});
