import { useTranslation } from "react-i18next";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import type { LocalizedProfile } from "~/features/reference/profiles/profiles.types.ts";

interface SelectedProfilesProps {
  profiles: LocalizedProfile[];
  maximumProfiles: number;
  onRemove: (profileId: string) => void;
  onClear: () => void;
}

export function SelectedProfiles({
  profiles,
  maximumProfiles,
  onRemove,
  onClear,
}: SelectedProfilesProps) {
  const { t } = useTranslation("army-list-finder");

  if (profiles.length === 0) {
    return null;
  }

  return (
    <Stack spacing={1}>
      <Stack
        direction="row"
        sx={{
          maxWidth: 720,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="subtitle2">
          {t("selectedProfiles.title")} ({profiles.length}/{maximumProfiles})
        </Typography>

        <Button
          variant="text"
          size="small"
          onClick={onClear}
          sx={{ minWidth: 0 }}
        >
          {t("selectedProfiles.clear")}
        </Button>
      </Stack>

      <Stack
        direction="row"
        spacing={1}
        useFlexGap
        sx={{ maxWidth: 720, flexWrap: "wrap" }}
      >
        {profiles.map((profile) => (
          <Chip
            key={profile.profile}
            label={profile.name}
            onDelete={() => onRemove(profile.profile)}
          />
        ))}
      </Stack>
    </Stack>
  );
}
