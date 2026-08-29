import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type {
  AppLanguage,
  GeneralSettingsState,
} from "./generalSettings.types.ts";

const initialState: GeneralSettingsState = {
  language: "en",
  translatedGameRules: false,
};

const generalSettingsSlice = createSlice({
  name: "generalSettings",
  initialState,
  reducers: {
    setLanguage(state, action: PayloadAction<AppLanguage>) {
      state.language = action.payload;
      state.translatedGameRules = false;
    },

    setTranslatedGameRules(state, action: PayloadAction<boolean>) {
      state.translatedGameRules = action.payload;
    },
  },
});

export const { setLanguage, setTranslatedGameRules } =
  generalSettingsSlice.actions;

export default generalSettingsSlice.reducer;
