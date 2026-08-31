// @ts-expect-error
import { mkdir } from "node:fs/promises";
// @ts-expect-error
import { fileURLToPath } from "node:url";

import { z } from "zod";

import { readFile, readSheet } from "../excel/readSheet";
import { SUPPORTED_LOCALES, type SupportedLocale } from "../locales";
import { writeJson } from "../output/write-json";
import type { NestedTranslations, TranslationMap } from "../types";
import { ruleRowSchema, translationRowSchema } from "./schemas";
import type { Rule } from "./types";

const rulesWorkbookPath = fileURLToPath(
  new URL("../../raw/rules/rules.xlsx", import.meta.url),
);
const translationsWorkbookPath = fileURLToPath(
  new URL("../../raw/rules/translations.xlsx", import.meta.url),
);
const generatedRulesDirectory = fileURLToPath(
  new URL("../../generated/game-data", import.meta.url),
);
const generatedTranslationsDirectory = fileURLToPath(
  new URL("../../generated/i18n", import.meta.url),
);

function readRules(): Rule[] {
  const workbook = readFile(rulesWorkbookPath);
  const rows = readSheet(workbook, "Rules");

  const parsedRows = rows.map((row, index) => {
    const result = ruleRowSchema.safeParse(row);

    if (!result.success) {
      throw new Error(
        [
          `Invalid rule at Excel row ${index + 2}:`,
          z.prettifyError(result.error),
        ].join("\n"),
      );
    }

    return result.data;
  });

  ensureUnique(
    parsedRows.map((rule) => rule.id),
    "rule id",
  );

  return parsedRows.map((rule) => ({
    id: rule.id,
    category: rule.category,
    ...(rule.type ? { type: rule.type } : {}),
    source: rule.source,
  }));
}

function ensureUnique(values: string[], description: string): void {
  const seen = new Set<string>();
  const duplicates = new Set<string>();

  for (const value of values) {
    if (seen.has(value)) {
      duplicates.add(value);
    }

    seen.add(value);
  }

  if (duplicates.size > 0) {
    throw new Error(
      `Duplicate ${description}(s): ${[...duplicates].join(", ")}`,
    );
  }
}

function readTranslations(): Record<SupportedLocale, TranslationMap> {
  const workbook = readFile(translationsWorkbookPath);
  const rows = readSheet(workbook, "Translations");

  const parsedRows = rows.map((row, index) => {
    const result = translationRowSchema.safeParse(row);

    if (!result.success) {
      throw new Error(
          [
            `Invalid translation at Excel row ${index + 2}:`,
            z.prettifyError(result.error),
          ].join("\n"),
      );
    }

    return result.data;
  });

  ensureUnique(
      parsedRows.map((row) => row.key),
      "translation key",
  );

  return Object.fromEntries(
      SUPPORTED_LOCALES.map((locale) => [
        locale,
        Object.fromEntries(
            parsedRows.map((row) => [
              row.key,
              row[locale],
            ]),
        ),
      ]),
  ) as Record<SupportedLocale, TranslationMap>;
}

function getRequiredTranslationKeys(rules: Rule[]): Set<string> {
  return new Set(
    rules.flatMap((rule) => [`${rule.id}.name`, `${rule.id}.description`]),
  );
}

function validateTranslationCoverage(
  rules: Rule[],
  translations: Record<SupportedLocale, TranslationMap>,
): void {
  const requiredKeys = getRequiredTranslationKeys(rules);
  const english = translations.en;

  for (const key of requiredKeys) {
    if (!english[key]) {
      throw new Error(`Missing required English translation: '${key}'`);
    }
  }

  for (const locale of SUPPORTED_LOCALES) {
    if (locale === "en") {
      continue;
    }

    const missing = [...requiredKeys].filter(
      (key) => !translations[locale][key],
    );
    if (missing.length > 0) {
      console.warn(
        [
          `Missing ${locale} translations:`,
          ...missing.map((key) => `  - ${key}`),
        ].join("\n"),
      );
    }
  }
}

function nestTranslations(translations: TranslationMap): NestedTranslations {
  const output: NestedTranslations = {};

  for (const [key, value] of Object.entries(translations)) {
    const segments = key.split(".");

    let current: Record<string, unknown> = output;

    for (let index = 0; index < segments.length; index++) {
      const segment = segments[index];
      const isLast = index === segments.length - 1;

      if (isLast) {
        current[segment] = value;
        continue;
      }

      const existing = current[segment];

      if (
        existing !== undefined &&
        (typeof existing !== "object" ||
          existing === null ||
          Array.isArray(existing))
      ) {
        throw new Error(`Translation key collision at '${key}'`);
      }

      if (!existing) {
        current[segment] = {};
      }

      current = current[segment] as Record<string, unknown>;
    }
  }

  return output;
}

function filterTranslations(
  rules: Rule[],
  translations: TranslationMap,
): TranslationMap {
  const required = getRequiredTranslationKeys(rules);

  return Object.fromEntries(
    Object.entries(translations).filter(([key]) => required.has(key)),
  );
}

async function generateRules(): Promise<void> {
  console.log("Generating rules...");

  const rules = readRules();

  const translations = readTranslations();

  validateTranslationCoverage(rules, translations);

  await mkdir(generatedRulesDirectory, { recursive: true });
  await writeJson(`${generatedRulesDirectory}/rules.json`, rules);

  for (const locale of SUPPORTED_LOCALES) {
    const localeDirectory = `${generatedTranslationsDirectory}/${locale}`;
    const usedTranslations = filterTranslations(rules, translations[locale]);

    await mkdir(localeDirectory, { recursive: true });
    await writeJson(
      `${localeDirectory}/game-rules.json`,
      nestTranslations(usedTranslations),
    );
  }

  console.log(`Generated ${rules.length} rules.`);
}

generateRules().catch((error: unknown) => {
  console.error(error);
  // @ts-expect-error
  process.exitCode = 1;
});
