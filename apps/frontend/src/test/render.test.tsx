import { useTheme } from "@mui/material/styles";

import { expect, test } from "vitest";

import { render, screen } from "~/test/render";

function ThemeProbe() {
  const theme = useTheme();

  return (
    <output data-testid="theme-accent">{theme.palette.accent.main}</output>
  );
}

test("provides the application theme", () => {
  render(<ThemeProbe />);

  expect(screen.getByTestId("theme-accent")).toHaveTextContent(
    /^#[0-9a-f]{6}$/i,
  );
});
