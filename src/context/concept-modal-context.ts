import { createContext } from "react";

export interface ConceptModalContextValue {
  editingId: string | null;
  openModal: (id: string | null) => void;
  closeModal: () => void;
}

export const ConceptModalContext = createContext<ConceptModalContextValue | null>(
  null
);
