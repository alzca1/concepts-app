/**
 * Shared application constants.
 */

/** Versioned localStorage key for the v1 data model. */
export const STORAGE_KEY = "concepts-app:v1";

/** localStorage key holding the UI language ("es" | "en"). */
export const LOCALE_STORAGE_KEY = "concepts-app:locale";

/**
 * Pause (ms) before the hover auto-scroll starts: gives time to read
 * the beginning of the text before it starts moving.
 */
export const HOVER_SCROLL_DELAY = 750;

/**
 * Pixels per second of the hover auto-scroll. Very slow, so the
 * overflow stays readable while the pointer is over the card.
 */
export const HOVER_SCROLL_SPEED = 16;

/**
 * Delay (ms) after which the answer buttons appear once the study
 * card is flipped: gives time to read the answer before deciding.
 */
export const STUDY_ACTIONS_DELAY = 1500;
