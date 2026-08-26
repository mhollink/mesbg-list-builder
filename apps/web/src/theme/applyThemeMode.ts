import {
    clampChroma,
    converter,
    formatHex,
    type Oklch,
} from "culori";
import type { PaletteMode } from "@mui/material/styles";

import type {
    SemanticColorTokens,
    ThemeColorTokens,
} from "./theme.types";

const toOklch = converter("oklch");

export function applyThemeMode(
    colors: ThemeColorTokens,
    mode: PaletteMode,
): ThemeColorTokens {
    if (mode === "light") {
        return colors;
    }

    const primary = parseOklch(
        colors.brand.primary,
    );

    return {
        ...colors,

        brand: {
            primary: adaptBrandColorForDarkMode(
                colors.brand.primary,
            ),
            secondary: adaptBrandColorForDarkMode(
                colors.brand.secondary,
            ),
            tertiary: adaptBrandColorForDarkMode(
                colors.brand.tertiary,
            ),
            accent: adaptBrandColorForDarkMode(
                colors.brand.accent,
            ),
            highlight: adaptBrandColorForDarkMode(
                colors.brand.highlight,
            ),
        },

        surface: {
            background: createNeutral(
                primary,
                0.14,
                0.014,
            ),
            paper: createNeutral(
                primary,
                0.18,
                0.016,
            ),
            subtle: createNeutral(
                primary,
                0.23,
                0.018,
            ),
        },

        text: {
            primary: createNeutral(
                primary,
                0.94,
                0.008,
            ),
            secondary: createNeutral(
                primary,
                0.76,
                0.012,
            ),
        },

        semantic: adaptSemanticColorsForDarkMode(
            colors.semantic,
        ),

        divider: createNeutral(
            primary,
            0.32,
            0.016,
        ),
    };
}

function adaptSemanticColorsForDarkMode(
    colors: SemanticColorTokens,
): SemanticColorTokens {
    return {
        success: ensureMinimumLightness(
            colors.success,
            0.68,
        ),
        warning: ensureMinimumLightness(
            colors.warning,
            0.72,
        ),
        error: ensureMinimumLightness(
            colors.error,
            0.65,
        ),
        info: ensureMinimumLightness(
            colors.info,
            0.68,
        ),
    };
}

function adaptBrandColorForDarkMode(
    color: string,
): string {
    return ensureMinimumLightness(
        color,
        0.65,
    );
}

function ensureMinimumLightness(
    color: string,
    minimumLightness: number,
): string {
    const parsed = parseOklch(color);

    return toHex({
        ...parsed,
        l: Math.max(
            parsed.l,
            minimumLightness,
        ),
    });
}

function createNeutral(
    source: Oklch,
    lightness: number,
    maximumChroma: number,
): string {
    return toHex({
        mode: "oklch",
        l: lightness,
        c: Math.min(
            source.c ?? 0,
            maximumChroma,
        ),
        h: source.h,
    });
}

function parseOklch(
    color: string,
): Oklch {
    const parsed = toOklch(color);

    if (!parsed) {
        throw new Error(
            `Invalid theme color: ${color}`,
        );
    }

    return parsed;
}

function toHex(color: Oklch): string {
    const value = formatHex(
        clampChroma(color, "oklch"),
    );

    if (!value) {
        throw new Error(
            "Unable to convert theme color",
        );
    }

    return value;
}