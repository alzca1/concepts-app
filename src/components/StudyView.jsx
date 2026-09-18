import { useState } from "react";

import { FlashCard } from "./FlashCard";
import { shuffle } from "../lib/utils";

function initialStats(count) {
  return { initial: count, known: 0, repeated: 0 };
}

/**
 * Modo estudio:
 * - la pila empieza barajada y se reduce al marcar "la tengo clara";
 * - "volver a ver" devuelve la tarjeta al final de la pila;
 * - cuando la pila se vacía se muestra un resumen de la sesión.
 */
export function StudyView({ concepts, onBack }) {
  const [queue, setQueue] = useState(() => shuffle(concepts));
  const [stats, setStats] = useState(() => initialStats(concepts.length));
  const [flipped, setFlipped] = useState(false);

  const current = queue[0];
  const mastered = stats.initial - queue.length;
  const visited = stats.known + stats.repeated;
  const pct = stats.initial ? Math.round((mastered / stats.initial) * 100) : 0;

  function restart() {
    setQueue(shuffle(concepts));
    setStats(initialStats(concepts.length));
    setFlipped(false);
  }

  function answer(isKnown) {
    setStats((s) => (isKnown ? { ...s, known: s.known + 1 } : { ...s, repeated: s.repeated + 1 }));
    setQueue((q) => (isKnown ? q.slice(1) : [...q.slice(1), q[0]]));
    setFlipped(false);
  }

  // Sin tarjetas para estudiar
  if (stats.initial === 0) {
    return (
      <div className="empty-state">
        <p>No hay tarjetas para estudiar. Vuelve al modo «Mis tarjetas» y añade algunas.</p>
        <div className="study-actions">
          <button className="btn btn-primary" onClick={onBack}>
            Volver a tarjetas
          </button>
        </div>
      </div>
    );
  }

  // Sesión completada
  if (queue.length === 0) {
    return (
      <section className="summary">
        <div className="summary__emoji">🎉</div>
        <h2 className="summary__title">¡Sesión completada!</h2>
        <div className="summary__pct">{pct}%</div>
        <p className="summary__sub">
          de tus tarjetas dominadas (revisadas y marcadas como claras)
        </p>
        <div className="summary-stats">
          <div className="summary-stat">
            <span>{visited}</span>
            <em>visitas</em>
          </div>
          <div className="summary-stat">
            <span>{stats.repeated}</span>
            <em>repeticiones</em>
          </div>
          <div className="summary-stat">
            <span>{mastered}</span>
            <em>de {stats.initial}</em>
          </div>
        </div>
        {stats.repeated === 0 && (
          <p className="summary__sub">
            ¡Sin repeticiones: todo fue a la primera!
          </p>
        )}
        <div className="summary-actions">
          <button className="btn btn-primary" onClick={restart}>
            Estudiar de nuevo
          </button>
          <button className="btn btn-ghost" onClick={onBack}>
            Volver a tarjetas
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="study">
      <div className="study-progress">
        <span className="study-progress__label">
          {mastered} de {stats.initial} dominadas
        </span>
        <div className="progress" aria-hidden="true">
          <div className="progress__fill" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div className="study-card-wrap">
        <FlashCard
          concept={current}
          size="large"
          controlled
          flipped={flipped}
          onFlip={() => setFlipped((v) => !v)}
        />
      </div>

      {flipped && (
        <div className="study-actions" aria-label="Responder tarjeta actual">
          <button className="btn btn-success" onClick={() => answer(true)}>
            👍 La tengo clara
          </button>
          <button className="btn btn-warning" onClick={() => answer(false)}>
            🔄 Volver a ver
          </button>
        </div>
      )}
    </section>
  );
}
