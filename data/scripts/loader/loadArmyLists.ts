import { readFile } from "xlsx";

import { readSheet } from "../excel/readSheet";
import {
  type ArmyListsWorkbook,
  armyListsWorkbookSchema,
} from "../schemas/army-lists";

export function loadArmyLists(armyListWorkbookPath: string): ArmyListsWorkbook {
  const workbook = readFile(armyListWorkbookPath);

  return armyListsWorkbookSchema.parse({
    armyLists: readSheet(workbook, "Army Lists"),
    armyListProfiles: readSheet(workbook, "Army List Profiles"),
    profileOptions: readSheet(workbook, "Profile Options"),
    warbands: readSheet(workbook, "Warbands"),
    generalRules: readSheet(workbook, "General Rules"),
    requirements: readSheet(workbook, "Requirements"),
    armyOptions: readSheet(workbook, "Army Options"),
    rules: readSheet(workbook, "Rules"),
  });
}
