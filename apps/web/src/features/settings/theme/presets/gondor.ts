import { createThemeTokens } from "../../../../theme/createThemeTokens";
import type { ThemePreset } from "../theme.types";

export const gondorTheme: ThemePreset = {
    id: "gondor",
    name: "Gondor",
    category: "middle-earth",
    description: "Steel, stone and the White City.",

    colors: createThemeTokens({
        primary: "#244B73",
        secondary: "#71899D",
        tertiary: "#D7DDE1",
        accent: "#C7A54A",
        highlight: "#F1F3F4",
    }),
};