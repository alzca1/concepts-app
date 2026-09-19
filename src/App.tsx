import { BrowserRouter, Route, Routes } from "react-router-dom";

import type { ConceptInput } from "./application/api/types";
import { ConceptForm } from "./common/components/domain/concept-form";
import { ConceptModalProvider } from "./context/concept-modal";
import { useConceptModal } from "./context/use-concept-modal";
import { useConcepts } from "./application/store/use-concepts";
import { MainLayout } from "./layouts/main-layout";
import { HomePage } from "./pages/home/home";
import { StudyPage } from "./pages/study/study";
import "./App.css";

export const NEW_CARD_SENTINEL = "new";

function AppContent() {
  const { concepts, addConcept, updateConcept } = useConcepts();
  const { editingId, closeModal } = useConceptModal();

  function handleSave(data: ConceptInput) {
    if (editingId === NEW_CARD_SENTINEL) addConcept(data);
    else if (editingId !== null) updateConcept(editingId, data);
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/study" element={<StudyPage concepts={concepts} />} />
      </Routes>

      {editingId !== null && (
        <ConceptForm
          key={editingId}
          concept={
            editingId === NEW_CARD_SENTINEL
              ? null
              : concepts.find((c) => c.id === editingId)
          }
          onClose={closeModal}
          onSave={handleSave}
        />
      )}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ConceptModalProvider>
        <MainLayout>
          <AppContent />
        </MainLayout>
      </ConceptModalProvider>
    </BrowserRouter>
  );
}
