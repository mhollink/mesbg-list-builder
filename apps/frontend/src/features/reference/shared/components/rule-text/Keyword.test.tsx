import { describe, expect, test } from "vitest";

import { Keyword } from "./Keyword.tsx";
import { render, screen } from "~/test/render";

describe("Keyword", () => {
  test("renders its content with strong semantics", () => {
    render(<Keyword>Hero</Keyword>);

    expect(screen.getByText("Hero").tagName).toBe("STRONG");
  });
});
