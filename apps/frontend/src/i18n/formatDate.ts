import i18n from "./i18n";

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat(i18n.resolvedLanguage, {
    dateStyle: "long",
  }).format(date);
}
