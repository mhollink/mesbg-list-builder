import type { ReactNode } from "react";
import { Link } from "react-router";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

export interface FeatureShowcaseProps {
  id: string;
  title: string;
  description: string;
  labels: string[];
  reverse?: boolean;
  imageSrc?: string;
  planned?: boolean;
  plannedLabel?: string;
  action?: {
    label: string;
    to: string;
  };
  preview?: ReactNode;
}

interface FeaturePreviewProps {
  imageSrc?: string;
  labels: string[];
  planned?: boolean;
  plannedLabel?: string;
}

function FeaturePreview({
  imageSrc,
  labels,
  planned = false,
  plannedLabel,
}: FeaturePreviewProps) {
  return (
    <Paper
      variant="outlined"
      sx={{
        position: "relative",
        minHeight: { xs: 300, sm: 360, md: 400 },
        borderRadius: 4,
        overflow: "hidden",
        bgcolor: "action.hover",
        backgroundImage:
          !planned && imageSrc ? `url("${imageSrc}")` : undefined,
        backgroundPosition: "top center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        isolation: "isolate",
        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          zIndex: 1,
          bgcolor: planned ? "rgba(0, 0, 0, 0.32)" : "rgba(0, 0, 0, 0.18)",
        },
        "&::after": {
          content: '""',
          position: "absolute",
          inset: 0,
          zIndex: 1,
          background:
            "linear-gradient(to top, rgba(0, 0, 0, 0.55) 0%, rgba(0, 0, 0, 0.25) 30%, rgba(0, 0, 0, 0.12) 68%, rgba(0, 0, 0, 0) 100%)",
        },
      }}
    >
      {planned ? (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            zIndex: 2,
            display: "grid",
            placeItems: "center",
            px: 3,
          }}
        >
          <Typography
            variant="h3"
            component="p"
            sx={{
              color: "common.white",
              fontWeight: 900,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              textAlign: "center",
            }}
          >
            {plannedLabel}
          </Typography>
        </Box>
      ) : (
        <Stack
          direction="row"
          spacing={1}
          useFlexGap
          sx={{
            position: "absolute",
            left: { xs: 2, sm: 3 },
            right: { xs: 2, sm: 3 },
            bottom: { xs: 2, sm: 3 },
            zIndex: 2,
            flexWrap: "wrap",
            p: 2,
          }}
        >
          {labels.slice(0, 4).map((label) => (
            <Chip
              key={label}
              label={label}
              size="small"
              sx={{
                color: "common.white",
                bgcolor: "rgba(18, 18, 18, 0.58)",
                border: "1px solid rgba(255, 255, 255, 0.24)",
                backdropFilter: "blur(6px)",
                fontWeight: 700,
              }}
            />
          ))}
        </Stack>
      )}
    </Paper>
  );
}

export function FeatureShowcase({
  id,
  title,
  description,
  labels,
  reverse = false,
  imageSrc,
  planned = false,
  plannedLabel,
  action,
  preview,
}: FeatureShowcaseProps) {
  return (
    <Box id={id} component="section" sx={{ scrollMarginTop: 96 }}>
      <Grid container spacing={{ xs: 4, md: 8 }} sx={{ alignItems: "center" }}>
        <Grid
          size={{ xs: 12, md: 5 }}
          sx={{ order: { xs: 1, md: reverse ? 2 : 1 } }}
        >
          <Stack spacing={2.5}>
            <Typography
              component="h2"
              variant="h3"
              sx={{ fontWeight: 900, letterSpacing: "-0.025em" }}
            >
              {title}
            </Typography>

            <Typography color="textSecondary" sx={{ lineHeight: 1.8 }}>
              {description}
            </Typography>

            {action ? (
              <Box>
                <Button
                  component={Link}
                  to={action.to}
                  endIcon={<ArrowForwardIcon />}
                >
                  {action.label}
                </Button>
              </Box>
            ) : null}
          </Stack>
        </Grid>

        <Grid
          size={{ xs: 12, md: 7 }}
          sx={{ order: { xs: 2, md: reverse ? 1 : 2 } }}
        >
          {preview ?? (
            <FeaturePreview
              imageSrc={imageSrc}
              labels={labels}
              planned={planned}
              plannedLabel={plannedLabel}
            />
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
