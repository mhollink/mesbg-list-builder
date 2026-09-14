import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import { ArmyListSectionDivider } from "./ArmyListSectionDivider.tsx";

describe("ArmyListSectionDivider", () => {
  test("renders the section title between two dividers", () => {
    render(<ArmyListSectionDivider>Army composition</ArmyListSectionDivider>);

    expect(screen.getByText("Army composition")).toBeInTheDocument();
    expect(screen.getAllByRole("separator")).toHaveLength(2);
  });
});
