import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { ProfileSection } from "./ProfileSection";

interface ProfileValueListProps {
  title: string;
  values: string[];
}

export function ProfileValueList({ title, values }: ProfileValueListProps) {
  if (values.length === 0) {
    return null;
  }

  return (
    <ProfileSection title={title}>
      <Stack sx={{ gap: 0.5 }}>
        {values.map((value) => (
          <Typography key={value}>{value}</Typography>
        ))}
      </Stack>
    </ProfileSection>
  );
}
