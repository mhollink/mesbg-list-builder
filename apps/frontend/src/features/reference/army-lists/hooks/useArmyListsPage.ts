import { useCallback, useDeferredValue, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import useMediaQuery from "@mui/material/useMediaQuery";

import type {
  ArmyListAlignment,
  LocalizedArmyList,
} from "../army-lists.types.ts";
import { createArmyListRows, filterArmyLists } from "../army-lists.utils.ts";
import { useGameArmyLists } from "./useGameArmyLists.ts";
import { useAlphabetNavigation } from "~/features/reference/shared/hooks/useAlphabetNavigation.ts";

export const ARMY_LISTS_TOOLBAR_HEIGHT = 160;

export function useArmyListsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { armyLists, locale } = useGameArmyLists();

  const tab = searchParams.get("tab");
  const activeAlignment: ArmyListAlignment = tab === "evil" ? "evil" : "good";

  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  const filteredArmyLists = useMemo(
    () => filterArmyLists(armyLists, activeAlignment, deferredSearch, locale),
    [armyLists, activeAlignment, deferredSearch, locale],
  );

  const { rows, letterIndexes } = useMemo(
    () => createArmyListRows(filteredArmyLists),
    [filteredArmyLists],
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
    stickyOffset: ARMY_LISTS_TOOLBAR_HEIGHT,
  });

  const selectAlignment = useCallback(
    (alignment: ArmyListAlignment) => {
      setSearchParams((params) => {
        const next = new URLSearchParams(params);
        next.set("tab", alignment);
        return next;
      });
    },
    [setSearchParams],
  );

  const selectLetter = useCallback(
    (letter: string) => {
      navigateToLetter(letter, reduceMotion ? "auto" : "smooth");
    },
    [navigateToLetter, reduceMotion],
  );

  const changeSearch = useCallback((value: string) => {
    setSearch(value);
  }, []);

  const handleArmyListClick = useCallback(
    (armyList: LocalizedArmyList) => {
      navigate(`/reference/armylists/${armyList.id}`);
    },
    [navigate],
  );

  return {
    activeAlignment,
    activeLetter,
    search,
    availableLetters,

    rows,
    resultCount: filteredArmyLists.length,

    selectAlignment,
    selectLetter,
    changeSearch,
    registerLetter,
    handleArmyListClick,
  };
}
