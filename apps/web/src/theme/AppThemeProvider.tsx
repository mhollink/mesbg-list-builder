import CssBaseline from "@mui/material/CssBaseline";
import useMediaQuery from "@mui/material/useMediaQuery";
import {
    ThemeProvider,
    type PaletteMode,
} from "@mui/material/styles";
import {
    type PropsWithChildren,
    useMemo,
} from "react";

import { useAppSelector } from "../app/hooks";
import { createAppTheme } from "./createAppTheme";
import { applyThemeMode } from "./applyThemeMode";
import {resolveThemeColors} from "./resolveThemeColors.ts";

export function AppThemeProvider({
                                     children,
                                 }: PropsWithChildren) {
    const themeState = useAppSelector((state) => state.theme,);
    const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)",);
    const mode: PaletteMode =
        themeState.mode === "system"
            ? prefersDarkMode ? "dark" : "light"
            : themeState.mode;

    const theme = useMemo(() => {
        const baseColors = resolveThemeColors(themeState.selection,);
        const colors = applyThemeMode(baseColors, mode,);

        return createAppTheme(colors, mode);
    }, [themeState.selection]);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
        </ThemeProvider>
    );
}