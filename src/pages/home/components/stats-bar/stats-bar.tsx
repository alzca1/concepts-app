import { useTranslation } from "react-i18next";

import { DEFAULT_TAG } from "../../../../application/config/constants";

import type { StatsBarProps } from "./utils/interfaces";

export function StatsBar({ concepts }: StatsBarProps) {
  const { t } = useTranslation();
  const tags = new Set(concepts.map((c) => c.tag || DEFAULT_TAG));

  return (
    <div className="stats-bar">
      <div className="stat">
        <span>{concepts.length}</span>
        <em>{t("stats.cards")}</em>
      </div>
      <div className="stat">
        <span>{tags.size}</span>
        <em>{t("stats.tags")}</em>
      </div>
    </div>
  );
}
