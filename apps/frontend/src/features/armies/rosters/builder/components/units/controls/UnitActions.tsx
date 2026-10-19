import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";

import IconButton from "~/components/icon-button";

interface UnitActionsProps {
  canEdit?: boolean;
  canDelete?: boolean;

  onEdit?: () => void;
  onDelete?: () => void;
}

export function UnitActions({
  canEdit = false,
  canDelete = false,
  onEdit,
  onDelete,
}: UnitActionsProps) {
  return (
    <Stack direction="row" spacing={1}>
      {canEdit && (
        <Tooltip title="Edit unit" placement="top">
          <IconButton
            size="small"
            onClick={onEdit}
            aria-label="Edit unit"
            tone="primary"
          >
            <EditOutlinedIcon fontSize="small" />
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
