import { useCallback, useEffect, useState } from "react";

import { loadConcepts, saveConcepts } from "../../api/concepts-storage";
import { seedConcepts } from "../../api/seed/seed-concepts";
import type { Concept, ConceptInput } from "../../api/types";
import { uid } from "../../../common/utils/uid";

import type { UseConceptsResult } from "./utils/interfaces";

/**
 * Hook with the cards + localStorage persistence.
 * Loads the sample cards the first time there is nothing saved.
 */
export function useConcepts(): UseConceptsResult {
  const [concepts, setConcepts] = useState<Concept[]>(() => loadConcepts());

  // Persistence: whenever the cards change, they are saved.
  useEffect(() => {
    saveConcepts(concepts);
  }, [concepts]);

  const addConcept = useCallback(
    (data: ConceptInput) =>
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
    (id: string, data: ConceptInput) =>
      setConcepts((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, ...data, createdAt: c.createdAt } : c
        )
      ),
    []
  );

  const deleteConcept = useCallback(
    (id: string) => setConcepts((prev) => prev.filter((c) => c.id !== id)),
    []
  );

  const resetToSeed = useCallback(() => setConcepts(seedConcepts()), []);

  return { concepts, addConcept, updateConcept, deleteConcept, resetToSeed };
}
