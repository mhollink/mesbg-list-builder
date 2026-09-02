import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import type { LocalizedProfile, ProfileAlignment } from "../profiles.types";
import profilesData from "~/generated/game-data/profiles.json" with {
  type: "json",
};

export function useGameProfiles() {
  const { t, i18n } = useTranslation("game-data", { keyPrefix: "profiles" });

  const locale = i18n.resolvedLanguage ?? "en";

  const profiles: LocalizedProfile[] = useMemo(
    () =>
      profilesData.map(
        (profile) =>
          ({
            ...profile,
            alignment: profile.alignment as ProfileAlignment,
            name: t(`profiles.${profile.profile}.name`),
            originName: t(`origins.${profile.origin}`),
          }) satisfies LocalizedProfile,
      ),
    [t],
  );

  return {
    profiles,
    locale,
  };
}
