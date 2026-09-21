import { useState } from "react";
import { Link } from "react-router";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import DriveFileMoveOutlinedIcon from "@mui/icons-material/DriveFileMoveOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import StarIcon from "@mui/icons-material/Star";
import StarBorderOutlinedIcon from "@mui/icons-material/StarBorderOutlined";
import StarOutlinedIcon from "@mui/icons-material/StarOutlined";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import { useDraggable } from "@dnd-kit/react";
import type { RosterSummary } from "@mlb/api-client";

import { HeraldryIcon } from "~/components/heraldry/HeraldryIcon.tsx";
import { getArmyListHeraldry } from "~/components/heraldry/heraldry.const.ts";
import { useRosterMetadata } from "~/features/armies/rosters/management/hooks/useRosterMetadata.ts";

interface RosterCardProps {
  roster: RosterSummary;
  armyList: string;
  onMove: (roster: RosterSummary) => void;
  onDelete: (roster: RosterSummary) => void;
}

export function RosterCard({
  roster,
  onMove,
  onDelete,
  armyList,
}: RosterCardProps) {
  const { onFavorite, onLock, isFavoriteLoading, isLockLoading } =
    useRosterMetadata(roster);

  const {
    ref: draggableRef,
    handleRef,
    isDragging,
  } = useDraggable({
    id: `roster:${roster.id}`,
    type: "roster",
    data: {
      type: "roster",
      rosterId: roster.id,
    },
  });

  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const stats = [
    ["Points", roster.points],
    ["Models", roster.modelCount],
    ["Warbands", roster.warbandCount],
    ["Might", roster.might],
    ["Bows", roster.bowCount],
    ["Thr. Weap", roster.throwingWeaponCount],
  ] as const;

  return (
    <Card
      ref={draggableRef}
      elevation={3}
      sx={{
        position: "relative",
        width: "100%",
        maxWidth: 300,
        aspectRatio: "1 / 1",
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      <Tooltip title="Drag roster">
        <IconButton
          ref={handleRef}
          aria-label={`Drag ${roster.name}`}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
          }}
          sx={{
            position: "absolute",
            left: 4,
            top: 4,
            zIndex: 2,
            cursor: "grab",
            "&:active": {
              cursor: "grabbing",
            },
          }}
        >
          <DragIndicatorIcon />
        </IconButton>
      </Tooltip>

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

            <Box sx={{ position: "relative", display: "inline-flex" }}>
              <HeraldryIcon
                iconName={getArmyListHeraldry(roster.armyListId)}
                size={66}
              />

              {roster.favorite && (
                <Tooltip title="Favorite roster">
                  <StarIcon
                    aria-label="Favorite roster"
                    sx={{
                      position: "absolute",
                      top: -4,
                      right: -20,
                      fontSize: 18,
                    }}
                  />
                </Tooltip>
              )}
            </Box>

            <Typography
              variant="body2"
              color="textSecondary"
              noWrap
              sx={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 0.5,
              }}
            >
              {roster.locked && (
                <Tooltip title="Locked roster">
                  <LockOutlinedIcon
                    aria-label="Locked roster"
                    sx={{
                      fontSize: 16,
                    }}
                  />
                </Tooltip>
              )}
              {armyList}
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
          disabled={isFavoriteLoading}
          onClick={() => {
            setMenuAnchor(null);
            onFavorite();
          }}
        >
          {roster.favorite ? (
            <StarOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
          ) : (
            <StarBorderOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
          )}

          {roster.favorite ? "Remove from favorites" : "Add to favorites"}
        </MenuItem>

        <MenuItem
          disabled={isLockLoading}
          onClick={() => {
            setMenuAnchor(null);
            onLock();
          }}
        >
          {roster.locked ? (
            <LockOpenOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
          ) : (
            <LockOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
          )}

          {roster.locked ? "Unlock roster" : "Lock roster"}
        </MenuItem>

        <Divider />

        <MenuItem
          onClick={() => {
            setMenuAnchor(null);
            onMove(roster);
          }}
        >
          <DriveFileMoveOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
          Move to group
        </MenuItem>
        <Tooltip
          title={roster.locked ? "Unlock this roster before deleting it." : ""}
          placement="left"
        >
          <span>
            <MenuItem
              disabled={roster.locked}
              onClick={() => {
                setMenuAnchor(null);
                onDelete(roster);
              }}
            >
              <DeleteOutlineIcon fontSize="small" sx={{ mr: 1 }} />
              Delete
            </MenuItem>
          </span>
        </Tooltip>
      </Menu>
    </Card>
  );
}
