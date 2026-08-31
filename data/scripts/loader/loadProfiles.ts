import { parseRows } from "../excel/parseSheet";
import { readFile, readSheet } from "../excel/readSheet";
import {
  profileMagicPowerRowSchema,
  profileRowSchema,
  profileRuleRowSchema,
  profileStatsRowSchema,
} from "../schemas";
import type {
  MagicalPowerRow,
  ProfileRow,
  ProfileRuleRow,
  StatsRow,
} from "../types/profile";

export interface ProfileWorkbook {
  profiles: ProfileRow[];
  stats: StatsRow[];
  profileRules: ProfileRuleRow[];
  magicalPowers: MagicalPowerRow[];
}

export function loadProfiles(profilesWorkbookPath: string): ProfileWorkbook {
  const workbook = readFile(profilesWorkbookPath);

  const profiles = parseRows(
    readSheet(workbook, "Profiles"),
    profileRowSchema,
    "profile",
  );

  const stats = parseRows(
    readSheet(workbook, "Stats"),
    profileStatsRowSchema,
    "profile stats",
  );

  const profileRules = parseRows(
    readSheet(workbook, "Profile Rules"),
    profileRuleRowSchema,
    "profile rule",
  );

  const magicalPowers = parseRows(
    readSheet(workbook, "Magical Powers"),
    profileMagicPowerRowSchema,
    "magical power",
  );

  return {
    profiles,
    stats,
    profileRules,
    magicalPowers,
  };
}
