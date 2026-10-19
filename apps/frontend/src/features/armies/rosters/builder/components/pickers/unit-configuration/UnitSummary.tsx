import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { ProfileAvatar } from "~/components/profile-avatar/ProfileAvatar.tsx";
import { getUnitCost } from "~/features/armies/rosters/builder/domain/option-rules.ts";
import type { LocalizedArmyListProfile } from "~/features/reference/army-lists/army-lists.types.ts";
import { ProfileStats } from "~/features/reference/profiles/components/profile-drawer/ProfileStats.tsx";

interface UnitSummaryProps {
  profile: LocalizedArmyListProfile;
}

export function UnitSummary({ profile }: UnitSummaryProps) {
  const includedOptions = profile.options.filter(
    (option) => option.state === "preselected",
  );
  const standardCost = getUnitCost(
    {
      id: "preview",
      armyListProfileId: profile.id,
      quantity: 1,
      optionIds: [],
    },
    profile,
  );
  const isHero = profile.profile.stats.type === "hero";

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
            {standardCost} pts{!isHero && " per model"}
            {!isHero && includedOptions.length > 0 && (
              <>
                {" "}
                (includes{" "}
                {includedOptions.map((option) => option.name).join(", ")})
              </>
            )}
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
