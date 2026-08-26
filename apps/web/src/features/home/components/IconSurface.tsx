import type { ReactNode } from "react";
import Box from "@mui/material/Box";
import { alpha } from "@mui/material/styles";

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
