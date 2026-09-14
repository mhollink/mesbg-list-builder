import type { ReactNode } from "react";

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, test, vi } from "vitest";

import type { Rule } from "../../rules.types.ts";
import { RuleDrawer } from "./RuleDrawer.tsx";

const mocks = vi.hoisted(() => ({
  useRuleDrawer: vi.fn(),
  openRuleDrawer: vi.fn(),
}));

vi.mock("../../hooks/useRuleDrawer.ts", () => ({
  useRuleDrawer: mocks.useRuleDrawer,
}));

vi.mock("~/features/drawer-stack/hooks/useDrawerStack.ts", () => ({
  useDrawerStack: () => ({
    openRuleDrawer: mocks.openRuleDrawer,
  }),
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => `book:${key}`,
  }),
}));

vi.mock("@mui/material/Drawer", () => ({
  default: ({
    open,
    onClose,
    children,
  }: {
    open: boolean;
    onClose: () => void;
    children: ReactNode;
  }) =>
    open ? (
      <div data-testid="rule-drawer">
        <button type="button" onClick={onClose}>
          drawer-close
        </button>
        {children}
      </div>
    ) : null,
}));

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

const rule: Rule = {
  id: "terror",
  name: "Terror",
  description: "Models with Terror cause Fear.",
  category: "special-rule",
  type: "move-phase",
  source: {
    book: "rules-manual",
    page: 42,
  },
};

describe("RuleDrawer", () => {
  beforeEach(() => {
    mocks.useRuleDrawer.mockReset();
    mocks.openRuleDrawer.mockReset();
  });

  test("renders nothing when the drawer is closed", () => {
    mocks.useRuleDrawer.mockReturnValue({
      open: false,
      rule: undefined,
      close: vi.fn(),
      canGoBack: false,
      goBack: vi.fn(),
    });

    render(<RuleDrawer />);

    expect(screen.queryByTestId("rule-drawer")).not.toBeInTheDocument();
  });

  test("renders rule details and source", () => {
    mocks.useRuleDrawer.mockReturnValue({
      open: true,
      rule,
      close: vi.fn(),
      canGoBack: false,
      goBack: vi.fn(),
    });

    render(<RuleDrawer />);

    expect(screen.getByRole("heading", { name: "Terror" })).toBeInTheDocument();
    expect(screen.getByText("Special Rule")).toBeInTheDocument();
    expect(screen.getByText("Move Phase")).toBeInTheDocument();
    expect(
      screen.getByText("Models with Terror cause Fear."),
    ).toBeInTheDocument();
    expect(screen.getByText("book:rules-manual (page 42)")).toBeInTheDocument();
  });

  test("forwards close, back and referenced rule actions", async () => {
    const user = userEvent.setup();
    const close = vi.fn();
    const goBack = vi.fn();

    mocks.useRuleDrawer.mockReturnValue({
      open: true,
      rule,
      close,
      canGoBack: true,
      goBack,
    });

    render(<RuleDrawer />);

    await user.click(
      screen.getByRole("button", { name: "Back to previous item" }),
    );
    await user.click(
      screen.getByRole("button", { name: "Models with Terror cause Fear." }),
    );
    await user.click(
      screen.getByRole("button", { name: "Close rule details" }),
    );

    expect(goBack).toHaveBeenCalledOnce();
    expect(mocks.openRuleDrawer).toHaveBeenCalledWith("referenced-rule");
    expect(close).toHaveBeenCalledOnce();
  });
});
