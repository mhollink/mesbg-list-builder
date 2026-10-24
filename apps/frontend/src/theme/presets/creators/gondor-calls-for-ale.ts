import { createThemeTokens } from "../../createThemeTokens.ts";
import type { ThemePreset } from "../../theme.types";

export const gondorCallsForAleTheme: ThemePreset = {
  id: "gondor-calls-for-ale",
  name: "Gondor  calls for Ale",
  description: "A Middle Earth Podcast.",
  category: "creator",
  creator: {
    name: "Gondor Calls of Ale",
  },

  // TODO: Align a fitting theme with the amazing people of Gondor Calls for Ale
  colors: createThemeTokens({
    primary: "#02112C",
    secondary: "#334255",
    tertiary: "#EDD8BF",
    accent: "#D1B567",
    highlight: "#798C82",
  }),
};
