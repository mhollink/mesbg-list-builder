import { createThemeTokens } from "../createThemeTokens.ts";
import type { ThemePreset } from "../theme.types";

export const angmarTheme: ThemePreset = {
  id: "angmar",
  name: "Angmar",
  category: "middle-earth",
  description: "Frozen stone and shadowed skies.",

  colors: createThemeTokens({
    primary: "#394A68", // midnight blue
    secondary: "#70798B", // cold slate
    tertiary: "#AAB5B9", // frost grey
    accent: "#518E9E", // spectral cyan
    highlight: "#725882", // bruised violet
  }),
};
