import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { useAuth } from "../../context/use-auth";

import type { AuthFormProps } from "./utils/interfaces";

interface LocationState {
  from?: string;
}

export function LoginPage({ redirectTo }: AuthFormProps = {}) {
  const { t } = useTranslation();
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from =
    redirectTo ?? (location.state as LocationState | null)?.from ?? "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await signIn(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="auth">
      <form className="auth__card" onSubmit={handleSubmit}>
        <h2 className="auth__title">{t("auth.loginTitle")}</h2>
        <label className="auth__field">
          <span>{t("auth.email")}</span>
          <input
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label className="auth__field">
          <span>{t("auth.password")}</span>
          <input
            type="password"
            autoComplete="current-password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        {error && (
          <p className="auth__error" role="alert">
            {error}
          </p>
        )}
        <button
          type="submit"
          className="btn btn-primary auth__submit"
          disabled={submitting}
        >
          {submitting ? t("auth.submitting") : t("auth.loginAction")}
        </button>
        <p className="auth__switch">
          {t("auth.noAccount")}{" "}
          <Link to="/signup">{t("auth.goSignup")}</Link>
        </p>
      </form>
    </section>
  );
}
