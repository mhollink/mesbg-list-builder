import { useTranslation } from "react-i18next";
import BugReportOutlinedIcon from "@mui/icons-material/BugReportOutlined";
import PhoneIphoneOutlinedIcon from "@mui/icons-material/PhoneIphoneOutlined";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { formatDate } from "../../../i18n/formatDate.ts";
import { PreviewRow } from "../components/PreviewRow.tsx";

export function StatusAndCommunitySection() {
  const { t } = useTranslation("home", { keyPrefix: "status" });

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 6 }}>
        <Card variant="outlined" sx={{ height: "100%" }}>
          <CardContent>
            <Stack spacing={2}>
              <Chip label="Data status" sx={{ alignSelf: "flex-start" }} />
              <Typography variant="h5" sx={{ fontWeight: 800 }}>
                MESBG 2024 data
              </Typography>
              <Typography color="textSecondary">
                {t("data.description")}
              </Typography>

              <Stack spacing={1}>
                <PreviewRow label={t("data.edition")} value="2024" />
                <PreviewRow
                  label={t("data.last-update")}
                  value={formatDate(new Date(BUILD_DATE))}
                />
                <PreviewRow label={t("data.version")} value={BUILD_VERSION} />
                <PreviewRow
                  label={t("data.known-issues")}
                  value={t("data.view-issues")}
                  linkTo="https://github.com/mhollink/mesbg-list-builder/issues"
                  success
                />
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <Card variant="outlined" sx={{ height: "100%" }}>
          <CardContent>
            <Stack spacing={2}>
              <Stack
                direction="row"
                spacing={1}
                useFlexGap
                sx={{ flexWrap: "wrap" }}
              >
                <Chip
                  icon={<BugReportOutlinedIcon />}
                  label={t("community.tags.report")}
                  variant="outlined"
                />
                <Chip
                  icon={<PhoneIphoneOutlinedIcon />}
                  label={t("community.tags.pwa")}
                  variant="outlined"
                />
              </Stack>

              <Typography variant="h5" sx={{ fontWeight: 800 }}>
                {t("community.title")}
              </Typography>

              <Typography color="textSecondary">
                {" "}
                {t("community.description")}
              </Typography>
            </Stack>
          </CardContent>

          <CardActions sx={{ px: 2, pb: 2, gap: 1, flexWrap: "wrap" }}>
            <Button href="/feedback" variant="contained">
              {t("community.report")}
            </Button>
            <Button href="/support" variant="outlined">
              {t("community.support")}
            </Button>
          </CardActions>
        </Card>
      </Grid>

      <Grid size={{ xs: 12 }} sx={{ placeItems: "center" }}>
        <Typography
          variant="body2"
          color="textSecondary"
          sx={{ textAlign: "center", maxWidth: "100ch" }}
        >
          {t("disclaimer")}
        </Typography>
      </Grid>
    </Grid>
  );
}
