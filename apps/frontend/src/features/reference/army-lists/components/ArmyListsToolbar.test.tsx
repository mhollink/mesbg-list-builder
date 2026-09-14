import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import { ArmyListsToolbar } from "./ArmyListsToolbar.tsx";

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

describe("ArmyListsToolbar", () => {
  test("renders the active alignment", () => {
    render(
      <ArmyListsToolbar
        activeAlignment="good"
        activeLetter="M"
        search=""
        availableLetters={new Set(["A", "M"])}
        onAlignmentChange={vi.fn()}
        onLetterChange={vi.fn()}
        onSearchChange={vi.fn()}
      />,
    );

    expect(screen.getByRole("tab", { name: "alignment.good" })).toHaveAttribute(
      "aria-selected",
      "true",
    );

    expect(screen.getByRole("tab", { name: "alignment.evil" })).toHaveAttribute(
      "aria-selected",
      "false",
    );
  });

  test("changes the alignment", async () => {
    const user = userEvent.setup();
    const onAlignmentChange = vi.fn();

    render(
      <ArmyListsToolbar
        activeAlignment="good"
        activeLetter={false}
        search=""
        availableLetters={new Set()}
        onAlignmentChange={onAlignmentChange}
        onLetterChange={vi.fn()}
        onSearchChange={vi.fn()}
      />,
    );

    await user.click(screen.getByRole("tab", { name: "alignment.evil" }));

    expect(onAlignmentChange).toHaveBeenCalledOnce();
    expect(onAlignmentChange).toHaveBeenCalledWith("evil");
  });

  test("passes search state and changes through to the search field", async () => {
    const user = userEvent.setup();
    const onSearchChange = vi.fn();

    render(
      <ArmyListsToolbar
        activeAlignment="good"
        activeLetter={false}
        search="Minas"
        availableLetters={new Set()}
        onAlignmentChange={vi.fn()}
        onLetterChange={vi.fn()}
        onSearchChange={onSearchChange}
      />,
    );

    const search = screen.getByRole("textbox", {
      name: "reference-search",
    });

    expect(search).toHaveValue("Minas");
    expect(search).toHaveAttribute("placeholder", "search.placeholder");

    await user.type(search, " Tirith");

    expect(onSearchChange).toHaveBeenCalled();
  });

  test("passes alphabet state and changes through to the alphabet tabs", async () => {
    const user = userEvent.setup();
    const onLetterChange = vi.fn();

    render(
      <ArmyListsToolbar
        activeAlignment="good"
        activeLetter="M"
        search=""
        availableLetters={new Set(["A", "M"])}
        onAlignmentChange={vi.fn()}
        onLetterChange={onLetterChange}
        onSearchChange={vi.fn()}
      />,
    );

    expect(screen.getByTestId("active-letter")).toHaveTextContent("M");

    await user.click(screen.getByRole("button", { name: "A" }));

    expect(onLetterChange).toHaveBeenCalledOnce();
    expect(onLetterChange).toHaveBeenCalledWith("A");
  });
});
