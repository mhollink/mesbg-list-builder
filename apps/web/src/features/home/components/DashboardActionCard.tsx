import type { ReactNode } from "react";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { IconSurface } from "./IconSurface";

export function DashboardActionCard({
  title,
  description,
  href,
  icon,
  action,
  primary = false,
}: {
  title: string;
  description: string;
  href: string;
  icon: ReactNode;
  action: string;
  primary?: boolean;
}) {
  return (
    <Card
      variant="outlined"
      sx={{
        height: "100%",
        transition: "border-color 160ms, transform 160ms",
        "&:hover": {
          borderColor: "primary.main",
          transform: "translateY(-2px)",
        },
      }}
    >
      <CardContent>
        <Stack spacing={2}>
          <IconSurface>{icon}</IconSurface>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              {title}
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 0.75 }}>
              {description}
            </Typography>
          </Box>
        </Stack>
      </CardContent>

      <CardActions sx={{ px: 2, pb: 2 }}>
        <Button
          href={href}
          variant={primary ? "contained" : "text"}
          endIcon={<ArrowForwardIcon />}
        >
          {action}
        </Button>
      </CardActions>
    </Card>
  );
}
