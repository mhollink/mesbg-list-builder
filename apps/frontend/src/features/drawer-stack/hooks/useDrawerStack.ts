import { useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router";

interface OpenDrawer {
  type: "rule" | "profile";
  id: string;
}

export function useDrawerStack() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const drawerStack = searchParams
    .getAll("drawer")
    .map(parseDrawer)
    .filter((drawer): drawer is OpenDrawer => drawer !== undefined);

  const activeDrawer = drawerStack.at(-1);

  const openDrawer = useCallback(
    (drawer: OpenDrawer) => {
      setSearchParams((params) => {
        const next = new URLSearchParams(params);
        next.append("drawer", serializeDrawer(drawer));
        return next;
      });
    },
    [setSearchParams],
  );

  const openRuleDrawer = useCallback(
    (ruleId: string) => {
      openDrawer({ type: "rule", id: ruleId });
    },
    [openDrawer],
  );

  const openProfileDrawer = useCallback(
    (profileId: string) => {
      openDrawer({ type: "profile", id: profileId });
    },
    [openDrawer],
  );

  const goBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const closeDrawer = useCallback(() => {
    setSearchParams((params) => {
      const next = new URLSearchParams(params);
      next.delete("drawer");
      return next;
    });
  }, [setSearchParams]);

  return {
    drawers: drawerStack,
    activeDrawer,
    depth: drawerStack.length,
    canGoBack: drawerStack.length > 1,
    openRuleDrawer,
    openProfileDrawer,
    goBack,
    closeDrawer,
  };
}

function serializeDrawer(drawer: OpenDrawer) {
  return `${drawer.type}.${drawer.id}`;
}

function parseDrawer(value: string): OpenDrawer | undefined {
  const [type, id] = value.split(".");

  if (!id) {
    return undefined;
  }

  if (type === "rule" || type === "profile") {
    return { type, id };
  }

  return undefined;
}
