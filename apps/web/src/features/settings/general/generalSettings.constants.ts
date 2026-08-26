import type { AppLanguage } from "./generalSettings.types";

interface LanguageDefinition {
    id: AppLanguage;
    name: string;
}

export const SUPPORTED_LANGUAGES: readonly LanguageDefinition[] = [
    {
        id: "en",
        name: "English",
    },
    {
        id: "nl",
        name: "Nederlands",
    },
];