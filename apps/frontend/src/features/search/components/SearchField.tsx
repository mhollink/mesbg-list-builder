import { type FormEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import SearchIcon from "@mui/icons-material/Search";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";

interface Props {
  query: string;
  onSubmit: (query: string) => void;
}
export function SearchField({ query, onSubmit }: Props) {
  const [draft, setDraft] = useState(query);
  const { t } = useTranslation("search");
  useEffect(() => setDraft(query), [query]);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (draft.trim()) onSubmit(draft.trim());
  }
  return (
    <Box
      component="form"
      onSubmit={submit}
      sx={{ display: "flex", gap: 1, alignItems: "center" }}
    >
      <TextField
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        fullWidth
        size="small"
        placeholder={t("placeholder")}
        aria-label={t("placeholder")}
      />
      <IconButton
        type="submit"
        aria-label={t("submit")}
        disabled={!draft.trim()}
      >
        <SearchIcon />
      </IconButton>
    </Box>
  );
}
