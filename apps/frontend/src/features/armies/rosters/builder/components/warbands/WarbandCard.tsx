import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import {
  calculateWarbandPoints
} from "~/features/armies/rosters/builder/domain/roster-statistics.ts";

import type {BuilderGameData} from "../../data/builder-game-data.types.ts";
import type {BuilderWarband} from "../../domain/roster.types.ts";
import type {WarbandCapacity} from "../../domain/warband-rules.ts";
import {LeaderRow} from "~/features/armies/rosters/builder/components/units/LeaderRow.tsx";
import {FollowerRow} from "~/features/armies/rosters/builder/components/units/FollowerRow.tsx";
import UnfoldLessIcon from '@mui/icons-material/UnfoldLess';
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import CopyAllIcon from '@mui/icons-material/CopyAll';

import IconButton from "~/components/icon-button/IconButton";

interface WarbandCardProps {
  index: number;
  warband: BuilderWarband;
  gameData: BuilderGameData;
  capacity: WarbandCapacity;
}

export function WarbandCard({index, warband, capacity, gameData}: WarbandCardProps) {
  const points = calculateWarbandPoints(warband, gameData);
  return (
    <Paper variant="outlined" elevation={10}>
      <Stack>
        <MobileWarbandHeader index={index} points={points} capacity={capacity}/>
        <WarbandHeader index={index} points={points} capacity={capacity}/>
        <Divider/>
        <Box sx={{p: 2}}>
          <LeaderRow leader={warband.leader} gameData={gameData}/>
        </Box>
        {warband.followers.length > 0 && (
          <>
            <Divider/>
            <Stack spacing={2} sx={{p: 2}}>
              {warband.followers.map((follower) => (
                <FollowerRow key={follower.id} follower={follower} gameData={gameData}/>
              ))}
            </Stack>
          </>
        )}
      </Stack>
    </Paper>
  );
}

interface WarbandHeaderProps {
  index: number;
  points: number;
  capacity: WarbandCapacity;
}

function WarbandHeader({index, capacity, points}: WarbandHeaderProps) {
  return (
    <Stack
      direction="row"
      sx={{
        display: {xs: "none", sm: "flex"},
        p: 2,
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Stack direction="row" spacing={2} useFlexGap>
        <Typography>Warband: <b>{index + 1}</b></Typography>
        <Typography>Points: <b>{points}</b></Typography>
        <Typography color={capacity.overMaximum ? "error" : "default"}>
          Units: <b>{capacity.current} / {capacity.maximum}</b>
        </Typography>
      </Stack>

      <WarbandActions />
    </Stack>
  )
}

function MobileWarbandHeader({points, capacity}: WarbandHeaderProps) {
  return (
    <Stack
      direction="row"
      sx={{
        display: {sx: "flex", sm: "none"},
        p: 2,
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Stack>
        <Typography>Points: <b>{points}</b></Typography>
        <Typography color={capacity.overMaximum ? "error" : "default"}>
          Units: <b>{capacity.current} / {capacity.maximum}</b>
        </Typography>
      </Stack>

      <WarbandActions />
    </Stack>
  )
}

function WarbandActions() {
  return (
    <Stack direction="row" spacing={2} sx={{flexGrow: 1, justifyContent: "flex-end"}}>
      <IconButton color="#333" aria-label="collapse warband" onClick={() => console.log("clicked")}>
        <UnfoldLessIcon/>
      </IconButton>
      <IconButton color="#66F" aria-label="collapse warband" onClick={() => console.log("clicked")}>
        <CopyAllIcon/>
      </IconButton>
      <IconButton color="#F00" aria-label="delete warband" onClick={() => console.log("clicked")}>
        <DeleteOutlinedIcon/>
      </IconButton>
    </Stack>
  )
}
