import { createThemeTokens } from "../../../../theme/createThemeTokens.ts";
import type { ThemePreset } from "../theme.types.ts";

export const lothlorienTheme: ThemePreset = {
  id: "lothlorien",
  name: "Lothlórien",
  category: "middle-earth",
  description: "Golden leaves beneath silver starlight.",

  colors: createThemeTokens({
    primary: "#38765A",
    secondary: "#78977E",
    tertiary: "#7469A3",
    accent: "#D9B83F",
    highlight: "#66A7C9",
  }),
};
