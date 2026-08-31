import { useCallback, useDeferredValue, useMemo, useState } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";

import { useAlphabetNavigation } from "../../hooks/useAlphabetNavigation";
import type { LocalizedProfile, ProfileAlignment } from "../profiles.types";
import { createProfileRows, filterProfiles } from "../profiles.utils";
import { useGameProfiles } from "./useGameProfiles";
import { useAppDispatch } from "~/app/store/hooks.ts";
import { openProfileDrawer } from "~/app/store/uiSlice.ts";

export const PROFILES_TOOLBAR_HEIGHT = 160;

export function useProfilesPage() {
  const { profiles, locale } = useGameProfiles();
  const dispatch = useAppDispatch();

  const handleProfileClick = useCallback(
    (profile: LocalizedProfile) => {
      dispatch(openProfileDrawer(profile.profile));
    },
    [dispatch],
  );

  const [activeAlignment, setActiveAlignment] =
    useState<ProfileAlignment>("good");

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

  const selectAlignment = useCallback((alignment: ProfileAlignment) => {
    setActiveAlignment(alignment);
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
