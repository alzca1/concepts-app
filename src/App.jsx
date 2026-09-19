import { useState } from "react";

import { ConceptForm } from "./common/components/domain/concept-form";
import { useConcepts } from "./application/store/use-concepts";
import { HomePage } from "./pages/home";
import { StudyPage } from "./pages/study";
import "./App.css";

const MODES = [
  { id: "cartas", label: "Mis tarjetas" },
  { id: "estudiar", label: "Estudiar" },
];

/**
 * Application shell: header with mode tabs, active page and the
 * create/edit card modal.
 */
export default function App() {
  const {
    concepts,
    addConcept,
    updateConcept,
    deleteConcept,
    resetToSeed,
  } = useConcepts();

  const [mode, setMode] = useState("cartas");
  const [editing, setEditing] = useState(null); // null | "nueva" | id

  function handleDelete(id) {
    if (editing === id) setEditing(null);
    deleteConcept(id);
  }

  function handleSave(data) {
    if (editing === "nueva") addConcept(data);
    else updateConcept(editing, data);
  }

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <h1>Concepts</h1>
          <p className="subtitle">
            Recuerda tus conceptos con tarjetas de memoria
          </p>
        </div>
        <div className="mode-tabs" aria-label="Cambio de modo">
          {MODES.map((m) => (
            <button
              key={m.id}
              className={`mode-tab ${mode === m.id ? "active" : ""}`}
              aria-pressed={mode === m.id}
              onClick={() => setMode(m.id)}
            >
              {m.id === "cartas" ? "🗂️" : "🎯"} {m.label}
            </button>
          ))}
        </div>
      </header>

      <main>
        {mode === "cartas" ? (
          <HomePage
            concepts={concepts}
            deleteConcept={handleDelete}
            onEdit={setEditing}
            resetToSeed={resetToSeed}
          />
        ) : (
          <StudyPage concepts={concepts} onBack={() => setMode("cartas")} />
        )}
      </main>

      {editing !== null && (
        <ConceptForm
          key={editing}
          concept={
            editing === "nueva"
              ? null
              : concepts.find((c) => c.id === editing)
          }
          onClose={() => setEditing(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
