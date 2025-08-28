import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: true,
    fallbackLng: "en",
    lng: "en",
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: { translation: { greeting: "Hello, Welcome!" } },
      hi: { translation: { greeting: "नमस्ते, स्वागत है!" } },
      es: { translation: { greeting: "¡Hola, bienvenido!" } },
      ru: { translation: { greeting: "Здравствуйте, добро пожаловать!" } },
      de: { translation: { greeting: "Hallo, Willkommen!" } },
      it: { translation: { greeting: "Ciao, benvenuto!" } },
      gu: { translation: { greeting: "હેલો, સ્વાગત છે!" } },
    },
  });

export default i18n;
