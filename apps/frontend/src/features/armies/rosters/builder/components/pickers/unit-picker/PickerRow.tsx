import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ListItemButton from "@mui/material/ListItemButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { ProfileAvatar } from "~/components/profile-avatar/ProfileAvatar.tsx";
import type { LocalizedArmyListProfile } from "~/features/reference/army-lists/army-lists.types.ts";

interface PickerRowProps {
  profile: LocalizedArmyListProfile;
  onSelect: () => void;
  onQuickAdd?: () => void;
}

export function PickerRow({ profile, onSelect, onQuickAdd }: PickerRowProps) {
  const points = getInitialPoints(profile);

  return (
    <ListItemButton onClick={onSelect} sx={{ px: 3, py: 1.5 }}>
      <ProfileAvatar profileId={profile.profileId} size={52} sx={{ mr: 2 }} />

      <Box
        sx={{
          flex: 1,
          minWidth: 0,
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          sx={{
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography
              sx={{
                fontWeight: 600,
              }}
            >
              {profile.profile.name}
            </Typography>
          </Box>

          <Typography
            variant="body2"
            sx={{
              flexShrink: 0,
              fontWeight: 700,
            }}
          >
            {points} pts
          </Typography>
        </Stack>

        {profile.profile.stats.type !== "warrior" && (
          <Stack direction="row" spacing={2}>
            <Button
              variant="text"
              size="small"
              endIcon={<ChevronRightIcon />}
              onClick={(clickEvent) => {
                clickEvent.stopPropagation();
                onQuickAdd();
              }}
              sx={{
                textTransform: "none",
                justifyContent: "flex-start",
                p: 0,
              }}
            >
              Add without extra options
            </Button>
          </Stack>
        )}
      </Box>
    </ListItemButton>
  );
}

function getInitialPoints(profile: LocalizedArmyListProfile) {
  return (
    (profile.profile.points ?? 0) +
    profile.options
      .filter((option) => option.state === "preselected")
      .reduce((total, option) => total + (option.points ?? 0), 0)
  );
}
