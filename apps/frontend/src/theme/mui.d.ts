import "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Theme {
    appColors: {
      primary: string;
      secondary: string;
      tertiary: string;
      accent: string;
      highlight: string;
      surfaceSubtle: string;
    };
  }

  interface ThemeOptions {
    appColors?: {
      primary?: string;
      secondary?: string;
      tertiary?: string;
      accent?: string;
      highlight?: string;
      surfaceSubtle?: string;
    };
  }

  interface Palette {
    tertiary: Palette["primary"];
    accent: Palette["primary"];
    highlight: Palette["primary"];
  }

  interface PaletteOptions {
    tertiary?: PaletteOptions["primary"];
    accent?: PaletteOptions["primary"];
    highlight?: PaletteOptions["primary"];
  }
}

declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    tertiary: true;
    accent: true;
    highlight: true;
  }
}

declare module "@mui/material/IconButton" {
  interface IconButtonPropsColorOverrides {
    tertiary: true;
    accent: true;
    highlight: true;
  }
}
