import type { ReactElement, ReactNode } from "react";
import { type Theme, ThemeProvider } from "@mui/material/styles";

import {
  type RenderOptions,
  render as rtlRender,
} from "@testing-library/react";

import { applyThemeMode } from "~/theme/applyThemeMode";
import { createAppTheme } from "~/theme/createAppTheme";
import { defaultTheme } from "~/theme/presets/default";

const defaultTestTheme = createAppTheme(
  applyThemeMode(defaultTheme.colors, "light"),
  "light",
);

interface TestRenderOptions extends RenderOptions {
  theme?: Theme;
}

export function render(
  ui: ReactElement,
  {
    theme = defaultTestTheme,
    wrapper: Wrapper,
    ...options
  }: TestRenderOptions = {},
) {
  function Providers({ children }: { children: ReactNode }) {
    return (
      <ThemeProvider theme={theme}>
        {Wrapper ? <Wrapper>{children}</Wrapper> : children}
      </ThemeProvider>
    );
  }

  return rtlRender(ui, {
    ...options,
    wrapper: Providers,
  });
}

export * from "@testing-library/react";
