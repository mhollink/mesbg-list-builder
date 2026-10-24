import { createThemeTokens } from "../createThemeTokens.ts";
import type { ThemePreset } from "../theme.types";

export const mordorTheme: ThemePreset = {
  id: "mordor",
  name: "Mordor",
  category: "middle-earth",
  description: "Ash, iron and the fires of Mordor.",

  colors: createThemeTokens({
    primary: "#592D32",
    secondary: "#302D2D",
    tertiary: "#6D635A",
    accent: "#D6BD75",
    highlight: "#71748D",
  }),
};
