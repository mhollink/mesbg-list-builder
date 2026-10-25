import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

import type { RoadmapProgress } from "./roadmap.progress.ts";

interface RoadmapProgressRingProps {
  progress: RoadmapProgress;
  label: string;
  size?: number;
}

/** Completion is based on shipped deliverables; items in progress are not rounded up. */
export function RoadmapProgressRing({
  progress,
  label,
  size = 64,
}: RoadmapProgressRingProps) {
  const color =
    progress.total > 0 && progress.completed === progress.total
      ? "success.main"
      : progress.completed > 0
        ? "primary.main"
        : "text.disabled";

  return (
    <Box
      sx={{
        position: "relative",
        width: size,
        height: size,
        display: "inline-flex",
        flexShrink: 0,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <CircularProgress
        variant="determinate"
        value={100}
        size={size}
        thickness={4.2}
        aria-hidden="true"
        sx={{ color: "action.disabledBackground" }}
      />
      <CircularProgress
        variant="determinate"
        value={progress.percentage}
        size={size}
        thickness={4.2}
        aria-label={label}
        sx={{
          color,
          position: "absolute",
          inset: 0,
          "& .MuiCircularProgress-circle": { strokeLinecap: "round" },
        }}
      />
      <Typography
        component="span"
        variant="caption"
        sx={{
          position: "absolute",
          fontSize: size < 60 ? "0.7rem" : "0.8rem",
          fontWeight: 800,
          color: "text.primary",
          fontVariantNumeric: "tabular-nums",
          lineHeight: 1,
          whiteSpace: "nowrap",
        }}
      >
        {progress.completed} / {progress.total}
      </Typography>
    </Box>
  );
}
