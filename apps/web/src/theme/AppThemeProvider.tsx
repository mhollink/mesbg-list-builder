import CssBaseline from "@mui/material/CssBaseline";
import {ThemeProvider} from "@mui/material/styles";
import {type PropsWithChildren, useMemo,} from "react";

import {useAppSelector} from "../app/hooks";
import {createAppTheme} from "./createAppTheme";
import {resolveThemeColors} from "./createCustomTheme";

export function AppThemeProvider({
                                     children,
                                 }: PropsWithChildren) {
    const themeState = useAppSelector(
        (state) => state.theme,
    );

    const theme = useMemo(() => {
        const colors = resolveThemeColors(themeState);

        return createAppTheme(colors);
    }, [themeState]);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            {children}
        </ThemeProvider>
    );
}