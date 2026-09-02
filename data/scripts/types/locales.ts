import {z} from "zod"
import {translationRowSchema} from "../schemas";

const supportedLocaleSchema = translationRowSchema
    .omit({key: true})
    .keyof();

export const SUPPORTED_LOCALES = supportedLocaleSchema.options;
export type SupportedLocale = z.infer<typeof supportedLocaleSchema>;