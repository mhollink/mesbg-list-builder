import { useState } from "react";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";

import type { BuilderGameData } from "../../data/builder-game-data.types.ts";
import type { BuilderWarband } from "../../domain/roster.types.ts";
import type { WarbandCapacity } from "../../domain/warband-rules.ts";
import type { WarbandHeaderActions } from "./WarbandActions.tsx";
import { MobileWarbandHeader, WarbandHeader } from "./WarbandHeader.tsx";
import { FollowerRow } from "~/features/armies/rosters/builder/components/units/FollowerRow.tsx";
import { LeaderRow } from "~/features/armies/rosters/builder/components/units/LeaderRow.tsx";
import { calculateWarbandPoints } from "~/features/armies/rosters/builder/domain/roster-statistics.ts";

export interface WarbandCardProps {
  index: number;
  warband: BuilderWarband;
  gameData: BuilderGameData;
  capacity: WarbandCapacity;
  readonly?: boolean;
}

export function WarbandCard({
  index,
  warband,
  capacity,
  gameData,
  readonly = false,
}: WarbandCardProps) {
  const points = calculateWarbandPoints(warband, gameData);
  const [open, setOpen] = useState(true);

  const actions: WarbandHeaderActions = {
    readonly,
    collapsed: open,
    toggleCollapse: () => setOpen(!open),
    deleteWarband: () => console.log("Delete warband..."),
    duplicateWarband: () => console.log("duplicate warband..."),
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
          <LeaderRow
            leader={warband.leader}
            gameData={gameData}
            readonly={readonly}
            collapsed={!open}
          />
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
                  readonly={readonly}
                />
              ))}
            </Stack>
          </Collapse>
        )}
      </Stack>
    </Paper>
  );
}
