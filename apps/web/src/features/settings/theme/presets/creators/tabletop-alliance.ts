import type {ThemePreset} from "../../theme.types.ts";
import {createThemeTokens} from "../../../../../theme/createThemeTokens.ts";

export const tabletopAllianceTheme: ThemePreset = {
    id: "tabletop-alliance",
    name: "The Tabletop Alliance",
    description: "Creating MESBG & 40k Content on YouTube",
    category: "creator",
    creator: {
        name: "The Tabletop Alliance",
    },

    // TODO: Align a fitting theme with the amazing people of the Tabletop Alliance.
    colors: createThemeTokens({
        primary: "#22445D",
        secondary: "#327FA1",
        tertiary: "#CCD7E4",
        accent: "#5B4B5A",
        highlight: "#9B6964",
    }),
};