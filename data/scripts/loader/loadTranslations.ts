import { parseRows } from "../excel/parseSheet";
import { readFile, readSheet } from "../excel/readSheet";
import { translationRowSchema } from "../schemas";
import type { TranslationRow } from "../types/translations";

export function loadTranslations(
  translationWorkbookPath: string,
): TranslationRow[] {
  const workbook = readFile(translationWorkbookPath);
  return parseRows(
    readSheet(workbook, "Translations"),
    translationRowSchema,
    "translations",
  );
}
