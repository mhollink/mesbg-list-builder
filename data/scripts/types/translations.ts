import type { z } from "zod";

import type { translationRowSchema } from "../schemas";

export type TranslationMap = Record<string, string>;
export type NestedTranslations = Record<string, unknown>;

export type TranslationRow = z.infer<typeof translationRowSchema>;
