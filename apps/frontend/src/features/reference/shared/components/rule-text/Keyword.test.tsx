import { render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { Keyword } from "./Keyword.tsx";

vi.mock('@mui/material/Typography', () => ({
  default: ({ component: Component, children, sx, ...props }: any) => {
    const mockTheme = {
      appColors: { highlight: 'mocked-highlight-color' },
    };
    console.log(sx);
    const resolvedSx = typeof sx === 'function' ? sx(mockTheme) : sx;
    return (
        <Component data-sx={JSON.stringify(resolvedSx)} {...props}>
          {children}
        </Component>
    );
  },
}));

describe("Keyword", () => {
  test("renders its content with strong semantics", () => {
    render(<Keyword>Hero</Keyword>);

    expect(screen.getByText("Hero").tagName).toBe("STRONG");
  });
});