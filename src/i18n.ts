import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import translationEN from "./locales/en.json";
import translationPT from "./locales/pt.json";

const resources = {
  en: {
    translation: translationEN,
  },
  pt: {
    translation: translationPT,
  },
};

const getDefaultLanguage = () => {
  if (typeof window !== "undefined") {
    const browserLanguage = navigator.language || navigator.languages[0];
    return browserLanguage.startsWith("pt") ? "pt" : "en";
  }
  return "en";
};

i18n.use(initReactI18next).init({
  resources,
  lng: getDefaultLanguage(),
  fallbackLng: "pt",
  interpolation: {
    escapeValue: false,
    prefix: '{{',
    suffix: '}}',
  },
});

export default i18n;
