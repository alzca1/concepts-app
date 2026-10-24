import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

/**
 * Mode switcher shared by the cards page and the study page:
 * links to /cards and /study, marking the active one.
 */
export function ModeTabs() {
  const { t } = useTranslation();

  return (
    <nav className="mode-tabs" aria-label={t("mode.tabsAria")}>
      <NavLink
        to="/cards"
        className={({ isActive }) => `mode-tab${isActive ? " active" : ""}`}
        end
      >
        🗂 {t("mode.cards")}
      </NavLink>
      <NavLink
        to="/study"
        className={({ isActive }) => `mode-tab${isActive ? " active" : ""}`}
      >
        🎯 {t("mode.study")}
      </NavLink>
    </nav>
  );
}
