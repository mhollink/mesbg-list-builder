import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAlt1Outlined";
import Grid from "@mui/material/Grid";

import { DashboardActionCard } from "../components/DashboardActionCard.tsx";
import { PageSection } from "../components/PageSection";

const quickActions = [
  {
    label: "Create your account",
    description:
      "Keep your rosters, match history, ongoing games and collection stored safely in one place.",
    href: "/register",
    icon: <PersonAddAltOutlinedIcon />,
    action: "Get started",
    primary: true,
  },
  {
    label: "Build your first roster",
    description:
      "Choose an army, add warbands and check points, bows, warriors and validation warnings as you build.",
    href: "/armies/rosters/new",
    icon: <FactCheckOutlinedIcon />,
    action: "Create roster",
  },
  {
    label: "Bring your hobby data together",
    description:
      "Track games, manage your collection and build a history around the armies you play most.",
    href: "/features",
    icon: <Inventory2OutlinedIcon />,
    action: "Explore tools",
  },
];

export function NewPlayerSection() {
  return (
    <PageSection
      eyebrow="Start"
      title="Everything you need before, during and after a game"
      description="Sign in to create your first roster, manage your collection and keep everything stored safely with your account."
    >
      <Grid container spacing={3}>
        {quickActions.map((action) => (
          <Grid key={action.label} size={{ xs: 12, md: 4 }}>
            <DashboardActionCard
              title={action.label}
              description={action.description}
              href={action.href}
              icon={action.icon}
              action={action.primary ? "Start now" : "Open"}
              primary={action.primary}
            />
          </Grid>
        ))}
      </Grid>
    </PageSection>
  );
}
