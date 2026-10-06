import Stack from "@mui/material/Stack";

import { ProfileSection } from "./ProfileSection";
import { RuleText } from "~/features/reference/shared/components/rule-text/RuleText.tsx";

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
        <RuleText>
          {new Intl.ListFormat("en-GB", {
            style: "long",
            type: "conjunction",
          }).format(values)}
        </RuleText>
      ) : (
        <Stack sx={{ gap: 0.5 }}>
          {values.map((value) => (
            <RuleText key={value}>{value}</RuleText>
          ))}
        </Stack>
      )}
    </ProfileSection>
  );
}
