import { useState } from "react";

import { tagColor } from "../lib/utils";

/**
 * Tarjeta 3D que se voltea al hacer clic.
 *
 * - En la parrilla (no controlada): se voltea con hover (desktop) o clic.
 * - En el modo estudio (controlled): el estado de volteo lo da el padre
 *   vía la prop `flipped`, y el clic llama a `onFlip`.
 */
export function FlashCard({
  concept,
  controlled = false,
  flipped,
  onFlip,
  size = "normal",
}) {
  const [localFlipped, setLocalFlipped] = useState(false);
  const isFlipped = controlled ? flipped : localFlipped;

  const handleClick = () => {
    if (controlled) onFlip?.();
    else setLocalFlipped((v) => !v);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div
      className={`flash-card ${
        isFlipped ? "flipped" : ""
      } ${size === "large" ? "flash-card--big" : ""}`}
      style={{ "--tag-color": tagColor(concept.tag || "General") }}
      role="button"
      tabIndex={0}
      aria-label={concept.front}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      <div className="flash-card-inner">
        <div className="flash-face flash-front">
          <span className="card-tag">{concept.tag || "General"}</span>
          <h3>{concept.front}</h3>
          {!isFlipped && (
            <span className="flip-hint">Clic para revelar ↩</span>
          )}
        </div>
        <div className="flash-face flash-back">
          <span className="card-tag">Respuesta</span>
          <p>{concept.back}</p>
        </div>
      </div>
    </div>
  );
}
