import { useAppDispatch } from "~/app/store/hooks.ts";
import { openRuleDrawer } from "~/app/store/uiSlice.ts";
import { useDrawerStack } from "~/features/reference/hooks/useDrawerStack.ts";
import { useGameRules } from "~/features/reference/rules/hooks/useGameRules.ts";

export function useRuleDrawer() {
  const dispatch = useAppDispatch();
  const { rules } = useGameRules();

  const { activeDrawer, canGoBack, closeDrawer } = useDrawerStack();

  const rule =
    activeDrawer?.type === "rule"
      ? rules.find((rule) => rule.id === activeDrawer.id)
      : undefined;

  return {
    open: rule !== undefined,
    rule,
    canGoBack,
    close: closeDrawer,
    openRule: (id: string) => dispatch(openRuleDrawer(id)),
  };
}
