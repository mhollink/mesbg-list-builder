import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { useAppSelector } from "~/app/store/hooks.ts";
import type {
  ArmyList,
  LocalizedArmyList,
  LocalizedArmyListProfileOption,
  LocalizedArmyListRule,
} from "~/features/reference/army-lists/army-lists.types.ts";
import { formatArmyListId } from "~/features/reference/army-lists/army-lists.utils.ts";
import { useGameProfiles } from "~/features/reference/profiles/hooks/useGameProfiles.ts";
import armyListsData from "~/generated/game-data/army-lists.json" with {
  type: "json",
};

export function useGameArmyLists() {
  const { t: gameT, i18n } = useTranslation("game-data");
  const { t: uiT } = useTranslation("army-lists");
  const { profiles } = useGameProfiles();

  const translatedGameRules = useAppSelector(
    (state) => state.settings.translatedGameRules,
  );

  const locale = i18n.resolvedLanguage ?? "en";
  const baseLanguage = locale.split("-")[0];
  const rulesLocale =
    baseLanguage !== "en" && translatedGameRules ? baseLanguage : "en";

  const armyLists = useMemo<LocalizedArmyList[]>(() => {
    const profilesById = new Map(
      profiles.map((profile) => [profile.profile, profile]),
    );

    const translateFirst = (
      keys: Array<string | undefined>,
      fallback: string,
      lng = locale,
    ): string => {
      for (const key of keys) {
        if (!key) {
          continue;
        }

        const value = gameT(key, {
          lng,
          defaultValue: "",
        });

        if (typeof value === "string" && value.trim() !== "") {
          return value;
        }
      }

      return fallback;
    };

    const translateRule = (
      armyListId: string,
      ruleId: string,
    ): LocalizedArmyListRule => {
      return {
        id: ruleId,
        name: gameT(`armylists.${armyListId}.rules.${ruleId}.name`, {
          lng: rulesLocale,
          defaultValue: "",
        }),
        description: gameT(
          `armylists.${armyListId}.rules.${ruleId}.description`,
          {
            lng: rulesLocale,
            defaultValue: "",
          },
        ),
      };
    };

    return (armyListsData as ArmyList[]).map((armyList) => {
      const localizedProfiles = armyList.profiles.flatMap((armyListProfile) => {
        const profile = profilesById.get(armyListProfile.profileId);

        if (!profile) {
          console.warn(
            `Army list '${armyList.id}' references missing profile '${armyListProfile.profileId}'.`,
          );
          return [];
        }

        const canonicalOptions = new Map(
          (profile.options ?? []).map((option) => [option.id, option]),
        );

        const options: LocalizedArmyListProfileOption[] =
          armyListProfile.options.map((option) => {
            const canonicalOption = canonicalOptions.get(option.optionId);
            const translationKey =
              option.nameKeyOverride ?? `profiles.options.${option.optionId}`;

            return {
              ...option,
              name: translateFirst(
                [translationKey],
                formatArmyListId(option.id),
              ),
              points: option.pointsOverride ?? canonicalOption?.points,
            };
          });

        return [
          {
            ...armyListProfile,
            profile,
            tierName: uiT(`tiers.${armyListProfile.tier}`, {
              defaultValue: formatArmyListId(armyListProfile.tier),
            }),
            options,
          },
        ];
      });

      return {
        ...armyList,
        name: translateFirst(
          [`armylists.armies.${armyList.id}.name`],
          formatArmyListId(armyList.id),
        ),
        sourceName: translateFirst(
          [`books.${armyList.source.book}`],
          formatArmyListId(armyList.source.book),
        ),
        profiles: localizedProfiles,
        specialRules: armyList.specialRules.map((rule) =>
          translateRule(armyList.id, rule.id),
        ),
        additionalRules: armyList.additionalRules.map((rule) =>
          translateRule(armyList.id, rule.id),
        ),
        options: armyList.options?.map((option) => ({
          ...option,
          name: translateFirst(
            [
              option.nameKeyOverride,
              `armylists.armies.${armyList.id}.options.${option.id}.name`,
            ],
            formatArmyListId(option.id),
          ),
        })),
      };
    });
  }, [gameT, locale, profiles, rulesLocale, uiT]);

  return {
    armyLists,
    locale,
  };
}
