import { useState } from "react";

/**
 * Modal para crear o editar una tarjeta.
 * Se monta/desmonta en App con un `key` propio, así el estado inicial
 * de los inputs se ajusta solo a la tarjeta que se está editando.
 */
export function ConceptForm({ concept, onClose, onSave }) {
  const isEdit = concept != null;

  const [front, setFront] = useState(concept?.front ?? "");
  const [back, setBack] = useState(concept?.back ?? "");
  const [tag, setTag] = useState(concept?.tag ?? "");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const f = front.trim();
    const b = back.trim();
    if (!f || !b) {
      setError("Completa la pregunta (front) y la respuesta (back).");
      return;
    }
    onSave({ front: f, back: b, tag: tag.trim() || "General" });
    onClose();
  }

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (!e.target.closest(".modal")) onClose();
      }}
    >
      <form
        className="modal"
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal__head">
          <h2>{isEdit ? "Editar tarjeta" : "Nueva tarjeta"}</h2>
          <button
            type="button"
            className="btn btn-ghost btn-icon"
            onClick={onClose}
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        {error && <p className="form-error">{error}</p>}

        <label className="field">
          <span>Concepto / pregunta *</span>
          <input
            value={front}
            onChange={(e) => {
              setFront(e.target.value);
              setError("");
            }}
            placeholder="¿Qué es un closure?"
            autoFocus
          />
        </label>

        <label className="field">
          <span>Respuesta / explicación *</span>
          <textarea
            value={back}
            rows={4}
            onChange={(e) => {
              setBack(e.target.value);
              setError("");
            }}
            placeholder="Explica el concepto…"
          />
        </label>

        <label className="field">
          <span>Etiqueta</span>
          <input
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            placeholder="JavaScript, React, CSS…"
          />
        </label>

        <div className="form-actions">
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            Cancelar
          </button>
          <button type="submit" className="btn btn-primary">
            {isEdit ? "Guardar cambios" : "Crear tarjeta"}
          </button>
        </div>
      </form>
    </div>
  );
}
