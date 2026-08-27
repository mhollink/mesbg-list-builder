import { useTranslation } from "react-i18next";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import SportsEsportsOutlinedIcon from "@mui/icons-material/SportsEsportsOutlined";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { DashboardActionCard } from "../components/DashboardActionCard.tsx";
import { PageSection } from "../components/PageSection";

export type RecentRoster = {
  id: string;
  name: string;
  army: string;
  points: number;
  href: string;
};

export function ReturningPlayerSection({
  recentRosters,
}: {
  recentRosters: RecentRoster[];
}) {
  const { t } = useTranslation("home", { keyPrefix: "returning-player" });
  return (
    <PageSection
      eyebrow={t("eyebrow")}
      title={t("title")}
      description={t("description")}
    >
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Card variant="outlined" sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 800 }}>
                {t("rosters.title")}
              </Typography>

              <Stack spacing={1} sx={{ mt: 3 }}>
                {recentRosters.map((roster) => (
                  <Paper
                    key={roster.id}
                    component="a"
                    href={roster.href}
                    variant="outlined"
                    sx={{
                      p: 2.5,
                      color: "inherit",
                      textDecoration: "none",
                      transition: "border-color 160ms, transform 160ms",
                      "&:hover": {
                        borderColor: "primary.main",
                        transform: "translateY(-1px)",
                      },
                    }}
                  >
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      spacing={1}
                      sx={{ justifyContent: "space-between" }}
                    >
                      <Box>
                        <Typography sx={{ fontWeight: 800 }}>
                          {roster.name}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {roster.army}
                        </Typography>
                      </Box>
                      <Chip
                        label={`${roster.points} ${t("rosters.points")}`}
                        size="small"
                      />
                    </Stack>
                  </Paper>
                ))}
              </Stack>
            </CardContent>

            <CardActions sx={{ px: 2, pb: 2 }}>
              <Button href="/armies/rosters" endIcon={<ArrowForwardIcon />}>
                {t("rosters.open-all")}
              </Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Stack spacing={3}>
            <DashboardActionCard
              title={t("games.title")}
              description={t("games.description")}
              href="/play/games/current"
              icon={<SportsEsportsOutlinedIcon />}
              action={t("games.cta")}
            />

            <DashboardActionCard
              title={t("results.title")}
              description={t("results.description")}
              href="/play/games/new"
              icon={<HistoryOutlinedIcon />}
              action={t("results.cta")}
            />
          </Stack>
        </Grid>
      </Grid>
    </PageSection>
  );
}
