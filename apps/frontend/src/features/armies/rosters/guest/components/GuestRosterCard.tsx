import { useMemo } from "react";
import { Link } from "react-router";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { HeraldryIcon } from "~/components/heraldry/HeraldryIcon.tsx";
import { getArmyListHeraldry } from "~/components/heraldry/heraldry.const.ts";
import type { GuestRoster } from "~/features/armies/rosters/guest/guest-roster.types.ts";
import { calculateGuestRosterStats } from "~/features/armies/rosters/guest/guest-roster.utils.ts";
import { useGameArmyLists } from "~/features/reference/army-lists/hooks/useGameArmyLists.ts";
import { useGameProfiles } from "~/features/reference/profiles/hooks/useGameProfiles.ts";
import type { LocalizedProfile } from "~/features/reference/profiles/profiles.types.ts";

interface GuestRosterCardProps {
  roster: GuestRoster;
  onDelete: () => void;
}

export function GuestRosterCard({ roster, onDelete }: GuestRosterCardProps) {
  const { profiles } = useGameProfiles();
  const { armyLists } = useGameArmyLists();

  const profilesById = useMemo(
    () =>
      profiles.reduce(
        (byId, profile) => byId.set(profile.profile, profile),
        new Map<string, LocalizedProfile>(),
      ),
    [profiles],
  );

  const armyListName = useMemo(
    () => armyLists.find((list) => list.id === roster.armyListId),
    [armyLists, roster.armyListId],
  );

  const stats = useMemo(
    () => calculateGuestRosterStats(roster, profilesById),
    [roster, profilesById],
  );

  const items = [
    ["Points", stats.points],
    ["Models", stats.modelCount],
    ["Warbands", stats.warbandCount],
    ["Might", stats.might],
    ["Bows", stats.bowCount],
    ["Thr. Weap", stats.throwingWeaponCount],
  ] as const;

  return (
    <Card
      elevation={3}
      sx={{
        position: "relative",
        width: "100%",
        maxWidth: 300,
        aspectRatio: "1 / 1",
      }}
    >
      <IconButton
        aria-label={`Actions for ${roster.name}`}
        onClick={onDelete}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          zIndex: 1,
        }}
      >
        <DeleteOutlineIcon />
      </IconButton>

      <CardActionArea
        component={Link}
        to={`/armies/rosters/guest`}
        sx={{ height: "100%" }}
      >
        <Stack sx={{ height: "100%", p: 1.5, justifyContent: "space-between" }}>
          <Stack
            spacing={1}
            sx={{
              px: 3,
              textAlign: "center",
              alignItems: "center",
            }}
          >
            <Typography variant="h6" noWrap sx={{ width: "100%" }}>
              {roster.name}
            </Typography>

            <HeraldryIcon
              iconName={getArmyListHeraldry(roster.armyListId)}
              size={66}
            />

            <Typography
              variant="body2"
              color="textSecondary"
              noWrap
              sx={{ width: "100%" }}
            >
              {armyListName.name}
            </Typography>
          </Stack>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: 1,
              p: 1,
            }}
          >
            {items.map(([label, value]) => (
              <Chip
                key={label}
                label={
                  <Stack
                    direction="row"
                    spacing={1}
                    useFlexGap
                    sx={{ width: "100%", justifyContent: "space-between" }}
                  >
                    <Typography variant="body2">{label}</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {value}
                    </Typography>
                  </Stack>
                }
                sx={{
                  width: "100%",
                  "& .MuiChip-label": {
                    width: "100%",
                  },
                }}
              />
            ))}
          </Box>
        </Stack>
      </CardActionArea>
    </Card>
  );
}
