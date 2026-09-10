import { useCallback, useDeferredValue, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import useMediaQuery from "@mui/material/useMediaQuery";

import { useAlphabetNavigation } from "../../hooks/useAlphabetNavigation";
import type { LocalizedProfile, ProfileAlignment } from "../profiles.types";
import { createProfileRows, filterProfiles } from "../profiles.utils";
import { useGameProfiles } from "./useGameProfiles";
import { useDrawerStack } from "~/features/drawer-stack/hooks/useDrawerStack.ts";

export const PROFILES_TOOLBAR_HEIGHT = 160;

export function useProfilesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { openProfileDrawer } = useDrawerStack();
  const { profiles, locale } = useGameProfiles();

  const tab = searchParams.get("tab");
  const activeAlignment: ProfileAlignment = (tab as ProfileAlignment) ?? "good";

  const handleProfileClick = useCallback(
    (profile: LocalizedProfile) => {
      openProfileDrawer(profile.profile);
    },
    [openProfileDrawer],
  );

  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);

  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  const filteredProfiles = useMemo(
    () => filterProfiles(profiles, activeAlignment, deferredSearch, locale),
    [profiles, activeAlignment, deferredSearch, locale],
  );

  const { rows, letterIndexes } = useMemo(
    () => createProfileRows(filteredProfiles),
    [filteredProfiles],
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
    stickyOffset: PROFILES_TOOLBAR_HEIGHT,
  });

  const selectAlignment = useCallback(
    (alignment: ProfileAlignment) => {
      setSearchParams((params) => {
        const next = new URLSearchParams(params);
        next.set("tab", alignment);
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

  return {
    activeAlignment,
    activeLetter,
    search,
    availableLetters,

    rows,
    resultCount: filteredProfiles.length,

    selectAlignment,
    selectLetter,
    changeSearch,
    registerLetter,
    handleProfileClick,
  };
}
