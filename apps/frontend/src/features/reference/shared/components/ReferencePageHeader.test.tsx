import { describe, expect, test } from "vitest";

import { ReferencePageHeader } from "./ReferencePageHeader.tsx";
import { render, screen } from "~/test/render";

describe("ReferencePageHeader", () => {
  test("renders the page title and description", () => {
    render(
      <ReferencePageHeader
        title="Profiles"
        description="Browse all available profiles."
      />,
    );

    expect(
      screen.getByRole("heading", { level: 1, name: "Profiles" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Browse all available profiles."),
    ).toBeInTheDocument();
  });
});
