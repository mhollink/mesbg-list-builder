import DriveFileMoveOutlinedIcon from "@mui/icons-material/DriveFileMoveOutlined";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import { useDroppable } from "@dnd-kit/react";

export function RootRosterDropZone() {
  const { ref, isDropTarget } = useDroppable({
    id: "roster-root",
    accept: "roster",
    data: {
      type: "root",
    },
  });

  return (
    <Paper
      ref={ref}
      variant="outlined"
      sx={{
        p: 1.5,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 1,
        borderStyle: "dashed",
        bgcolor: isDropTarget ? "action.selected" : "transparent",
        borderColor: isDropTarget ? "primary.main" : undefined,
      }}
    >
      <DriveFileMoveOutlinedIcon fontSize="small" />

      <Typography variant="body2">Drop here to move to My Rosters</Typography>
    </Paper>
  );
}
