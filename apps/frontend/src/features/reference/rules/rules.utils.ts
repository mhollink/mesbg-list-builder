import type { Rule, RuleRow, RuleType } from "./rules.types";
import { ALPHABET } from "~/features/reference/shared/reference.constants.ts";
import { normalizeSearchText } from "~/utils/normalize.ts";

export function getRuleLetter(name: string): string {
  const letter = name.trim().charAt(0).toUpperCase();

  return ALPHABET.includes(letter) ? letter : "#";
}

export function filterRules(
  rules: Rule[],
  category: RuleType,
  search: string,
  locale?: string,
): Rule[] {
  const query = normalizeSearchText(search);

  const collator = new Intl.Collator(locale, {
    sensitivity: "base",
    numeric: true,
  });

  return rules
    .filter((rule) => {
      return query
        ? normalizeSearchText(rule.name).includes(query) ||
            normalizeSearchText(rule.description).includes(query)
        : rule.category === category;
    })
    .sort((left, right) => collator.compare(left.name, right.name));
}

export function createRuleRows(rules: Rule[]) {
  const rows: RuleRow[] = [];
  const letterIndexes = new Map<string, number>();

  let previousLetter: string | undefined;

  for (const rule of rules) {
    const letter = getRuleLetter(rule.name);

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
      key: `rule:${rule.id}`,
      type: "rule",
      letter,
      rule,
    });
  }

  return {
    rows,
    letterIndexes,
  };
}
