import type { ReactNode } from "react";

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import type { LocalizedArmyListRule } from "../../army-lists.types.ts";
import { ArmyListRules } from "./ArmyListRules.tsx";

vi.mock(
  "~/features/reference/shared/components/rule-text/RuleText.tsx",
  () => ({
    RuleText: ({
      children,
      onRuleClick,
    }: {
      children: ReactNode;
      onRuleClick: (ruleId: string) => void;
    }) => (
      <button type="button" onClick={() => onRuleClick("referenced-rule")}>
        {children}
      </button>
    ),
  }),
);

const shieldwallRule: LocalizedArmyListRule = {
  id: "shieldwall",
  name: "Shieldwall",
  description: "Models gain additional Defence.",
};

const armyBonusRule: LocalizedArmyListRule = {
  id: "army-bonus",
  name: "Army Bonus",
  description: "Models receive an additional bonus.",
};

const rules = [shieldwallRule, armyBonusRule];

describe("ArmyListRules", () => {
  test("renders the rule names and descriptions", () => {
    render(<ArmyListRules rules={rules} onOpenRule={vi.fn()} />);

    expect(
      screen.getByRole("heading", { name: "Shieldwall" }),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Models gain additional Defence."),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", { name: "Army Bonus" }),
    ).toBeInTheDocument();
  });

  test("forwards referenced rule clicks", async () => {
    const user = userEvent.setup();
    const onOpenRule = vi.fn();

    render(<ArmyListRules rules={[shieldwallRule]} onOpenRule={onOpenRule} />);

    await user.click(
      screen.getByRole("button", {
        name: "Models gain additional Defence.",
      }),
    );

    expect(onOpenRule).toHaveBeenCalledWith("referenced-rule");
  });

  test("renders rules as list items when requested", () => {
    render(<ArmyListRules rules={rules} onOpenRule={vi.fn()} display="list" />);

    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });
});
