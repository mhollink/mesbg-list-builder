import { conquestCreationsTheme } from "./presets/creators/conquest-creations.ts";
import { gondorCallsForAleTheme } from "./presets/creators/gondor-calls-for-ale.ts";
import { tabletopAllianceTheme } from "./presets/creators/tabletop-alliance.ts";
import { defaultTheme } from "./presets/default.ts";
import { gondorTheme } from "./presets/gondor.ts";
import { haradTheme } from "./presets/harad.ts";
import { isengardTheme } from "./presets/isengard.ts";
import { lothlorienTheme } from "./presets/lothlorien.ts";
import { mordorTheme } from "./presets/mordor.ts";
import { amethystTheme } from "./presets/patreons/amethystTheme.ts";
import type { ThemePreset, ThemePresetId } from "./theme.types.ts";
import {rohanTheme} from "./presets/rohan.ts";
import {angmarTheme} from "./presets/angmar.ts";

export const THEME_PRESETS: Record<ThemePresetId, ThemePreset> = {
  default: defaultTheme,
  gondor: gondorTheme,
  rohan: rohanTheme,
  lothlorien: lothlorienTheme,
  mordor: mordorTheme,
  isengard: isengardTheme,
  angmar: angmarTheme,
  harad: haradTheme,

  // Creator Packs
  "tabletop-alliance": tabletopAllianceTheme,
  "gondor-calls-for-ale": gondorCallsForAleTheme,
  "conquest-creations": conquestCreationsTheme,

  // Patreon / Community Packs
  amethyst: amethystTheme,
};
