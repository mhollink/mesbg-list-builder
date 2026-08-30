import { useAppDispatch, useAppSelector } from "~/app/store/hooks.ts";
import { closeDrawer } from "~/app/store/uiSlice.ts";

export function useDrawerStack() {
  const dispatch = useAppDispatch();

  const drawers = useAppSelector((state) => state.ui.drawers);

  const activeDrawer = drawers.at(-1);

  return {
    drawers,
    activeDrawer,
    depth: drawers.length,
    canGoBack: drawers.length > 1,
    closeDrawer: () => dispatch(closeDrawer()),
  };
}
