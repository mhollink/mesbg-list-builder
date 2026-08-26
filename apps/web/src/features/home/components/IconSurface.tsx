import { Box } from "@mui/material";
import { alpha } from "@mui/material/styles";
import type { ReactNode } from "react";

export function IconSurface({ children }: { children: ReactNode }) {
  return (
    <Box
      sx={(theme) => ({
        width: 44,
        height: 44,
        display: "grid",
        placeItems: "center",
        color: "primary.main",
        backgroundColor: alpha(theme.palette.primary.main, 0.12),
        "& svg": {
          fontSize: 24,
        },
      })}
    >
      {children}
    </Box>
  );
}
