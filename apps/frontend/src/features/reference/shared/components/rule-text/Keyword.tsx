import type { PropsWithChildren } from "react";
import Typography from "@mui/material/Typography";

export function Keyword({ children }: PropsWithChildren) {
  return (
    <Typography component="strong" color="accent" sx={{ fontWeight: 700 }}>
      {children}
    </Typography>
  );
}
