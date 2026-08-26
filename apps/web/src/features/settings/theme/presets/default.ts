import type { ThemePreset } from "../theme.types.ts";

export const defaultTheme: ThemePreset = {
  id: "default",
  name: "Default",
  category: "default",
  description: "The classic MESBG List Builder theme.",

  colors: {
    brand: {
      primary: "#2867A8",
      secondary: "#3E914D",
      tertiary: "#965D2E",
      accent: "#E0AE22",
      highlight: "#D04432",
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
      success: "#1F7A6D",
      warning: "#C97818",
      error: "#A92F55",
      info: "#2B7FA3",
    },

    divider: "rgba(0, 0, 0, 0.12)",
  },
};
