import { combineReducers } from "@reduxjs/toolkit";

import generalSettingsReducer from "../features/settings/general/generalSettingsSlice";
import themeReducer from "../features/settings/theme/themeSlice";

export const rootReducer = combineReducers({
  settings: generalSettingsReducer,
  theme: themeReducer,
});
