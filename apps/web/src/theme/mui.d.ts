import "@mui/material/styles";

declare module "@mui/material/styles" {
    interface Theme {
        appColors: {
            accent: string;
            surfaceSubtle: string;
        };
    }

    interface ThemeOptions {
        appColors?: {
            accent?: string;
            surfaceSubtle?: string;
        };
    }
}