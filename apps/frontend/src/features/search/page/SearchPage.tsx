import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { SearchCategoryFilters } from "../components/SearchCategoryFilters.tsx";
import { SearchField } from "../components/SearchField.tsx";
import { SearchResults } from "../components/SearchResults.tsx";
import { SEARCH_CATEGORIES } from "../domain/search.constants.ts";
import type { SearchCategory } from "../domain/search.types.ts";
import { useSearchNavigation } from "../hooks/useSearchNavigation.ts";
import { useSearchResults } from "../hooks/useSearchResults.ts";

const ACTIVE_CATEGORIES: SearchCategory[] = SEARCH_CATEGORIES.slice(0, 4);

export function SearchPage() {
  const { t } = useTranslation("search");
  const [params, setParams] = useSearchParams();
  const query = params.get("q")?.trim() ?? "";
  const selected = params.get("c") as SearchCategory | null;
  const category =
    selected && ACTIVE_CATEGORIES.includes(selected) ? selected : undefined;
  const search = useSearchResults(query, Number.MAX_SAFE_INTEGER);
  const { openResult } = useSearchNavigation();

  function submit(nextQuery: string) {
    setParams((previous) => {
      const next = new URLSearchParams(previous);
      next.set("q", nextQuery);
      return next;
    });
  }

  function filter(nextCategory?: SearchCategory) {
    setParams((previous) => {
      const next = new URLSearchParams(previous);
      if (nextCategory) next.set("c", nextCategory);
      else next.delete("c");
      return next;
    });
  }

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Stack spacing={3}>
        <Typography component="h1" variant="h4">
          {t("title")}
        </Typography>
        <SearchField query={query} onSubmit={submit} />
        <SearchCategoryFilters selected={category} onChange={filter} />
        {query ? (
          <>
            <Typography color="text.secondary">
              {search.isLoading
                ? t("loading")
                : t("resultCount", { count: search.total })}
            </Typography>
            <SearchResults
              mode="full"
              category={category}
              search={search}
              onOpen={openResult}
            />
          </>
        ) : (
          <Typography color="text.secondary">{t("start")}</Typography>
        )}
      </Stack>
    </Container>
  );
}
