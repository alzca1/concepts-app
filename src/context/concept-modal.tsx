import { useCallback, useState, type ReactNode } from "react";

import { ConceptModalContext } from "./concept-modal-context";

interface ConceptModalProviderProps {
  children: ReactNode;
}

export function ConceptModalProvider({ children }: ConceptModalProviderProps) {
  const [editingId, setEditingId] = useState<string | null>(null);

  const openModal = useCallback((id: string | null) => {
    setEditingId(id);
  }, []);

  const closeModal = useCallback(() => {
    setEditingId(null);
  }, []);

  return (
    <ConceptModalContext.Provider value={{ editingId, openModal, closeModal }}>
      {children}
    </ConceptModalContext.Provider>
  );
}
