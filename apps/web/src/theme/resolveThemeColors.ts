import { createCustomThemeColors } from "./createCustomTheme.ts";
import type { ThemeColorTokens, ThemeSelection } from "./theme.types";
import { THEME_PRESETS } from "./themePresets.ts";

export function resolveThemeColors(
  selection: ThemeSelection,
): ThemeColorTokens {
  if (selection.type === "custom") {
    return createCustomThemeColors(selection.primaryColor);
  }

  const preset = THEME_PRESETS[selection.preset] ?? THEME_PRESETS.default;
  return preset.colors;
}
