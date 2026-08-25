import { createThemeTokens } from "../../../../theme/createThemeTokens";
import type { ThemePreset } from "../theme.types";

export const gondorTheme: ThemePreset = {
    id: "gondor",
    name: "Gondor",
    category: "middle-earth",
    description: "Steel, stone and the White City.",

    colors: createThemeTokens({
        primary: "#344A5E",
        secondary: "#667785",
        accent: "#C2A65A",
    }),
};