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
        primary: "#FC7202",
        secondary: "#1C2B26",
        accent: "#337245",
    }),
};