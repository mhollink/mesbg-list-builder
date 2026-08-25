import type { ThemePreset } from "../theme.types";
import {createThemeTokens} from "../../../../theme/createThemeTokens.ts";

export const mordorTheme: ThemePreset = {
    id: "mordor",
    name: "Mordor",
    category: "middle-earth",
    description: "Ash, iron and the fires of Mordor.",

    colors: createThemeTokens({
        primary: "#542E2B",
        secondary: "#3D4142",
        accent: "#C66A32",
    }),
};