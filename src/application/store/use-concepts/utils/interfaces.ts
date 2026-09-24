import type { Concept, ConceptInput } from "../../../api/types";

export interface UseConceptsResult {
  concepts: Concept[];
  isLoading: boolean;
  error: Error | null;
  addConcept: (data: ConceptInput) => Promise<void>;
  updateConcept: (id: string, data: ConceptInput) => Promise<void>;
  deleteConcept: (id: string) => Promise<void>;
}
