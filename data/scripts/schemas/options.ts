import { z } from "zod";

import { optionalStringCellSchema, requiredStringCellSchema } from "./common";

export const optionRowSchema = z.object({
  profile: requiredStringCellSchema,
  option: requiredStringCellSchema,
  cost: z.coerce.number().int(),
});

export const optionRequirementRowSchema = z.object({
  profile: requiredStringCellSchema,
  option: requiredStringCellSchema,
  type: requiredStringCellSchema,
  target: requiredStringCellSchema,
  scope: optionalStringCellSchema,
  value: optionalStringCellSchema,
});

export const optionEffectRowSchema = z.object({
  profile: requiredStringCellSchema,
  option: requiredStringCellSchema,
  type: requiredStringCellSchema,
  target: requiredStringCellSchema,
  value: optionalStringCellSchema,
});
