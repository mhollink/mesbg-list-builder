import { useTranslation } from "react-i18next";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { PageSection } from "../components/PageSection.tsx";

const workflow = ["choose", "build", "play", "track"];

export function HowItWorksSection() {
  const { t } = useTranslation("home", { keyPrefix: "flow" });
  return (
    <PageSection
      eyebrow={t("eyebrow")}
      title={t("title")}
      description={t("description")}
    >
      <Grid container spacing={2}>
        {workflow.map((step, index) => (
          <Grid key={step} size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper variant="outlined" sx={{ p: 2.5 }}>
              <Stack spacing={1}>
                <Chip label={index + 1} sx={{ alignSelf: "flex-start" }} />
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                  {t(`cards.${step}`)}
                </Typography>
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </PageSection>
  );
}
