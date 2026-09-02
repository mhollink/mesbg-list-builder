import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";

import { ProfileSection } from "./ProfileSection";

interface ProfileKeywordsProps {
  factions: string[];
}

export function ProfileKeywords({ factions }: ProfileKeywordsProps) {
  if (factions.length === 0) {
    return null;
  }

  return (
    <ProfileSection title="Factions">
      <Stack
        direction="row"
        useFlexGap
        sx={{
          gap: 0.75,
          flexWrap: "wrap",
        }}
      >
        {factions.map((faction) => (
          <Chip key={faction} label={faction} size="small" />
        ))}
      </Stack>
    </ProfileSection>
  );
}
