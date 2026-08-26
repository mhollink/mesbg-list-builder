import { createThemeTokens } from "../../../../../theme/createThemeTokens.ts";
import type { ThemePreset } from "../../theme.types.ts";

export const conquestCreationsTheme: ThemePreset = {
  id: "conquest-creations",
  name: "Conquest Creations",
  description: "Creating content for the Middle Earth SBG",
  category: "creator",
  creator: {
    name: "Conquest Creations",
  },

  // TODO: Align a fitting theme with the amazing people at Conquest Creations
  colors: createThemeTokens({
    primary: "#F09020",
    secondary: "#1990c6",
    tertiary: "#0b3859",
    accent: "#27ae60",
    highlight: "#ff5f00",
  }),
};
