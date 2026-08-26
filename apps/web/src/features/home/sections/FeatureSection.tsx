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
  {
    title: "Build valid army lists",
    description:
      "Create warbands, add heroes and warriors, track points, bows, throwing weapons and validation warnings.",
    icon: <FactCheckOutlinedIcon />,
  },
  {
    title: "Use profile cards",
    description:
      "Open clean profile cards while building, printing or playing at the table.",
    icon: <PrintOutlinedIcon />,
  },
  {
    title: "Play with digital trackers",
    description:
      "Track Might, Will, Fate, wounds, break points and casualties during a game.",
    icon: <SportsEsportsOutlinedIcon />,
  },
  {
    title: "Manage your collection",
    description:
      "Enable collection checks so lists can warn you when models or loadouts are missing.",
    icon: <Inventory2OutlinedIcon />,
  },
  {
    title: "Track match history",
    description:
      "Record results by army, opponent, scenario and points level to learn from your games.",
    icon: <HistoryOutlinedIcon />,
  },
  {
    title: "Made for the community",
    description:
      "Report data issues, suggest improvements and help keep the builder accurate.",
    icon: <GroupsOutlinedIcon />,
  },
];

export function FeatureSection() {
  return (
    <PageSection
      eyebrow="Features"
      title="Built around the actual tabletop flow"
      description="Your rosters, match history, ongoing games and collection are tied to your account, so the List Builder can stay consistent across devices without manual syncing."
    >
      <Grid container spacing={3}>
        {features.map((feature) => (
          <Grid key={feature.title} size={{ xs: 12, sm: 6, md: 4 }}>
            <Card variant="outlined" sx={{ height: "100%" }}>
              <CardContent>
                <Stack spacing={2}>
                  <IconSurface>{feature.icon}</IconSurface>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>
                      {feature.title}
                    </Typography>
                    <Typography color="text.secondary" sx={{ mt: 1 }}>
                      {feature.description}
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
