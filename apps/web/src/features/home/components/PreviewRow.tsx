import { Link } from "react-router";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

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
