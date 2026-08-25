import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {ColorVisionMode, ThemePresetId, ThemeState} from "./theme.types.ts";

const initialState: ThemeState = {
    selection: {
        type: "preset",
        preset: "middle-earth",
    },
    colorVisionMode: "standard",
};

const themeSlice = createSlice({
    name: "theme",
    initialState,
    reducers: {
        setPreset(state, action: PayloadAction<ThemePresetId>) {
            state.selection = {
                type: "preset",
                preset: action.payload,
            };
        },

        setCustomPrimaryColor(
            state,
            action: PayloadAction<string>,
        ) {
            state.selection = {
                type: "custom",
                primaryColor: action.payload,
            };
        },

        setColorVisionMode(
            state,
            action: PayloadAction<ColorVisionMode>,
        ) {
            state.colorVisionMode = action.payload;
        },
    },
});

export const {
    setPreset,
    setCustomPrimaryColor,
    setColorVisionMode,
} = themeSlice.actions;

export default themeSlice.reducer;