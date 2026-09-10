import { createThemeTokens } from "../createThemeTokens.ts";
import type { ThemePreset } from "../theme.types";

export const rohanTheme: ThemePreset = {
  id: "rohan",
  name: "Rohan",
  category: "middle-earth",
  description: "Green fields and banners of the Riddermark.",

  colors: createThemeTokens({
    primary: "#567A3E",
    secondary: "#9A713F",
    tertiary: "#D4B85A",
    accent: "#3E7892",
    highlight: "#A84B37",
  }),
};
