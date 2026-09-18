import { useState } from "react";

import { FlashCard } from "./FlashCard";
import { tagColor } from "../lib/utils";

/**
 * Modo "Mis tarjetas": búsqueda, filtro por etiqueta y parrilla de tarjetas
 * con acciones de editar / eliminar.
 */
export function ConceptList({ concepts, deleteConcept, onEdit }) {
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState("");

  const tags = Array.from(new Set(concepts.map((c) => c.tag || "General")));

  const query = search.trim().toLowerCase();
  const filtered = concepts.filter(
    (c) =>
      (activeTag === "" || c.tag === activeTag) &&
      (query === "" ||
        `${c.front} ${c.back} ${c.tag}`.toLowerCase().includes(query))
  );

  return (
    <section className="deck-section">
      <div className="deck-controls">
        <input
          className="search"
          type="search"
          placeholder="Buscar en preguntas, respuestas y etiquetas…"
          aria-label="Buscar tarjetas"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {tags.length > 0 && (
          <div className="tag-row" aria-label="Filtrar por etiqueta">
            {tags.map((tag) => (
              <button
                key={tag}
                type="button"
                className={`chip ${activeTag === tag ? "active" : ""}`}
                style={{ "--chip-color": tagColor(tag) }}
                onClick={() => setActiveTag(activeTag === tag ? "" : tag)}
              >
                <span className="dot" />
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {filtered.length === 0 ? (
        <p className="empty-state">
          {search || activeTag
            ? "No hay tarjetas que coincidan con el filtro. Prueba a ampliar la búsqueda."
            : "Todavía no hay tarjetas. Crea la primera con «Nueva tarjeta»."}
        </p>
      ) : (
        <div className="deck" aria-label="Tarjetas">
          {filtered.map((concept) => (
            <div key={concept.id} className="card-cell">
              <FlashCard concept={concept} />
              <div className="cell-actions">
                <button
                  type="button"
                  title="Editar tarjeta"
                  onClick={() => onEdit(concept.id)}
                >
                  ✎
                </button>
                <button
                  type="button"
                  title="Eliminar tarjeta"
                  className="danger"
                  onClick={() =>
                    window.confirm(
                      `¿Eliminar «${concept.front}»?`
                    ) && deleteConcept(concept.id)
                  }
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
