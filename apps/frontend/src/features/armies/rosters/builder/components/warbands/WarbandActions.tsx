import CopyAllIcon from "@mui/icons-material/CopyAll";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import UnfoldLessIcon from "@mui/icons-material/UnfoldLess";
import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";

import IconButton from "~/components/icon-button";

export interface WarbandHeaderActions {
  readonly: boolean;
  collapsed: boolean;
  toggleCollapse: () => void;
  deleteWarband: () => void;
  duplicateWarband: () => void;
}

export function WarbandActions({
  readonly,
  collapsed,
  toggleCollapse,
  deleteWarband,
  duplicateWarband,
}: WarbandHeaderActions) {
  return (
    <Stack
      direction="row"
      spacing={1}
      sx={{ flexGrow: 1, justifyContent: "flex-end" }}
    >
      <Tooltip title="collapse warband" placement="top">
        <IconButton aria-label="collapse warband" onClick={toggleCollapse}>
          {collapsed ? <UnfoldLessIcon /> : <UnfoldMoreIcon />}
        </IconButton>
      </Tooltip>

      <Tooltip title="duplicate warband" placement="top">
        <IconButton
          tone="primary"
          aria-label="duplicate warband"
          onClick={duplicateWarband}
          disabled={readonly}
        >
          <CopyAllIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title="delete warband" placement="top">
        <IconButton
          tone="error"
          aria-label="delete warband"
          onClick={deleteWarband}
          disabled={readonly}
        >
          <DeleteOutlinedIcon />
        </IconButton>
      </Tooltip>
    </Stack>
  );
}
