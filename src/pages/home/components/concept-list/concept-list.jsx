import { useState } from "react";
import { useTranslation } from "react-i18next";

import { FlashCard } from "../../../../common/components/presentational/flash-card";
import { tagColor } from "../../../../common/utils/tag-color";

/**
 * "My cards" mode: search, tag filter and the card grid with
 * edit / delete actions. Only one card shows its answer at a time:
 * flipping one resets the previous one.
 */
export function ConceptList({ concepts, deleteConcept, onEdit }) {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState("");
  const [flippedId, setFlippedId] = useState(null);

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
          placeholder={t("list.searchPlaceholder")}
          aria-label={t("list.searchAria")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {tags.length > 0 && (
          <div className="tag-row" aria-label={t("list.filterAria")}>
            <button
              type="button"
              className={`chip ${activeTag === "" ? "active" : ""}`}
              onClick={() => setActiveTag("")}
              aria-pressed={activeTag === ""}
            >
              {t("list.allTags")}
            </button>
            {tags.map((tag) => (
              <button
                key={tag}
                type="button"
                className={`chip ${activeTag === tag ? "active" : ""}`}
                style={{ "--chip-color": tagColor(tag) }}
                onClick={() => setActiveTag(activeTag === tag ? "" : tag)}
                aria-pressed={activeTag === tag}
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
            ? t("list.emptyWithFilters")
            : t("list.emptyNoCards")}
        </p>
      ) : (
        <div className="deck" aria-label={t("list.gridAria")}>
          {filtered.map((concept) => (
            <div key={concept.id} className="card-cell">
              <FlashCard
                concept={concept}
                flipped={flippedId === concept.id}
                onFlip={() =>
                  setFlippedId(flippedId === concept.id ? null : concept.id)
                }
                actions={
                  <div className="cell-actions">
                    <button
                      type="button"
                      title={t("list.editTitle")}
                      onClick={() => onEdit(concept.id)}
                    >
                      ✎
                    </button>
                    <button
                      type="button"
                      title={t("list.deleteTitle")}
                      className="danger"
                      onClick={() =>
                        window.confirm(
                          t("list.deleteConfirm", { front: concept.front })
                        ) && deleteConcept(concept.id)
                      }
                    >
                      ✕
                    </button>
                  </div>
                }
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
