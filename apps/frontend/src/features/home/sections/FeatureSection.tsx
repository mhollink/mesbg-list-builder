import { useTranslation } from "react-i18next";
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import PrintOutlinedIcon from "@mui/icons-material/PrintOutlined";
import SportsEsportsOutlinedIcon from "@mui/icons-material/SportsEsportsOutlined";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { IconSurface } from "../components/IconSurface.tsx";
import { PageSection } from "../components/PageSection.tsx";

const features = [
  { key: "build", icon: <FactCheckOutlinedIcon /> },
  { key: "profiles", icon: <PrintOutlinedIcon /> },
  { key: "play", icon: <SportsEsportsOutlinedIcon /> },
  { key: "collect", icon: <Inventory2OutlinedIcon /> },
  { key: "track", icon: <HistoryOutlinedIcon /> },
  { key: "community", icon: <GroupsOutlinedIcon /> },
];

export function FeatureSection() {
  const { t } = useTranslation("home", { keyPrefix: "features" });
  return (
    <PageSection
      eyebrow={t("eyebrow")}
      title={t("title")}
      description={t("description")}
    >
      <Grid container spacing={3}>
        {features.map((feature) => (
          <Grid key={feature.key} size={{ xs: 12, sm: 6, md: 4 }}>
            <Card variant="outlined" sx={{ height: "100%" }}>
              <CardContent>
                <Stack spacing={2}>
                  <IconSurface>{feature.icon}</IconSurface>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>
                      {t(`features.${feature.key}.title`)}
                    </Typography>
                    <Typography color="textSecondary" sx={{ mt: 1 }}>
                      {t(`features.${feature.key}.description`)}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </PageSection>
  );
}
