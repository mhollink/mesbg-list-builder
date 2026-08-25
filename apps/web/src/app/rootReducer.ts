import { combineReducers } from "@reduxjs/toolkit";

import themeReducer from "../features/settings/theme/themeSlice";

export const rootReducer = combineReducers({
    theme: themeReducer,
});