import { z } from "zod";

import {
  optionalNumberCellSchema,
  optionalStringCellSchema,
  requiredStringCellSchema,
} from "./common";

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

export const optionLimitRowSchema = z.object({
  profile: requiredStringCellSchema,
  min: optionalNumberCellSchema,
  max: optionalNumberCellSchema,
});

export const optionWorkbookSchema = z.object({
  options: z.array(optionRowSchema),
  requirements: z.array(optionRequirementRowSchema),
  effects: z.array(optionEffectRowSchema),
  limits: z.array(optionLimitRowSchema),
});

export type OptionWorkbook = z.infer<typeof optionWorkbookSchema>;
