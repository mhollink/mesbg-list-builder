import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import ButtonBase from "@mui/material/ButtonBase";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { ProfileSection } from "./ProfileSection";
import type { ProfileDrawerRelatedProfile } from "./profile-drawer.types";

interface ProfileRelatedProfilesProps {
  profiles: ProfileDrawerRelatedProfile[];
  onOpenProfile: (profileId: string) => void;
}

export function ProfileRelatedProfiles({
  profiles,
  onOpenProfile,
}: ProfileRelatedProfilesProps) {
  if (profiles.length === 0) {
    return null;
  }

  return (
    <ProfileSection title="Additional Profiles">
      <Stack>
        {profiles.map((profile) => (
          <ButtonBase
            key={profile.id}
            onClick={() => onOpenProfile(profile.id)}
            sx={{
              width: "100%",
              justifyContent: "flex-start",
              borderRadius: 1,
              px: 1,
              py: 0.75,
              mx: -1,

              "&:hover": {
                bgcolor: "action.hover",
              },
            }}
          >
            <Typography
              sx={{
                flex: 1,
                textAlign: "left",
                fontWeight: 500,
              }}
            >
              {profile.name}
            </Typography>

            <ChevronRightRoundedIcon
              fontSize="small"
              sx={{
                color: "textSecondary",
              }}
            />
          </ButtonBase>
        ))}
      </Stack>
    </ProfileSection>
  );
}
