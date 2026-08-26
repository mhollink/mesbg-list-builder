import type { ThemePreset } from "../theme.types.ts";
import { createThemeTokens } from "../../../../theme/createThemeTokens.ts";

export const isengardTheme: ThemePreset = {
  id: "isengard",
  name: "Isengard",
  category: "middle-earth",
  description: "Iron, smoke and the machinery of war.",

  colors: createThemeTokens({
    primary: "#34383A",
    secondary: "#D4D0C5",
    tertiary: "#704437",
    accent: "#B47732",
    highlight: "#607887",
  }),
};
