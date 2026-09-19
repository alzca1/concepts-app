import { useCallback, useEffect, useState } from "react";

import { loadConcepts, saveConcepts } from "../../api/concepts-storage";
import { uid } from "../../../common/utils/uid";

/**
 * Hook con las tarjetas + persistencia en localStorage.
 * Carga las tarjetas de ejemplo la primera vez que no hay nada guardado.
 */
export function useConcepts() {
  const [concepts, setConcepts] = useState(() => loadConcepts());

  // Persistencia: cada vez que cambian las tarjetas se guardan.
  useEffect(() => {
    saveConcepts(concepts);
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
