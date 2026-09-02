import {z} from "zod";
import {
    booleanCellSchema,
    optionalStringCellSchema,
    positiveNumberCellSchema,
    requiredStringCellSchema
} from "./common";
import {ruleCategorySchema} from "./rules";

export const profileRowSchema = z.object({
    id: requiredStringCellSchema,
    origin: requiredStringCellSchema,
    points: optionalStringCellSchema,
    race: optionalStringCellSchema,
    faction: optionalStringCellSchema,
    unit_type: optionalStringCellSchema,
    base_size: optionalStringCellSchema,
    selectable: booleanCellSchema,
    heroic_actions: optionalStringCellSchema,
    special_rules: optionalStringCellSchema,
    wargear: optionalStringCellSchema,
    additional_profiles: optionalStringCellSchema,
    additional_text: optionalStringCellSchema,
    source_book: requiredStringCellSchema,
    source_page: requiredStringCellSchema,
});

export const profileStatsRowSchema = z.object({
    profile: requiredStringCellSchema,

    mv: requiredStringCellSchema,
    fv: requiredStringCellSchema,
    sv: requiredStringCellSchema,
    s: requiredStringCellSchema,
    d: requiredStringCellSchema,
    a: requiredStringCellSchema,
    w: requiredStringCellSchema,
    c: requiredStringCellSchema,
    i: requiredStringCellSchema,

    might: optionalStringCellSchema,
    will: optionalStringCellSchema,
    fate: optionalStringCellSchema,

    range: optionalStringCellSchema,
});

export const profileRuleRowSchema = z.object({
    profile: requiredStringCellSchema,
    rule: requiredStringCellSchema,
    type: ruleCategorySchema,
    option_dependency: z.string().default(""),
    order: positiveNumberCellSchema,
});

export const profileMagicPowerRowSchema = z.object({
    profile: requiredStringCellSchema,
    power: requiredStringCellSchema,
    range: requiredStringCellSchema,
    cast: positiveNumberCellSchema,
    target: optionalStringCellSchema,
    order: z.coerce.number().int().positive(),
});