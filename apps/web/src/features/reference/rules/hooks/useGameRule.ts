import { useCallback } from "react";
import { useTranslation } from "react-i18next";

import type { Rule, RuleType } from "../rules.types";
import { useAppSelector } from "~/app/store/hooks.ts";
import rulesData from "~/generated/game-data/rules.json" with { type: "json" };

export function useGameRule() {
  const { t, i18n } = useTranslation("game-rules");

  const translatedGameRules = useAppSelector(
    (state) => state.settings.translatedGameRules,
  );

  const locale = i18n.resolvedLanguage ?? "en";
  const baseLanguage = locale.split("-")[0];

  const rulesLocale =
    baseLanguage !== "en" && translatedGameRules ? baseLanguage : "en";

  const getRule = useCallback(
    function getRule(ruleId: string): Rule | null {
      const rule = rulesData.find((candidate) => candidate.id === ruleId);

      if (!rule) return null;

      return {
        ...rule,
        category: rule.category as RuleType,
        name: t(`${rule.id}.name`, { lng: rulesLocale }),
        description: t(`${rule.id}.description`, { lng: rulesLocale }),
      };
    },
    [rulesLocale, t],
  );

  return {
    getRule,
    locale: rulesLocale,
    isTranslated: rulesLocale !== "en",
  };
}
