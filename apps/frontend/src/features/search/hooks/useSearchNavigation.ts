import { useCallback } from "react";
import { useNavigate } from "react-router";

import type { SearchCategory, SearchResult } from "../domain/search.types.ts";
import { useDrawerStack } from "~/features/drawer-stack/hooks/useDrawerStack.ts";
export function searchPageUrl(
  query: string,
  category?: SearchCategory,
): string {
  const params = new URLSearchParams({ q: query });
  if (category) params.set("c", category);
  return `/search?${params.toString()}`;
}
export function useSearchNavigation() {
  const navigate = useNavigate();
  const { openProfileDrawer, openRuleDrawer } = useDrawerStack();
  const openResult = useCallback(
    (result: SearchResult) => {
      if (result.target.type === "route") {
        navigate(result.target.path);
        return;
      }
      if (result.target.drawer === "profile")
        openProfileDrawer(result.target.id);
      else openRuleDrawer(result.target.id);
    },
    [navigate, openProfileDrawer, openRuleDrawer],
  );
  const openSearchPage = useCallback(
    (query: string, category?: SearchCategory) => {
      navigate(searchPageUrl(query, category));
    },
    [navigate],
  );
  return { openResult, openSearchPage };
}
