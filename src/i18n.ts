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
  const browserLanguage = navigator.language || navigator.languages[0];
  return browserLanguage.startsWith("pt") ? "pt" : "en";
};

i18n.use(initReactI18next).init({
  resources,
  lng: getDefaultLanguage(),
  fallbackLng: "pt",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
