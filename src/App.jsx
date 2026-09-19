import { useState } from "react";
import { useTranslation } from "react-i18next";

import { changeLocale } from "./application/i18n";
import { ConceptForm } from "./common/components/domain/concept-form";
import { useConcepts } from "./application/store/use-concepts";
import { HomePage } from "./pages/home";
import { StudyPage } from "./pages/study";
import "./App.css";

const MODES = [
  { id: "cartas", labelKey: "mode.cards" },
  { id: "estudiar", labelKey: "mode.study" },
];

const LANGUAGES = [
  { id: "es", label: "ES" },
  { id: "en", label: "EN" },
];

/**
 * Application shell: header with the language switch and mode tabs,
 * the active page and the create/edit card modal.
 */
export default function App() {
  const { t, i18n } = useTranslation();
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
          <p className="subtitle">{t("app.subtitle")}</p>
        </div>
        <div className="header-controls">
          <div
            className="lang-switch"
            role="group"
            aria-label={t("language.aria")}
          >
            {LANGUAGES.map((lang) => (
              <button
                key={lang.id}
                type="button"
                className={`lang-switch__option${
                  i18n.language === lang.id ? " active" : ""
                }`}
                aria-pressed={i18n.language === lang.id}
                onClick={() => changeLocale(lang.id)}
              >
                {lang.label}
              </button>
            ))}
          </div>
          <div className="mode-tabs" aria-label={t("mode.tabsAria")}>
            {MODES.map((m) => (
              <button
                key={m.id}
                className={`mode-tab ${mode === m.id ? "active" : ""}`}
                aria-pressed={mode === m.id}
                onClick={() => setMode(m.id)}
              >
                {m.id === "cartas" ? "🗂️" : "🎯"} {t(m.labelKey)}
              </button>
            ))}
          </div>
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
