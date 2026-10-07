import CopyAllIcon from "@mui/icons-material/CopyAll";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import SwapHorizOutlinedIcon from "@mui/icons-material/SwapHorizOutlined";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";

import IconButton from "~/components/icon-button";

interface UnitActionsProps {
  canDuplicate?: boolean;
  canReplace?: boolean;
  canDelete?: boolean;

  onDuplicate?: () => void;
  onReplace?: () => void;
  onDelete?: () => void;
}

export function UnitActions({
  canDuplicate = false,
  canReplace = false,
  canDelete = false,
  onDuplicate,
  onReplace,
  onDelete,
}: UnitActionsProps) {
  return (
    <Stack direction="row" spacing={2}>
      {canDuplicate && (
        <Tooltip title="Duplicate unit" placement="top">
          <IconButton
            size="small"
            onClick={onDuplicate}
            aria-label="Duplicate unit"
            tone="info"
          >
            <CopyAllIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}

      {canReplace && (
        <Tooltip title="Replace unit" placement="top">
          <IconButton
            size="small"
            onClick={onReplace}
            aria-label="Replace unit"
            tone="warning"
          >
            <SwapHorizOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}

      {canDelete && (
        <Tooltip title="Delete unit" placement="top">
          <IconButton
            size="small"
            onClick={onDelete}
            aria-label="Delete unit"
            tone="error"
          >
            <DeleteOutlineOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
    </Stack>
  );
}
