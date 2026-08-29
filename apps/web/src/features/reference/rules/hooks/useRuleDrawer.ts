import { useDrawerStack } from "~/features/reference/hooks/useDrawerStack.ts";
import { useGameRules } from "~/features/reference/rules/hooks/useGameRules.ts";

export function useRuleDrawer() {
  const { rules } = useGameRules();

  const { activeDrawer, canGoBack, goBack, closeDrawer } = useDrawerStack();

  const rule =
    activeDrawer?.type === "rule"
      ? rules.find((rule) => rule.id === activeDrawer.id)
      : undefined;

  return {
    open: rule !== undefined,
    rule,
    canGoBack,
    goBack,
    close: closeDrawer,
  };
}
