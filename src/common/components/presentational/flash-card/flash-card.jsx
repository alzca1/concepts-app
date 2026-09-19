import { useHoverScroll } from "../../../hooks/use-hover-scroll";
import { tagColor } from "../../../utils/tag-color";

/**
 * Tarjeta 3D que se voltea al hacer clic (o teclado: `Enter` / espacio).
 *
 * El estado de volteo lo controla siempre el padre vía la prop
 * `flipped`; el clic llama a `onFlip`. La parrilla lo usa para
 * garantizar que solo una tarjeta muestra su respuesta a la vez, y
 * el modo estudio para controlar la tarjeta grande.
 *
 * La prop opcional `actions` (p. ej. botones de editar / eliminar)
 * se pinta sobre la cara frontal, de modo que participa en la
 * rotación 3D y se voltea junto con la tarjeta.
 * - El texto envuelve: si la pregunta o la respuesta son más altas
 *   que la tarjeta, un scroll vertical muy lento se activa —tras una
 *   pausa de ~0,75 s— al hacer hover (o foco) sobre la tarjeta y se
 *   detiene al llegar al final (ver `useHoverScroll`); si el
 *   contenido cabe, la tarjeta se mantiene estática. Con desborde, la
 *   cara recibe `flash-face--overflow` (degradado inferior como pista
 *   de que hay más texto).
 */
export function FlashCard({
  concept,
  flipped = false,
  onFlip,
  size = "normal",
  actions = null,
}) {
  const front = useHoverScroll(concept.front);
  const back = useHoverScroll(concept.back);
  const { ref: frontTextRef, onScroll: onFrontTextScroll } = front;
  const { ref: backTextRef, onScroll: onBackTextScroll } = back;

  const handleMouseEnter = () => {
    front.onMouseEnter();
    back.onMouseEnter();
  };

  const handleMouseLeave = () => {
    front.onMouseLeave();
    back.onMouseLeave();
  };

  const handleClick = () => onFlip?.();

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div
      className={`flash-card ${
        flipped ? "flipped" : ""
      } ${size === "large" ? "flash-card--big" : ""}`}
      style={{ "--tag-color": tagColor(concept.tag || "General") }}
      role="button"
      tabIndex={0}
      aria-label={concept.front}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={() => {
        front.onFocus();
        back.onFocus();
      }}
      onBlur={() => {
        front.onBlur();
        back.onBlur();
      }}
    >
      <div className="flash-card-inner">
        <div
          className={`flash-face flash-front${
            front.scrollable ? " flash-face--overflow" : ""
          }`}
        >
          {actions}
          <span className="card-tag">{concept.tag || "General"}</span>
          <h3 ref={frontTextRef} onScroll={onFrontTextScroll}>
            {concept.front}
          </h3>
          {/* El hint permanece en el DOM al voltear (solo se oculta con
            opacidad): si desapareciera, la cara perdería altura y la
            pregunta saltaría a la parte inferior justo al girar. */}
          <span
            className={`flip-hint${flipped ? " flip-hint--hidden" : ""}`}
            aria-hidden={flipped}
          >
            Clic para revelar ↩
          </span>
        </div>
        <div
          className={`flash-face flash-back${
            back.scrollable ? " flash-face--overflow" : ""
          }`}
        >
          <span className="card-tag">Respuesta</span>
          <p ref={backTextRef} onScroll={onBackTextScroll}>
            {concept.back}
          </p>
        </div>
      </div>
    </div>
  );
}
