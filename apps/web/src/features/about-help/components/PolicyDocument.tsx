import { Divider, Paper, Stack, Typography } from "@mui/material";

type PolicyDocumentProps = {
  eyebrow: string;
  title: string;
  introduction: string;
  children: React.ReactNode;
};

export function PolicyDocument({
  eyebrow,
  title,
  introduction,
  children,
}: PolicyDocumentProps) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: {
          xs: 3,
          sm: 4,
          md: 5,
        },
        borderRadius: 4,
        borderColor: "divider",
        bgcolor: "background.paper",
      }}
    >
      <Stack spacing={1.5}>
        <Typography
          variant="overline"
          color="primary.main"
          sx={{
            fontWeight: 700,
            letterSpacing: "0.12em",
          }}
        >
          {eyebrow}
        </Typography>

        <Typography
          component="h2"
          variant="h3"
          sx={{
            fontWeight: 800,
            lineHeight: 1.15,
          }}
        >
          {title}
        </Typography>

        <Typography
          color="text.secondary"
          sx={{
            maxWidth: 760,
            fontSize: {
              xs: "1rem",
              sm: "1.0625rem",
            },
            lineHeight: 1.75,
          }}
        >
          {introduction}
        </Typography>
      </Stack>

      <Divider sx={{ my: 4 }} />

      <Stack spacing={4}>{children}</Stack>
    </Paper>
  );
}
