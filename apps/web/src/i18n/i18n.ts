import { initReactI18next } from "react-i18next";

import i18n from "i18next";
import resourcesToBackend from "i18next-resources-to-backend";

import { loadTranslationResource } from "~/i18n/resourceLoader.ts";

void i18n
  .use(initReactI18next)
  .use(
    resourcesToBackend((language: string, namespace: string) =>
      loadTranslationResource(language, namespace),
    ),
  )
  .init({
    lng: "en",
    fallbackLng: "en",
    supportedLngs: ["en", "nl"],
    defaultNS: "common",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
