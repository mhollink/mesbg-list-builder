import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";

import { ReferenceSearchField } from "./ReferenceSearchField.tsx";

describe("ReferenceSearchField", () => {
  test("renders the current search value and placeholder", () => {
    render(
      <ReferenceSearchField
        search="Aragorn"
        placeholder="Search profiles"
        onSearchChange={vi.fn()}
      />,
    );

    const input = screen.getByRole("textbox");

    expect(input).toHaveValue("Aragorn");
    expect(input).toHaveAttribute("placeholder", "Search profiles");
  });

  test("forwards search changes", () => {
    const onSearchChange = vi.fn();

    render(
      <ReferenceSearchField
        search=""
        placeholder="Search profiles"
        onSearchChange={onSearchChange}
      />,
    );

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "Gandalf" },
    });

    expect(onSearchChange).toHaveBeenCalledOnce();
    expect(onSearchChange).toHaveBeenCalledWith("Gandalf");
  });
});
