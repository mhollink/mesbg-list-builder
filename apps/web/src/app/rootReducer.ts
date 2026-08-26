import { combineReducers } from "@reduxjs/toolkit";

import generalSettingsReducer from "../features/settings/state/general/generalSettingsSlice";
import themeReducer from "../features/settings/state/theme/themeSlice";

export const rootReducer = combineReducers({
  settings: generalSettingsReducer,
  theme: themeReducer,
});
