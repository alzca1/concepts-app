import { useHoverScroll } from "../../../hooks/use-hover-scroll";
import { tagColor } from "../../../utils/tag-color";

/**
 * 3D card that flips on click (or keyboard: `Enter` / space).
 *
 * The flip is always controlled by the parent (`flipped` +
 * `onFlip`), and `actions` (e.g. edit/delete buttons) render over
 * the front face and rotate with the card. The full behavior
 * description (hint, hover auto-scroll, sizes) lives in
 * `docs/modules/ROOT/pages/flash-card.adoc`.
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
          {/* The hint stays in the DOM when flipped (it is only
            hidden with opacity): if it were removed, the face would
            lose height and the question would jump to the bottom
            right before the flip starts. */}
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
