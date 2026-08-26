import { useState } from "react";
import { useTranslation } from "react-i18next";
import BugReportOutlinedIcon from "@mui/icons-material/BugReportOutlined";
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";
import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined";
import RateReviewOutlinedIcon from "@mui/icons-material/RateReviewOutlined";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import type { SelectChangeEvent } from "@mui/material";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Container from "@mui/material/Container";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

type FeedbackType =
  | "bug"
  | "incorrect-data"
  | "feature-request"
  | "usability"
  | "general";

type FeedbackFormState = {
  type: FeedbackType;
  title: string;
  description: string;
  contactEmail: string;
};

const feedbackOptions: readonly FeedbackType[] = [
  "bug",
  "incorrect-data",
  "feature-request",
  "usability",
  "general",
];

const feedbackOptionKeys: Record<FeedbackType, string> = {
  bug: "bug",
  "incorrect-data": "incorrectData",
  "feature-request": "featureRequest",
  usability: "usability",
  general: "general",
};

const feedbackCards = [
  {
    key: "bugs",
    icon: <BugReportOutlinedIcon fontSize="large" />,
  },
  {
    key: "data",
    icon: <FactCheckOutlinedIcon fontSize="large" />,
  },
  {
    key: "features",
    icon: <LightbulbOutlinedIcon fontSize="large" />,
  },
  {
    key: "general",
    icon: <RateReviewOutlinedIcon fontSize="large" />,
  },
] as const;

export function FeedbackPage() {
  const { t } = useTranslation("feedback");
  const [form, setForm] = useState<FeedbackFormState>({
    type: "general",
    title: "",
    description: "",
    contactEmail: "",
  });

  const handleTextChange =
    (field: keyof FeedbackFormState) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((current) => ({
        ...current,
        [field]: event.target.value,
      }));
    };

  const handleTypeChange = (event: SelectChangeEvent<FeedbackType>) => {
    setForm((current) => ({
      ...current,
      type: event.target.value as FeedbackType,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // TODO:
    // Replace this with your preferred implementation:
    // - POST to your API
    // - create a GitHub issue
    // - send an email
    // - store it in your database
    console.log("Feedback submitted", form);
  };

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
              color="text.secondary"
              sx={{ lineHeight: 1.7 }}
            >
              {t("hero.description")}
            </Typography>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Grid container spacing={3}>
          {feedbackCards.map((card) => (
            <Grid key={card.key} size={{ xs: 12, sm: 6, md: 3 }}>
              <Card
                variant="outlined"
                sx={{
                  height: "100%",
                  borderRadius: 4,
                }}
              >
                <CardContent>
                  <Stack spacing={2}>
                    <Box color="primary.main">{card.icon}</Box>

                    <Typography
                      component="h2"
                      variant="h6"
                      sx={{ fontWeight: 700 }}
                    >
                      {t(`cards.${card.key}.title`)}
                    </Typography>

                    <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
                      {t(`cards.${card.key}.description`)}
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Box sx={{ bgcolor: "background.default", pb: { xs: 8, md: 12 } }}>
        <Container maxWidth="md">
          <Card
            variant="outlined"
            sx={{
              borderRadius: 4,
              overflow: "hidden",
            }}
          >
            <CardContent sx={{ p: { xs: 3, md: 5 } }}>
              <Stack spacing={4}>
                <Stack spacing={1.5}>
                  <Typography
                    component="h2"
                    variant="h4"
                    sx={{ fontWeight: 800 }}
                  >
                    {t("form.title")}
                  </Typography>

                  <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
                    {t("form.description")}
                  </Typography>
                </Stack>

                <Alert severity="info">{t("form.rulebookNotice")}</Alert>

                <Alert severity="warning">
                  <Typography sx={{ fontWeight: 700 }}>
                    {t("form.languageNotice.title")}
                  </Typography>

                  <Typography variant="body2">
                    {t("form.languageNotice.description")}
                  </Typography>
                </Alert>

                <Box component="form" onSubmit={handleSubmit}>
                  <Stack spacing={3}>
                    <FormControl fullWidth>
                      <InputLabel id="feedback-type-label">
                        {t("form.type.label")}
                      </InputLabel>
                      <Select
                        labelId="feedback-type-label"
                        value={form.type}
                        label={t("form.type.label")}
                        onChange={handleTypeChange}
                      >
                        {feedbackOptions.map((option) => (
                          <MenuItem key={option} value={option}>
                            {t(
                              `form.type.options.${feedbackOptionKeys[option]}`,
                            )}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <TextField
                      label={t("form.fields.title.label")}
                      value={form.title}
                      onChange={handleTextChange("title")}
                      required
                      fullWidth
                      placeholder={t("form.fields.title.placeholder")}
                    />

                    <TextField
                      label={t("form.fields.description.label")}
                      value={form.description}
                      onChange={handleTextChange("description")}
                      required
                      fullWidth
                      multiline
                      minRows={6}
                      placeholder={t("form.fields.description.placeholder")}
                    />

                    <TextField
                      label={t("form.fields.contactEmail.label")}
                      value={form.contactEmail}
                      onChange={handleTextChange("contactEmail")}
                      fullWidth
                      type="email"
                      placeholder={t("form.fields.contactEmail.placeholder")}
                    />

                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      spacing={2}
                      sx={{
                        alignItems: { xs: "stretch", sm: "center" },
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography variant="body2" color="textSecondary">
                        {t("form.reviewNotice")}
                      </Typography>

                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        endIcon={<SendOutlinedIcon />}
                      >
                        {t("form.submit")}
                      </Button>
                    </Stack>
                  </Stack>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </Box>
  );
}
