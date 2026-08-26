import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type {
  AppLanguage,
  GeneralSettingsState,
} from "./generalSettings.types";

const initialState: GeneralSettingsState = {
  language: "en",
};

const generalSettingsSlice = createSlice({
  name: "generalSettings",
  initialState,
  reducers: {
    setLanguage(state, action: PayloadAction<AppLanguage>) {
      state.language = action.payload;
    },
  },
});

export const { setLanguage } = generalSettingsSlice.actions;

export default generalSettingsSlice.reducer;
