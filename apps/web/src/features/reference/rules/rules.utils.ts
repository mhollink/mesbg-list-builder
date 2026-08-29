import {
  ALPHABET,
  LETTER_ROW_HEIGHT,
  RULE_ROW_HEIGHT,
} from "./rules.constants";
import type { Rule, RuleRow, RuleRowProps, RuleType } from "./rules.types";

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
  const query = search.trim().toLocaleLowerCase(locale);

  const collator = new Intl.Collator(locale, {
    sensitivity: "base",
    numeric: true,
  });

  return rules
    .filter((rule) => rule.category === category)
    .filter((rule) => {
      if (!query) {
        return true;
      }

      return (
        rule.name.toLocaleLowerCase(locale).includes(query) ||
        rule.description.toLocaleLowerCase(locale).includes(query)
      );
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

export function getRuleRowHeight(index: number, { rows }: RuleRowProps) {
  return rows[index]?.type === "letter" ? LETTER_ROW_HEIGHT : RULE_ROW_HEIGHT;
}

export function getRuleRowKey(index: number, { rows }: RuleRowProps) {
  return rows[index]?.key ?? index;
}
