import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import { LOCALE_STORAGE_KEY } from "../config/constants";
import en from "./locales/en.json";
import es from "./locales/es.json";

/**
 * Supported UI languages and their i18next locale codes.
 * Single source of truth for both the values and the {@link Locale}
 * type.
 */
export const APP_LANGUAGES = {
  ES: "es",
  EN: "en",
} as const;

/** Supported UI languages, derived from {@link APP_LANGUAGES}. */
export type Locale = (typeof APP_LANGUAGES)[keyof typeof APP_LANGUAGES];

/**
 * i18next setup (default instance shared with `useTranslation`).
 * The chosen language persists in localStorage; Spanish is the
 * fallback and the first-run default.
 */
function loadInitialLocale(): Locale {
  try {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
    return stored === APP_LANGUAGES.EN || stored === APP_LANGUAGES.ES
      ? stored
      : APP_LANGUAGES.ES;
  } catch {
    return APP_LANGUAGES.ES;
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
