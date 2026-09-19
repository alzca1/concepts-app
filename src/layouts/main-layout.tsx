import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { APP_LANGUAGES, changeLocale, type Locale } from "../application/i18n";
import { useAuth } from "../context/use-auth";

const LANGUAGES: { id: Locale; label: string }[] = [
  { id: APP_LANGUAGES.ES, label: "ES" },
  { id: APP_LANGUAGES.EN, label: "EN" },
];

export function MainLayout({ children }: { children: React.ReactNode }) {
  const { t, i18n } = useTranslation();
  const { user, signOut } = useAuth();

  async function handleSignOut() {
    await signOut();
  }

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <h1>Concepts</h1>
          <p className="subtitle">{t("app.subtitle")}</p>
        </div>
        <div className="header-controls">
          <div
            className="lang-switch"
            role="group"
            aria-label={t("language.aria")}
          >
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
          <nav className="mode-tabs" aria-label={t("mode.tabsAria")}>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `mode-tab${isActive ? " active" : ""}`
              }
              end
            >
              🗂 {t("mode.cards")}
            </NavLink>
            <NavLink
              to="/study"
              className={({ isActive }) =>
                `mode-tab${isActive ? " active" : ""}`
              }
            >
              🎯 {t("mode.study")}
            </NavLink>
          </nav>
          {user && (
            <div className="user-menu">
              <span className="user-menu__email" title={user.email ?? ""}>
                {user.email}
              </span>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={handleSignOut}
              >
                {t("auth.signOut")}
              </button>
            </div>
          )}
        </div>
      </header>

      <main>{children}</main>
    </div>
  );
}
