import type { ReactNode } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

export function PageSection({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <Box component="section">
      <Stack spacing={3}>
        <Box sx={{ maxWidth: 760 }}>
          <Typography
            variant="overline"
            color="primary"
            sx={{ fontWeight: 900, letterSpacing: 1 }}
          >
            {eyebrow}
          </Typography>

          <Typography variant="h3" component="h2" sx={{ fontWeight: 900 }}>
            {title}
          </Typography>

          <Typography color="text.secondary" sx={{ mt: 1.25, lineHeight: 1.7 }}>
            {description}
          </Typography>
        </Box>

        {children}
      </Stack>
    </Box>
  );
}
