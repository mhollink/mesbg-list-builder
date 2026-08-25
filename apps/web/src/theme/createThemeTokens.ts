import {
    clampChroma,
    converter,
    formatHex,
    type Oklch,
} from "culori";

import type {
    BrandColorTokens,
    SemanticColorTokens,
    ThemeColorTokens,
} from "./theme.types";

const toOklch = converter("oklch");

const DEFAULT_SEMANTIC_COLORS: SemanticColorTokens = {
    success: "#2E7D32",
    warning: "#ED6C02",
    error: "#D32F2F",
    info: "#0288D1",
};

export interface CreateThemeTokensOptions {
    primary: string;
    secondary: string;
    accent: string;

    semantic?: Partial<SemanticColorTokens>;
}

export function createThemeTokens({
                                      primary,
                                      secondary,
                                      accent,
                                      semantic,
                                  }: CreateThemeTokensOptions): ThemeColorTokens {
    const primaryColor = parseOklch(primary);

    const brand: BrandColorTokens = {
        primary: normalizeColor(primary),
        secondary: normalizeColor(secondary),
        accent: normalizeColor(accent),
    };

    return {
        brand,

        surface: {
            background: createNeutral(primaryColor, {
                lightness: 0.975,
                chroma: 0.008,
            }),

            paper: createNeutral(primaryColor, {
                lightness: 0.995,
                chroma: 0.004,
            }),

            subtle: createNeutral(primaryColor, {
                lightness: 0.93,
                chroma: 0.015,
            }),
        },

        text: {
            primary: createNeutral(primaryColor, {
                lightness: 0.22,
                chroma: 0.018,
            }),

            secondary: createNeutral(primaryColor, {
                lightness: 0.45,
                chroma: 0.018,
            }),
        },

        semantic: {
            ...DEFAULT_SEMANTIC_COLORS,
            ...semantic,
        },

        divider: createNeutral(primaryColor, {
            lightness: 0.84,
            chroma: 0.012,
        }),
    };
}

interface NeutralOptions {
    lightness: number;
    chroma: number;
}

function createNeutral(
    source: Oklch,
    {
        lightness,
        chroma,
    }: NeutralOptions,
): string {
    return toHex({
        mode: "oklch",
        l: lightness,

        // Do not make "neutral" surfaces as colorful as the brand.
        // The source chroma merely gives them a subtle brand tint.
        c: Math.min(source.c ?? 0, chroma),

        h: source.h,
    });
}

function normalizeColor(color: string): string {
    return toHex(parseOklch(color));
}

function parseOklch(color: string): Oklch {
    const parsed = toOklch(color);

    if (!parsed) {
        throw new Error(`Invalid theme color: ${color}`);
    }

    return parsed;
}

function toHex(color: Oklch): string {
    const hex = formatHex(
        clampChroma(color, "oklch"),
    );

    if (!hex) {
        throw new Error("Unable to convert theme color to sRGB");
    }

    return hex;
}