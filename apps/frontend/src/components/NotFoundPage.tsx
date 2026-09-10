import { useTranslation } from "react-i18next";
import { Link as RouterLink, useLocation, useNavigate } from "react-router";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { alpha } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

export function NotFoundPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation("notFound");

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate("/");
  };

  return (
    <Box
      component="main"
      sx={{
        minHeight: "calc(100vh - 130px)",
        display: "flex",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
        bgcolor: "background.default",
        py: {
          xs: 4,
          lg: 8,
        },
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          position: "relative",
          zIndex: 1,
        }}
      >
        <Paper
          variant="outlined"
          sx={{
            overflow: "hidden",
            borderColor: "divider",
            bgcolor: "background.paper",
          }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                lg: "minmax(0, 1.5fr) minmax(320px, 0.5fr)",
              },
              gridTemplateAreas: {
                xs: `"error" "content"`,
                lg: `"content error"`,
              },
            }}
          >
            <Stack
              spacing={3}
              sx={{
                p: {
                  xs: 3,
                  sm: 5,
                  lg: 7,
                },
                justifyContent: "center",
                gridArea: "content",
              }}
            >
              <Chip
                label={t("badge")}
                color="primary"
                variant="outlined"
                sx={{
                  alignSelf: "flex-start",
                  fontWeight: 700,
                }}
              />

              <Stack spacing={1.5}>
                <Typography
                  component="h1"
                  variant="h2"
                  sx={{
                    maxWidth: 720,
                    fontWeight: 800,
                    lineHeight: 1.08,
                    letterSpacing: "-0.03em",
                  }}
                >
                  {t("title")}
                </Typography>

                <Typography
                  color="textSecondary"
                  sx={{
                    maxWidth: 680,
                    fontSize: {
                      xs: "1rem",
                      sm: "1.1rem",
                    },
                    lineHeight: 1.75,
                  }}
                >
                  {t("description")}
                </Typography>
              </Stack>

              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.035),
                }}
              >
                <Typography
                  variant="caption"
                  color="textSecondary"
                  sx={{
                    display: "block",
                    mb: 0.5,
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  }}
                >
                  {t("requestedLocation")}
                </Typography>

                <Typography
                  component="code"
                  sx={{
                    display: "block",
                    overflowWrap: "anywhere",
                    color: "text.primary",
                    fontFamily: "monospace",
                    fontSize: "0.9rem",
                    lineHeight: 1.6,
                  }}
                >
                  {location.pathname}
                  {location.search}
                </Typography>
              </Paper>

              <Stack
                direction={{
                  xs: "column",
                  sm: "row",
                }}
                spacing={1.5}
              >
                <Button
                  component={RouterLink}
                  to="/"
                  variant="contained"
                  size="large"
                >
                  {t("actions.home")}
                </Button>

                <Button
                  component={RouterLink}
                  to="/rosters"
                  variant="outlined"
                  size="large"
                >
                  {t("actions.rosters")}
                </Button>

                <Button
                  type="button"
                  variant="text"
                  size="large"
                  onClick={handleGoBack}
                >
                  {t("actions.back")}
                </Button>
              </Stack>
            </Stack>

            <Box
              sx={{
                minHeight: {
                  xs: 280,
                  lg: 560,
                },
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                overflow: "hidden",
                borderBottom: {
                  xs: 1,
                  lg: 0,
                },
                borderLeft: {
                  xs: 0,
                  lg: 1,
                },
                borderColor: "divider",
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.025),
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  width: 260,
                  height: 260,
                  borderRadius: "50%",
                  border: 1,
                  borderColor: (theme) =>
                    alpha(theme.palette.primary.main, 0.16),
                }}
              />

              <Box
                sx={{
                  position: "absolute",
                  width: 190,
                  height: 190,
                  borderRadius: "50%",
                  border: 1,
                  borderColor: (theme) =>
                    alpha(theme.palette.primary.main, 0.12),
                }}
              />

              <Stack
                spacing={1}
                sx={{
                  position: "relative",
                  alignItems: "center",
                  zIndex: 1,
                  gridArea: "error",
                }}
              >
                <Typography
                  aria-hidden="true"
                  sx={{
                    fontSize: {
                      xs: "6rem",
                      sm: "8rem",
                      lg: "9rem",
                    },
                    fontWeight: 900,
                    lineHeight: 0.9,
                    letterSpacing: "-0.08em",
                    color: "primary.main",
                  }}
                >
                  404
                </Typography>

                <Divider
                  sx={{
                    width: 80,
                    borderColor: "primary.main",
                    opacity: 0.5,
                  }}
                />

                <Typography
                  color="textSecondary"
                  sx={{
                    fontWeight: 600,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  {t("error.label")}
                </Typography>
              </Stack>
            </Box>
          </Box>
        </Paper>

        <Typography
          variant="body2"
          color="textSecondary"
          sx={{
            mt: 2.5,
            textAlign: "center",
            lineHeight: 1.7,
          }}
        >
          {t("footer")}
        </Typography>
      </Container>
    </Box>
  );
}
