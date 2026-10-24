import { describe, expect, test } from "vitest";

import { ErrataText } from "./ErrataText.tsx";
import { render, screen } from "~/test/render";

describe("ErrataText", () => {
  test("renders the errata wording", () => {
    render(<ErrataText>updated wording</ErrataText>);

    expect(screen.getByText("updated wording")).toBeInTheDocument();
  });
});
