import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import { ProfilesToolbar } from "./ProfilesToolbar.tsx";

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

describe("ProfilesToolbar", () => {
  test("renders the active alignment", () => {
    render(
      <ProfilesToolbar
        activeAlignment="good"
        activeLetter="A"
        search=""
        availableLetters={new Set(["A"])}
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

  test("forwards alignment changes", async () => {
    const user = userEvent.setup();
    const onAlignmentChange = vi.fn();

    render(
      <ProfilesToolbar
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

    expect(onAlignmentChange).toHaveBeenCalledWith("evil");
  });

  test("forwards search and alphabet changes", async () => {
    const user = userEvent.setup();
    const onSearchChange = vi.fn();
    const onLetterChange = vi.fn();

    render(
      <ProfilesToolbar
        activeAlignment="good"
        activeLetter="A"
        search="Aragorn"
        availableLetters={new Set(["A", "B"])}
        onAlignmentChange={vi.fn()}
        onLetterChange={onLetterChange}
        onSearchChange={onSearchChange}
      />,
    );

    const search = screen.getByRole("textbox", { name: "reference-search" });
    expect(search).toHaveValue("Aragorn");
    expect(search).toHaveAttribute("placeholder", "search.placeholder");
    expect(screen.getByTestId("active-letter")).toHaveTextContent("A");

    fireEvent.change(search, { target: { value: "Boromir" } });
    await user.click(screen.getByRole("button", { name: "B" }));

    expect(onSearchChange).toHaveBeenCalledWith("Boromir");
    expect(onLetterChange).toHaveBeenCalledWith("B");
  });
});
