import {clampChroma, converter, formatHex,} from "culori";
import type {BrandColorTokens, ThemeColorTokens,} from "./theme.types.ts";
import {createThemeTokens} from "./createThemeTokens.ts";

const toOklch = converter("oklch");

function normalizeHue(hue: number): number {
    return ((hue % 360) + 360) % 360;
}

function clamp(
    value: number,
    minimum: number,
    maximum: number,
): number {
    return Math.min(maximum, Math.max(minimum, value));
}

function toHex(color: {
    mode: "oklch";
    l: number;
    c: number;
    h: number;
}): string {
    return formatHex(
        clampChroma(color, "oklch"),
    );
}

export function createBrandColors(
    primaryColor: string,
): BrandColorTokens {
    const primary = toOklch(primaryColor);

    if (!primary) {
        throw new Error(
            `Unable to parse primary color: ${primaryColor}`,
        );
    }

    /*
     * Very low-chroma colors such as grey effectively have no hue.
     * Giving them a small minimum chroma produces useful secondary
     * and accent colors.
     */
    const hue = primary.h ?? 250;
    const chroma = Math.max(primary.c ?? 0, 0.08);

    const secondary = {
        mode: "oklch" as const,
        l: clamp(primary.l + 0.04, 0.4, 0.75),
        c: clamp(chroma * 0.8, 0.06, 0.16),
        h: normalizeHue(hue + 50),
    };

    const tertiary = {
        mode: "oklch" as const,
        l: clamp(primary.l - 0.02, 0.35, 0.7),
        c: clamp(chroma * 0.7, 0.05, 0.14),
        h: normalizeHue(hue - 40),
    };

    const accent = {
        mode: "oklch" as const,
        l: clamp(primary.l + 0.08, 0.5, 0.8),
        c: clamp(chroma * 1.15, 0.08, 0.2),
        h: normalizeHue(hue + 150),
    };

    const highlight = {
        mode: "oklch" as const,
        l: clamp(primary.l + 0.12, 0.55, 0.85),
        c: clamp(chroma * 1.3, 0.1, 0.22),
        h: normalizeHue(hue + 210),
    };

    return {
        primary: formatHex(primary),
        secondary: toHex(secondary),
        tertiary: toHex(tertiary),
        accent: toHex(accent),
        highlight: toHex(highlight),
    };
}

export function createCustomThemeColors(
    primaryColor: string,
): ThemeColorTokens {
    return createThemeTokens(createBrandColors(primaryColor))
}
