import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import type { Rule, RuleType } from "../rules.types";
import rulesData from "~/generated/game-data/rules.json" with { type: "json" };

export function useGameRules() {
  const { t, i18n } = useTranslation("game-rules");

  const rules = useMemo(
    () =>
      rulesData.map((rule) => ({
        ...rule,
        category: rule.category as RuleType,
        name: t(`${rule.id}.name`),
        description: t(`${rule.id}.description`),
      })) satisfies Rule[],
    [t],
  );

  return {
    rules,
    locale: i18n.resolvedLanguage,
  };
}
