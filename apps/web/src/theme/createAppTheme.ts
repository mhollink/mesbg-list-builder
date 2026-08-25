import {
    createTheme,
    type PaletteMode,
    type ThemeOptions,
} from "@mui/material/styles";

import type { ThemeColorTokens } from "./theme.types";

export function createAppTheme(
    colors: ThemeColorTokens,
    mode: PaletteMode,
) {
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
            accent: colors.brand.accent,
            surfaceSubtle: colors.surface.subtle,
        },

        shape: {
            borderRadius: 8,
        },
    };

    return createTheme(options);
}