import { useTranslation } from "react-i18next";
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAlt1Outlined";
import Grid from "@mui/material/Grid";

import { DashboardActionCard } from "../components/DashboardActionCard.tsx";
import { PageSection } from "../components/PageSection";

const quickActions = [
  {
    key: "account",
    href: "/register",
    icon: <PersonAddAltOutlinedIcon />,
    primary: true,
  },
  {
    key: "build",
    href: "/armies/rosters/new",
    icon: <FactCheckOutlinedIcon />,
  },
  {
    key: "data",
    href: "/features",
    icon: <Inventory2OutlinedIcon />,
  },
];

export function NewPlayerSection() {
  const { t } = useTranslation("home", { keyPrefix: "new-player" });
  return (
    <PageSection
      eyebrow={t("eyebrow")}
      title={t("title")}
      description={t("description")}
    >
      <Grid container spacing={3}>
        {quickActions.map((action) => (
          <Grid key={action.key} size={{ xs: 12, md: 4 }}>
            <DashboardActionCard
              title={t(`cards.${action.key}.title`)}
              description={t(`cards.${action.key}.description`)}
              href={action.href}
              icon={action.icon}
              action={t(`cards.${action.key}.action`)}
              primary={action.primary}
            />
          </Grid>
        ))}
      </Grid>
    </PageSection>
  );
}
