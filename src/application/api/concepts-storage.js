/**
 * Persistencia de tarjetas en localStorage (clave versionada).
 * Todo acceso va envuelto en try/catch: si localStorage no está
 * disponible o el JSON está corrupto, la app sigue funcionando y
 * siembra las tarjetas de ejemplo.
 */
import { seedConcepts } from "./seed/seed-concepts";

const STORAGE_KEY = "concepts-app:v1";

/** Carga las tarjetas guardadas; si no hay datos válidos, siembra. */
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

/** Guarda las tarjetas; falla en silencio sin localStorage. */
export function saveConcepts(concepts) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(concepts));
  } catch {
    // localStorage no disponible: seguimos funcionando en memoria.
  }
}
