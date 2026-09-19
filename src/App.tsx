import { BrowserRouter, Route, Routes } from "react-router-dom";

import type { ConceptInput } from "./application/api/types";
import { ConceptForm } from "./common/components/domain/concept-form";
import { ProtectedRoute } from "./common/components/protected-route";
import { ConceptModalProvider } from "./context/concept-modal";
import { AuthProvider } from "./context";
import { useConceptModal } from "./context/use-concept-modal";
import { useConcepts } from "./application/store/use-concepts";
import { MainLayout } from "./layouts/main-layout";
import { HomePage } from "./pages/home/home";
import { StudyPage } from "./pages/study/study";
import { LoginPage, SignupPage } from "./pages/auth";
import "./App.css";

export const NEW_CARD_SENTINEL = "new";

function AppContent() {
  const { concepts, addConcept, updateConcept, isLoading, error } = useConcepts();
  const { editingId, closeModal } = useConceptModal();

  async function handleSave(data: ConceptInput) {
    if (editingId === NEW_CARD_SENTINEL) await addConcept(data);
    else if (editingId !== null) await updateConcept(editingId, data);
  }

  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage concepts={concepts} isLoading={isLoading} error={error} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/study"
          element={
            <ProtectedRoute>
              <StudyPage concepts={concepts} />
            </ProtectedRoute>
          }
        />
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
      <AuthProvider>
        <ConceptModalProvider>
          <MainLayout>
            <AppContent />
          </MainLayout>
        </ConceptModalProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
