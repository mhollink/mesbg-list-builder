import BugReportOutlinedIcon from "@mui/icons-material/BugReportOutlined";
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";
import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined";
import RateReviewOutlinedIcon from "@mui/icons-material/RateReviewOutlined";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import type { SelectChangeEvent } from "@mui/material";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";

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

const feedbackOptions: Array<{
  value: FeedbackType;
  label: string;
}> = [
  {
    value: "bug",
    label: "Bug report",
  },
  {
    value: "incorrect-data",
    label: "Missing or incorrect data",
  },
  {
    value: "feature-request",
    label: "Feature idea",
  },
  {
    value: "usability",
    label: "Usability feedback",
  },
  {
    value: "general",
    label: "General feedback",
  },
];

const feedbackCards = [
  {
    title: "Report bugs",
    description:
      "Found something that does not work as expected? Share what happened, what you expected, and where you noticed the issue.",
    icon: <BugReportOutlinedIcon fontSize="large" />,
  },
  {
    title: "Improve data accuracy",
    description:
      "Missing options, incorrect profiles, or outdated information can be reported here so the list builder becomes more reliable for everyone.",
    icon: <FactCheckOutlinedIcon fontSize="large" />,
  },
  {
    title: "Suggest features",
    description:
      "Have an idea that would make list building, roster management, or game preparation easier? Describe the problem you want solved.",
    icon: <LightbulbOutlinedIcon fontSize="large" />,
  },
  {
    title: "Share general thoughts",
    description:
      "Not every piece of feedback has to be a bug or feature request. If something feels confusing, slow, awkward, or useful, that matters too.",
    icon: <RateReviewOutlinedIcon fontSize="large" />,
  },
];

export function FeedbackPage() {
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
              Feedback
            </Typography>

            <Typography
              component="h1"
              variant="h2"
              sx={{
                fontWeight: 800,
                letterSpacing: -1,
              }}
            >
              Help improve the List Builder
            </Typography>

            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ lineHeight: 1.7 }}
            >
              This project is shaped by real players using it for real games.
              Whether you found a bug, noticed incorrect data, or have an idea
              that would make list building easier, your feedback helps decide
              what gets improved next.
            </Typography>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Grid container spacing={3}>
          {feedbackCards.map((card) => (
            <Grid key={card.title} size={{ xs: 12, sm: 6, md: 3 }}>
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
                      {card.title}
                    </Typography>

                    <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
                      {card.description}
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
                    Send feedback
                  </Typography>

                  <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
                    Try to include enough context to make the feedback easy to
                    understand. For bug reports, the page, list, army, unit, or
                    action you were using is especially helpful.
                  </Typography>
                </Stack>

                <Alert severity="info">
                  Please avoid copying full rulebook text. A short description
                  of the issue, the affected unit or option, and the source you
                  are comparing against is enough.
                </Alert>

                <Box component="form" onSubmit={handleSubmit}>
                  <Stack spacing={3}>
                    <FormControl fullWidth>
                      <InputLabel id="feedback-type-label">
                        Feedback type
                      </InputLabel>
                      <Select
                        labelId="feedback-type-label"
                        value={form.type}
                        label="Feedback type"
                        onChange={handleTypeChange}
                      >
                        {feedbackOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <TextField
                      label="Title"
                      value={form.title}
                      onChange={handleTextChange("title")}
                      required
                      fullWidth
                      placeholder="Short summary of your feedback"
                    />

                    <TextField
                      label="Description"
                      value={form.description}
                      onChange={handleTextChange("description")}
                      required
                      fullWidth
                      multiline
                      minRows={6}
                      placeholder="Describe what happened, what you expected, or what you would like to improve."
                    />

                    <TextField
                      label="Contact email"
                      value={form.contactEmail}
                      onChange={handleTextChange("contactEmail")}
                      fullWidth
                      type="email"
                      placeholder="Optional, only needed if you want a reply"
                    />

                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      spacing={2}
                      sx={{
                        alignItems: { xs: "stretch", sm: "center" },
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        Feedback is reviewed manually and helps prioritize
                        future improvements.
                      </Typography>

                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        endIcon={<SendOutlinedIcon />}
                      >
                        Submit feedback
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
