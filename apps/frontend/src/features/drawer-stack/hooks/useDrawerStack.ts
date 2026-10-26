import { useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router";

type OpenDrawer = { type: "search" } | { type: "rule" | "profile"; id: string };

export function useDrawerStack() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const drawerStack = searchParams
    .getAll("drawer")
    .map(parseDrawer)
    .filter((drawer): drawer is OpenDrawer => drawer !== undefined);

  const activeDrawer = drawerStack.at(-1);
  const isSearchOpen = activeDrawer?.type === "search";

  const openDrawer = useCallback(
    (drawer: OpenDrawer) => {
      setSearchParams(
        (params) => {
          const next = new URLSearchParams(params);
          next.append("drawer", serializeDrawer(drawer));
          return next;
        },
        { preventScrollReset: true },
      );
    },
    [setSearchParams],
  );

  const openRuleDrawer = useCallback(
    (ruleId: string) => openDrawer({ type: "rule", id: ruleId }),
    [openDrawer],
  );

  const openProfileDrawer = useCallback(
    (profileId: string) => openDrawer({ type: "profile", id: profileId }),
    [openDrawer],
  );

  const openSearchDrawer = useCallback(
    (query: string) => {
      const trimmed = query.trim();
      if (!trimmed) return;

      // Resubmitting from the search drawer replaces the URL entry.
      // Opening search from another drawer starts a new stack.
      const replace = isSearchOpen;
      setSearchParams(
        (params) => {
          const next = new URLSearchParams(params);
          if (!replace) {
            next.delete("drawer");
            next.append("drawer", "search");
          }
          next.set("lookup", trimmed);
          return next;
        },
        { preventScrollReset: true, replace },
      );
    },
    [isSearchOpen, setSearchParams],
  );

  const goBack = useCallback(() => navigate(-1), [navigate]);

  const closeDrawer = useCallback(() => {
    setSearchParams(
      (params) => {
        const next = new URLSearchParams(params);
        next.delete("drawer");
        next.delete("lookup");
        return next;
      },
      { preventScrollReset: true },
    );
  }, [setSearchParams]);

  return {
    drawers: drawerStack,
    activeDrawer,
    depth: drawerStack.length,
    canGoBack: drawerStack.length > 1,
    openRuleDrawer,
    openProfileDrawer,
    openSearchDrawer,
    goBack,
    closeDrawer,
  };
}

function serializeDrawer(drawer: OpenDrawer): string {
  return drawer.type === "search" ? "search" : `${drawer.type}.${drawer.id}`;
}

function parseDrawer(value: string): OpenDrawer | undefined {
  if (value === "search") return { type: "search" };

  const [type, id] = value.split(".");
  if ((type === "rule" || type === "profile") && id) {
    return { type, id };
  }
  return undefined;
}
