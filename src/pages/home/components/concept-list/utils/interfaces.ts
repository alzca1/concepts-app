import type { Concept } from "../../../../../application/api/types";

export interface ConceptListProps {
  concepts: Concept[];
  deleteConcept: (id: string) => void;
  onEdit: (id: string) => void;
}