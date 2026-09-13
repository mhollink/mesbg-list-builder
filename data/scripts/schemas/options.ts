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

export const optionWorkbookSchema = z.object({
  options: z.array(optionRowSchema),
  requirements: z.array(optionRequirementRowSchema),
  effects: z.array(optionEffectRowSchema),
});

export type OptionWorkbook = z.infer<typeof optionWorkbookSchema>;
