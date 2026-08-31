import { z } from "zod";

import { kebabCaseSchema, requiredStringCellSchema } from "./common";

export const ruleCategorySchema = z.enum([
  "special-rule",
  "magical-power",
  "heroic-action",
  "brutal-power-attack",
  "equipment",
  "siege-equipment",
]);

export const ruleTypeSchema = z.preprocess((value) => {
  if (typeof value === "string") {
    const trimmed = value.trim();

    if (trimmed === "") {
      return undefined;
    }

    return trimmed;
  }

  return value;
}, z
  .enum([
    "active",
    "passive",
    "exhaustion",
    "instant",
    "temporary",
    "move-phase",
    "shoot-phase",
    "fight-phase",
  ])
  .optional());

export const ruleRowSchema = z.object({
  id: kebabCaseSchema,
  category: ruleCategorySchema,
  type: ruleTypeSchema,
  source_book: requiredStringCellSchema,
  source_page: requiredStringCellSchema,
});
