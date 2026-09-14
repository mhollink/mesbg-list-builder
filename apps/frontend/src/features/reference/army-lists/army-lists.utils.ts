import { ALPHABET } from "./army-lists.constants.ts";
import type {
  ArmyListAlignment,
  ArmyListRow,
  LocalizedArmyList,
} from "./army-lists.types.ts";
import { normalizeSearchText } from "~/utils/normalize.ts";

export function formatArmyListId(id: string): string {
  return id
    .split("-")
    .filter(Boolean)
    .map((part) => {
      if (part.length === 0) {
        return part;
      }

      return part.charAt(0).toUpperCase() + part.slice(1);
    })
    .join(" ");
}

export function getArmyListLetter(name: string): string {
  const letter = name.trim().charAt(0).toUpperCase();

  return ALPHABET.includes(letter) ? letter : "#";
}

export function filterArmyLists(
  armyLists: LocalizedArmyList[],
  alignment: ArmyListAlignment,
  search: string,
  locale?: string,
): LocalizedArmyList[] {
  const query = search.trim().toLocaleLowerCase(locale);

  const collator = new Intl.Collator(locale, {
    sensitivity: "base",
    numeric: true,
  });

  return armyLists
    .filter((armyList) => armyList.alignment === alignment)
    .filter((armyList) => {
      if (!query) {
        return true;
      }

      const searchableValues = [
        armyList.name,
        armyList.sourceName,
        ...armyList.profiles.map(({ profile }) => profile.name),
        ...armyList.profiles.flatMap(({ profile }) => [
          ...profile.race,
          ...profile.factions,
          ...profile.unitTypes,
        ]),
        ...armyList.specialRules.map((rule) => rule.name),
        ...armyList.additionalRules.map((rule) => rule.name),
      ];

      const normalizedQuery = normalizeSearchText(query);
      return searchableValues.some((value) =>
        normalizeSearchText(value).includes(normalizedQuery),
      );
    })
    .sort((left, right) => collator.compare(left.name, right.name));
}

export function createArmyListRows(armyLists: LocalizedArmyList[]): {
  rows: ArmyListRow[];
  letterIndexes: Map<string, number>;
} {
  const rows: ArmyListRow[] = [];
  const letterIndexes = new Map<string, number>();

  let previousLetter: string | undefined;

  for (const armyList of armyLists) {
    const letter = getArmyListLetter(armyList.name);

    if (letter !== previousLetter) {
      previousLetter = letter;
      letterIndexes.set(letter, rows.length);

      rows.push({
        key: `letter:${letter}`,
        type: "letter",
        letter,
      });
    }

    rows.push({
      key: `army-list:${armyList.id}`,
      type: "army-list",
      letter,
      armyList,
    });
  }

  return {
    rows,
    letterIndexes,
  };
}
