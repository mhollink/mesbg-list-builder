import { useCallback, useDeferredValue, useMemo, useState } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";

import { useAlphabetNavigation } from "../../hooks/useAlphabetNavigation.ts";
import type { Rule, RuleType } from "../rules.types";
import { createRuleRows, filterRules } from "../rules.utils";
import { useGameRules } from "./useGameRules";
import { useAppDispatch } from "~/app/store/hooks.ts";
import { openRuleDrawer } from "~/app/store/uiSlice.ts";

export const RULES_TOOLBAR_HEIGHT = 160;

export function useRulesPage() {
  const dispatch = useAppDispatch();
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

  const handleRuleClick = useCallback(
    (rule: Rule) => {
      dispatch(openRuleDrawer(rule.id));
    },
    [dispatch],
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
    handleRuleClick,
  };
}
