import type { ReactNode } from "react";

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import { ProfileProfileRules } from "./ProfileProfileRules.tsx";
import type { ProfileDrawerRule } from "./profile-drawer.types.ts";

vi.mock("~/features/reference/shared/components/rule-text/RuleText", () => ({
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
}));

const rules: ProfileDrawerRule[] = [
  {
    id: "monstrous-charge",
    name: "Monstrous Charge",
    description: "A profile-specific rule.",
    type: "brutal-power-attack",
  },
];

describe("ProfileProfileRules", () => {
  test("renders nothing without profile rules", () => {
    const { container } = render(
      <ProfileProfileRules rules={[]} onOpenRule={vi.fn()} />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  test("renders the rule and formatted type", () => {
    render(<ProfileProfileRules rules={rules} onOpenRule={vi.fn()} />);

    expect(screen.getByText("Profile Rules")).toBeInTheDocument();
    expect(screen.getByText("Monstrous Charge")).toBeInTheDocument();
    expect(screen.getByText("Brutal Power Attack")).toBeInTheDocument();
    expect(screen.getByText("A profile-specific rule.")).toBeInTheDocument();
  });

  test("forwards referenced rule clicks", async () => {
    const user = userEvent.setup();
    const onOpenRule = vi.fn();

    render(<ProfileProfileRules rules={rules} onOpenRule={onOpenRule} />);

    await user.click(
      screen.getByRole("button", { name: "A profile-specific rule." }),
    );

    expect(onOpenRule).toHaveBeenCalledWith("referenced-rule");
  });
});
