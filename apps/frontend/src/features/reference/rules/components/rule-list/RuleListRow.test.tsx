import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import type { Rule, RuleRow } from "../../rules.types.ts";
import { RuleListRow } from "./RuleListRow.tsx";

const rule: Rule = {
  id: "terror",
  name: "Terror",
  description: "A terrifying rule.",
  category: "special-rule",
  source: {
    book: "rules-manual",
    page: 42,
  },
};

describe("RuleListRow", () => {
  test("renders and registers a letter row", () => {
    const refCallback = vi.fn();
    const registerLetter = vi.fn(() => refCallback);

    const row: RuleRow = {
      key: "letter:T",
      type: "letter",
      letter: "T",
    };

    render(
      <RuleListRow
        row={row}
        onOpenRule={vi.fn()}
        registerLetter={registerLetter}
      />,
    );

    expect(screen.getByText("T")).toBeInTheDocument();
    expect(registerLetter).toHaveBeenCalledWith("T");
    expect(refCallback).toHaveBeenCalled();
  });

  test("renders and opens a rule row", async () => {
    const user = userEvent.setup();
    const onOpenRule = vi.fn();

    const row: RuleRow = {
      key: "rule:terror",
      type: "rule",
      letter: "T",
      rule,
    };

    render(
      <RuleListRow
        row={row}
        onOpenRule={onOpenRule}
        registerLetter={vi.fn()}
      />,
    );

    expect(screen.getByText("Terror")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /terror/i }));

    expect(onOpenRule).toHaveBeenCalledOnce();
    expect(onOpenRule).toHaveBeenCalledWith(rule);
  });
});
