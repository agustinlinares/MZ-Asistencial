import { useEffect, useState } from "react";
import { I18nextProvider } from "react-i18next";
import i18next from "i18next";
import { initReactI18next } from "react-i18next";

import config from "devextreme/core/config";
import { licenseKey } from "../devextreme-license";
import { locale, loadMessages } from "devextreme/localization";
import esMessages from "../lib/translate/es.json";

import { useLogError } from '../hooks/useLogError';

config({ licenseKey });

i18next
    .use(initReactI18next)
    .init({
        lng: "es",
        fallbackLng: "es",
        debug: false,
        interpolation: { escapeValue: false },
        react: { useSuspense: true }
    });

export const AppProvider = ({ children }) => {
    const [currentLanguage, setCurrentLanguage] = useState(i18next.language);

    const logError = useLogError("App Provider");

    useEffect(() => {
        const loadLocalizationMessages = async (lang) => {
            try {
                const dictionary = esMessages;
                loadMessages(dictionary);
                locale(lang);
            } catch (error) {
                logError(`Fallo al cargar el idioma: ${lang}`, error);
                console.error("Error cargando mensajes de localización:", error);
            }
        };

        loadLocalizationMessages(currentLanguage);

        i18next.on("languageChanged", (lang) => {
            setCurrentLanguage(lang);
            locale(lang);
        });

        return () => {
            i18next.off("languageChanged");
        };
    }, [currentLanguage]);

    return (
        <I18nextProvider i18n={i18next}>{children}</I18nextProvider>
    );
};