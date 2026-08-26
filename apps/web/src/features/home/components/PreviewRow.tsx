import { Button, Stack, Typography } from "@mui/material";
import { Link } from "react-router";

export function PreviewRow({
  label,
  value,
  success = false,
  linkTo,
}: {
  label: string;
  value: string;
  success?: boolean;
  linkTo?: string;
}) {
  return (
    <Stack direction="row" spacing={2} sx={{ justifyContent: "space-between" }}>
      <Typography color="textSecondary">{label}</Typography>
      {linkTo ? (
        <Button
          variant="text"
          color={success ? "primary" : "inherit"}
          sx={{ fontWeight: 700, textAlign: "right" }}
          component={Link}
          to={linkTo}
        >
          {value}
        </Button>
      ) : (
        <Typography
          color={success ? "primary" : "textPrimary"}
          sx={{ fontWeight: 700, textAlign: "right" }}
        >
          {value}
        </Typography>
      )}
    </Stack>
  );
}
