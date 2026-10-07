import { getContrastRatio } from "@mui/material";
import {
  alpha,
  createTheme,
  type PaletteMode,
  type ThemeOptions,
} from "@mui/material/styles";

import type { ThemeColorTokens } from "./theme.types";

export function tokenize(color: string) {
  return {
    main: color,
    light: alpha(color, 0.5),
    dark: alpha(color, 0.9),
    contrastText: getContrastRatio(color, "#fff") > 4.5 ? "#fff" : "#111",
  };
}

export function createAppTheme(colors: ThemeColorTokens, mode: PaletteMode) {
  const options: ThemeOptions = {
    cssVariables: true,

    palette: {
      mode,

      contrastThreshold: 4.5,

      primary: {
        main: colors.brand.primary,
      },

      secondary: {
        main: colors.brand.secondary,
      },

      tertiary: tokenize(colors.brand.tertiary),
      accent: tokenize(colors.brand.accent),
      highlight: tokenize(colors.brand.highlight),

      background: {
        default: colors.surface.background,
        paper: colors.surface.paper,
      },

      text: {
        primary: colors.text.primary,
        secondary: colors.text.secondary,
      },

      divider: colors.divider,

      success: {
        main: colors.semantic.success,
      },

      warning: {
        main: colors.semantic.warning,
      },

      error: {
        main: colors.semantic.error,
      },

      info: {
        main: colors.semantic.info,
      },
    },

    appColors: {
      primary: colors.brand.primary,
      secondary: colors.brand.secondary,
      tertiary: colors.brand.tertiary,
      accent: colors.brand.accent,
      highlight: colors.brand.highlight,
      surfaceSubtle: colors.surface.subtle,
    },

    components: {
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: colors.surface.subtle,
            color: colors.text.primary,
            borderColor: colors.divider,
          },
        },
      },

      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: colors.surface.subtle,
            color: colors.text.primary,
            borderBottom: `1px solid ${colors.divider}`,
            boxShadow: "none",
          },
        },
      },
    },

    shape: {
      borderRadius: 4,
    },
  };

  return createTheme(options);
}
