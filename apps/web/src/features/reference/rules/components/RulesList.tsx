import type { RefCallback } from "react";
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
          No rules found
        </Typography>

        <Typography
          color="textSecondary"
          sx={{
            mt: 0.5,
          }}
        >
          Try a different search term.
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
