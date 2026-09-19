import { useContext } from "react";

import { ConceptModalContext } from "./concept-modal-context";

export function useConceptModal() {
  const context = useContext(ConceptModalContext);
  if (!context) {
    throw new Error(
      "useConceptModal must be used within ConceptModalProvider"
    );
  }
  return context;
}
