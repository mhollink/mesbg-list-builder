import { useTranslation } from "react-i18next";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { RosterPreviewCard } from "../components/RosterPreviewCard.tsx";

export function HeroSection({ returningUser }: { returningUser: boolean }) {
  const { t } = useTranslation("home");

  return (
    <Box>
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 14 } }}>
        <Grid container spacing={5} sx={{ alignItems: "center" }}>
          <Grid size={{ xs: 12, md: 7 }}>
            <Stack spacing={3}>
              <Stack
                direction="row"
                spacing={1}
                useFlexGap
                sx={{ flexWrap: "wrap" }}
              >
                <Chip label="MESBG 2024" color="primary" />
                <Chip label="Army lists" variant="outlined" />
                <Chip label="Game tracker" variant="outlined" />
              </Stack>

              <Box>
                <Typography
                  variant="h2"
                  component="h1"
                  sx={{
                    maxWidth: 760,
                    fontWeight: 800,
                    letterSpacing: "-0.04em",
                    fontSize: { xs: "2.5rem", md: "4.25rem" },
                  }}
                >
                  {t("hero.title")}
                </Typography>

                <Typography
                  variant="h6"
                  color="textSecondary"
                  sx={{ mt: 2, maxWidth: 680, lineHeight: 1.6 }}
                >
                  {t("hero.description")}
                </Typography>
              </Box>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                {returningUser ? (
                  <>
                    <Button
                      href="/armies/rosters/new"
                      size="large"
                      variant="contained"
                      endIcon={<ArrowForwardIcon />}
                    >
                      {t("hero.cta.create-roster")}
                    </Button>
                    <Button
                      href="/armies/rosters"
                      size="large"
                      variant="outlined"
                    >
                      {t("hero.cta.view-rosters")}
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      href="/login"
                      size="large"
                      variant="contained"
                      endIcon={<ArrowForwardIcon />}
                    >
                      {" "}
                      {t("hero.cta.sign-in")}
                    </Button>
                    <Button href="/register" size="large" variant="outlined">
                      {t("hero.cta.create-account")}
                    </Button>
                  </>
                )}
              </Stack>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 5 }}>
            <RosterPreviewCard />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
