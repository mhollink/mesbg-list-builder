import Chip from "@mui/material/Chip";

import type { LocalizedProfile } from "~/features/reference/profiles/profiles.types.ts";

interface UnitHeroicStatsProps {
  profile: LocalizedProfile;
}

export function UnitHeroicStats({ profile }: UnitHeroicStatsProps) {
  if (profile.stats.type !== "hero") {
    return null;
  }

  return (
    <Chip
      size="small"
      variant="outlined"
      label={
        `M W F | ` +
        `${profile.stats.might} / ` +
        `${profile.stats.will} / ` +
        `${profile.stats.fate}`
      }
    />
  );
}
