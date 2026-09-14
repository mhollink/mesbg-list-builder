import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import { AlphabetTabs } from "./AlphabetTabs.tsx";

describe("AlphabetTabs", () => {
  test("renders the alphabet and marks the active and available letters", () => {
    render(
      <AlphabetTabs
        activeLetter="A"
        availableLetters={new Set(["A", "B"])}
        ariaLabel="Profile index"
        onLetterChange={vi.fn()}
      />,
    );

    expect(screen.getByRole("tablist", { name: "Profile index" })).toBeInTheDocument();
    expect(screen.getAllByRole("tab")).toHaveLength(26);

    expect(screen.getByRole("tab", { name: "A" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByRole("tab", { name: "A" })).toBeEnabled();
    expect(screen.getByRole("tab", { name: "B" })).toBeEnabled();
    expect(screen.getByRole("tab", { name: "C" })).toBeDisabled();
  });

  test("forwards enabled letter changes", async () => {
    const user = userEvent.setup();
    const onLetterChange = vi.fn();

    render(
      <AlphabetTabs
        activeLetter="A"
        availableLetters={new Set(["A", "B"])}
        ariaLabel="Rule index"
        onLetterChange={onLetterChange}
      />,
    );

    await user.click(screen.getByRole("tab", { name: "B" }));

    expect(onLetterChange).toHaveBeenCalledOnce();
    expect(onLetterChange).toHaveBeenCalledWith("B");
  });

  test("disables unavailable letters", () => {
    const onLetterChange = vi.fn();

    render(
        <AlphabetTabs
            activeLetter={false}
            availableLetters={new Set(["A"])}
            ariaLabel="Rule index"
            onLetterChange={onLetterChange}
        />,
    );

    expect(screen.getByRole("tab", { name: "A" })).toBeEnabled();
    expect(screen.getByRole("tab", { name: "B" })).toBeDisabled();

    expect(onLetterChange).not.toHaveBeenCalled();
  });
});
