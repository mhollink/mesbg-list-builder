import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import CodeOutlinedIcon from "@mui/icons-material/CodeOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import HandshakeOutlinedIcon from "@mui/icons-material/HandshakeOutlined";
import RateReviewOutlinedIcon from "@mui/icons-material/RateReviewOutlined";
import VolunteerActivismOutlinedIcon from "@mui/icons-material/VolunteerActivismOutlined";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

const supportOptions = [
  {
    key: "share",
    icon: <GroupsOutlinedIcon fontSize="large" />,
    href: undefined,
  },
  {
    key: "feedback",
    icon: <RateReviewOutlinedIcon fontSize="large" />,
    href: "/feedback",
  },
  {
    key: "code",
    icon: <CodeOutlinedIcon fontSize="large" />,
    href: "https://github.com/mhollink/mesbg-list-builder",
  },
  {
    key: "financial",
    icon: <VolunteerActivismOutlinedIcon fontSize="large" />,
    href: "https://patreon.com/mesbg_list_builder",
  },
] as const;

const contributionGuidelines = [
  "focused",
  "discussion",
  "maintainability",
] as const;

export function SupportPage() {
  const { t } = useTranslation("support");

  return (
    <Box component="main">
      <Box>
        <Container maxWidth="lg">
          <Stack spacing={3} sx={{ maxWidth: "md" }}>
            <Typography
              component="p"
              variant="overline"
              color="primary"
              sx={{ fontWeight: 700 }}
            >
              {t("hero.eyebrow")}
            </Typography>

            <Typography
              component="h1"
              variant="h2"
              sx={{
                fontWeight: 800,
                letterSpacing: -1,
              }}
            >
              {t("hero.title")}
            </Typography>

            <Typography
              variant="h6"
              color="textSecondary"
              sx={{ lineHeight: 1.7 }}
            >
              {t("hero.description")}
            </Typography>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <Button
                component={Link}
                to="/feedback"
                variant="contained"
                size="large"
              >
                {t("hero.feedbackButton")}
              </Button>

              <Button component={Link} to="/" variant="outlined" size="large">
                {t("hero.homeButton")}
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Grid container spacing={3}>
          {supportOptions.map((option) => (
            <Grid key={option.key} size={{ xs: 12, sm: 6, md: 3 }}>
              <Card
                variant="outlined"
                sx={{
                  height: "100%",
                  borderRadius: 4,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Stack spacing={2}>
                    <Box color="primary.main">{option.icon}</Box>

                    <Typography
                      component="h2"
                      variant="h6"
                      sx={{ fontWeight: 700 }}
                    >
                      {t(`options.${option.key}.title`)}
                    </Typography>

                    <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
                      {t(`options.${option.key}.description`)}
                    </Typography>
                  </Stack>
                </CardContent>

                <CardActions sx={{ px: 2, pb: 2 }}>
                  {option.href ? (
                    <Button component={Link} to={option.href}>
                      {t(`options.${option.key}.action`)}
                    </Button>
                  ) : (
                    <Button disabled>
                      {t(`options.${option.key}.action`)}
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Box sx={{ bgcolor: "background.default", py: { xs: 6, md: 10 } }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} sx={{ alignItems: "center" }}>
            <Grid size={{ xs: 12, md: 5 }}>
              <Stack spacing={2}>
                <Box color="primary.main">
                  <HandshakeOutlinedIcon fontSize="large" />
                </Box>

                <Typography
                  component="h2"
                  variant="h4"
                  sx={{ fontWeight: 800 }}
                >
                  {t("contribute.title")}
                </Typography>

                <Typography color="textSecondary" sx={{ lineHeight: 1.7 }}>
                  {t("contribute.description")}
                </Typography>
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, md: 7 }}>
              <Stack spacing={2}>
                {contributionGuidelines.map((guideline) => (
                  <Card
                    key={guideline}
                    variant="outlined"
                    sx={{ borderRadius: 4 }}
                  >
                    <CardContent>
                      <Stack spacing={1}>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                          {t(`contribute.guidelines.${guideline}.title`)}
                        </Typography>

                        <Typography
                          color="textSecondary"
                          sx={{ lineHeight: 1.7 }}
                        >
                          {t(`contribute.guidelines.${guideline}.description`)}
                        </Typography>
                      </Stack>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="md" sx={{ py: { xs: 6, md: 10 } }}>
        <Card
          variant="outlined"
          sx={{
            borderRadius: 4,
            textAlign: "center",
          }}
        >
          <CardContent sx={{ p: { xs: 3, md: 5 } }}>
            <Stack spacing={3} sx={{ alignItems: "center" }}>
              <Box color="primary.main">
                <FavoriteBorderOutlinedIcon fontSize="large" />
              </Box>

              <Stack spacing={1.5}>
                <Typography
                  component="h2"
                  variant="h4"
                  sx={{ fontWeight: 800 }}
                >
                  {t("closing.title")}
                </Typography>

                <Typography color="textSecondary" sx={{ lineHeight: 1.7 }}>
                  {t("closing.description")}
                </Typography>
              </Stack>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <Button
                  component={Link}
                  to="/feedback"
                  variant="contained"
                  size="large"
                >
                  {t("closing.feedbackButton")}
                </Button>

                <Button
                  href="https://patreon.com/mesbg_list_builder"
                  variant="outlined"
                  size="large"
                >
                  {t("closing.financialButton")}
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
