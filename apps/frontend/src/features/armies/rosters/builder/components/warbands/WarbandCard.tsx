import { useState } from "react";
import CopyAllIcon from "@mui/icons-material/CopyAll";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import UnfoldLessIcon from "@mui/icons-material/UnfoldLess";
import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import type { BuilderGameData } from "../../data/builder-game-data.types.ts";
import type { BuilderWarband } from "../../domain/roster.types.ts";
import type { WarbandCapacity } from "../../domain/warband-rules.ts";
import IconButton from "~/components/icon-button/IconButton";
import { FollowerRow } from "~/features/armies/rosters/builder/components/units/FollowerRow.tsx";
import { LeaderRow } from "~/features/armies/rosters/builder/components/units/LeaderRow.tsx";
import { calculateWarbandPoints } from "~/features/armies/rosters/builder/domain/roster-statistics.ts";

interface WarbandCardProps {
  index: number;
  warband: BuilderWarband;
  gameData: BuilderGameData;
  capacity: WarbandCapacity;
}

export function WarbandCard({
  index,
  warband,
  capacity,
  gameData,
}: WarbandCardProps) {
  const points = calculateWarbandPoints(warband, gameData);
  const [open, setOpen] = useState(true);

  const actions: WarbandHeaderActions = {
    collapsed: open,
    toggleCollapse: () => setOpen(!open),
  };

  return (
    <Paper variant="outlined" elevation={10}>
      <Stack>
        <MobileWarbandHeader
          index={index}
          points={points}
          capacity={capacity}
          actions={actions}
        />
        <WarbandHeader
          index={index}
          points={points}
          capacity={capacity}
          actions={actions}
        />
        <Divider />
        <Box sx={{ p: 2 }}>
          <LeaderRow leader={warband.leader} gameData={gameData} />
        </Box>
        {warband.followers.length > 0 && (
          <Collapse in={open}>
            <Divider />
            <Stack spacing={2} sx={{ p: 2 }}>
              {warband.followers.map((follower) => (
                <FollowerRow
                  key={follower.id}
                  follower={follower}
                  gameData={gameData}
                />
              ))}
            </Stack>
          </Collapse>
        )}
      </Stack>
    </Paper>
  );
}

interface WarbandHeaderActions {
  collapsed: boolean;
  toggleCollapse: () => void;
}

interface WarbandHeaderProps {
  index: number;
  points: number;
  capacity: WarbandCapacity;
  actions: WarbandHeaderActions;
}

function WarbandHeader({
  index,
  capacity,
  points,
  actions,
}: WarbandHeaderProps) {
  return (
    <Stack
      direction="row"
      sx={{
        display: { xs: "none", sm: "flex" },
        p: 2,
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Stack direction="row" spacing={2} useFlexGap>
        <Typography>
          Warband: <b>{index + 1}</b>
        </Typography>
        <Typography>
          Points: <b>{points}</b>
        </Typography>
        <Typography color={capacity.overMaximum ? "error" : "default"}>
          Units:{" "}
          <b>
            {capacity.current} / {capacity.maximum}
          </b>
        </Typography>
      </Stack>

      <WarbandActions {...actions} />
    </Stack>
  );
}

function MobileWarbandHeader({
  points,
  capacity,
  actions,
}: WarbandHeaderProps) {
  return (
    <Stack
      direction="row"
      sx={{
        display: { sx: "flex", sm: "none" },
        p: 2,
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Stack>
        <Typography>
          Points: <b>{points}</b>
        </Typography>
        <Typography color={capacity.overMaximum ? "error" : "default"}>
          Units:{" "}
          <b>
            {capacity.current} / {capacity.maximum}
          </b>
        </Typography>
      </Stack>

      <WarbandActions {...actions} />
    </Stack>
  );
}

function WarbandActions({ toggleCollapse, collapsed }: WarbandHeaderActions) {
  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{ flexGrow: 1, justifyContent: "flex-end" }}
    >
      <IconButton
        color="#333"
        aria-label="collapse warband"
        onClick={toggleCollapse}
      >
        {collapsed ? <UnfoldLessIcon /> : <UnfoldMoreIcon />}
      </IconButton>
      <IconButton
        color="#66F"
        aria-label="collapse warband"
        onClick={() => console.log("clicked")}
      >
        <CopyAllIcon />
      </IconButton>
      <IconButton
        color="#F00"
        aria-label="delete warband"
        onClick={() => console.log("clicked")}
      >
        <DeleteOutlinedIcon />
      </IconButton>
    </Stack>
  );
}
