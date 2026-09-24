import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { useAuth } from "../../context/use-auth";

import type { AuthFormProps } from "./utils/interfaces";

export function SignupPage({ redirectTo }: AuthFormProps = {}) {
  const { t } = useTranslation();
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [info, setInfo] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setInfo(null);
    setSubmitting(true);
    try {
      await signUp(email, password);
      // With "Confirm email" on, the session is null until the user
      // clicks the link in the email. We surface that and stay on
      // the page so they know what to do.
      setInfo(t("auth.signupConfirm"));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="auth">
      <form className="auth__card" onSubmit={handleSubmit}>
        <h2 className="auth__title">{t("auth.signupTitle")}</h2>
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
            autoComplete="new-password"
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
        {info && (
          <p className="auth__info" role="status">
            {info}
          </p>
        )}
        <button
          type="submit"
          className="btn btn-primary auth__submit"
          disabled={submitting}
        >
          {submitting ? t("auth.submitting") : t("auth.signupAction")}
        </button>
        <p className="auth__switch">
          {t("auth.haveAccount")}{" "}
          <Link to="/login">{t("auth.goLogin")}</Link>
        </p>
        {/* When no email confirmation is enabled, the user is signed
            in immediately and the info message is replaced by a
            navigation. We keep the link as a fallback. */}
        {info && redirectTo !== undefined && (
          <button
            type="button"
            className="btn btn-ghost auth__submit"
            onClick={() => navigate(redirectTo)}
          >
            {t("auth.continue")}
          </button>
        )}
      </form>
    </section>
  );
}
