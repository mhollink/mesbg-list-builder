import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import type { LocalizedArmyListRule } from "../../army-lists.types.ts";
import { RuleText } from "~/features/reference/rules/components/rule-text/RuleText.tsx";

interface ArmyListRulesProps {
  rules: LocalizedArmyListRule[];
  onOpenRule: (ruleId: string) => void;
}

export function ArmyListRules({ rules, onOpenRule }: ArmyListRulesProps) {
  return (
    <Stack
      divider={<Divider />}
      sx={{
        gap: 3,
      }}
    >
      {rules.map((rule) => (
        <Stack
          key={rule.id}
          sx={{
            gap: 1,
          }}
        >
          <Typography
            component="h3"
            variant="h6"
            sx={{
              fontWeight: 700,
            }}
          >
            {rule.name}
          </Typography>

          {rule.description && (
            <RuleText onRuleClick={onOpenRule}>{rule.description}</RuleText>
          )}
        </Stack>
      ))}
    </Stack>
  );
}
