import type {ThemeColorTokens} from "../../../theme/theme.types.ts";

export type ThemeMode =
    | "light"
    | "dark"
    | "system";

export type ThemePresetId =
    | "default"
    | "gondor"
    | "mordor"
    | "lothlorien"
    | "isengard"
    | "tabletop-alliance"
    | "gondor-calls-for-ale"
    | "conquest-creations"
    | "amethyst";

export type ThemePresetCategory =
    | "default"
    | "middle-earth"
    | "creator"
    | "patreon";

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