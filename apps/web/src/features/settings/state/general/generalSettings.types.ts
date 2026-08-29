export type AppLanguage = "en" | "nl";

export interface GeneralSettingsState {
  language: AppLanguage;
  translatedGameRules: boolean;
}
