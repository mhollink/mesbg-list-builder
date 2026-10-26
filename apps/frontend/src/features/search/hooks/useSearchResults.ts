import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { SEARCH_PREVIEW_LIMIT } from "../domain/search.constants.ts";
import type { SearchCategory, SearchResult } from "../domain/search.types.ts";
import { useSearchProviders } from "./useSearchProviders.ts";
import { normalizeSearchText } from "~/utils/normalize.ts";

export interface SearchProviderState {
  status: "loading" | "success" | "error";
  results: SearchResult[];
  total: number;
}

export interface UseSearchResultsResult {
  query: string;
  categories: Partial<Record<SearchCategory, SearchProviderState>>;
  total: number;
  isLoading: boolean;
  hasResults: boolean;
  retry: () => void;
}

interface SearchExecution {
  normalizedQuery: string;
  limit: number;
  providers: Record<string, SearchProviderState>;
}

const emptyState = (): SearchProviderState => ({
  status: "success",
  results: [],
  total: 0,
});

export function useSearchResults(
  query: string,
  limit = SEARCH_PREVIEW_LIMIT,
): UseSearchResultsResult {
  const providers = useSearchProviders();
  const normalizedQuery = normalizeSearchText(query);
  const generation = useRef(0);
  const [revision, setRevision] = useState(0);
  const [execution, setExecution] = useState<SearchExecution>({
    normalizedQuery: "",
    limit,
    providers: {},
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies(revision): Revision intentionally triggers a new search when retrying.
  useEffect(() => {
    const requestId = ++generation.current;
    if (!normalizedQuery) {
      setExecution({ normalizedQuery: "", limit, providers: {} });
      return;
    }

    const loadingEntries = Object.fromEntries(
      providers.map((provider) => [
        provider.id,
        {
          status: "loading",
          results: [],
          total: 0,
        } satisfies SearchProviderState,
      ]),
    );
    setExecution({ normalizedQuery, limit, providers: loadingEntries });

    for (const provider of providers) {
      Promise.resolve()
        .then(() => provider.search({ query, normalizedQuery, limit }))
        .then(({ results, total }) => {
          if (generation.current !== requestId) return;
          setExecution((previous) => ({
            ...previous,
            providers: {
              ...previous.providers,
              [provider.id]: { status: "success", results, total },
            },
          }));
        })
        .catch(() => {
          if (generation.current !== requestId) return;
          setExecution((previous) => ({
            ...previous,
            providers: {
              ...previous.providers,
              [provider.id]: { ...emptyState(), status: "error" },
            },
          }));
        });
    }

    return () => {
      generation.current++;
    };
  }, [normalizedQuery, query, limit, providers, revision]);

  const categories = useMemo(() => {
    const grouped: Partial<Record<SearchCategory, SearchProviderState>> = {};
    if (!normalizedQuery) return grouped;

    const current: Record<string, SearchProviderState> =
      execution.normalizedQuery === normalizedQuery && execution.limit === limit
        ? execution.providers
        : {};

    for (const provider of providers) {
      const state = current[provider.id] ?? {
        ...emptyState(),
        status: "loading" as const,
      };
      const existing = grouped[provider.category] ?? emptyState();
      const distinct = new Map(
        [...existing.results, ...state.results].map((result) => [
          result.key,
          result,
        ]),
      );
      grouped[provider.category] = {
        status:
          existing.status === "error" || state.status === "error"
            ? "error"
            : existing.status === "loading" || state.status === "loading"
              ? "loading"
              : "success",
        results: [...distinct.values()]
          .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
          .slice(0, limit),
        total: existing.total + state.total,
      };
    }

    return grouped;
  }, [execution, normalizedQuery, limit, providers]);

  const states = Object.values(categories);
  const retry = useCallback(() => setRevision((value) => value + 1), []);

  return {
    query,
    categories,
    total: states.reduce((sum, state) => sum + state.total, 0),
    isLoading: states.some((state) => state.status === "loading"),
    hasResults: states.some((state) => state.total > 0),
    retry,
  };
}
