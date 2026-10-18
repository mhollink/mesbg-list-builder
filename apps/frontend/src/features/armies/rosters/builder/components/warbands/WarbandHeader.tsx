import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import StyledIconButton from "~/components/icon-button";
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
  dragHandleRef?: (element: Element | null) => void;
}

export function WarbandHeader({
  index,
  capacity,
  points,
  actions,
  dragHandleRef,
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
        {dragHandleRef && (
          <StyledIconButton ref={dragHandleRef}>
            <DragIndicatorIcon />
          </StyledIconButton>
        )}
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
  dragHandleRef,
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
      {dragHandleRef && (
        <StyledIconButton ref={dragHandleRef}>
          <DragIndicatorIcon />
        </StyledIconButton>
      )}
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
