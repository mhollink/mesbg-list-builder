import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { RuleText } from "~/features/reference/shared/components/rule-text/RuleText.tsx";

interface RulesSectionProps {
  title: string;

  rules: Array<{
    id: string;
    name: string;
    description: string;
  }>;

  onRuleClick: (ruleId: string) => void;
}

export function RulesSection({ title, rules, onRuleClick }: RulesSectionProps) {
  return (
    <Box sx={{ px: 3, py: 2.5 }}>
      <Typography
        variant="overline"
        color="textSecondary"
        sx={{
          display: "block",
          mb: 1.5,
          fontWeight: 700,
        }}
      >
        {title}
      </Typography>

      <Stack spacing={3}>
        {rules.map((rule) => (
          <Box key={rule.id}>
            <Typography variant="subtitle2" sx={{ mb: 0.75, fontWeight: 700 }}>
              {rule.name}
            </Typography>

            <RuleText onRuleClick={onRuleClick}>{rule.description}</RuleText>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}
