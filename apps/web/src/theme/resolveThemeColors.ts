import type { ThemeSelection } from "../features/settings/theme/theme.types.ts";
import { THEME_PRESETS } from "../features/settings/theme/themePresets.ts";
import { createCustomThemeColors } from "./createCustomTheme.ts";
import type { ThemeColorTokens } from "./theme.types.ts";

export function resolveThemeColors(
  selection: ThemeSelection,
): ThemeColorTokens {
  if (selection.type === "custom") {
    return createCustomThemeColors(selection.primaryColor);
  }

  const preset = THEME_PRESETS[selection.preset] ?? THEME_PRESETS.default;
  return preset.colors;
}
