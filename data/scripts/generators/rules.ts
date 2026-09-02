import { parseRows } from "../excel/parseSheet";
import { readFile, readSheet } from "../excel/readSheet";
import { ruleRowSchema } from "../schemas";
import type { Rule, RuleRow } from "../types/rule";

export function generateRules(filename: string): Rule[] {
  const workbook = readFile(filename);

  const rows = parseRows(readSheet(workbook, "Rules"), ruleRowSchema, "rule");

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

function validateRules(rows: RuleRow[]): void {
  const ids = new Set<string>();

  for (const row of rows) {
    if (ids.has(row.id)) {
      throw new Error(`Duplicate rule id '${row.id}'`);
    }

    ids.add(row.id);
  }
}
