import { useTranslation } from "react-i18next";
import { Outlet } from "react-router";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { SettingsNavigation } from "./components/SettingsNavigation.tsx";

export const SettingsPage = () => {
  const { t } = useTranslation("settings");
  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          {t("title")}
        </Typography>

        <Typography color="textSecondary">{t("description")}</Typography>
      </Box>

      <Box
        sx={{
          display: {
            xs: "block",
            md: "grid",
          },
          gridTemplateColumns: {
            md: "220px minmax(0, 1fr)",
          },
          gap: {
            xs: 3,
            md: 4,
          },
        }}
      >
        <SettingsNavigation />

        <Box
          sx={{
            minWidth: 0,
            pt: {
              xs: 3,
              md: 0,
            },
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Stack>
  );
};
