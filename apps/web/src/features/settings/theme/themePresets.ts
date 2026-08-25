import type {ThemePreset, ThemePresetId} from "./theme.types.ts";
import {defaultTheme} from "./presets/default.ts";
import {mordorTheme} from "./presets/mordor.ts";
import {gondorTheme} from "./presets/gondor.ts";
import {tabletopAllianceTheme} from "./presets/creators/tabletop-alliance.ts";

export const THEME_PRESETS: Record<
    ThemePresetId,
    ThemePreset
> = {
    default: defaultTheme,
    gondor: gondorTheme,
    mordor: mordorTheme,

    // Creator Packs
    "tabletop-alliance": tabletopAllianceTheme
};