import { ALPHABET } from "./profiles.constants";
import type {
  LocalizedProfile,
  ProfileAlignment,
  ProfileRow,
} from "./profiles.types";

export function getProfileLetter(name: string): string {
  const letter = name.trim().charAt(0).toUpperCase();

  return ALPHABET.includes(letter) ? letter : "#";
}

export function filterProfiles(
  profiles: LocalizedProfile[],
  alignment: ProfileAlignment,
  search: string,
  locale?: string,
): LocalizedProfile[] {
  const query = search.trim().toLocaleLowerCase(locale);

  const collator = new Intl.Collator(locale, {
    sensitivity: "base",
    numeric: true,
  });

  return profiles
    .filter((profile) => profile.alignment === alignment)
    .filter((profile) => {
      if (!query) {
        return true;
      }

      return (
        profile.name.toLocaleLowerCase(locale).includes(query) ||
        profile.originName.toLocaleLowerCase(locale).includes(query)
      );
    })
    .sort((left, right) => collator.compare(left.name, right.name));
}

export function createProfileRows(profiles: LocalizedProfile[]) {
  const rows: ProfileRow[] = [];
  const letterIndexes = new Map<string, number>();

  let previousLetter: string | undefined;

  for (const profile of profiles) {
    const letter = getProfileLetter(profile.name);

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
      key: `profile:${profile.profile}`,
      type: "profile",
      letter,
      profile,
    });
  }

  return {
    rows,
    letterIndexes,
  };
}
