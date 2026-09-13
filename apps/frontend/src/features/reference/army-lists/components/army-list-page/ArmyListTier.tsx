import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import type { LocalizedArmyListProfile } from "../../army-lists.types.ts";
import { ArmyListProfile } from "./ArmyListProfile.tsx";

interface ArmyListTierProps {
  profiles: LocalizedArmyListProfile[];
  onOpenProfile: (profileId: string) => void;
}

export function ArmyListTier({ profiles, onOpenProfile }: ArmyListTierProps) {
  const firstProfile = profiles[0];

  if (!firstProfile) {
    return null;
  }

  return (
    <Stack sx={{ gap: 2 }}>
      <Typography
        variant="overline"
        color="primary"
        sx={{
          fontWeight: 700,
          lineHeight: 1.5,
        }}
      >
        {firstProfile.tierName}
      </Typography>

      <Stack sx={{ gap: 3 }}>
        {profiles.map((profile) => (
          <ArmyListProfile
            key={profile.id}
            profile={profile}
            onOpenProfile={onOpenProfile}
          />
        ))}
      </Stack>
    </Stack>
  );
}
