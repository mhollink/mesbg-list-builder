import { render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";

import type { Rule, RuleRow } from "../../rules.types.ts";
import { RulesList } from "./RulesList.tsx";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock("./RuleListRow.tsx", () => ({
  RuleListRow: ({ row }: { row: RuleRow }) => (
    <div data-testid="rule-row">{row.key}</div>
  ),
}));

const rows: RuleRow[] = [
  {
    key: "letter:T",
    type: "letter",
    letter: "T",
  },
  {
    key: "rule:terror",
    type: "rule",
    letter: "T",
    rule: {
      id: "terror",
      name: "Terror",
    } as Rule,
  },
];

describe("RulesList", () => {
  test("renders the empty state when there are no rows", () => {
    render(
      <RulesList rows={[]} onOpenRule={vi.fn()} registerLetter={vi.fn()} />,
    );

    expect(screen.getByText("search.noResults")).toBeInTheDocument();
    expect(screen.getByText("search.noResultsHelper")).toBeInTheDocument();
  });

  test("renders each row", () => {
    render(
      <RulesList rows={rows} onOpenRule={vi.fn()} registerLetter={vi.fn()} />,
    );

    expect(screen.getAllByTestId("rule-row")).toHaveLength(2);
    expect(screen.getByText("letter:T")).toBeInTheDocument();
    expect(screen.getByText("rule:terror")).toBeInTheDocument();
    expect(screen.queryByText("search.noResults")).not.toBeInTheDocument();
  });
});
