import type { z } from "zod";

import { translationRowSchema } from "./schemas/translations";

const supportedLocaleSchema = translationRowSchema.omit({ key: true }).keyof();

export const SUPPORTED_LOCALES = supportedLocaleSchema.options;
export type SupportedLocale = z.infer<typeof supportedLocaleSchema>;

export type TranslationMap = Record<string, string>;
export type NestedTranslations = Record<string, unknown>;
