import { useCallback, useEffect, useState } from "react";

import { seedConcepts } from "../data/seed";
import { uid } from "../common/utils/uid";

const STORAGE_KEY = "concepts-app:v1";

/**
 * Hook con las tarjetas + persistencia en localStorage.
 * Carga las tarjetas de ejemplo la primera vez que no hay nada guardado.
 */
export function useConcepts() {
  const [concepts, setConcepts] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const parsed = stored ? JSON.parse(stored) : null;
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : seedConcepts();
    } catch {
      return seedConcepts();
    }
  });

  // Persistencia: cada vez que cambian las tarjetas se guardan.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(concepts));
    } catch {
      // localStorage no disponible: seguimos funcionando en memoria.
    }
  }, [concepts]);

  const addConcept = useCallback(
    (data) =>
      setConcepts((prev) => [
        ...prev,
        {
          ...data,
          id: uid(),
          createdAt: Date.now(),
        },
      ]),
    []
  );

  const updateConcept = useCallback(
    (id, data) =>
      setConcepts((prev) =>
        prev.map((c) =>
          c.id === id
            ? { ...c, ...data, createdAt: c.createdAt }
            : c,
        ),
      ),
    []
  );

  const deleteConcept = useCallback(
    (id) => setConcepts((prev) => prev.filter((c) => c.id !== id)),
    []
  );

  const resetToSeed = useCallback(() => setConcepts(seedConcepts()), []);

  return { concepts, addConcept, updateConcept, deleteConcept, resetToSeed };
}
