import { useState } from "react";
import { useTranslation } from "react-i18next";

import { FlashCard } from "../../../../common/components/presentational/flash-card";
import { AddCard } from "../add-card";
import "./concept-list.css";

import type { ConceptListProps } from "./utils/interfaces";

export function ConceptList({
  concepts,
  deleteConcept,
  onEdit,
  onAdd,
}: ConceptListProps) {
  const { t } = useTranslation();
  const [flippedId, setFlippedId] = useState<string | null>(null);

  return (
    <section className="deck-section">
      <div className="deck" aria-label={t("list.gridAria")}>
        <AddCard onClick={onAdd} />
        {concepts.map((concept) => (
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
    </section>
  );
}
