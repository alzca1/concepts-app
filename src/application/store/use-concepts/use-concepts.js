import { useCallback, useEffect, useState } from "react";

import { loadConcepts, saveConcepts } from "../../api/concepts-storage";
import { uid } from "../../../common/utils/uid";

/**
 * Hook with the cards + localStorage persistence.
 * Loads the sample cards the first time there is nothing saved.
 */
export function useConcepts() {
  const [concepts, setConcepts] = useState(() => loadConcepts());

  // Persistence: whenever the cards change, they are saved.
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
