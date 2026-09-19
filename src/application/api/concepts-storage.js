/**
 * Card persistence in localStorage (versioned key).
 * Every access is wrapped in try/catch: if localStorage is
 * unavailable or the JSON is corrupt, the app keeps working and
 * seeds the sample cards.
 */
import { seedConcepts } from "./seed/seed-concepts";
import { STORAGE_KEY } from "../config/constants";

/** Loads the stored cards; falls back to the seed when invalid. */
export function loadConcepts() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const parsed = stored ? JSON.parse(stored) : null;
    return Array.isArray(parsed) && parsed.length > 0
      ? parsed
      : seedConcepts();
  } catch {
    return seedConcepts();
  }
}

/** Saves the cards; fails silently without localStorage. */
export function saveConcepts(concepts) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(concepts));
  } catch {
    // localStorage unavailable: keep working in memory.
  }
}
