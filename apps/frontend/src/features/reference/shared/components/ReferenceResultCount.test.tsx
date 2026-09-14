import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import { ReferenceResultCount } from "./ReferenceResultCount.tsx";

describe("ReferenceResultCount", () => {
  test("uses the singular label for one result", () => {
    render(
      <ReferenceResultCount
        count={1}
        resultLabel="profile"
        resultsLabel="profiles"
      />,
    );

    expect(screen.getByText("1 profile")).toBeInTheDocument();
  });

  test("uses the plural label for multiple results", () => {
    render(
      <ReferenceResultCount
        count={42}
        resultLabel="profile"
        resultsLabel="profiles"
      />,
    );

    expect(screen.getByText("42 profiles")).toBeInTheDocument();
  });

  test("uses the plural label for zero results", () => {
    render(
      <ReferenceResultCount
        count={0}
        resultLabel="rule"
        resultsLabel="rules"
      />,
    );

    expect(screen.getByText("0 rules")).toBeInTheDocument();
  });
});
