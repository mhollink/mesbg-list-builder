import { z } from "zod";

import { kebabCaseSchema, translationKeySchema } from "../common-schemas";

export const ruleCategorySchema = z.enum([
  "special-rule",
  "magical-power",
  "heroic-action",
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

export const ruleRowSchema = z
  .object({
    id: kebabCaseSchema,
    "name-key": translationKeySchema,
    "description-key": translationKeySchema,
    category: ruleCategorySchema,
    type: ruleTypeSchema,
  })
  .superRefine((rule, context) => {
    const expectedNameKey = `${rule.id}.name`;
    const expectedDescriptionKey = `${rule.id}.description`;

    if (rule["name-key"] !== expectedNameKey) {
      context.addIssue({
        code: "custom",
        path: ["name-key"],
        message: `Expected '${expectedNameKey}'`,
      });
    }

    if (rule["description-key"] !== expectedDescriptionKey) {
      context.addIssue({
        code: "custom",
        path: ["description-key"],
        message: `Expected '${expectedDescriptionKey}'`,
      });
    }
  });

export const translationRowSchema = z.object({
  key: translationKeySchema,
  translation: z.string().trim().min(1),
});
