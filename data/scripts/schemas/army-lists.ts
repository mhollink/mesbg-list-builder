import { z } from "zod";

import {
  optionalNumberCellSchema,
  optionalStringCellSchema,
  positiveNumberCellSchema,
  requiredStringCellSchema,
  semicolonListCellSchema,
} from "./common";

export const armyListRowSchema = z.object({
  id: requiredStringCellSchema,

  alignment: z.enum(["good", "evil"]),

  warband_mode: z.preprocess(
    (value) => (value === "" || value == null ? undefined : value),
    z.enum(["standard", "single", "choice"]).default("standard"),
  ),

  single_warband_unit_types: semicolonListCellSchema,

  bow_limit: optionalNumberCellSchema,
  throw_limit: optionalNumberCellSchema,
  break_point: optionalNumberCellSchema,

  book: requiredStringCellSchema,
  page: requiredStringCellSchema,
});

export type ArmyListRow = z.infer<typeof armyListRowSchema>;

export const armyListProfileRowSchema = z
  .object({
    army_list: requiredStringCellSchema,
    id: optionalStringCellSchema,
    profile: requiredStringCellSchema,
    tier: z.enum([
      "hero-of-legend",
      "hero-of-valour",
      "hero-of-fortitude",
      "minor-hero",
      "independent-hero",
      "warrior",
      "siege-engine",
    ]),
  })
  .transform((row) => ({
    ...row,
    id: row.id || row.profile,
  }));

export type ArmyListProfileRow = z.infer<typeof armyListProfileRowSchema>;

export const profileOptionRowSchema = z.object({
  army_list: requiredStringCellSchema,
  profile: requiredStringCellSchema,
  option: requiredStringCellSchema,

  state: z.preprocess(
    (value) => (value === "" || value == null ? undefined : value),
    z.enum(["available", "preselected"]).default("available"),
  ),

  points_override: optionalNumberCellSchema,
});

export type ProfileOptionRow = z.infer<typeof profileOptionRowSchema>;

export const warbandRowSchema = z.object({
  army_list: requiredStringCellSchema,
  id: requiredStringCellSchema,
  leader: requiredStringCellSchema,
  followers: semicolonListCellSchema,
  max_size: optionalNumberCellSchema.pipe(
    z.number().int().positive().optional(),
  ),
});

export type WarbandRow = z.infer<typeof warbandRowSchema>;

export const generalRuleRowSchema = z.object({
  army_list: requiredStringCellSchema,
  type: z.enum(["fixed", "selector"]),

  profile: optionalStringCellSchema,
  selector_profiles: semicolonListCellSchema,
});

export type GeneralRuleRow = z.infer<typeof generalRuleRowSchema>;

export const requirementRowSchema = z.object({
  army_list: requiredStringCellSchema,
  id: requiredStringCellSchema,
  type: z.enum(["requires", "excludes", "minimum", "maximum", "ratio"]),

  selector_profiles: semicolonListCellSchema,
  selector_races: semicolonListCellSchema,
  selector_factions: semicolonListCellSchema,
  selector_unit_types: semicolonListCellSchema,

  related_profiles: semicolonListCellSchema,
  related_races: semicolonListCellSchema,
  related_factions: semicolonListCellSchema,
  related_unit_types: semicolonListCellSchema,

  count: optionalNumberCellSchema.pipe(
    z.number().int().nonnegative().optional(),
  ),

  max_ratio: optionalNumberCellSchema.pipe(z.number().positive().optional()),
});

export type RequirementRow = z.infer<typeof requirementRowSchema>;

export const armyOptionRowSchema = z.object({
  army_list: requiredStringCellSchema,
  id: requiredStringCellSchema,
  points: positiveNumberCellSchema,
});

export type ArmyOptionRow = z.infer<typeof armyOptionRowSchema>;

export const armyRuleRowSchema = z.object({
  army_list: requiredStringCellSchema,
  id: requiredStringCellSchema,
  category: z.enum(["special", "additional"]),
});

export type ArmyRuleRow = z.infer<typeof armyRuleRowSchema>;

export const armyListsWorkbookSchema = z.object({
  armyLists: z.array(armyListRowSchema),
  armyListProfiles: z.array(armyListProfileRowSchema),
  profileOptions: z.array(profileOptionRowSchema),
  warbands: z.array(warbandRowSchema),
  generalRules: z.array(generalRuleRowSchema),
  requirements: z.array(requirementRowSchema),
  armyOptions: z.array(armyOptionRowSchema),
  rules: z.array(armyRuleRowSchema),
});

export type ArmyListsWorkbook = z.infer<typeof armyListsWorkbookSchema>;
