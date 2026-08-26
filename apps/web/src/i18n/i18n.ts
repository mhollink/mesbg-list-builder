import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import commonEn from "./locales/en/common.json";
import commonNl from "./locales/nl/common.json";

import navigationEn from "./locales/en/navigation.json";
import navigationNl from "./locales/nl/navigation.json";

import settingsEn from "./locales/en/settings.json";
import settingsNl from "./locales/nl/settings.json";

void i18n
    .use(initReactI18next)
    .init({
        lng: "en",
        fallbackLng: "en",

        supportedLngs: [
            "en",
            "nl",
        ],

        resources: {
            en: {
                common: commonEn,
                navigation: navigationEn,
                settings: settingsEn,
            },

            nl: {
                common: commonNl,
                navigation: navigationNl,
                settings: settingsNl,
            },
        },

        ns: [
            "common",
            "navigation",
            "settings",
        ],

        defaultNS: "common",

        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;