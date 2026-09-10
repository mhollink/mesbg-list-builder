import { createThemeTokens } from "../../createThemeTokens.ts";
import type { ThemePreset } from "../../theme.types";

export const amethystTheme: ThemePreset = {
  id: "amethyst",
  name: "Amethyst",
  category: "patreon",
  description: "Rich violet tones with gold and cool blue accents.",

  colors: createThemeTokens({
    primary: "#6F42C1",
    secondary: "#8B5CF6",
    tertiary: "#3F5F8F",
    accent: "#D6A72C",
    highlight: "#D05A9E",
  }),
};
