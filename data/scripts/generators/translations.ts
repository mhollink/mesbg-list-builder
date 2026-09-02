import { SUPPORTED_LOCALES, type SupportedLocale } from "../types/locales";
import type {
  NestedTranslations,
  TranslationMap,
  TranslationRow,
} from "../types/translations";

export function generateTranslations(
  translations: TranslationRow[],
): Map<SupportedLocale, NestedTranslations> {
  return new Map(
    SUPPORTED_LOCALES.map((locale) => [
      locale,
      buildTranslations(translations, locale),
    ]),
  );
}

export function buildTranslations(
  rows: TranslationRow[],
  locale: SupportedLocale,
): NestedTranslations {
  const translations = Object.fromEntries(
    rows.flatMap((row) => {
      const value = row[locale]?.trim();

      return value ? [[row.key, value]] : [];
    }),
  );

  return nestTranslations(translations);
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
        if (current[segment] !== undefined) {
          throw new Error(`Translation key collision at '${key}'`);
        }

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
