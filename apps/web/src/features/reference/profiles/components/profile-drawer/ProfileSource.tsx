import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import type { Profile } from "../../profiles.types";

interface ProfileSourceProps {
  source: Profile["source"];
}

export function ProfileSource({ source }: ProfileSourceProps) {
  const { t } = useTranslation("game-data", {
    keyPrefix: "books",
  });

  return (
    <Box
      sx={{
        px: {
          xs: 2.5,
          sm: 4,
        },
        py: 2.5,
        bgcolor: "action.hover",
      }}
    >
      <Typography
        variant="overline"
        color="textSecondary"
        sx={{
          display: "block",
          fontWeight: 700,
          mb: 0.25,
        }}
      >
        Source
      </Typography>

      <Typography variant="body2" color="textSecondary">
        {t(source.book)} (page {source.page})
      </Typography>
    </Box>
  );
}
