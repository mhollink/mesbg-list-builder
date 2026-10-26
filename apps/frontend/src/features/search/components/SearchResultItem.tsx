import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";

import type { SearchResult } from "../domain/search.types.ts";

interface SearchResultItemProps {
  result: SearchResult;
  onOpen: (result: SearchResult) => void;
}

export function SearchResultItem({ result, onOpen }: SearchResultItemProps) {
  const secondary = [result.subtitle, result.matchDescription]
    .filter(Boolean)
    .join(" · ");

  return (
    <ListItemButton onClick={() => onOpen(result)} sx={{ borderRadius: 1 }}>
      <ListItemText
        primary={result.title}
        secondary={secondary || undefined}
        slotProps={{
          secondary: {
            sx: {
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            },
          },
        }}
      />
    </ListItemButton>
  );
}
