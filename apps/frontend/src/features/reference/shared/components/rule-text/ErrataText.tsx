import type { ReactNode } from "react";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";

interface ErrataTextProps {
  children: ReactNode;
}

/**
 * Highlights wording that was changed by an official errata.
 */
export function ErrataText({ children }: ErrataTextProps) {
  return (
    <Tooltip title="This text was added or modified as result of an official errata.">
      <Box
        component="span"
        sx={{
          textDecorationLine: "underline",
          textDecorationStyle: "wavy",
          textDecorationColor: (theme) => theme.palette.warning.dark,
          textDecorationThickness: "0.5px",
        }}
      >
        {children}
      </Box>
    </Tooltip>
  );
}
