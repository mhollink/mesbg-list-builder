import { combineReducers } from "@reduxjs/toolkit";

import generalSettingsReducer from "../../features/settings/state/general/generalSettingsSlice.ts";
import themeReducer from "../../features/settings/state/theme/themeSlice.ts";

export const rootReducer = combineReducers({
  settings: generalSettingsReducer,
  theme: themeReducer,
});
