import { useEffect, useRef, useState } from "react";

import {
  HOVER_SCROLL_DELAY,
  HOVER_SCROLL_SPEED,
} from "../../../application/config/constants";

/**
 * Devuelve `ref` y eventos para aplicar un scroll vertical lento y
 * automático al hacer hover (o foco) sobre un elemento, solo si el
 * contenido desborda en vertical.
 *
 * La descripción completa del comportamiento (pausa, recorrido,
 * interrupción manual, cuantización) vive en
 * `docs/modules/ROOT/pages/flash-card.adoc`.
 *
 * @param {string} content - Texto de la cara; el hook se re-mide cuando
 *   cambia.
 * @param {number} speed - Píxeles por segundo (por defecto
 *   `HOVER_SCROLL_SPEED`).
 * @param {number} delay - Pausa en ms antes de arrancar (por defecto
 *   `HOVER_SCROLL_DELAY`).
 */
export function useHoverScroll(
  content,
  speed = HOVER_SCROLL_SPEED,
  delay = HOVER_SCROLL_DELAY
) {
  const ref = useRef(null);
  const rafRef = useRef(null);
  const timerRef = useRef(null);
  const posRef = useRef(0);
  const lastTsRef = useRef(0);
  const expectedRef = useRef(0);
  const speedRef = useRef(speed);
  const [scrollable, setScrollable] = useState(false);

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  const measure = () => {
    const el = ref.current;
    return el != null && el.scrollHeight > el.clientHeight + 1;
  };

  const stop = () => {
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
  };

  const cancelPending = () => {
    if (timerRef.current == null) return;
    clearTimeout(timerRef.current);
    timerRef.current = null;
  };

  const start = () => {
    const el = ref.current;
    if (el == null) return;
    stop();
    const max = el.scrollHeight - el.clientHeight;
    if (max <= 0) return;

    lastTsRef.current = performance.now();
    posRef.current = 0;
    el.scrollTop = 0;
    expectedRef.current = 0;

    const step = (ts) => {
      // Clamp del delta: si la pestaña estaba en segundo plano, el
      // salto de tiempo no debe dar un salto visual del contenido.
      const dt = Math.min(ts - lastTsRef.current, 50) / 1000;
      lastTsRef.current = ts;

      const maxNow = el.scrollHeight - el.clientHeight;
      if (maxNow <= 0) {
        // El contenido ya cabe (p. ej. resize): se detiene todo.
        stop();
        posRef.current = 0;
        el.scrollTop = 0;
        return;
      }

      // Recorrido único hacia abajo, sin rebote: al llegar al final
      // el scroll se detiene. La posición se acumula en `posRef` y
      // NO se relee de `scrollTop`: el navegador cuantiza el scroll
      // (píxeles enteros, o medios en HiDPI), así que el incremento
      // por frame (~0,3 px a 16 px/s) se truncaría a 0 y el scroll
      // nunca avanzaría. La tolerancia de `onScroll` (±2 px) absorbe
      // esa cuantización.
      let pos = posRef.current + speedRef.current * dt;
      const reachedEnd = pos >= maxNow;
      if (reachedEnd) pos = maxNow;

      posRef.current = pos;
      el.scrollTop = pos;
      expectedRef.current = pos;

      if (!reachedEnd) rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
  };

  const enter = () => {
    if (!measure()) return;
    cancelPending();
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      start();
    }, delay);
  };

  const leave = () => {
    cancelPending();
    stop();
    posRef.current = 0;
    const el = ref.current;
    if (el != null) el.scrollTop = 0;
  };

  const onScroll = () => {
    const el = ref.current;
    if (el == null || rafRef.current == null) return;
    // Si la posición difiere de la esperada, el scroll no fue el
    // automático: lo hizo el usuario. Se deja de mover solo.
    if (Math.abs(el.scrollTop - expectedRef.current) > 2) stop();
  };

  // Medir al montar, al cambiar el contenido y al redimensionar la
  // ventana.
  useEffect(
    () => {
      setScrollable(measure());
      const onResize = () => setScrollable(measure());
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    },
    [content]
  );

  // Detener la pausa y el loop al desmontar.
  useEffect(
    () => {
      return () => {
        cancelPending();
        if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      };
    },
    []
  );

  return {
    ref,
    scrollable,
    onMouseEnter: enter,
    onMouseLeave: leave,
    onFocus: enter,
    onBlur: leave,
    onScroll,
  };
}
