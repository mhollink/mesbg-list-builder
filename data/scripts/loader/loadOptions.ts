import { readFile } from "xlsx";

import { parseRows } from "../excel/parseSheet";
import { readSheet } from "../excel/readSheet";
import {
  optionEffectRowSchema,
  optionRequirementRowSchema,
  optionRowSchema,
} from "../schemas";
import type {
  OptionEffectRow,
  OptionRequirementRow,
  OptionRow,
} from "../types/profile";

export interface OptionWorkbook {
  options: OptionRow[];
  requirements: OptionRequirementRow[];
  effects: OptionEffectRow[];
}

export function loadOptions(optionsWorkbookPath: string): OptionWorkbook {
  const workbook = readFile(optionsWorkbookPath);

  const options = parseRows(
    readSheet(workbook, "Options"),
    optionRowSchema,
    "options",
  );

  const requirements = parseRows(
    readSheet(workbook, "Option Requirements"),
    optionRequirementRowSchema,
    "option requirements",
  );

  const effects = parseRows(
    readSheet(workbook, "Option Effects"),
    optionEffectRowSchema,
    "option effects",
  );

  return {
    options,
    requirements,
    effects,
  };
}
