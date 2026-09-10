import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { ProfileSection } from "./ProfileSection";

interface ProfileValueListProps {
  title: string;
  values: string[];
  display?: "stacked" | "inline";
}

export function ProfileValueList({
  title,
  values,
  display = "stacked",
}: ProfileValueListProps) {
  if (values.length === 0) {
    return null;
  }

  return (
    <ProfileSection title={title}>
      {display === "inline" ? (
        <Typography>
          {new Intl.ListFormat("en-GB", {
            style: "long",
            type: "conjunction",
          }).format(values)}
        </Typography>
      ) : (
        <Stack sx={{ gap: 0.5 }}>
          {values.map((value) => (
            <Typography key={value}>{value}</Typography>
          ))}
        </Stack>
      )}
    </ProfileSection>
  );
}
