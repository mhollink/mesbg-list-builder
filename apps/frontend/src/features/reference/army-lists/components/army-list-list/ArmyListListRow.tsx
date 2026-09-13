import type { RefCallback } from "react";
import { useTranslation } from "react-i18next";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import Box from "@mui/material/Box";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";

import type { ArmyListRow, LocalizedArmyList } from "../../army-lists.types.ts";
import { ARMY_LISTS_TOOLBAR_HEIGHT } from "../../hooks/useArmyListsPage.ts";

interface ArmyListListRowProps {
  row: ArmyListRow;
  onOpenArmyList: (armyList: LocalizedArmyList) => void;
  registerLetter: (letter: string) => RefCallback<HTMLElement>;
}

export function ArmyListListRow({
  row,
  onOpenArmyList,
  registerLetter,
}: ArmyListListRowProps) {
  const { t } = useTranslation("army-lists");

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
          scrollMarginTop: `${ARMY_LISTS_TOOLBAR_HEIGHT}px`,
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

  const profileCount = row.armyList.profiles.length;
  const ruleCount =
    row.armyList.specialRules.length + row.armyList.additionalRules.length;

  return (
    <ListItemButton
      onClick={() => onOpenArmyList(row.armyList)}
      sx={{
        minHeight: 60,
        px: 2,
        borderBottom: 1,
        borderColor: "divider",
      }}
    >
      <ListItemText
        primary={row.armyList.name}
        secondary={`${row.armyList.sourceName} · p. ${row.armyList.source.page}`}
        slotProps={{
          primary: {
            sx: {
              fontWeight: 500,
            },
          },
          secondary: {
            sx: {
              color: "text.muted",
            },
          },
        }}
      />

      <Typography
        variant="body2"
        color="textSecondary"
        sx={{
          ml: 2,
          whiteSpace: "nowrap",
          display: {
            xs: "none",
            sm: "block",
          },
        }}
      >
        {t("list.summary", {
          profiles: profileCount,
          rules: ruleCount,
        })}
      </Typography>

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
