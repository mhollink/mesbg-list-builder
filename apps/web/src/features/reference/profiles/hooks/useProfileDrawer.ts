import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";

import type { ProfileDrawerContent } from "../components/profile-drawer/profile-drawer.types";
import { useGameProfiles } from "./useGameProfiles";
import { useAppDispatch } from "~/app/store/hooks";
import { openProfileDrawer, openRuleDrawer } from "~/app/store/uiSlice";
import { useDrawerStack } from "~/features/reference/hooks/useDrawerStack";
import { useGameRules } from "~/features/reference/rules/hooks/useGameRules";
import type {SpecialRuleRef} from "~/features/reference/profiles/profiles.types.ts";

export function useProfileDrawer() {
  const dispatch = useAppDispatch();

  const { profiles } = useGameProfiles();
  const { rules, locale: rulesLocale } = useGameRules();

  const { t } = useTranslation("game-data", {
    keyPrefix: "profiles",
  });

  const { activeDrawer, canGoBack, goBack, closeDrawer } = useDrawerStack();

  const profile = useMemo(() => {
    if (activeDrawer?.type !== "profile") {
      return undefined;
    }

    return profiles.find((profile) => profile.profile === activeDrawer.id);
  }, [activeDrawer, profiles]);

  const rulesById = useMemo(
    () => new Map(rules.map((rule) => [rule.id, rule])),
    [rules],
  );

  const profilesById = useMemo(
    () => new Map(profiles.map((profile) => [profile.profile, profile])),
    [profiles],
  );

  const content = useMemo<ProfileDrawerContent | undefined>(() => {
    if (!profile) {
      return undefined;
    }

    const translateAdditionalText = (id: string) =>
      t(`profiles.${profile.profile}.additional-text.${id}`);

    const resolveHeroic = (id: string) => ({
      id,
      name: rulesById.get(id)?.name ?? id,
    });

    const resolveRule = (ref: SpecialRuleRef) => {
      let name = rulesById.get(ref.id)?.name ?? ref.id;
      if (ref.parameter) {
        name = name.replace(/\([x|X]\)/, `(${ref.parameter})`)
      }
      return ({
        ...ref,
        name
      });
    };


    return {
      profile,

      additionalText: (profile.additionalText ?? [])?.map(
        translateAdditionalText,
      ),

      heroicActions: (profile.heroicActions ?? []).map(resolveHeroic),

      specialRules: (profile.specialRules ?? []).map(resolveRule),

      profileRules: (profile.profileRules ?? []).map((rule) => ({
        id: rule.id,
        type: rule.type,

        name: t(`profiles.${profile.profile}.rules.${rule.id}.name`, {
          lng: rulesLocale,
          defaultValue: rule.id,
        }),

        description: t(
          `profiles.${profile.profile}.rules.${rule.id}.description`,
          {
            lng: rulesLocale,
            defaultValue: "",
          },
        ),
      })),

      magicalPowers: (profile.magicPowers ?? []).map((power) => ({
        id: power.id,
        name:
          rulesById.get(power.id)?.name ??
          t(`profiles.${profile.profile}.magical-powers.${power.id}.name`, {
            defaultValue: power.id,
          }),
        cast: power.cast,
        range:
          power.range === "self"
            ? t("magical-power-ranges.self")
            : `${power.range}"`,
        ...(power.target
          ? {
              target: power.target,
            }
          : {}),
      })),

      options: (profile.options ?? []).map((option) => ({
        id: option.id,
        name: t(`options.${option.id}`, {
          defaultValue: option.id,
        }),
        points: option.points,
      })),

      additionalProfiles: (profile.additionalProfiles ?? []).map(
        (profileId) => ({
          id: profileId,
          name:
            profilesById.get(profileId)?.name ??
            t(`profiles.${profileId}.name`, {
              defaultValue: profileId,
            }),
        }),
      ),
    };
  }, [profile, profilesById, rulesById, rulesLocale, t]);

  const openRule = useCallback(
    (ruleId: string) => {
      dispatch(openRuleDrawer(ruleId));
    },
    [dispatch],
  );

  const openProfile = useCallback(
    (profileId: string) => {
      dispatch(openProfileDrawer(profileId));
    },
    [dispatch],
  );

  return {
    open: content !== undefined,
    content,

    canGoBack,
    goBack,
    close: closeDrawer,

    openRule,
    openProfile,
  };
}
