export type TranslationMap = Record<string, string>;
export type NestedTranslations = Record<string, unknown>;

export type TranslationRow = {
    key: string;
    en: string;
    nl?: string;
}

