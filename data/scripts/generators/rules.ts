import { parseRows } from "../excel/parseSheet";
import { readFile, readSheet } from "../excel/readSheet";
import { ruleRowSchema } from "../schemas";
import type { Rule, RuleRow } from "../types/rule";

export function generateRules(filename: string): Rule[] {
  const workbook = readFile(filename);
  const sheet = readSheet(workbook, "Rules");
  const rows = parseRows(sheet, ruleRowSchema, "rule");

  validateRules(rows);

  return rows.map(mapRule);
}

function mapRule(row: RuleRow): Rule {
  return {
    id: row.id,
    category: row.category,
    ...(row.type ? { type: row.type } : {}),
    source: {
      book: row.source_book,
      page: Number(row.source_page),
    },
  };
}

function validateRules(rules: RuleRow[]): void {
  const ids = new Set<string>();

  for (const rule of rules) {
    if (ids.has(rule.id)) {
      throw new Error(`Duplicate rule id '${rule.id}'`);
    }

    ids.add(rule.id);
  }
}
