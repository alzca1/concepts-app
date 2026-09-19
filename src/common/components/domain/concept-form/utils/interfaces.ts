import type { Concept, ConceptInput } from "../../../../../application/api/types";

export interface ConceptFormProps {
  concept?: Concept | null;
  onClose: () => void;
  onSave: (data: ConceptInput) => void;
}
