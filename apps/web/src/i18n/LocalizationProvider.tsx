import {
    type PropsWithChildren,
    useEffect,
} from "react";

import { useAppSelector } from "../app/hooks";
import i18n from "./i18n";

export function LocalizationProvider({
                                         children,
                                     }: PropsWithChildren) {
    const language = useAppSelector((state) => state.settings.language,);

    useEffect(() => {
        if (i18n.resolvedLanguage !== language) {
            void i18n.changeLanguage(language);
        }

        document.documentElement.lang = language;
    }, [language]);

    return children;
}