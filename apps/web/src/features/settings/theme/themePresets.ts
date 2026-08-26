import type {ThemePreset, ThemePresetId} from "./theme.types.ts";
import {defaultTheme} from "./presets/default.ts";
import {mordorTheme} from "./presets/mordor.ts";
import {gondorTheme} from "./presets/gondor.ts";
import {tabletopAllianceTheme} from "./presets/creators/tabletop-alliance.ts";
import {lothlorienTheme} from "./presets/lothlorien.ts";
import {isengardTheme} from "./presets/isengard.ts";
import {amethystTheme} from "./presets/patreons/amethystTheme.ts";

export const THEME_PRESETS: Record<
    ThemePresetId,
    ThemePreset
> = {
    default: defaultTheme,
    gondor: gondorTheme,
    lothlorien: lothlorienTheme,
    mordor: mordorTheme,
    isengard: isengardTheme,

    // Creator Packs
    "tabletop-alliance": tabletopAllianceTheme,

    // Patreon / Community Packs
    amethyst: amethystTheme
};