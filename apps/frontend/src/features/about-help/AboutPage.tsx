import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import GitHubIcon from "@mui/icons-material/GitHub";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { SupporterWall } from "./components/SupporterWall.tsx";
import supporterData from "./data/supporters.json";
import teamMembers from "./data/team-members.tsx";
import { TeamMemberCard } from "~/features/about-help/components/TeamMemberCard.tsx";
import type { Supporter } from "~/features/about-help/types/supporter.types.ts";

const supporters = supporterData as readonly Supporter[];

export function AboutPage() {
  return (
    <Box component="main">
      <Container maxWidth="lg">
        <Stack spacing={{ xs: 5, md: 8 }} divider={<Divider flexItem />}>
          <ProjectSection />
          <TeamSection />
          <SupportersSection />
        </Stack>
      </Container>
    </Box>
  );
}

function ProjectSection() {
  const { t } = useTranslation("about");

  return (
    <Stack
      component="section"
      aria-labelledby="project-title"
      spacing={{ xs: 3, sm: 4 }}
    >
      <Stack spacing={1.5}>
        <Typography
          component="p"
          variant="overline"
          color="primary"
          sx={{ fontWeight: 700 }}
        >
          {t("project.eyebrow")}
        </Typography>

        <Typography
          id="project-title"
          component="h1"
          variant="h3"
          sx={{ letterSpacing: "-0.025em", fontWeight: 800 }}
        >
          {t("project.title")}
        </Typography>

        <Typography
          variant="h6"
          color="textSecondary"
          sx={{
            maxWidth: 850,
            fontWeight: 400,
            lineHeight: 1.7,
          }}
        >
          {t("project.introduction")}
        </Typography>
      </Stack>

      <Stack
        spacing={2}
        sx={{
          maxWidth: 850,
          "& p": { lineHeight: 1.8 },
        }}
      >
        <Typography>{t("project.history")}</Typography>

        <Typography>{t("project.today")}</Typography>
      </Stack>

      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={1.5}
        sx={{
          alignItems: { xs: "stretch", sm: "center" },
        }}
      >
        <Button component={Link} to="/features" variant="contained">
          {t("project.featuresButton")}
        </Button>

        <Button
          component="a"
          href="https://github.com/mhollink/mesbg-list-builder"
          target="_blank"
          rel="noopener noreferrer"
          variant="outlined"
          startIcon={<GitHubIcon />}
        >
          {t("project.githubButton")}
        </Button>
      </Stack>

      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ maxWidth: 850 }}
      >
        {t("project.disclaimer")}
      </Typography>
    </Stack>
  );
}

function TeamSection() {
  const { t } = useTranslation("about");

  return (
    <Stack
      component="section"
      aria-labelledby="team-title"
      spacing={{ xs: 3, sm: 4 }}
    >
      <Stack spacing={1}>
        <Typography
          id="team-title"
          component="h2"
          variant="h4"
          sx={{ fontWeight: 700 }}
        >
          {t("team.title")}
        </Typography>

        <Typography color="textSecondary" sx={{ maxWidth: 760 }}>
          {t("team.description")}
        </Typography>
      </Stack>

      <Stack spacing={{ xs: 2, sm: 3 }}>
        {teamMembers.map((member, index) => (
          <TeamMemberCard
            key={member.name}
            {...member}
            avatarSide={index % 2 === 0 ? "left" : "right"}
          />
        ))}
      </Stack>
    </Stack>
  );
}

function SupportersSection() {
  const { t } = useTranslation("about");

  if (supporters.length === 0) {
    return null;
  }

  return (
    <Stack component="section" aria-labelledby="supporters-title" spacing={3}>
      <Stack spacing={1}>
        <Typography
          id="supporters-title"
          component="h2"
          variant="h4"
          sx={{ fontWeight: 700 }}
        >
          {t("supporters.title")}
        </Typography>

        <Typography color="text.secondary">
          {t("supporters.description")}
        </Typography>
      </Stack>

      <SupporterWall supporters={supporters} />

      <Button
        href="https://patreon.com/mesbg_list_builder"
        target="_blank"
        rel="noopener noreferrer"
        variant="outlined"
        sx={{ alignSelf: "center" }}
      >
        {t("supporters.action")}
      </Button>
    </Stack>
  );
}
