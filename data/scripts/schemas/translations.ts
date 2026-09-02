import { z } from "zod";

export const translationKeySchema = z
    .string()
    .trim()
    .min(1)
    .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*(?:\.[a-z0-9]+(?:-[a-z0-9]+)*)+$/,
        "Expected a translation key such as ancient-enemies.name",
    );


export const translationRowSchema = z.object({
    key: translationKeySchema,
    en: z.string().trim().min(1),
    nl: z.string().optional(),
});
