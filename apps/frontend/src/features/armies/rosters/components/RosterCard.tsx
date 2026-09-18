import { useState } from "react";
import { Link } from "react-router";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import type { RosterSummary } from "@mlb/api-client";

import { HeraldryIcon } from "~/components/heraldry/HeraldryIcon.tsx";
import { getArmyListHeraldry } from "~/components/heraldry/heraldry.const.ts";

interface RosterCardProps {
  roster: RosterSummary;
  armyListName: string;
  onDelete: (roster: RosterSummary) => void;
}

export function RosterCard({
  roster,
  armyListName,
  onDelete,
}: RosterCardProps) {
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const stats = [
    ["Points", roster.points],
    ["Models", roster.modelCount],
    ["Warbands", roster.warbandCount],
    ["Might", roster.warbandCount],
    ["Bows", roster.bowCount],
    ["Thr. Weap", roster.throwingWeaponCount],
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
        onClick={(event) => setMenuAnchor(event.currentTarget)}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          zIndex: 1,
        }}
      >
        <MoreVertIcon />
      </IconButton>

      <CardActionArea
        component={Link}
        to={`/armies/rosters/${roster.id}`}
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
              {armyListName}
            </Typography>
          </Stack>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: 1,
              p: 2,
            }}
          >
            {stats.map(([label, value]) => (
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

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
      >
        <MenuItem
          onClick={() => {
            setMenuAnchor(null);
            onDelete(roster);
          }}
        >
          <DeleteOutlineIcon fontSize="small" sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>
    </Card>
  );
}
