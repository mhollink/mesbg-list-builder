import { useMemo } from "react";

import type { BuilderGameData } from "./builder-game-data.types.ts";
import type { LocalizedArmyListProfile } from "~/features/reference/army-lists/army-lists.types.ts";
import { useGameArmyLists } from "~/features/reference/army-lists/hooks/useGameArmyLists.ts";

export function useBuilderGameData(
    armyListId: string,
): BuilderGameData | undefined {
  const { armyLists } = useGameArmyLists();

  return useMemo(() => {
    const armyList = armyLists.find(
        (candidate) => candidate.id === armyListId,
    );

    if (!armyList) {
      return undefined;
    }

    const profilesById = new Map(
        armyList.profiles.map(({ profile }) => [
          profile.profile,
          profile,
        ]),
    );

    const armyListProfilesById = new Map(
        armyList.profiles.map((profile) => [
          profile.id,
          profile,
        ]),
    );

    const armyListProfilesByProfileId = new Map<
        string,
        LocalizedArmyListProfile[]
    >();

    for (const armyListProfile of armyList.profiles) {
      const profiles =
          armyListProfilesByProfileId.get(
              armyListProfile.profileId,
          ) ?? [];

      profiles.push(armyListProfile);

      armyListProfilesByProfileId.set(
          armyListProfile.profileId,
          profiles,
      );
    }

    return {
      armyList,
      profilesById,
      armyListProfilesById,
      armyListProfilesByProfileId,
    };
  }, [armyListId, armyLists]);
}