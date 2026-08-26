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
}