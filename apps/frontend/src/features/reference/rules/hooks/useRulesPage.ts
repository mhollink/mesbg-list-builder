import { useCallback, useDeferredValue, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import useMediaQuery from "@mui/material/useMediaQuery";

import { useAlphabetNavigation } from "../../hooks/useAlphabetNavigation.ts";
import type { Rule, RuleType } from "../rules.types";
import { createRuleRows, filterRules } from "../rules.utils";
import { useGameRules } from "./useGameRules";
import { useDrawerStack } from "~/features/drawer-stack/hooks/useDrawerStack.ts";

export const RULES_TOOLBAR_HEIGHT = 160;

export function useRulesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { openRuleDrawer } = useDrawerStack();
  const { rules, locale } = useGameRules();

  const tab = searchParams.get("tab");
  const activeType: RuleType = (tab as RuleType) ?? "special-rule";

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

  const selectType = useCallback(
    (type: RuleType) => {
      setSearchParams((params) => {
        const next = new URLSearchParams(params);
        next.set("tab", type);
        return next;
      });
    },
    [setSearchParams],
  );

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
      openRuleDrawer(rule.id);
    },
    [openRuleDrawer],
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
