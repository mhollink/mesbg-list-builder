import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import type { LocalizedArmyListRule } from "../../army-lists.types.ts";
import { RuleText } from "~/features/reference/shared/components/rule-text/RuleText.tsx";

interface ArmyListRulesProps {
  rules: LocalizedArmyListRule[];
  onOpenRule: (ruleId: string) => void;
  display?: "block" | "list";
}

export function ArmyListRules({
  rules,
  onOpenRule,
  display = "block",
}: ArmyListRulesProps) {
  return (
    <Stack sx={{ gap: display === "block" ? 3 : 1.5 }}>
      {rules.map((rule) => (
        <Stack
          key={rule.id}
          sx={{
            gap: 1,
          }}
          component={display === "list" ? "li" : "div"}
        >
          {rule.name && (
            <Typography
              component="h3"
              variant="h6"
              sx={{
                fontWeight: 700,
              }}
            >
              {rule.name}
            </Typography>
          )}

          {rule.description && (
            <RuleText onRuleClick={onOpenRule}>{rule.description}</RuleText>
          )}
        </Stack>
      ))}
    </Stack>
  );
}
