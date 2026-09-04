import Chip, { type ChipProps } from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { RuleText } from "../../../rules/components/rule-text/RuleText";
import { ProfileSection } from "./ProfileSection";
import type { ProfileDrawerRule } from "./profile-drawer.types";

interface ProfileProfileRulesProps {
  rules: ProfileDrawerRule[];
  onOpenRule: (ruleId: string) => void;
}

export function ProfileProfileRules({
  rules,
  onOpenRule,
}: ProfileProfileRulesProps) {
  if (rules.length === 0) {
    return null;
  }

  return (
    <ProfileSection title="Profile Rules">
      <Stack sx={{ gap: 3 }}>
        {rules.map((rule) => (
          <Stack
            key={rule.id}
            sx={{
              gap: 0.75,
            }}
          >
            <Stack
              direction="row"
              useFlexGap
              sx={{
                alignItems: "center",
                gap: 1,
                flexWrap: "wrap",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                }}
              >
                {rule.name}
              </Typography>

              <Chip
                label={formatRuleType(rule.type)}
                color={ruleTypeColor(rule.type)}
                size="small"
                variant="filled"
                sx={{
                  fontWeight: "bold",
                }}
              />
            </Stack>

            <RuleText onRuleClick={onOpenRule}>{rule.description}</RuleText>
          </Stack>
        ))}
      </Stack>
    </ProfileSection>
  );
}

function ruleTypeColor(type: string) {
  const colors: Record<string, ChipProps["color"]> = {
    active: "error",
    passive: "warning",
    "brutal-power-attack": "info",
  };

  return colors[type];
}

function formatRuleType(type: string): string {
  return type
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
