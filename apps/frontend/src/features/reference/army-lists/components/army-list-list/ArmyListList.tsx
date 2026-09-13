import type { RefCallback } from "react";
import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";

import type { ArmyListRow, LocalizedArmyList } from "../../army-lists.types.ts";
import { ArmyListListRow } from "./ArmyListListRow.tsx";

interface ArmyListListProps {
  rows: ArmyListRow[];
  onOpenArmyList: (armyList: LocalizedArmyList) => void;
  registerLetter: (letter: string) => RefCallback<HTMLElement>;
}

export function ArmyListList({
  rows,
  onOpenArmyList,
  registerLetter,
}: ArmyListListProps) {
  const { t } = useTranslation("army-lists");

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
        <ArmyListListRow
          key={row.key}
          row={row}
          onOpenArmyList={onOpenArmyList}
          registerLetter={registerLetter}
        />
      ))}
    </List>
  );
}
