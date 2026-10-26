import Stack from "@mui/material/Stack";

import { SEARCH_CATEGORIES } from "../domain/search.constants.ts";
import type { SearchCategory, SearchResult } from "../domain/search.types.ts";
import type { UseSearchResultsResult } from "../hooks/useSearchResults.ts";
import { SearchCategorySection } from "./SearchCategorySection.tsx";
import { SearchEmptyState } from "./SearchEmptyState.tsx";

type SearchDisplayMode = "preview" | "full";
interface Props {
  search: UseSearchResultsResult;
  mode: SearchDisplayMode;
  category?: SearchCategory;
  onOpen: (result: SearchResult) => void;
  onViewAll?: (category: SearchCategory) => void;
}
export function SearchResults({
  search,
  mode,
  category,
  onOpen,
  onViewAll,
}: Props) {
  const selected = category ? [category] : SEARCH_CATEGORIES;
  const visible = selected.filter((id) => search.categories[id]);
  if (
    !search.isLoading &&
    !visible.some((id) => (search.categories[id]?.total ?? 0) > 0) &&
    !visible.some((id) => search.categories[id]?.status === "error")
  )
    return <SearchEmptyState />;
  return (
    <Stack spacing={2}>
      {visible.map((id) => (
        <SearchCategorySection
          key={id}
          category={id}
          state={search.categories[id]!}
          onOpen={onOpen}
          onRetry={() => search.retry()}
          onViewAll={mode === "preview" ? onViewAll : undefined}
        />
      ))}
    </Stack>
  );
}
