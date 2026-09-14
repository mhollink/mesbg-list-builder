import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import { RulesToolbar } from "./RulesToolbar.tsx";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock(
  "~/features/reference/shared/components/ReferenceSearchField.tsx",
  () => ({
    ReferenceSearchField: ({
      search,
      onSearchChange,
      placeholder,
    }: {
      search: string;
      onSearchChange: (search: string) => void;
      placeholder: string;
    }) => (
      <input
        aria-label="reference-search"
        value={search}
        placeholder={placeholder}
        onChange={(event) => onSearchChange(event.target.value)}
      />
    ),
  }),
);

vi.mock("~/features/reference/shared/components/AlphabetTabs.tsx", () => ({
  AlphabetTabs: ({
    activeLetter,
    availableLetters,
    onLetterChange,
  }: {
    activeLetter: string | false;
    availableLetters: ReadonlySet<string>;
    onLetterChange: (letter: string) => void;
  }) => (
    <div>
      <span data-testid="active-letter">{activeLetter || "none"}</span>
      {[...availableLetters].map((letter) => (
        <button
          key={letter}
          type="button"
          onClick={() => onLetterChange(letter)}
        >
          {letter}
        </button>
      ))}
    </div>
  ),
}));

describe("RulesToolbar", () => {
  test("renders and marks the active rule type", () => {
    render(
      <RulesToolbar
        activeType="special-rule"
        activeLetter="T"
        search=""
        availableLetters={new Set(["T"])}
        onTypeChange={vi.fn()}
        onLetterChange={vi.fn()}
        onSearchChange={vi.fn()}
      />,
    );

    expect(screen.getByRole("tab", { name: "Special rules" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByRole("tab", { name: "Magical powers" })).toHaveAttribute(
      "aria-selected",
      "false",
    );
  });

  test("forwards rule type changes", async () => {
    const user = userEvent.setup();
    const onTypeChange = vi.fn();

    render(
      <RulesToolbar
        activeType="special-rule"
        activeLetter={false}
        search=""
        availableLetters={new Set()}
        onTypeChange={onTypeChange}
        onLetterChange={vi.fn()}
        onSearchChange={vi.fn()}
      />,
    );

    await user.click(screen.getByRole("tab", { name: "Magical powers" }));

    expect(onTypeChange).toHaveBeenCalledWith("magical-power");
  });

  test("forwards search and alphabet changes", async () => {
    const user = userEvent.setup();
    const onSearchChange = vi.fn();
    const onLetterChange = vi.fn();

    render(
      <RulesToolbar
        activeType="special-rule"
        activeLetter="T"
        search="Terror"
        availableLetters={new Set(["S", "T"])}
        onTypeChange={vi.fn()}
        onLetterChange={onLetterChange}
        onSearchChange={onSearchChange}
      />,
    );

    const search = screen.getByRole("textbox", { name: "reference-search" });
    expect(search).toHaveValue("Terror");
    expect(search).toHaveAttribute("placeholder", "search.placeholder");
    expect(screen.getByTestId("active-letter")).toHaveTextContent("T");

    fireEvent.change(search, { target: { value: "Strike" } });
    await user.click(screen.getByRole("button", { name: "S" }));

    expect(onSearchChange).toHaveBeenCalledWith("Strike");
    expect(onLetterChange).toHaveBeenCalledWith("S");
  });
});
