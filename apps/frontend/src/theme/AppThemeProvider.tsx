import { type PropsWithChildren, useMemo } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import { useAppSelector } from "../app/store/hooks.ts";
import { applyThemeMode } from "./applyThemeMode";
import { createAppTheme } from "./createAppTheme";
import { resolveThemeColors } from "./resolveThemeColors.ts";

export function AppThemeProvider({ children }: PropsWithChildren) {
  const themeState = useAppSelector((state) => state.theme);
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const mode = useMemo(() => {
    return themeState.mode === "system"
      ? prefersDarkMode
        ? "dark"
        : "light"
      : themeState.mode;
  }, [themeState.mode, prefersDarkMode]);

  const theme = useMemo(() => {
    const baseColors = resolveThemeColors(themeState.selection);
    const colors = applyThemeMode(baseColors, mode);

    return createAppTheme(colors, mode);
  }, [themeState.selection, mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
