import { useAppDispatch, useAppSelector } from "~/app/store/hooks.ts";
import { closeRuleDrawer } from "~/app/store/uiSlice.ts";

export function useRuleDrawer() {
  const dispatch = useAppDispatch();

  const rule = useAppSelector((state) => state.ui.selectedRule);

  return {
    rule,
    open: rule !== null,
    close: () => dispatch(closeRuleDrawer()),
  };
}
