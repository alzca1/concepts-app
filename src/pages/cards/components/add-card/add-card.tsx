import { useTranslation } from "react-i18next";

import "./add-card.css";

import type { AddCardProps } from "./utils/interfaces";

/**
 * Placeholder card rendered inside the deck: it looks like a regular
 * card but with a dashed border, and opens the create-card modal.
 */
export function AddCard({ onClick }: AddCardProps) {
  const { t } = useTranslation();

  return (
    <button
      type="button"
      className="add-card"
      aria-label={t("list.addCardTitle")}
      onClick={onClick}
    >
      <span className="card-tag">{t("list.addCardTopic")}</span>
      <h3 className="add-card__title">{t("list.addCardTitle")}</h3>
      <span className="flip-hint">{t("list.addCardHint")}</span>
    </button>
  );
}
