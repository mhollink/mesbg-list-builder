import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import ListItemButton from "@mui/material/ListItemButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import type { ArmyListMatch } from "../army-list-finder.types.ts";
import { ProfileFitChip } from "./ProfileFitChip.tsx";
import type { LocalizedProfile } from "~/features/reference/profiles/profiles.types.ts";

interface ArmyListFinderResultItemProps {
  match: ArmyListMatch;
  selectedProfiles: LocalizedProfile[];
  onOpenArmyList: (armyListId: string) => void;
}

export function ArmyListFinderResultItem({
  match,
  selectedProfiles,
  onOpenArmyList,
}: ArmyListFinderResultItemProps) {
  const matchedProfileIds = new Set(match.matchedProfileIds);

  return (
    <ListItemButton
      onClick={() => onOpenArmyList(match.armyList.id)}
      sx={{
        alignItems: "flex-start",
        gap: 2,
        px: 2,
        py: 1.5,
        borderBottom: 1,
        borderColor: "divider",
      }}
    >
      <Stack spacing={1} sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          variant="body1"
          sx={{
            fontWeight: 500,
          }}
        >
          {match.armyList.name}
        </Typography>

        <Stack direction="row" spacing={1}>
          {selectedProfiles.map((profile) => (
            <ProfileFitChip
              key={profile.profile}
              profile={profile}
              fits={matchedProfileIds.has(profile.profile)}
            />
          ))}
        </Stack>
      </Stack>

      <ChevronRightRoundedIcon
        fontSize="small"
        sx={{
          mt: 0.25,
          color: "textSecondary",
        }}
      />
    </ListItemButton>
  );
}
