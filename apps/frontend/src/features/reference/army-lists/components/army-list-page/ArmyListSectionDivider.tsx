import type { PropsWithChildren } from "react";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";

export function ArmyListSectionDivider({ children }: PropsWithChildren) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        my: {
          xs: 4,
          md: 6,
        },
      }}
    >
      <Divider sx={{ flex: 1 }} />

      <Typography
        variant="overline"
        color="textSecondary"
        sx={{
          fontWeight: 700,
          letterSpacing: "0.12em",
          whiteSpace: "nowrap",
        }}
      >
        {children}
      </Typography>

      <Divider sx={{ flex: 1 }} />
    </Box>
  );
}
