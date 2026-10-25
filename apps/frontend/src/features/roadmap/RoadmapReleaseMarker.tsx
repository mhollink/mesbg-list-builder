import { useTranslation } from "react-i18next";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import type { RoadmapRelease } from "./roadmap.data.ts";

interface RoadmapReleaseMarkerProps {
  release: RoadmapRelease;
  hasNext: boolean;
}

export function RoadmapReleaseMarker({
  release,
  hasNext,
}: RoadmapReleaseMarkerProps) {
  const { t } = useTranslation("roadmap");
  const title = t(`releases.${release.id}.title`);

  return (
    <Box
      component="section"
      aria-label={title}
      sx={{
        display: "flex",
        alignItems: "stretch",
        gap: { xs: 1.5, sm: 2.5 },
      }}
    >
      <Stack
        sx={{
          flexShrink: 0,
          width: { xs: 40, sm: 56 },
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            width: { xs: 40, sm: 52 },
            height: { xs: 40, sm: 52 },
            borderRadius: "50%",
            border: 2,
            borderStyle: "dashed",
            borderColor: "primary.main",
            bgcolor: "background.paper",
            color: "primary.main",
            display: "grid",
            placeItems: "center",
          }}
        >
          <FlagOutlinedIcon aria-hidden="true" />
        </Box>
        {hasNext && (
          <Box
            sx={{
              width: 2,
              bgcolor: "divider",
              flexGrow: 1,
              minHeight: 24,
            }}
          />
        )}
      </Stack>

      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          mb: 2.5,
          p: { xs: 2, sm: 3 },
          border: 1,
          borderLeftWidth: 4,
          borderColor: "primary.main",
          borderRadius: 2,
          bgcolor: "action.hover",
        }}
      >
        <Stack spacing={0.5}>
          <Stack
            direction="row"
            useFlexGap
            spacing={1}
            sx={{ alignItems: "center", flexWrap: "wrap" }}
          >
            <Typography component="h2" variant="h6" sx={{ fontWeight: 800 }}>
              {title}
            </Typography>
            <Chip
              size="small"
              color="primary"
              variant="outlined"
              label={t("releases.estimate")}
            />
          </Stack>
          <Typography variant="body2" color="textSecondary">
            {t(`releases.${release.id}.description`)}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            {t("releases.disclaimer")}
          </Typography>
        </Stack>
      </Box>
    </Box>
  );
}
