import { useState } from "react";
import { useTranslation } from "react-i18next";

import { APP_LANGUAGES, changeLocale, type Locale } from "./application/i18n";
import type { ConceptInput } from "./application/api/types";
import { ConceptForm } from "./common/components/domain/concept-form";
import { useConcepts } from "./application/store/use-concepts";
import { HomePage } from "./pages/home";
import { StudyPage } from "./pages/study";
import "./App.css";

const MODE_IDS = {
  CARDS: "cards",
  STUDY: "study",
} as const;

type ModeId = (typeof MODE_IDS)[keyof typeof MODE_IDS];

const MODES: { id: ModeId; labelKey: string }[] = [
  { id: MODE_IDS.CARDS, labelKey: "mode.cards" },
  { id: MODE_IDS.STUDY, labelKey: "mode.study" },
];

const LANGUAGES: { id: Locale; label: string }[] = [
  { id: APP_LANGUAGES.ES, label: "ES" },
  { id: APP_LANGUAGES.EN, label: "EN" },
];

/**
 * Sentinel value stored in `editing` to mean "the modal is open to
 * create a new card, not to edit an existing one". Exported so the
 * Home page can request a new card from its "+ Add" button.
 */
export const NEW_CARD_SENTINEL = "new";

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

  const [mode, setMode] = useState<ModeId>(MODE_IDS.CARDS);
  const [editing, setEditing] = useState<string | null>(null); // null | NEW_CARD_SENTINEL | id

  function handleDelete(id: string) {
    if (editing === id) setEditing(null);
    deleteConcept(id);
  }

  function handleSave(data: ConceptInput) {
    if (editing === NEW_CARD_SENTINEL) addConcept(data);
    else if (editing !== null) updateConcept(editing, data);
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
                {m.id === MODE_IDS.CARDS ? "🗂️" : "🎯"} {t(m.labelKey)}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main>
        {mode === MODE_IDS.CARDS ? (
          <HomePage
            concepts={concepts}
            deleteConcept={handleDelete}
            onEdit={setEditing}
            resetToSeed={resetToSeed}
          />
        ) : (
          <StudyPage concepts={concepts} onBack={() => setMode(MODE_IDS.CARDS)} />
        )}
      </main>

      {editing !== null && (
        <ConceptForm
          key={editing}
          concept={
            editing === NEW_CARD_SENTINEL
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
