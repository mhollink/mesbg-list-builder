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

import { useBuilderGameData } from "../../../builder/data/useBuilderGameData";
import { calculateRosterStatistics } from "../../../builder/domain/roster-statistics";
import { HeraldryIcon } from "~/components/heraldry/HeraldryIcon.tsx";
import { getArmyListHeraldry } from "~/components/heraldry/heraldry.const.ts";
import { mapGuestRoster } from "~/features/armies/rosters/builder/mappers/guest-roster.mapper.ts";
import type { GuestRoster } from "~/features/armies/rosters/guest/guest-roster.types.ts";
import {InvalidRoster} from "~/features/armies/rosters/builder/components/InvalidRoster.tsx";

interface GuestRosterCardProps {
  roster: GuestRoster;
  onDelete: () => void;
}

export function GuestRosterCard({ roster, onDelete }: GuestRosterCardProps) {
  const gameData = useBuilderGameData(roster.armyListId);

  const builderRoster = useMemo(() => mapGuestRoster(roster), [roster]);

  if (!gameData) {
      return <InvalidRoster />
  }

  const stats = calculateRosterStatistics(builderRoster, gameData);
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
              {gameData.armyList.name}
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
