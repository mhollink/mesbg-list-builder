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




