import { useTranslation } from "react-i18next";

export function StatsBar({ concepts, resetToSeed }) {
  const { t } = useTranslation();
  const tags = new Set(concepts.map((c) => c.tag || "General"));

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
      <div className="stats-bar__spacer" />
      <button
        type="button"
        className="btn btn-ghost btn-sm"
        onClick={() =>
          window.confirm(t("stats.restoreConfirm")) && resetToSeed()
        }
      >
        {t("stats.restore")}
      </button>
    </div>
  );
}
