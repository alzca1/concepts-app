import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import { LOCALE_STORAGE_KEY } from "../config/constants";
import en from "./locales/en.json";
import es from "./locales/es.json";

/** Supported UI languages. */
export type Locale = "en" | "es";

/**
 * i18next setup (default instance shared with `useTranslation`).
 * The chosen language persists in localStorage; Spanish is the
 * fallback and the first-run default.
 */
function loadInitialLocale(): Locale {
  try {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
    return stored === "en" || stored === "es" ? stored : "es";
  } catch {
    return "es";
  }
}

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    es: { translation: es },
  },
  lng: loadInitialLocale(),
  fallbackLng: "es",
  interpolation: {
    // React already escapes rendered values.
    escapeValue: false,
  },
});

/** Switches the UI language and persists the choice. */
export function changeLocale(nextLocale: Locale): void {
  i18n.changeLanguage(nextLocale);
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, nextLocale);
  } catch {
    // localStorage unavailable: the switch works in memory only.
  }
}
