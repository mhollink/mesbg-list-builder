import { describe, expect, it } from "vitest";

import {
  type CommunityThemeDraft,
  generateThemeSource,
  getThemeSlug,
  isHexColor,
  isValidCommunityTheme,
} from "./community-theme.utils.ts";

const draft: CommunityThemeDraft = {
  name: "Éomer's Banner",
  author: 'A "Community" Member',
  description: "Golden riders of Rohan",
  colors: {
    primary: "#567A3E",
    secondary: "#9A713F",
    tertiary: "#D4B85A",
    accent: "#3E7892",
    highlight: "#A84B37",
  },
};

describe("community theme export", () => {
  it("accepts only six-digit hexadecimal colors", () => {
    expect(isHexColor("#aAbB09")).toBe(true);
    expect(isHexColor("#fff")).toBe(false);
    expect(isHexColor("not-a-color")).toBe(false);
  });

  it("creates stable, safe theme identifiers", () => {
    expect(getThemeSlug("Éomer's Banner")).toBe("community-eomers-banner");
    expect(getThemeSlug("!!!")).toBe("community-theme");
  });

  it("exports a typed preset using the existing factory", () => {
    const source = generateThemeSource(draft);
    expect(source).toContain('id: "community-eomers-banner"');
    expect(source).toContain('name: "Éomer\'s Banner"');
    expect(source).toContain('name: "A \\"Community\\" Member"');
    expect(source).toContain('category: "patreon"');
    expect(source).toContain('primary: "#567A3E"');
    expect(source).toContain(
      'import { createThemeTokens } from "../../createThemeTokens.ts";',
    );
    expect(source).toContain(
      "export const communityEomersBannerTheme: ThemePreset",
    );
  });

  it("rejects invalid colors and blank contributor names", () => {
    expect(isValidCommunityTheme({ ...draft, author: "   " })).toBe(false);
    expect(
      isValidCommunityTheme({
        ...draft,
        colors: { ...draft.colors, accent: "#xyzxyz" },
      }),
    ).toBe(false);
    expect(() => generateThemeSource({ ...draft, name: "  " })).toThrow(
      "Theme details and colors must be valid",
    );
  });
});
