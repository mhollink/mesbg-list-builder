import type { RefCallback } from "react";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import Box from "@mui/material/Box";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";

import type { Rule, RuleRow } from "../rules.types";
import { RULES_TOOLBAR_HEIGHT } from "~/features/reference/rules/hooks/useRulesPage.ts";

interface RuleListRowProps {
  row: RuleRow;
  onOpenRule: (rule: Rule) => void;
  registerLetter: (letter: string) => RefCallback<HTMLElement>;
}

export function RuleListRow({
  row,
  onOpenRule,
  registerLetter,
}: RuleListRowProps) {
  if (row.type === "letter") {
    return (
      <Box
        ref={registerLetter(row.letter)}
        sx={{
          display: "flex",
          alignItems: "center",
          minHeight: 40,
          px: 2,
          bgcolor: "background.default",
          borderBottom: 1,
          borderColor: "divider",
          scrollMarginTop: `${RULES_TOOLBAR_HEIGHT}px`,
        }}
      >
        <Typography
          variant="overline"
          sx={{
            fontWeight: 700,
            color: "primary.main",
          }}
        >
          {row.letter}
        </Typography>
      </Box>
    );
  }

  return (
    <ListItemButton
      onClick={() => onOpenRule(row.rule)}
      sx={{
        minHeight: 52,
        px: 2,
        borderBottom: 1,
        borderColor: "divider",
      }}
    >
      <ListItemText
        primary={row.rule.name}
        slotProps={{
          primary: {
            noWrap: true,
            sx: {
              fontWeight: 500,
            },
          },
        }}
      />

      <ChevronRightRoundedIcon
        fontSize="small"
        sx={{
          ml: 2,
          color: "textSecondary",
        }}
      />
    </ListItemButton>
  );
}
