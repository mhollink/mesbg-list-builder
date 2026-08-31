import { z } from "zod";

const requiredStringCellSchema = z
    .union([z.string(), z.number()])
    .transform(String)
    .pipe(z.string().min(1));

const optionalStringCellSchema = z
    .union([z.string(), z.number()])
    .optional()
    .transform((value) => (value === undefined ? "" : String(value)));

const booleanCellSchema = z
    .enum(["true", "false"])
    .transform((value) => value === "true");

export const profileTypeSchema = z.enum([
    "primary",
    "composite",
    "subprofile",
]);

export const profileRowSchema = z.object({
    profile: z.string().min(1),
    origin: z.string().min(1),
    type: profileTypeSchema,

    parent_profile: z.string().default(""),

    display_stat_row: booleanCellSchema,
    selectable: booleanCellSchema,

    heroic_actions: z.string().default(""),
    special_rules: z.string().default(""),
    wargear: z.string().default(""),
});

export const statsRowSchema = z.object({
    profile: z.string().min(1),

    mv: requiredStringCellSchema,
    fv: requiredStringCellSchema,
    sv: requiredStringCellSchema,
    s: requiredStringCellSchema,
    d: requiredStringCellSchema,
    a: requiredStringCellSchema,
    w: requiredStringCellSchema,
    c: requiredStringCellSchema,
    i: requiredStringCellSchema,

    hm: optionalStringCellSchema,
    hw: optionalStringCellSchema,
    hf: optionalStringCellSchema,

    range: optionalStringCellSchema,
});

export const profileRuleRowSchema = z.object({
    profile: z.string().min(1),
    rule: z.string().min(1),

    type: z.string().default(""),
    option_dependency: z.string().default(""),

    order: z.coerce.number().int().positive(),
});

export const magicPowerRowSchema = z.object({
    profile: z.string().min(1),
    power: z.string().min(1),

    range: z.string().min(1),
    cast: requiredStringCellSchema,
    target: z.string().optional(),

    order: z.coerce.number().int().positive(),
});

export const additionalTextRowSchema = z.object({
    profile: z.string().min(1),
    text: z.string().min(1),

    order: z.coerce.number().int().positive(),
});