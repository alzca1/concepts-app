import { useState } from "react";
import { useTranslation } from "react-i18next";

import { DEFAULT_TAG, EMPTY_STRING } from "../../application/config/constants";
import { NEW_CARD_SENTINEL } from "../../App";
import { tagColor } from "../../common/utils/tag-color";
import { ModeTabs } from "../../common/components/domain/mode-tabs";
import { useConcepts } from "../../application/store/use-concepts";
import { useConceptModal } from "../../context/use-concept-modal";
import { ConceptList } from "./components/concept-list";
import { StatsBar } from "./components/stats-bar";
import "../../common/styles/empty-state.css";
import "./cards.css";

import type { CardsPageProps } from "./utils/interfaces";

export function CardsPage({ concepts, isLoading, error }: CardsPageProps) {
  const { t } = useTranslation();
  const { deleteConcept } = useConcepts();
  const { openModal } = useConceptModal();

  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState("");

  const tags = Array.from(new Set(concepts.map((c) => c.tag || DEFAULT_TAG)));

  const query = search.trim().toLowerCase();
  const filtered = concepts.filter(
    (c) =>
      (activeTag === EMPTY_STRING || c.tag === activeTag) &&
      (query === EMPTY_STRING ||
        `${c.front} ${c.back} ${c.tag}`.toLowerCase().includes(query))
  );

  const hasFilters = Boolean(search || activeTag);

  if (isLoading) {
    return <p className="empty-state">{t("home.loading")}</p>;
  }

  if (error) {
    return (
      <p className="empty-state" role="alert">
        {t("home.loadError", { message: error.message })}
      </p>
    );
  }

  return (
    <>
      <ModeTabs />

      <div className="cards-header">
        <div className="cards-header__top">
          <StatsBar concepts={concepts} />
        </div>
        <div className="cards-header__filters">
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
                className={`chip ${activeTag === EMPTY_STRING ? "active" : ""}`}
                onClick={() => setActiveTag("")}
                aria-pressed={activeTag === EMPTY_STRING}
              >
                {t("list.allTags")}
              </button>
              {tags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className={`chip ${activeTag === tag ? "active" : ""}`}
                  style={{ "--chip-color": tagColor(tag) } as React.CSSProperties}
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
      </div>

      {filtered.length === 0 && (
        <p className="empty-state">
          {hasFilters ? t("list.emptyWithFilters") : t("list.emptyNoCards")}
        </p>
      )}

      <ConceptList
        concepts={filtered}
        deleteConcept={deleteConcept}
        onEdit={openModal}
        onAdd={() => openModal(NEW_CARD_SENTINEL)}
      />
    </>
  );
}
