import { z } from "zod";

import { kebabCaseSchema, requiredStringCellSchema } from "./common";

const blankToUndefined = (value: unknown) => {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed === "" ? undefined : trimmed;
  }

  return value;
};

const sourceSchema = {
  id: kebabCaseSchema,
  source_book: requiredStringCellSchema,
  source_page: requiredStringCellSchema,
};

const specialRuleTypeSchema = z.preprocess(
  blankToUndefined,
  z.enum(["active", "passive"]),
);

const magicalPowerTypeSchema = z.preprocess(
  blankToUndefined,
  z.enum(["exhaustion", "instant", "temporary"]),
);

const heroicActionTypeSchema = z.preprocess(
  blankToUndefined,
  z.enum(["move-phase", "shoot-phase", "fight-phase"]),
);

const noRuleTypeSchema = z.preprocess(blankToUndefined, z.undefined());

const specialRuleRowSchema = z.object({
  ...sourceSchema,
  category: z.literal("special-rule"),
  type: specialRuleTypeSchema,
});

const magicalPowerRowSchema = z.object({
  ...sourceSchema,
  category: z.literal("magical-power"),
  type: magicalPowerTypeSchema,
});

const heroicActionRowSchema = z.object({
  ...sourceSchema,
  category: z.literal("heroic-action"),
  type: heroicActionTypeSchema,
});

const brutalPowerAttackRowSchema = z.object({
  ...sourceSchema,
  category: z.literal("brutal-power-attack"),
  type: noRuleTypeSchema,
});

const equipmentRowSchema = z.object({
  ...sourceSchema,
  category: z.literal("equipment"),
  type: noRuleTypeSchema,
});

const siegeEquipmentRowSchema = z.object({
  ...sourceSchema,
  category: z.literal("siege-equipment"),
  type: noRuleTypeSchema,
});

export const ruleRowSchema = z.discriminatedUnion("category", [
  specialRuleRowSchema,
  magicalPowerRowSchema,
  heroicActionRowSchema,
  brutalPowerAttackRowSchema,
  equipmentRowSchema,
  siegeEquipmentRowSchema,
]);

export type RuleRow = z.infer<typeof ruleRowSchema>;
