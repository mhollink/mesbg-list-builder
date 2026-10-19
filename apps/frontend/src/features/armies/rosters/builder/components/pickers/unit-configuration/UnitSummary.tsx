import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { ProfileAvatar } from "~/components/profile-avatar/ProfileAvatar.tsx";
import type { LocalizedArmyListProfile } from "~/features/reference/army-lists/army-lists.types.ts";
import { ProfileStats } from "~/features/reference/profiles/components/profile-drawer/ProfileStats.tsx";

interface UnitSummaryProps {
  profile: LocalizedArmyListProfile;
}

export function UnitSummary({ profile }: UnitSummaryProps) {
  return (
    <>
      <Stack spacing={1} sx={{ p: 2 }} direction="row">
        <ProfileAvatar profileId={profile.profileId} size={75} />
        <Stack>
          <Typography
            variant="h6"
            component="h3"
            sx={{
              fontWeight: 700,
            }}
          >
            {profile.profile.name}
          </Typography>
          <Stack direction="row" spacing={0.5} useFlexGap>
            {profile.profile.unitTypeNames.map((unitTypeName) => (
              <Chip
                key={unitTypeName}
                label={unitTypeName}
                size="small"
                variant={"outlined"}
              />
            ))}
          </Stack>
          <Typography color="textSecondary">
            {profile.profile.points} points per model, without equipment
          </Typography>
        </Stack>
      </Stack>
      <Box sx={{ p: 2 }}>
        <ProfileStats stats={profile.profile.stats} />
      </Box>
      <Divider />
    </>
  );
}
