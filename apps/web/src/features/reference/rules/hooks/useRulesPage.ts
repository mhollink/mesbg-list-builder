import { useCallback, useDeferredValue, useMemo, useState } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";

import type { RuleType } from "../rules.types";
import { createRuleRows, filterRules } from "../rules.utils";
import { useAlphabetNavigation } from "./useAlphabetNavigation.ts";
import { useGameRules } from "./useGameRules";

export const RULES_TOOLBAR_HEIGHT = 160;

export function useRulesPage() {
  const { rules, locale } = useGameRules();

  const [activeType, setActiveType] = useState<RuleType>("special-rule");

  const [search, setSearch] = useState("");

  const deferredSearch = useDeferredValue(search);

  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  const filteredRules = useMemo(
    () => filterRules(rules, activeType, deferredSearch, locale),
    [activeType, deferredSearch, locale, rules],
  );

  const { rows, letterIndexes } = useMemo(
    () => createRuleRows(filteredRules),
    [filteredRules],
  );

  const availableLetters = useMemo(
    () => new Set(letterIndexes.keys()),
    [letterIndexes],
  );

  const {
    activeLetter,
    registerLetter,
    selectLetter: navigateToLetter,
  } = useAlphabetNavigation({
    stickyOffset: RULES_TOOLBAR_HEIGHT,
  });

  const selectType = useCallback((type: RuleType) => {
    setActiveType(type);
  }, []);

  const changeSearch = useCallback((value: string) => {
    setSearch(value);
  }, []);

  const selectLetter = useCallback(
    (letter: string) => {
      navigateToLetter(letter, reduceMotion ? "auto" : "smooth");
    },
    [navigateToLetter, reduceMotion],
  );

  return {
    activeType,
    activeLetter,
    search,
    availableLetters,

    rows,
    resultCount: filteredRules.length,

    selectType,
    selectLetter,
    changeSearch,
    registerLetter,
  };
}
