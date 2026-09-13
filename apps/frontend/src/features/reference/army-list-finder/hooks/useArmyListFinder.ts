import { useCallback, useMemo } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router";

import { MAX_SELECTED_PROFILES } from "../army-list-finder.constants.ts";
import {
  findArmyListMatches,
  sortArmyListMatches,
} from "../army-list-finder.utils.ts";
import { useGameArmyLists } from "~/features/reference/army-lists/hooks/useGameArmyLists.ts";
import { useGameProfiles } from "~/features/reference/profiles/hooks/useGameProfiles.ts";

export function useArmyListFinder() {
  const navigate = useNavigate();
  const location = useLocation();
  const { armyLists, locale } = useGameArmyLists();
  const { profiles } = useGameProfiles();
  const [searchParams, setSearchParams] = useSearchParams();

  const allSelectableProfiles = useMemo(
    () =>
      profiles
        .filter((profile) => profile.selectable)
        .sort((a, b) => a.name.localeCompare(b.name, locale)),
    [locale, profiles],
  );

  const profilesById = useMemo(
    () => new Map(profiles.map((profile) => [profile.profile, profile])),
    [profiles],
  );

  const validProfileIds = useMemo(
    () => new Set(allSelectableProfiles.map((profile) => profile.profile)),
    [allSelectableProfiles],
  );

  const requestedProfileIds = useMemo(
    () =>
      [...new Set(searchParams.getAll("profile"))]
        .filter((profileId) => validProfileIds.has(profileId))
        .slice(0, MAX_SELECTED_PROFILES),
    [searchParams, validProfileIds],
  );

  const selectedAlignment = useMemo(
    () =>
      requestedProfileIds
        .map((profileId) => profilesById.get(profileId))
        .find(
          (profile) =>
            profile?.alignment === "good" || profile?.alignment === "evil",
        )?.alignment,
    [profilesById, requestedProfileIds],
  );

  const selectedProfileIds = useMemo(
    () =>
      requestedProfileIds.filter((profileId) => {
        const profile = profilesById.get(profileId);

        if (!profile || !selectedAlignment) {
          return Boolean(profile);
        }

        return (
          profile.alignment === selectedAlignment ||
          profile.alignment === "both"
        );
      }),
    [profilesById, requestedProfileIds, selectedAlignment],
  );

  const selectedProfiles = useMemo(
    () =>
      selectedProfileIds.flatMap((profileId) => {
        const profile = profilesById.get(profileId);
        return profile ? [profile] : [];
      }),
    [profilesById, selectedProfileIds],
  );

  const selectableProfiles = useMemo(
    () =>
      allSelectableProfiles.filter(
        (profile) =>
          !selectedAlignment ||
          profile.alignment === selectedAlignment ||
          profile.alignment === "both",
      ),
    [allSelectableProfiles, selectedAlignment],
  );

  const matches = useMemo(
    () =>
      sortArmyListMatches(
        findArmyListMatches(selectedProfileIds, armyLists),
        locale,
      ),
    [armyLists, locale, selectedProfileIds],
  );

  const updateSelectedProfiles = useCallback(
    (profileIds: string[]) => {
      setSearchParams((current) => {
        const next = new URLSearchParams(current);

        next.delete("profile");

        for (const profileId of profileIds) {
          next.append("profile", profileId);
        }

        return next;
      });
    },
    [setSearchParams],
  );

  const addProfile = useCallback(
    (profileId: string) => {
      if (
        selectedProfileIds.length >= MAX_SELECTED_PROFILES ||
        selectedProfileIds.includes(profileId)
      ) {
        return;
      }

      updateSelectedProfiles([...selectedProfileIds, profileId]);
    },
    [selectedProfileIds, updateSelectedProfiles],
  );

  const removeProfile = useCallback(
    (profileId: string) => {
      updateSelectedProfiles(
        selectedProfileIds.filter((id) => id !== profileId),
      );
    },
    [selectedProfileIds, updateSelectedProfiles],
  );

  const clearProfiles = useCallback(() => {
    updateSelectedProfiles([]);
  }, [updateSelectedProfiles]);

  const openArmyList = useCallback(
    (armyListId: string) => {
      navigate(`/reference/armylists/${armyListId}`, {
        state: {
          backTo: `${location.pathname}${location.search}`,
        },
      });
    },
    [location.pathname, location.search, navigate],
  );

  return {
    selectableProfiles,
    selectedProfiles,
    selectedProfileIds,
    matches,
    canAddProfiles: selectedProfileIds.length < MAX_SELECTED_PROFILES,
    maximumProfiles: MAX_SELECTED_PROFILES,
    addProfile,
    removeProfile,
    clearProfiles,
    openArmyList,
  };
}
