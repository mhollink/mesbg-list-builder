import type {ThemeColorTokens} from "../../../theme/theme.types.ts";

export type ThemeMode =
    | "light"
    | "dark"
    | "system";

export type ThemePresetId =
    | "default"
    | "gondor"
    | "mordor"
    | "tabletop-alliance";

export type ThemePresetCategory =
    | "default"
    | "middle-earth"
    | "creator";

export type ColorVisionMode =
    | "standard"
    | "protanopia"
    | "deuteranopia"
    | "tritanopia"
    | "high-contrast";

export interface ThemePreset {
    id: ThemePresetId;
    name: string;
    description?: string;
    category: ThemePresetCategory;
    colors: ThemeColorTokens;
    creator?: {
        name: string;
    };
}

export type ThemeSelection =
    | { type: "preset"; preset: ThemePresetId; }
    | { type: "custom"; primaryColor: string; };

export interface ThemeState {
    selection: ThemeSelection;
    colorVisionMode: ColorVisionMode;
    mode: ThemeMode;
}