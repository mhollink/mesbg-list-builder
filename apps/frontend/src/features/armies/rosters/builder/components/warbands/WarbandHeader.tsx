import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import {
  WarbandActions,
  type WarbandHeaderActions,
} from "~/features/armies/rosters/builder/components/warbands/WarbandActions.tsx";
import type { WarbandCapacity } from "~/features/armies/rosters/builder/domain/warband-rules.ts";

interface WarbandHeaderProps {
  index: number;
  points: number;
  capacity: WarbandCapacity;
  actions: WarbandHeaderActions;
}

export function WarbandHeader({
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

export function MobileWarbandHeader({
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
