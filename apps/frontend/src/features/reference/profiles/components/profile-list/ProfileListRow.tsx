import type { RefCallback } from "react";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import Box from "@mui/material/Box";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";

import type {
  LocalizedProfile,
  ProfileRow,
} from "~/features/reference/profiles/profiles.types.ts";
import { RULES_TOOLBAR_HEIGHT } from "~/features/reference/rules/hooks/useRulesPage.ts";

interface RuleListRowProps {
  row: ProfileRow;
  onOpenProfile: (profile: LocalizedProfile) => void;
  registerLetter: (letter: string) => RefCallback<HTMLElement>;
}

export function ProfileListRow({
  row,
  onOpenProfile,
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
      onClick={() => onOpenProfile(row.profile)}
      sx={{
        minHeight: 52,
        px: 2,
        borderBottom: 1,
        borderColor: "divider",
      }}
    >
      <ListItemText
        primary={row.profile.name}
        secondary={row.profile.originName}
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

      {row.profile.points !== undefined && (
        <Typography
          variant="body2"
          color="textSecondary"
          sx={{ ml: 2, whiteSpace: "nowrap" }}
        >
          {row.profile.points} pts
        </Typography>
      )}

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
