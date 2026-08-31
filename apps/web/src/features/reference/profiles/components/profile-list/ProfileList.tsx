import type { RefCallback } from "react";
import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";

import { ProfileListRow } from "~/features/reference/profiles/components/profile-list/ProfileListRow.tsx";
import type {
  LocalizedProfile,
  ProfileRow,
} from "~/features/reference/profiles/profiles.types.ts";

interface RulesListProps {
  rows: ProfileRow[];
  onOpenProfile: (profile: LocalizedProfile) => void;
  registerLetter: (letter: string) => RefCallback<HTMLElement>;
}

export function ProfileList({
  rows,
  onOpenProfile,
  registerLetter,
}: RulesListProps) {
  const { t } = useTranslation("profiles");
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
        <ProfileListRow
          key={row.key}
          row={row}
          onOpenProfile={onOpenProfile}
          registerLetter={registerLetter}
        />
      ))}
    </List>
  );
}
