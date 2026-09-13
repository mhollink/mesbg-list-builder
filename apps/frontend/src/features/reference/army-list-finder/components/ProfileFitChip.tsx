import { useTranslation } from "react-i18next";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import Chip from "@mui/material/Chip";

import type { LocalizedProfile } from "~/features/reference/profiles/profiles.types.ts";

interface ProfileFitChipProps {
  profile: LocalizedProfile;
  fits: boolean;
}

export function ProfileFitChip({ profile, fits }: ProfileFitChipProps) {
  const { t } = useTranslation("army-list-finder");

  const accessibleLabel = t(fits ? "fit.available" : "fit.unavailable", {
    profile: profile.name,
  });

  return (
    <Chip
      size="small"
      variant="outlined"
      color={fits ? "success" : "warning"}
      icon={fits ? <CheckRoundedIcon /> : <CloseRoundedIcon />}
      label={profile.name}
      aria-label={accessibleLabel}
      title={accessibleLabel}
    />
  );
}
