import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import {
  WarbandActions,
  type WarbandHeaderActions,
} from "~/features/armies/rosters/builder/components/warbands/WarbandActions.tsx";
import { WarbandOrderControls } from "~/features/armies/rosters/builder/components/warbands/WarbandOrderControls.tsx";
import type { WarbandCapacity } from "~/features/armies/rosters/builder/domain/warband-rules.ts";

interface WarbandHeaderProps {
  index: number;
  points: number;
  capacity: WarbandCapacity;
  actions: WarbandHeaderActions;

  canMoveUp: boolean;
  canMoveDown: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

export function WarbandHeader({
  index,
  capacity,
  points,
  actions,
  canMoveDown,
  canMoveUp,
  onMoveDown,
  onMoveUp,
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
      <Stack
        direction="row"
        spacing={2}
        useFlexGap
        sx={{ alignItems: "center" }}
      >
        <WarbandOrderControls
          canMoveUp={canMoveUp}
          canMoveDown={canMoveDown}
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
        />
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
  canMoveDown,
  canMoveUp,
  onMoveDown,
  onMoveUp,
}: WarbandHeaderProps) {
  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{
        display: { sx: "flex", sm: "none" },
        p: 2,
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <WarbandOrderControls
        canMoveUp={canMoveUp}
        canMoveDown={canMoveDown}
        onMoveUp={onMoveUp}
        onMoveDown={onMoveDown}
      />
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
