import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";

import type { ConceptFormProps } from "./utils/interfaces";

/**
 * Modal to create or edit a card.
 * It is mounted/unmounted in App with its own `key`, so the initial
 * input state adapts by itself to the card being edited.
 */
export function ConceptForm({ concept, onClose, onSave }: ConceptFormProps) {
  const { t } = useTranslation();
  const isEdit = concept != null;

  const [front, setFront] = useState(concept?.front ?? "");
  const [back, setBack] = useState(concept?.back ?? "");
  const [tag, setTag] = useState(concept?.tag ?? "");
  const [error, setError] = useState("");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = front.trim();
    const b = back.trim();
    if (!f || !b) {
      setError(t("form.validationError"));
      return;
    }
    onSave({ front: f, back: b, tag: tag.trim() || "General" });
    onClose();
  }

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (!(e.target as HTMLElement).closest(".modal")) onClose();
      }}
    >
      <form
        className="modal"
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal__head">
          <h2>{t(isEdit ? "form.editTitle" : "form.newTitle")}</h2>
          <button
            type="button"
            className="btn btn-ghost btn-icon"
            onClick={onClose}
            aria-label={t("form.closeAria")}
          >
            ✕
          </button>
        </div>

        {error && <p className="form-error">{error}</p>}

        <label className="field">
          <span>{t("form.frontLabel")}</span>
          <input
            value={front}
            onChange={(e) => {
              setFront(e.target.value);
              setError("");
            }}
            placeholder={t("form.frontPlaceholder")}
            autoFocus
          />
        </label>

        <label className="field">
          <span>{t("form.backLabel")}</span>
          <textarea
            value={back}
            rows={4}
            onChange={(e) => {
              setBack(e.target.value);
              setError("");
            }}
            placeholder={t("form.backPlaceholder")}
          />
        </label>

        <label className="field">
          <span>{t("form.tagLabel")}</span>
          <input
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            placeholder={t("form.tagPlaceholder")}
          />
        </label>

        <div className="form-actions">
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            {t("form.cancel")}
          </button>
          <button type="submit" className="btn btn-primary">
            {t(isEdit ? "form.saveEdit" : "form.saveNew")}
          </button>
        </div>
      </form>
    </div>
  );
}
