import {clampChroma, converter, formatHex,} from "culori";

import {THEME_PRESETS} from "../features/settings/theme/themePresets.ts";
import type {BrandColorTokens, ThemeColorTokens,} from "./theme.types.ts";

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

    const accent = {
        mode: "oklch" as const,
        l: clamp(primary.l + 0.08, 0.5, 0.8),
        c: clamp(chroma * 1.15, 0.08, 0.2),
        h: normalizeHue(hue + 150),
    };

    return {
        primary: formatHex(primary),
        secondary: toHex(secondary),
        accent: toHex(accent),
    };
}

export function createCustomThemeColors(
    primaryColor: string,
): ThemeColorTokens {
    const base = THEME_PRESETS["default"].colors;

    return {
        ...base,

        brand: createBrandColors(primaryColor),
    };
}
