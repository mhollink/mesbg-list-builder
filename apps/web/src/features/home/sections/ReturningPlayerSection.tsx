import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import SportsEsportsOutlinedIcon from "@mui/icons-material/SportsEsportsOutlined";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
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
  return (
    <PageSection
      eyebrow="Continue"
      title="Pick up where you left off"
      description="Jump back into your latest rosters, continue an active game, or record your most recent result."
    >
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Card variant="outlined" sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 800 }}>
                Recent rosters
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
                        <Typography variant="body2" color="text.secondary">
                          {roster.army}
                        </Typography>
                      </Box>
                      <Chip label={`${roster.points} pts`} size="small" />
                    </Stack>
                  </Paper>
                ))}
              </Stack>
            </CardContent>

            <CardActions sx={{ px: 2, pb: 2 }}>
              <Button href="/armies/rosters" endIcon={<ArrowForwardIcon />}>
                Open all rosters
              </Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Stack spacing={3}>
            <DashboardActionCard
              title="Resume ongoing game"
              description="Continue tracking Might, Will, Fate, wounds and casualties."
              href="/play/games/current"
              icon={<SportsEsportsOutlinedIcon />}
              action="Open tracker"
            />

            <DashboardActionCard
              title="Add match result"
              description="Log your latest game and keep your match history complete."
              href="/play/games/new"
              icon={<HistoryOutlinedIcon />}
              action="Add result"
            />
          </Stack>
        </Grid>
      </Grid>
    </PageSection>
  );
}
