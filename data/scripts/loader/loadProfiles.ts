import { readFile, readSheet } from "../excel/readSheet";
import {
  type ProfileWorkbook,
  profileWorkbookSchema,
} from "../schemas/profiles";

export function loadProfiles(profilesWorkbookPath: string): ProfileWorkbook {
  const workbook = readFile(profilesWorkbookPath);

  return profileWorkbookSchema.parse({
    profiles: readSheet(workbook, "Profiles"),
    stats: readSheet(workbook, "Stats"),
    profileRules: readSheet(workbook, "Profile Rules"),
    magicalPowers: readSheet(workbook, "Magical Powers"),
  });
}
