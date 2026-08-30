import type { ReactNode } from "react";
import Box from "@mui/material/Box";

interface ErrataTextProps {
  children: ReactNode;
}

/**
 * Highlights wording that was changed by an official errata.
 */
export function ErrataText({ children }: ErrataTextProps) {
  return (
    <Box
      component="span"
      sx={{
        textDecorationLine: "underline",
        textDecorationStyle: "wavy",
        textDecorationColor: "primary.main",
      }}
    >
      {children}
    </Box>
  );
}
