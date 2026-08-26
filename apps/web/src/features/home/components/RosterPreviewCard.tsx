import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { alpha } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

import { PreviewRow } from "./PreviewRow.tsx";

export function RosterPreviewCard() {
  const { t } = useTranslation("home", { keyPrefix: "hero.roster-preview" });

  return (
    <Paper
      elevation={0}
      sx={(theme) => ({
        p: 2,
        border: 1,
        borderColor: "divider",
        backgroundColor: alpha(theme.palette.background.paper, 0.88),
        backdropFilter: "blur(14px)",
      })}
    >
      <Stack spacing={2}>
        <Stack
          direction="row"
          spacing={2}
          sx={{ justifyContent: "space-between" }}
        >
          <Box>
            <Typography variant="overline" color="textSecondary">
              {t("eyebrow")}
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>
              Moria
            </Typography>
          </Box>
          <Chip label={`650 ${t("points")}`} color="primary" />
        </Stack>

        <Divider />

        <Stack spacing={1.25}>
          <PreviewRow
            label={t("leader")}
            value="Durburz, Goblin-King of Moria"
          />
          <PreviewRow label={t("warbands")} value="5" />
          <PreviewRow label={t("models")} value="56" />
          <PreviewRow label={t("bows")} value="9 / 17" />
          <PreviewRow label={t("throwing-weapons")} value="12 / 17" />
          <PreviewRow label={t("warnings")} value={t("none")} />
        </Stack>

        <Button href="/armies/rosters/new" variant="contained" fullWidth>
          {t("cta")}
        </Button>
      </Stack>
    </Paper>
  );
}
