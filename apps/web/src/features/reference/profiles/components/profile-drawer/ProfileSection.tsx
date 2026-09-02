import type { PropsWithChildren } from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

interface ProfileSectionProps extends PropsWithChildren {
  title: string;
}

export function ProfileSection({ title, children }: ProfileSectionProps) {
  return (
    <Stack sx={{ gap: 1.25 }}>
      <Typography
        variant="overline"
        color="textSecondary"
        sx={{
          fontWeight: 700,
          lineHeight: 1.5,
        }}
      >
        {title}
      </Typography>

      {children}
    </Stack>
  );
}
