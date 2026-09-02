import { z } from "zod";

export const kebabCaseSchema = z
  .string()
  .trim()
  .min(1)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Expected kebab-case");

export const requiredStringCellSchema = z
  .union([z.string(), z.number()])
  .transform(String)
  .pipe(z.string().min(1));

export const optionalStringCellSchema = z
  .union([z.string(), z.number()])
  .optional()
  .transform((value) => (value === undefined ? "" : String(value)));

export const booleanCellSchema = z
  .enum(["true", "false"])
  .transform((value) => value === "true");

export const positiveNumberCellSchema = z.coerce.number().int().positive();
