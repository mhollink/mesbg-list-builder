import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";

import IconButton from "~/components/icon-button";

interface WarbandOrderControlsProps {
  canMoveUp: boolean;
  canMoveDown: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

export function WarbandOrderControls({
  canMoveUp,
  canMoveDown,
  onMoveUp,
  onMoveDown,
}: WarbandOrderControlsProps) {
  return (
    <Stack direction="row" spacing={1}>
      <Tooltip title="Move warband up" placement="top"  >
        <span>
          <IconButton
            aria-label="Move warband up"
            disabled={!canMoveUp}
            onClick={onMoveUp}
          >
            <KeyboardArrowUpIcon />
          </IconButton>
        </span>
      </Tooltip>

      <Tooltip title="Move warband down" placement="top">
        <span>
          <IconButton
            aria-label="Move warband down"
            disabled={!canMoveDown}
            onClick={onMoveDown}
          >
            <KeyboardArrowDownIcon />
          </IconButton>
        </span>
      </Tooltip>
    </Stack>
  );
}
