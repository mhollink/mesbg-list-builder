import { useTranslation } from "react-i18next";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";

import { SEARCH_CATEGORIES } from "../domain/search.constants.ts";
import type { SearchCategory } from "../domain/search.types.ts";

interface Props {
  selected?: SearchCategory;
  onChange: (category?: SearchCategory) => void;
}
export function SearchCategoryFilters({ selected, onChange }: Props) {
  const { t } = useTranslation("search");
  return (
    <Stack direction="row" useFlexGap spacing={1} sx={{ flexWrap: "wrap" }}>
      <Chip
        label={t("all")}
        color={!selected ? "primary" : "default"}
        onClick={() => onChange(undefined)}
      />
      {SEARCH_CATEGORIES.slice(0, 4).map((category) => (
        <Chip
          key={category}
          label={t(`categories.${category}`)}
          color={selected === category ? "primary" : "default"}
          onClick={() => onChange(category)}
        />
      ))}
    </Stack>
  );
}
