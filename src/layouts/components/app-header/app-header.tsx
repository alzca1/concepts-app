import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { APP_LANGUAGES, changeLocale, type Locale } from "../../../application/i18n";
import { useAuth } from "../../../context/use-auth";

const LANGUAGES: { id: Locale; label: string }[] = [
  { id: APP_LANGUAGES.ES, label: "ES" },
  { id: APP_LANGUAGES.EN, label: "EN" },
];

export function AppHeader() {
  const { t, i18n } = useTranslation();
  const { user, signOut } = useAuth();

  const userInitial = (user?.email ?? "").charAt(0).toUpperCase();

  async function handleSignOut() {
    await signOut();
  }

  return (
    <header className="app-header">
      {!user && (
        <div>
          <h1>Concepts</h1>
          <p className="subtitle">{t("app.subtitle")}</p>
        </div>
      )}
      <div className="header-controls">
        {user && (
          <nav className="mode-tabs" aria-label={t("mode.tabsAria")}>
            <NavLink to="/" className={({ isActive }) => `mode-tab${isActive ? " active" : ""}`} end>
              🗂 {t("mode.cards")}
            </NavLink>
            <NavLink to="/study" className={({ isActive }) => `mode-tab${isActive ? " active" : ""}`}>
              🎯 {t("mode.study")}
            </NavLink>
          </nav>
        )}
        <div className="header-controls__group">
          <div className="lang-switch" role="group" aria-label={t("language.aria")}>
            {LANGUAGES.map((lang) => {
              const active = i18n.language === lang.id;
              return (
                <button
                  key={lang.id}
                  type="button"
                  className={`lang-switch__option${active ? " active" : ""}`}
                  aria-pressed={active}
                  onClick={() => changeLocale(lang.id)}
                >
                  {lang.label}
                </button>
              );
            })}
          </div>
          {user && (
            <div className="user-menu">
              <span className="user-menu__avatar" title={user.email ?? ""}>
                {userInitial}
              </span>
              <button
                type="button"
                className="user-menu__signout"
                aria-label={t("auth.signOut")}
                title={t("auth.signOut")}
                onClick={handleSignOut}
              >
                ⏻
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
