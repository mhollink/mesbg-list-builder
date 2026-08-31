import {z} from "zod";

import {kebabCaseSchema, translationKeySchema} from "../common-schemas";

export const ruleCategorySchema = z.enum([
    "special-rule",
    "magical-power",
    "heroic-action",
    "brutal-power-attack",
    "equipment",
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

export const sourceTypeScheme = z.string().optional();

export const ruleRowSchema = z.object({
    id: kebabCaseSchema,
    category: ruleCategorySchema,
    type: ruleTypeSchema,
    source: sourceTypeScheme,
});

export const translationRowSchema = z.object({
    key: translationKeySchema,
    en: z.string().trim().min(1),
    nl: z.string().optional(),
});
