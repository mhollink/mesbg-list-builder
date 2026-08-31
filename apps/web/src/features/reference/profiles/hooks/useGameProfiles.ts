import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import type {
  LocalizedProfile,
  ProfileAlignment,
  Stats,
} from "../profiles.types";
import profilesData from "~/generated/game-data/profiles.json" with {
  type: "json",
};

export function useGameProfiles() {
  const { t, i18n } = useTranslation("game-data", { keyPrefix: "profiles" });

  const locale = i18n.resolvedLanguage ?? "en";

  const profiles: LocalizedProfile[] = useMemo(() => {
    const translateKeyword = (group: string, id: string) =>
      t(`keywords.${group}.${id}`, {
        defaultValue: id,
      });

    return profilesData.map(
      (profile) =>
        ({
          ...profile,
          name: t(`profiles.${profile.profile}.name`),
          originName: t(`origins.${profile.origin}`),
          alignment: profile.alignment as ProfileAlignment,
          stats: profile.stats as Stats,
          race: profile.race.map((race) => translateKeyword("races", race)),
          factions: profile.factions.map((faction) =>
            translateKeyword("factions", faction),
          ),
          unitTypes: profile.unitTypes.map((unitType) =>
            translateKeyword("unit-types", unitType),
          ),
          wargear: profile.wargear.map((item) =>
            t(`wargear.${item}`, { defaultValue: item }),
          ),
        }) satisfies LocalizedProfile,
    );
  }, [t]);

  return {
    profiles,
    locale,
  };
}
