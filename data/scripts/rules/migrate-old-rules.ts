// @ts-expect-error
import { existsSync } from "node:fs";
// @ts-expect-error
import { mkdir } from "node:fs/promises";
// @ts-expect-error
import { dirname } from "node:path";
// @ts-expect-error
import { fileURLToPath } from "node:url";

import * as XLSX from "xlsx";
import { z } from "zod";

import legacyRules from "../../../../apps/mlb/mesbg-list-builder-v2024/src/assets/data/keywords.json";

const RULES_OUTPUT_PATH = fileURLToPath(
  new URL("../../raw/rules/rules.xlsx", import.meta.url),
);

const TRANSLATIONS_OUTPUT_PATH = fileURLToPath(
  new URL("../../raw/rules/translations.xlsx", import.meta.url),
);

const RULES_SHEET_NAME = "rules";
const ENGLISH_SHEET_NAME = "en";
const DUTCH_SHEET_NAME = "nl";

const legacyRuleSchema = z.object({
  name: z.string().trim().min(1),
  type: z.enum(["special_rule", "magical_power", "heroic_action"]),
  active_passive: z.enum(["Active", "Passive"]).nullable(),
  description: z.string().trim().min(1),
});

const legacyRulesSchema = z.array(legacyRuleSchema);

type LegacyRule = z.infer<typeof legacyRuleSchema>;

const ruleIdSchema = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Rule ID must be kebab-case");

const specialRuleSchema = z.object({
  id: ruleIdSchema,
  category: z.literal("special-rule"),
  type: z.enum(["active", "passive"]).optional(),
  source: z.string(),
});

const magicalPowerSchema = z.object({
  id: ruleIdSchema,
  category: z.literal("magical-power"),
  type: z.string().min(1),
  source: z.string(),
});

const heroicActionSchema = z.object({
  id: ruleIdSchema,
  category: z.literal("heroic-action"),
  type: z.string().min(1),
  source: z.string(),
});

const migratedRuleSchema = z.discriminatedUnion("category", [
  specialRuleSchema,
  magicalPowerSchema,
  heroicActionSchema,
]);

const migratedRulesSchema = z.array(migratedRuleSchema);

type MigratedRule = z.infer<typeof migratedRuleSchema>;

interface MigratedRuleData {
  rule: MigratedRule;
  name: string;
  description: string;
}

interface TranslationRow {
  key: string;
  translation: string;
}

interface ExistingRuleRow {
  id?: unknown;
  source?: unknown;
}

interface ExistingTranslationRow {
  key?: unknown;
  translation?: unknown;
}

interface ParsedDescription {
  type: string;
  description: string;
}

async function main(): Promise<void> {
  console.log("Migrating legacy rules...");

  const parsedLegacyRules = legacyRulesSchema.parse(legacyRules);

  const existingSources = readExistingSources();

  const existingDutchTranslations = readExistingDutchTranslations();

  const migrated = parsedLegacyRules.map((legacyRule) =>
    migrateRule(legacyRule, existingSources),
  );

  const migratedRules = migratedRulesSchema
    .parse(migrated.map(({ rule }) => rule))
    .sort((a, b) => {
      if (a.category === b.category) {
        return a.id.localeCompare(b.id);
      }
      return a.category.localeCompare(b.category);
    });

  validateUniqueRuleIds(migratedRules);

  const englishTranslations = createEnglishTranslations(migrated);

  validateUniqueTranslationKeys(englishTranslations, "English");

  const dutchTranslations = preserveDutchTranslations(
    englishTranslations,
    existingDutchTranslations,
  );

  await mkdir(dirname(RULES_OUTPUT_PATH), {
    recursive: true,
  });

  writeRulesWorkbook(migratedRules);

  writeTranslationsWorkbook(englishTranslations, dutchTranslations);

  printSummary(migratedRules, englishTranslations, dutchTranslations);
}

function migrateRule(
  legacyRule: LegacyRule,
  existingSources: Map<string, string>,
): MigratedRuleData {
  const id = createRuleId(legacyRule.name);

  const source = existingSources.get(id) ?? "";

  switch (legacyRule.type) {
    case "special_rule":
      return migrateSpecialRule(legacyRule, id, source);

    case "magical_power":
      return migrateMagicalPower(legacyRule, id, source);

    case "heroic_action":
      return migrateHeroicAction(legacyRule, id, source);
  }
}

function migrateSpecialRule(
  legacyRule: LegacyRule,
  id: string,
  source: string,
): MigratedRuleData {
  const type = legacyRule.active_passive
    ? toKebabCase(legacyRule.active_passive)
    : undefined;

  return {
    rule: {
      id,
      category: "special-rule",
      ...(type
        ? {
            type: type as "active" | "passive",
          }
        : {}),
      source,
    },
    name: legacyRule.name.trim(),
    description: normalizeDescription(legacyRule.description),
  };
}

function migrateMagicalPower(
  legacyRule: LegacyRule,
  id: string,
  source: string,
): MigratedRuleData {
  if (legacyRule.active_passive) {
    console.warn(
      `Magical power '${legacyRule.name}' unexpectedly has active_passive '${legacyRule.active_passive}'.`,
    );
  }

  const parsed = extractMagicalPowerDuration(legacyRule);

  return {
    rule: {
      id,
      category: "magical-power",
      type: parsed.type,
      source,
    },
    name: legacyRule.name.trim(),
    description: parsed.description,
  };
}

function migrateHeroicAction(
  legacyRule: LegacyRule,
  id: string,
  source: string,
): MigratedRuleData {
  if (legacyRule.active_passive) {
    console.warn(
      `Heroic action '${legacyRule.name}' unexpectedly has active_passive '${legacyRule.active_passive}'.`,
    );
  }

  const parsed = extractHeroicActionPhase(legacyRule);

  return {
    rule: {
      id,
      category: "heroic-action",
      type: parsed.type,
      source,
    },
    name: legacyRule.name.trim(),
    description: parsed.description,
  };
}

function extractMagicalPowerDuration(rule: LegacyRule): ParsedDescription {
  const description = normalizeDescription(rule.description);

  /*
   * Matches for example:
   *
   * <b>Duration</b>: Exhaustion
   *
   * This Magical Power...
   */
  const durationPattern = /^<b>\s*Duration\s*<\/b>\s*:\s*([^\n]+)\n*/i;

  const match = description.match(durationPattern);

  if (!match) {
    throw new Error(
      [
        `Could not determine duration for magical power '${rule.name}'.`,
        "Expected its description to start with:",
        "<b>Duration</b>: <duration>",
      ].join("\n"),
    );
  }

  const duration = match[1].trim();

  const remainingDescription = description.replace(durationPattern, "").trim();

  if (!remainingDescription) {
    throw new Error(
      `Magical power '${rule.name}' has no description after its duration.`,
    );
  }

  return {
    type: toKebabCase(duration),
    description: remainingDescription,
  };
}

function extractHeroicActionPhase(rule: LegacyRule): ParsedDescription {
  const description = normalizeDescription(rule.description);

  /*
   * Matches for example:
   *
   * (Move Phase) A Heroic Move...
   * (Shoot Phase) ...
   * (Fight Phase) ...
   */
  const phasePattern = /^\(([^)]+)\)\s*/;

  const match = description.match(phasePattern);

  if (!match) {
    throw new Error(
      [
        `Could not determine phase for heroic action '${rule.name}'.`,
        "Expected its description to start with something like:",
        "(Move Phase)",
      ].join("\n"),
    );
  }

  const phase = match[1].trim();

  if (!phase.toLowerCase().includes("phase")) {
    throw new Error(
      `Unexpected heroic action timing '${phase}' for '${rule.name}'.`,
    );
  }

  const remainingDescription = description.replace(phasePattern, "").trim();

  if (!remainingDescription) {
    throw new Error(
      `Heroic action '${rule.name}' has no description after its phase.`,
    );
  }

  return {
    type: toKebabCase(phase),
    description: remainingDescription,
  };
}

function createRuleId(name: string): string {
  /*
   * "(X)" is part of the display name for
   * rules such as Ancient Enemies (X),
   * but it does not form part of the
   * stable rule ID.
   */
  const normalizedName = name.replace(/\s*\(X\)\s*$/i, "").trim();

  return toKebabCase(normalizedName);
}

function toKebabCase(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeDescription(description: string): string {
  /*
   * Keep deliberate newlines because
   * the frontend uses them as paragraph
   * boundaries.
   *
   * Only normalize CRLF/CR to LF.
   */
  return description.replace(/\r\n/g, "\n").replace(/\r/g, "\n").trim();
}

function createEnglishTranslations(
  migrated: MigratedRuleData[],
): TranslationRow[] {
  return migrated.flatMap(({ rule, name, description }) => [
    {
      key: `${rule.id}.name`,
      translation: name,
    },
    {
      key: `${rule.id}.description`,
      translation: description,
    },
  ]);
}

function preserveDutchTranslations(
  englishTranslations: TranslationRow[],
  existingTranslations: Map<string, string>,
): TranslationRow[] {
  /*
   * Only retain Dutch entries that:
   *
   * 1. Still belong to an existing rule.
   * 2. Actually contain a translation.
   *
   * Missing translations are simply absent
   * so the normal generator can fall back
   * to English.
   */
  return englishTranslations
    .map(({ key }) => ({
      key,
      translation: existingTranslations.get(key) ?? "",
    }))
    .filter(({ translation }) => translation.trim().length > 0);
}

function validateUniqueRuleIds(rules: MigratedRule[]): void {
  const duplicates = findDuplicates(rules.map(({ id }) => id));

  if (duplicates.length === 0) {
    return;
  }

  throw new Error(
    [
      "Duplicate generated rule IDs:",
      ...duplicates.map((id) => `  - ${id}`),
    ].join("\n"),
  );
}

function validateUniqueTranslationKeys(
  translations: TranslationRow[],
  language: string,
): void {
  const duplicates = findDuplicates(translations.map(({ key }) => key));

  if (duplicates.length === 0) {
    return;
  }

  throw new Error(
    [
      `Duplicate ${language} translation keys:`,
      ...duplicates.map((key) => `  - ${key}`),
    ].join("\n"),
  );
}

function findDuplicates(values: string[]): string[] {
  const seen = new Set<string>();

  const duplicates = new Set<string>();

  for (const value of values) {
    if (seen.has(value)) {
      duplicates.add(value);
    }

    seen.add(value);
  }

  return [...duplicates].sort();
}

function readExistingSources(): Map<string, string> {
  if (!existsSync(RULES_OUTPUT_PATH)) {
    return new Map();
  }

  console.log("Preserving existing rule sources...");

  const workbook = XLSX.readFile(RULES_OUTPUT_PATH);

  const sheet = workbook.Sheets[RULES_SHEET_NAME];

  if (!sheet) {
    return new Map();
  }

  const rows = XLSX.utils.sheet_to_json<ExistingRuleRow>(sheet, {
    defval: "",
  });

  return new Map(
    rows
      .filter(
        (
          row,
        ): row is {
          id: string;
          source: string;
        } =>
          typeof row.id === "string" &&
          row.id.trim() !== "" &&
          typeof row.source === "string" &&
          row.source.trim() !== "",
      )
      .map((row) => [row.id.trim(), row.source.trim()]),
  );
}

function readExistingDutchTranslations(): Map<string, string> {
  if (!existsSync(TRANSLATIONS_OUTPUT_PATH)) {
    return new Map();
  }

  console.log("Preserving existing Dutch translations...");

  const workbook = XLSX.readFile(TRANSLATIONS_OUTPUT_PATH);

  const sheet = workbook.Sheets[DUTCH_SHEET_NAME];

  if (!sheet) {
    return new Map();
  }

  const rows = XLSX.utils.sheet_to_json<ExistingTranslationRow>(sheet, {
    defval: "",
  });

  return new Map(
    rows
      .filter(
        (
          row,
        ): row is {
          key: string;
          translation: string;
        } =>
          typeof row.key === "string" &&
          row.key.trim() !== "" &&
          typeof row.translation === "string" &&
          row.translation.trim() !== "",
      )
      .map((row) => [row.key.trim(), normalizeDescription(row.translation)]),
  );
}

function writeRulesWorkbook(rules: MigratedRule[]): void {
  const workbook = XLSX.utils.book_new();

  const rows = rules.map((rule) => ({
    id: rule.id,
    category: rule.category,
    type: "type" in rule ? (rule.type ?? "") : "",
    source: rule.source,
  }));

  const sheet = XLSX.utils.json_to_sheet(rows, {
    header: ["id", "category", "type", "source"],
  });

  sheet["!cols"] = [
    {
      wch: 32,
    },
    {
      wch: 20,
    },
    {
      wch: 20,
    },
    {
      wch: 30,
    },
  ];

  XLSX.utils.book_append_sheet(workbook, sheet, RULES_SHEET_NAME);

  XLSX.writeFile(workbook, RULES_OUTPUT_PATH);
}

function writeTranslationsWorkbook(
  englishTranslations: TranslationRow[],
  dutchTranslations: TranslationRow[],
): void {
  const workbook = XLSX.utils.book_new();

  const englishSheet = createTranslationSheet(englishTranslations);

  const dutchSheet = createTranslationSheet(dutchTranslations);

  XLSX.utils.book_append_sheet(workbook, englishSheet, ENGLISH_SHEET_NAME);

  XLSX.utils.book_append_sheet(workbook, dutchSheet, DUTCH_SHEET_NAME);

  XLSX.writeFile(workbook, TRANSLATIONS_OUTPUT_PATH);
}

function createTranslationSheet(
  translations: TranslationRow[],
): XLSX.WorkSheet {
  const sheet = XLSX.utils.json_to_sheet(translations, {
    header: ["key", "translation"],
  });

  sheet["!cols"] = [
    {
      wch: 48,
    },
    {
      wch: 120,
    },
  ];

  return sheet;
}

function printSummary(
  rules: MigratedRule[],
  englishTranslations: TranslationRow[],
  dutchTranslations: TranslationRow[],
): void {
  const categories = countBy(rules, ({ category }) => category);

  const missingSources = rules.filter(({ source }) => !source.trim()).length;

  const expectedTranslations = englishTranslations.length;

  const missingDutch = expectedTranslations - dutchTranslations.length;

  console.log("");
  console.log("Migration complete.");
  console.log("");
  console.log(`Special rules:    ${categories.get("special-rule") ?? 0}`);
  console.log(`Magical powers:   ${categories.get("magical-power") ?? 0}`);
  console.log(`Heroic actions:   ${categories.get("heroic-action") ?? 0}`);
  console.log(`Total rules:      ${rules.length}`);
  console.log("");
  console.log(`English texts:    ${englishTranslations.length}`);
  console.log(`Dutch texts:      ${dutchTranslations.length}`);
  console.log(`Missing Dutch:    ${missingDutch}`);
  console.log(`Missing sources:  ${missingSources}`);
  console.log("");
  console.log(`Created: ${RULES_OUTPUT_PATH}`);
  console.log(`Created: ${TRANSLATIONS_OUTPUT_PATH}`);
}

function countBy<T>(
  values: T[],
  getKey: (value: T) => string,
): Map<string, number> {
  const counts = new Map<string, number>();

  for (const value of values) {
    const key = getKey(value);

    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  return counts;
}

main().catch((error: unknown) => {
  if (error instanceof z.ZodError) {
    console.error("Validation failed:");
    console.error(z.prettifyError(error));
  } else {
    console.error(error);
  }

  // @ts-expect-error
  process.exitCode = 1;
});
