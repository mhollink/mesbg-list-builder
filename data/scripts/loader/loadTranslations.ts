import { parseRows } from "../excel/parseSheet";
import { readFile, readSheet } from "../excel/readSheet";
import {
  type TranslationRow,
  translationRowSchema,
} from "../schemas/translations";

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
