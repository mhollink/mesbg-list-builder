import type { ArmyListMatch } from "./army-list-finder.types.ts";
import type { LocalizedArmyList } from "~/features/reference/army-lists/army-lists.types.ts";

export function getMinimumMatchCount(selectedProfileCount: number): number {
  return Math.ceil(selectedProfileCount / 2);
}

export function findArmyListMatches(
  selectedProfileIds: string[],
  armyLists: LocalizedArmyList[],
): ArmyListMatch[] {
  if (selectedProfileIds.length === 0) {
    return [];
  }

  const minimumMatchCount = getMinimumMatchCount(selectedProfileIds.length);

  return armyLists.flatMap((armyList) => {
    const armyListProfileIds = new Set(
      armyList.profiles.map(({ profile }) => profile.profile),
    );

    const matchedProfileIds = selectedProfileIds.filter((profileId) =>
      armyListProfileIds.has(profileId),
    );

    if (matchedProfileIds.length < minimumMatchCount) {
      return [];
    }

    const missingProfileIds = selectedProfileIds.filter(
      (profileId) => !armyListProfileIds.has(profileId),
    );

    return [
      {
        armyList,
        matchedProfileIds,
        missingProfileIds,
        matchCount: matchedProfileIds.length,
        exactMatch: missingProfileIds.length === 0,
      },
    ];
  });
}

export function sortArmyListMatches(
  matches: ArmyListMatch[],
  locale: string,
): ArmyListMatch[] {
  return [...matches].sort(
    (a, b) =>
      b.matchCount - a.matchCount ||
      a.armyList.name.localeCompare(b.armyList.name, locale),
  );
}
