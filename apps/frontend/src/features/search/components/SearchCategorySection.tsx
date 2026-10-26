import { useTranslation } from "react-i18next";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import type { SearchCategory, SearchResult } from "../domain/search.types.ts";
import type { SearchProviderState } from "../hooks/useSearchResults.ts";
import { SearchErrorState } from "./SearchErrorState.tsx";
import { SearchResultItem } from "./SearchResultItem.tsx";

interface Props {
  category: SearchCategory;
  state: SearchProviderState;
  onOpen: (result: SearchResult) => void;
  onViewAll?: (category: SearchCategory) => void;
  onRetry: () => void;
}

export function SearchCategorySection({
  category,
  state,
  onOpen,
  onViewAll,
  onRetry,
}: Props) {
  const { t } = useTranslation("search");
  if (!state.results.length && state.status === "success") return null;
  return (
    <Stack component="section" aria-label={t(`categories.${category}`)}>
      <Typography variant="h6">
        {t(`categories.${category}`)}{" "}
        {state.status === "success" ? `(${state.total})` : ""}
      </Typography>

      {state.results.map((result) => (
        <SearchResultItem key={result.key} result={result} onOpen={onOpen} />
      ))}
      {state.status === "loading" && (
        <CircularProgress size={20} aria-label={t("loading")} />
      )}
      {state.status === "error" && <SearchErrorState onRetry={onRetry} />}
      {onViewAll && state.total > 0 && (
        <Button
          size="small"
          sx={{ alignSelf: "flex-start" }}
          onClick={() => onViewAll(category)}
        >
          {t("viewCategory", { count: state.total })}
        </Button>
      )}
    </Stack>
  );
}
