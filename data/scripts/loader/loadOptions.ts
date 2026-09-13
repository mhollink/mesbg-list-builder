import { readFile } from "xlsx";

import { readSheet } from "../excel/readSheet";
import { type OptionWorkbook, optionWorkbookSchema } from "../schemas/options";

export function loadOptions(optionsWorkbookPath: string): OptionWorkbook {
  const workbook = readFile(optionsWorkbookPath);

  return optionWorkbookSchema.parse({
    options: readSheet(workbook, "Options"),
    requirements: readSheet(workbook, "Option Requirements"),
    effects: readSheet(workbook, "Option Effects"),
  });
}
