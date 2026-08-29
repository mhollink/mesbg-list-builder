import {
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useListRef } from "react-window";
import useMediaQuery from "@mui/material/useMediaQuery";

import type { RuleType, VisibleRows } from "../rules.types";
import { createRuleRows, filterRules } from "../rules.utils";
import { useGameRules } from "./useGameRules";

export function useRulesPage() {
  const { rules, locale } = useGameRules();

  const [activeType, setActiveType] = useState<RuleType>("special-rule");
  const [search, setSearch] = useState("");
  const [activeLetter, setActiveLetter] = useState<string | false>(false);

  const deferredSearch = useDeferredValue(search);
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  const listRef = useListRef(null);

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

  /*
   * A new type or search result represents a different list.
   * Start browsing that list from the beginning.
   */
  useEffect(() => {
    setActiveLetter(rows[0]?.letter ?? false);

    if (rows.length > 0) {
      listRef.current?.scrollToRow({
        index: 0,
        align: "start",
      });
    }
  }, [rows, listRef]);

  const selectType = useCallback((type: RuleType) => {
    setActiveType(type);
  }, []);

  const changeSearch = useCallback((value: string) => {
    setSearch(value);
  }, []);

  const selectLetter = useCallback(
    (letter: string) => {
      const index = letterIndexes.get(letter);

      if (index === undefined) {
        return;
      }

      setActiveLetter(letter);

      listRef.current?.scrollToRow({
        index,
        align: "start",
        behavior: reduceMotion ? "auto" : "smooth",
      });
    },
    [letterIndexes, listRef, reduceMotion],
  );

  const handleRowsRendered = useCallback(
    ({ startIndex }: VisibleRows) => {
      const firstVisibleRow = rows[startIndex];

      if (!firstVisibleRow) {
        return;
      }

      setActiveLetter((current) =>
        current === firstVisibleRow.letter ? current : firstVisibleRow.letter,
      );
    },
    [rows],
  );

  return {
    activeType,
    search,
    activeLetter,
    availableLetters,

    rows,
    resultCount: filteredRules.length,

    listRef,

    selectType,
    changeSearch,
    selectLetter,
    handleRowsRendered,
  };
}
