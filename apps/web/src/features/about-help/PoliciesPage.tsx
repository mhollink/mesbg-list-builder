import { Trans, useTranslation } from "react-i18next";
import { Link as RouterLink } from "react-router";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { alpha } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

import { PolicyDocument } from "./components/PolicyDocument";
import { PolicySection } from "./components/PolicySection";

const CONTACT_EMAIL = "support@mesbg-list-builder.com";

export function PoliciesPage() {
  const { t } = useTranslation("policies");

  const items = (key: string) =>
    t(key, {
      returnObjects: true,
    }) as string[];

  return (
    <Box
      component="main"
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Container
          maxWidth="lg"
          sx={{
            position: "relative",
            py: {
              xs: 8,
              md: 11,
            },
          }}
        >
          <Stack
            spacing={3}
            sx={{
              maxWidth: 840,
            }}
          >
            <Typography
              component="h1"
              variant="h2"
              sx={{
                fontWeight: 800,
                lineHeight: 1.08,
                letterSpacing: "-0.03em",
              }}
            >
              {t("hero.title")}
            </Typography>

            <Typography
              color="textSecondary"
              sx={{
                maxWidth: 740,
                fontSize: {
                  xs: "1.05rem",
                  md: "1.2rem",
                },
                lineHeight: 1.7,
              }}
            >
              {t("hero.description")}
            </Typography>

            <Stack
              direction={{
                xs: "column",
                sm: "row",
              }}
              spacing={1.5}
            >
              <Button
                component="a"
                href="#privacy"
                variant="contained"
                size="large"
              >
                {t("hero.privacyButton")}
              </Button>

              <Button
                component="a"
                href="#fair-use"
                variant="outlined"
                size="large"
              >
                {t("hero.fairUseButton")}
              </Button>
            </Stack>

            <Typography variant="body2" color="textSecondary" sx={{ pt: 1 }}>
              {t("hero.lastUpdated", {
                date: t("hero.lastUpdatedDate"),
              })}
            </Typography>
          </Stack>
        </Container>
      </Box>

      <Container
        maxWidth="lg"
        sx={{
          py: {
            xs: 5,
            md: 8,
          },
        }}
      >
        <Stack spacing={5}>
          <PolicyDocument
            eyebrow={t("privacy.eyebrow")}
            title={t("privacy.title")}
            introduction={t("privacy.introduction")}
          >
            <PolicySection
              id="privacy"
              title={t("privacy.information.title")}
              description={t("privacy.information.description")}
              items={items("privacy.information.items")}
            />

            <PolicySection
              title={t("privacy.usage.title")}
              items={items("privacy.usage.items")}
            />

            <PolicySection
              title={t("privacy.userContent.title")}
              description={t("privacy.userContent.description")}
            />

            <PolicySection
              title={t("privacy.sharing.title")}
              description={t("privacy.sharing.description")}
              items={items("privacy.sharing.items")}
            />

            <PolicySection
              title={t("privacy.privateData.title")}
              description={t("privacy.privateData.description")}
            />

            <PolicySection
              title={t("privacy.retention.title")}
              items={items("privacy.retention.items")}
            />

            <PolicySection
              title={t("privacy.security.title")}
              description={t("privacy.security.description")}
            />

            <PolicySection
              title={t("privacy.rights.title")}
              description={t("privacy.rights.description")}
            >
              <Typography
                color="textSecondary"
                sx={{
                  mt: 2,
                  lineHeight: 1.75,
                }}
              >
                <Trans
                  ns="policies"
                  i18nKey="privacy.rights.request"
                  values={{
                    email: CONTACT_EMAIL,
                  }}
                  components={{
                    email: <Link href={`mailto:${CONTACT_EMAIL}`} />,
                  }}
                />
              </Typography>
            </PolicySection>

            <PolicySection
              title={t("privacy.changes.title")}
              description={t("privacy.changes.description")}
            />
          </PolicyDocument>

          <PolicyDocument
            eyebrow={t("fairUse.eyebrow")}
            title={t("fairUse.title")}
            introduction={t("fairUse.introduction")}
          >
            <PolicySection
              id="fair-use"
              title={t("fairUse.normalUse.title")}
              description={t("fairUse.normalUse.description")}
              items={items("fairUse.normalUse.items")}
            />

            <Paper
              variant="outlined"
              sx={{
                p: 3,
                borderRadius: 3,
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.045),
                borderColor: (theme) => alpha(theme.palette.primary.main, 0.24),
              }}
            >
              <Typography
                sx={{
                  fontWeight: 700,
                  lineHeight: 1.6,
                }}
              >
                {t("fairUse.frequentUse.title")}
              </Typography>

              <Typography
                color="textSecondary"
                sx={{
                  mt: 1,
                  lineHeight: 1.7,
                }}
              >
                {t("fairUse.frequentUse.description")}
              </Typography>
            </Paper>

            <PolicySection
              title={t("fairUse.excessiveUse.title")}
              description={t("fairUse.excessiveUse.description")}
              items={items("fairUse.excessiveUse.items")}
            />

            <PolicySection
              title={t("fairUse.limits.title")}
              description={t("fairUse.limits.description")}
            />

            <PolicySection
              title={t("fairUse.response.title")}
              items={items("fairUse.response.items")}
            />

            <PolicySection
              title={t("fairUse.communication.title")}
              description={t("fairUse.communication.description")}
            />

            <PolicySection
              title={t("fairUse.support.title")}
              description={t("fairUse.support.description")}
            />

            <Paper
              variant="outlined"
              sx={{
                p: 3,
                borderRadius: 3,
                bgcolor: (theme) => alpha(theme.palette.secondary.main, 0.045),
                borderColor: (theme) =>
                  alpha(theme.palette.secondary.main, 0.24),
              }}
            >
              <Typography
                sx={{
                  fontWeight: 700,
                  lineHeight: 1.6,
                }}
              >
                {t("fairUse.voluntarySupport.title")}
              </Typography>

              <Typography
                color="textSecondary"
                sx={{
                  mt: 1,
                  lineHeight: 1.7,
                }}
              >
                {t("fairUse.voluntarySupport.description")}
              </Typography>

              <Button
                component={RouterLink}
                to="/support"
                variant="outlined"
                sx={{ mt: 2.5 }}
              >
                {t("fairUse.voluntarySupport.button")}
              </Button>
            </Paper>

            <PolicySection
              title={t("fairUse.changes.title")}
              description={t("fairUse.changes.description")}
            />
          </PolicyDocument>

          <Paper
            variant="outlined"
            sx={{
              p: {
                xs: 3,
                sm: 4,
              },
              borderRadius: 4,
              textAlign: "center",
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.035),
            }}
          >
            <Typography
              component="h2"
              variant="h5"
              sx={{
                fontWeight: 700,
              }}
            >
              {t("contact.title")}
            </Typography>

            <Typography
              color="textSecondary"
              sx={{
                mt: 1,
                mx: "auto",
                maxWidth: 640,
                lineHeight: 1.7,
              }}
            >
              {t("contact.description")}
            </Typography>

            <Stack
              direction={{
                xs: "column",
                sm: "row",
              }}
              spacing={1.5}
              sx={{
                mt: 3,
                justifyContent: "center",
              }}
            >
              <Button
                component="a"
                href={`mailto:${CONTACT_EMAIL}`}
                variant="contained"
              >
                {t("contact.button")}
              </Button>

              <Button component={RouterLink} to="/" variant="text">
                {t("contact.homeButton")}
              </Button>
            </Stack>
          </Paper>
        </Stack>
      </Container>
    </Box>
  );
}
