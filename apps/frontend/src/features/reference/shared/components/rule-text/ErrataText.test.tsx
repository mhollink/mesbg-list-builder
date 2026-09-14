import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import { ErrataText } from "./ErrataText.tsx";

describe("ErrataText", () => {
  test("renders the errata wording", () => {
    render(<ErrataText>updated wording</ErrataText>);

    expect(screen.getByText("updated wording")).toBeInTheDocument();
  });
});
