import type { Concept, ConceptInput } from "../../../api/types";

export interface UseConceptsResult {
  concepts: Concept[];
  addConcept: (data: ConceptInput) => void;
  updateConcept: (id: string, data: ConceptInput) => void;
  deleteConcept: (id: string) => void;
  resetToSeed: () => void;
}