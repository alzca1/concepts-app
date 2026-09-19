import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import type { Concept } from "../../application/api/types";
import { STUDY_ACTIONS_DELAY } from "../../application/config/constants";
import { FlashCard } from "../../common/components/presentational/flash-card";
import { shuffle } from "../../common/utils/shuffle";

import type { SessionStats, StudyPageProps } from "./utils/interfaces";

function initialStats(count: number): SessionStats {
  return { initial: count, known: 0, repeated: 0 };
}

/**
 * «Estudiar» page:
 * - the deck starts shuffled and shrinks as cards are marked
 *   "clear";
 * - "review again" sends the card to the end of the deck;
 * - when the deck is empty, the session summary is shown.
 */
export function StudyPage({ concepts, onBack }: StudyPageProps) {
  const { t } = useTranslation();
  const [queue, setQueue] = useState<Concept[]>(() => shuffle(concepts));
  const [stats, setStats] = useState<SessionStats>(() =>
    initialStats(concepts.length)
  );
  const [flipped, setFlipped] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const actionsTimerRef = useRef<number | null>(null);

  // Safe: the early returns above guarantee a non-empty queue.
  const current = queue[0]!;
  const mastered = stats.initial - queue.length;
  const visited = stats.known + stats.repeated;
  const pct = stats.initial ? Math.round((mastered / stats.initial) * 100) : 0;

  const cancelActionsTimer = () => {
    if (actionsTimerRef.current == null) return;
    clearTimeout(actionsTimerRef.current);
    actionsTimerRef.current = null;
  };

  const hideActions = () => {
    cancelActionsTimer();
    setShowActions(false);
  };

  // Cancel the pending timer on unmount (e.g. when leaving study
  // mode before the delay elapses).
  useEffect(() => hideActions, []);

  function restart() {
    setQueue(shuffle(concepts));
    setStats(initialStats(concepts.length));
    setFlipped(false);
    hideActions();
  }

  function answer(isKnown: boolean) {
    setStats((s) => (isKnown ? { ...s, known: s.known + 1 } : { ...s, repeated: s.repeated + 1 }));
    setQueue((q) => (isKnown ? q.slice(1) : [...q.slice(1), q[0]]));
    setFlipped(false);
    hideActions();
  }

  function handleCardFlip() {
    if (flipped) {
      // Back to the question: the buttons are hidden and their
      // pending start is cancelled.
      setFlipped(false);
      hideActions();
    } else {
      setFlipped(true);
      actionsTimerRef.current = setTimeout(
        () => setShowActions(true),
        STUDY_ACTIONS_DELAY
      );
    }
  }

  // No cards to study
  if (stats.initial === 0) {
    return (
      <div className="empty-state">
        <p>{t("study.empty")}</p>
        <div className="study-actions">
          <button className="btn btn-primary" onClick={onBack}>
            {t("study.back")}
          </button>
        </div>
      </div>
    );
  }

  // Session completed
  if (queue.length === 0) {
    return (
      <section className="summary">
        <div className="summary__emoji">🎉</div>
        <h2 className="summary__title">{t("study.summaryTitle")}</h2>
        <div className="summary__pct">{pct}%</div>
        <p className="summary__sub">{t("study.summarySub")}</p>
        <div className="summary-stats">
          <div className="summary-stat">
            <span>{visited}</span>
            <em>{t("study.summaryVisits")}</em>
          </div>
          <div className="summary-stat">
            <span>{stats.repeated}</span>
            <em>{t("study.summaryRepetitions")}</em>
          </div>
          <div className="summary-stat">
            <span>{mastered}</span>
            <em>{t("study.summaryOf", { initial: stats.initial })}</em>
          </div>
        </div>
        {stats.repeated === 0 && (
          <p className="summary__sub">{t("study.summaryNoRepeats")}</p>
        )}
        <div className="summary-actions">
          <button className="btn btn-primary" onClick={restart}>
            {t("study.restart")}
          </button>
          <button className="btn btn-ghost" onClick={onBack}>
            {t("study.back")}
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="study">
      <div className="study-progress">
        <span className="study-progress__label">
          {t("study.progressLabel", {
            mastered,
            initial: stats.initial,
          })}
        </span>
        <div className="progress" aria-hidden="true">
          <div className="progress__fill" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div className="study-card-wrap">
        <FlashCard
          concept={current!}
          size="large"
          flipped={flipped}
          onFlip={handleCardFlip}
        />
      </div>

      {flipped && (
        <div
          className={`study-actions${
            showActions ? "" : " study-actions--waiting"
          }`}
          aria-label={t("study.actionsAria")}
        >
          <button className="btn btn-success" onClick={() => answer(true)}>
            {t("study.known")}
          </button>
          <button className="btn btn-warning" onClick={() => answer(false)}>
            {t("study.review")}
          </button>
        </div>
      )}
    </section>
  );
}
