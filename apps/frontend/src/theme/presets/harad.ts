import { createThemeTokens } from "../createThemeTokens.ts";
import type { ThemePreset } from "../theme.types";

export const haradTheme: ThemePreset = {
  id: "harad",
  name: "Harad",
  category: "middle-earth",
  description: "Crimson, gold and desert heat",

  colors: createThemeTokens({
    primary: "#993622", // deep crimson
    secondary: "#DCC58A", // desert ochre
    tertiary: "#D8C29A", // sandstone
    accent: "#167D7A", // turquoise
    highlight: "#3E2927", // dark mahogany
  }),
};
