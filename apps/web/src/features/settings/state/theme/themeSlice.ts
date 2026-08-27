import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type {
  ColorVisionMode,
  ThemeMode,
  ThemePresetId,
  ThemeState,
} from "~/theme/theme.types.ts";

const initialState: ThemeState = {
  selection: {
    type: "preset",
    preset: "default",
  },
  colorVisionMode: "standard",
  mode: "light",
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setThemeMode(state, action: PayloadAction<ThemeMode>) {
      state.mode = action.payload;
    },

    setPreset(state, action: PayloadAction<ThemePresetId>) {
      state.selection = {
        type: "preset",
        preset: action.payload,
      };
    },

    setCustomPrimaryColor(state, action: PayloadAction<string>) {
      state.selection = {
        type: "custom",
        primaryColor: action.payload,
      };
    },

    setColorVisionMode(state, action: PayloadAction<ColorVisionMode>) {
      state.colorVisionMode = action.payload;
    },
  },
});

export const {
  setThemeMode,
  setPreset,
  setCustomPrimaryColor,
  setColorVisionMode,
} = themeSlice.actions;

export default themeSlice.reducer;
