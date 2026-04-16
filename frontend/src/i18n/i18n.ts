import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import dictionary from "@/dictionaries/dictionary";
import { dictionaryToI18nResources } from "./buildResources";

const resources = dictionaryToI18nResources(dictionary);

const defaultLng =
  import.meta.env.VITE_LANGUAGE === "pl" ? "pl" : "en";

void i18n.use(initReactI18next).init({
  resources: {
    en: resources.en,
    pl: resources.pl,
  },
  lng: defaultLng,
  fallbackLng: "en",
  defaultNS: "common",
  interpolation: { escapeValue: false },
});

/** For Yup, loaders, and other non-hook code: translate using an explicit locale. */
export function translateLng(
  lng: string,
  key: string,
  options?: Record<string, unknown>
): string {
  const locale = lng === "pl" ? "pl" : "en";
  return i18n.t(key, { lng: locale, ...options });
}

export default i18n;
