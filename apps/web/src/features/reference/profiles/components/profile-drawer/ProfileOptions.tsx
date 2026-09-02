import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { ProfileSection } from "./ProfileSection";
import type { ProfileDrawerOption } from "./profile-drawer.types";

interface ProfileOptionsProps {
  options: ProfileDrawerOption[];
}

export function ProfileOptions({ options }: ProfileOptionsProps) {
  if (options.length === 0) {
    return null;
  }

  return (
    <ProfileSection title="Options">
      <Stack sx={{ gap: 0.75 }}>
        {options.map((option) => (
          <Stack
            key={option.id}
            direction="row"
            sx={{
              justifyContent: "space-between",
              alignItems: "baseline",
              gap: 2,
            }}
          >
            <Typography>{option.name}</Typography>

            <Typography
              variant="body2"
              color="textSecondary"
              sx={{
                whiteSpace: "nowrap",
              }}
            >
              +{option.points} pts
            </Typography>
          </Stack>
        ))}
      </Stack>
    </ProfileSection>
  );
}
