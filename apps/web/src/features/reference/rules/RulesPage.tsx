import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import rules from "~/generated/game-data/rules.json";
import {RuleText} from "~/features/reference/rules/components/RuleText.tsx";

export function RulesPage() {
  const { t } = useTranslation("game-rules");

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Rules
      </Typography>

      <Stack spacing={2}>
        {Object.values(rules).map((rule) => (
          <Box key={rule.id}>
            <Typography variant="h6" component="h2">
              {t(rule.nameKey)}
            </Typography>

            <RuleText>{t(rule.descriptionKey)}</RuleText>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}
