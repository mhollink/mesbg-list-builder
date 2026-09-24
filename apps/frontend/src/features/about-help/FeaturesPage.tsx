import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";
import InsightsOutlinedIcon from "@mui/icons-material/InsightsOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import SportsEsportsOutlinedIcon from "@mui/icons-material/SportsEsportsOutlined";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { FeatureShowcase } from "./components/FeatureShowcase.tsx";

type FeatureStatus = "available" | "development" | "planned";

interface FeatureSectionConfig {
  key:
    | "rosters"
    | "collection"
    | "play"
    | "history"
    | "battle-companies"
    | "tournaments"
    | "reference";
  icon: ReactNode;
  status: FeatureStatus;
  imageSrc?: string;
  actionTo?: string;
}

const sections: FeatureSectionConfig[] = [
  {
    key: "rosters",
    icon: <FactCheckOutlinedIcon />,
    status: "development",
    imageSrc: "/feature-previews/rosters.webp",
    actionTo: "/armies/rosters",
  },
  {
    key: "collection",
    icon: <Inventory2OutlinedIcon />,
    status: "planned",
  },
  {
    key: "play",
    icon: <SportsEsportsOutlinedIcon />,
    status: "planned",
  },
  {
    key: "history",
    icon: <InsightsOutlinedIcon />,
    status: "planned",
  },
  {
    key: "battle-companies",
    icon: <ShieldOutlinedIcon />,
    status: "planned",
  },
  {
    key: "tournaments",
    icon: <EmojiEventsOutlinedIcon />,
    status: "planned",
  },
  {
    key: "reference",
    icon: <MenuBookOutlinedIcon />,
    status: "available",
    imageSrc: "/feature-previews/references.webp",
    actionTo: "/reference/rules",
  },
];

export function FeaturesPage() {
  const { t } = useTranslation("features");

  const getLabels = (key: FeatureSectionConfig["key"]) =>
    t(`sections.${key}.features`, { returnObjects: true }) as string[];

  return (
    <Box component="main">
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Stack spacing={2}>
          <Typography
            component="p"
            variant="overline"
            color="primary"
            sx={{ fontWeight: 900, letterSpacing: 1 }}
          >
            {t("hero.eyebrow")}
          </Typography>

          <Typography
            component="h1"
            variant="h2"
            sx={{
              fontWeight: 900,
              letterSpacing: "-0.035em",
            }}
          >
            {t("hero.title")}
          </Typography>

          <Typography
            variant="h6"
            color="textSecondary"
            sx={{ lineHeight: 1.7, maxWidth: 760 }}
          >
            {t("hero.description")}
          </Typography>
        </Stack>
      </Container>

      <Container maxWidth="lg" sx={{ pb: { xs: 8, md: 14 } }}>
        <Stack spacing={{ xs: 6, md: 10 }} divider={<Divider flexItem />}>
          {sections.map((section, index) => {
            const planned = section.status === "planned";
            const action = section.actionTo
              ? {
                  label: t(`sections.${section.key}.action`),
                  to: section.actionTo,
                }
              : undefined;

            return (
              <FeatureShowcase
                key={section.key}
                id={section.key}
                title={t(`sections.${section.key}.title`)}
                description={t(`sections.${section.key}.description`)}
                labels={getLabels(section.key)}
                reverse={index % 2 === 1}
                imageSrc={section.imageSrc}
                planned={planned}
                plannedLabel={t("statuses.planned")}
                action={action}
              />
            );
          })}
        </Stack>
      </Container>
    </Box>
  );
}
