export type ThemeMode = "light" | "dark" | "system";

export type ThemePresetId =
  | "default"
  | "gondor"
  | "mordor"
  | "angmar"
  | "harad"
  | "rohan"
  | "lothlorien"
  | "isengard"
  | "tabletop-alliance"
  | "gondor-calls-for-ale"
  | "conquest-creations"
  | "amethyst";

export type ThemePresetCategory =
  | "default"
  | "middle-earth"
  | "creator"
  | "patreon";

export type ColorVisionMode =
  | "standard"
  | "protanopia"
  | "deuteranopia"
  | "tritanopia"
  | "high-contrast";

export interface BrandColorTokens {
  primary: string;
  secondary: string;
  tertiary: string;
  accent: string;
  highlight: string;
}

export interface SurfaceColorTokens {
  background: string;
  paper: string;
  subtle: string;
}

export interface TextColorTokens {
  primary: string;
  secondary: string;
}

export interface SemanticColorTokens {
  success: string;
  warning: string;
  error: string;
  info: string;
}

export interface ThemeColorTokens {
  brand: BrandColorTokens;
  surface: SurfaceColorTokens;
  text: TextColorTokens;
  semantic: SemanticColorTokens;
  divider: string;
}

export interface ThemePreset {
  id: ThemePresetId;
  name: string;
  description?: string;
  category: ThemePresetCategory;
  colors: ThemeColorTokens;
  creator?: {
    name: string;
  };
}

export type ThemeSelection =
  | { type: "preset"; preset: ThemePresetId }
  | { type: "custom"; primaryColor: string };

export interface ThemeState {
  selection: ThemeSelection;
  colorVisionMode: ColorVisionMode;
  mode: ThemeMode;
}
