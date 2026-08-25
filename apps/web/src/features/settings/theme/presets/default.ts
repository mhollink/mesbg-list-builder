import type {ThemePreset} from "../theme.types.ts";

export const defaultTheme: ThemePreset = {
    id: "default",
    name: "Default",
    category: "default",
    description: "The classic MESBG List Builder theme.",

    colors: {
        brand: {
            primary: "#1976D2",
            secondary: "#9C27B0",
            accent: "#1976D2",
        },

        surface: {
            background: "#FFFFFF",
            paper: "#FFFFFF",
            subtle: "#F5F5F5",
        },

        text: {
            primary: "rgba(0, 0, 0, 0.87)",
            secondary: "rgba(0, 0, 0, 0.60)",
        },

        semantic: {
            success: "#2E7D32",
            warning: "#ED6C02",
            error: "#D32F2F",
            info: "#0288D1",
        },

        divider: "rgba(0, 0, 0, 0.12)",
    },
};