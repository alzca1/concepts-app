import { useCallback, useEffect, useState } from "react";

import {
  createConcept,
  deleteConcept as deleteConceptRow,
  listConcepts,
  updateConcept as updateConceptRow,
} from "../../api/concepts-repository";
import type { Concept, ConceptInput } from "../../api/types";
import { useAuth } from "../../../context/use-auth";

import type { UseConceptsResult } from "./utils/interfaces";

/**
 * Hook with the cards scoped to the signed-in user.
 * Loads on mount and whenever the session changes; mutations hit
 * Supabase and update the local list optimistically.
 */
export function useConcepts(): UseConceptsResult {
  const { user } = useAuth();
  const [concepts, setConcepts] = useState<Concept[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user) {
      setConcepts([]);
      setIsLoading(false);
      setError(null);
      return;
    }

    let active = true;
    setIsLoading(true);

    listConcepts()
      .then((data) => {
        if (!active) return;
        setConcepts(data);
        setError(null);
      })
      .catch((err) => {
        if (!active) return;
        setError(err instanceof Error ? err : new Error(String(err)));
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [user]);

  const addConcept = useCallback(async (data: ConceptInput) => {
    const created = await createConcept(data);
    setConcepts((prev) => [created, ...prev]);
  }, []);

  const updateConcept = useCallback(
    async (id: string, data: ConceptInput) => {
      const updated = await updateConceptRow(id, data);
      setConcepts((prev) => prev.map((c) => (c.id === id ? updated : c)));
    },
    [],
  );

  const deleteConcept = useCallback(async (id: string) => {
    await deleteConceptRow(id);
    setConcepts((prev) => prev.filter((c) => c.id !== id));
  }, []);

  return { concepts, isLoading, error, addConcept, updateConcept, deleteConcept };
}
