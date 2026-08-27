export const SUPPORTED_LOCALES = ["en", "nl"] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];
