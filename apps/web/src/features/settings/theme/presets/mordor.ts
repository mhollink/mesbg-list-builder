import type { ThemePreset } from "../theme.types";
import {createThemeTokens} from "../../../../theme/createThemeTokens.ts";

export const mordorTheme: ThemePreset = {
    id: "mordor",
    name: "Mordor",
    category: "middle-earth",
    description: "Ash, iron and the fires of Mordor.",

    colors: createThemeTokens({
        primary: "#592D32",
        secondary: "#302D2D",
        tertiary: "#76402D",
        accent: "#D16A24",
        highlight: "#B8322B",
    }),
};