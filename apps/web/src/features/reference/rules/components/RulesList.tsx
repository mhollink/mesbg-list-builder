import type { RefCallback } from "react";
import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";

import type { Rule, RuleRow } from "../rules.types";
import { RuleListRow } from "./RuleListRow";

interface RulesListProps {
  rows: RuleRow[];
  onOpenRule: (rule: Rule) => void;
  registerLetter: (letter: string) => RefCallback<HTMLElement>;
}

export function RulesList({
  rows,
  onOpenRule,
  registerLetter,
}: RulesListProps) {
  const { t } = useTranslation("rules");
  if (rows.length === 0) {
    return (
      <Box
        sx={{
          py: 8,
          textAlign: "center",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
          }}
        >
          {t("search.noResults")}
        </Typography>

        <Typography
          color="textSecondary"
          sx={{
            mt: 0.5,
          }}
        >
          {t("search.noResultsHelper")}
        </Typography>
      </Box>
    );
  }

  return (
    <List disablePadding>
      {rows.map((row) => (
        <RuleListRow
          key={row.key}
          row={row}
          onOpenRule={onOpenRule}
          registerLetter={registerLetter}
        />
      ))}
    </List>
  );
}
