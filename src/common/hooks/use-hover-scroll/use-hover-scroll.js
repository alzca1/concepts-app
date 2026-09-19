import { useEffect, useRef, useState } from "react";

import {
  HOVER_SCROLL_DELAY,
  HOVER_SCROLL_SPEED,
} from "../../../application/config/constants";

/**
 * Returns `ref` and events to apply a slow automatic vertical
 * scroll on hover (or focus) of an element, only when the content
 * overflows vertically.
 *
 * The full behavior description (pause, single pass, manual
 * interruption, quantization) lives in
 * `docs/modules/ROOT/pages/flash-card.adoc`.
 *
 * @param {string} content - Face text; the hook re-measures when it
 *   changes.
 * @param {number} speed - Pixels per second (defaults to
 *   `HOVER_SCROLL_SPEED`).
 * @param {number} delay - Pause in ms before starting (defaults to
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
      // Clamp the delta: if the tab was in the background, the time
      // jump must not visually jump the content.
      const dt = Math.min(ts - lastTsRef.current, 50) / 1000;
      lastTsRef.current = ts;

      const maxNow = el.scrollHeight - el.clientHeight;
      if (maxNow <= 0) {
        // Content fits again (e.g. after a resize): stop everything.
        stop();
        posRef.current = 0;
        el.scrollTop = 0;
        return;
      }

      // Single downward pass, no bounce: the scroll stops at the
      // end. The position accumulates in `posRef` and is NOT re-read
      // from `scrollTop`: the browser quantizes scroll offsets
      // (whole pixels, or halves on HiDPI), so the per-frame
      // increment (~0.3 px at 16 px/s) would truncate to 0 and the
      // scroll would never advance. The `onScroll` tolerance (±2 px)
      // absorbs that quantization.
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
    // If the position differs from the expected one, the scroll was
    // not ours: the user scrolled. Stop moving on our own.
    if (Math.abs(el.scrollTop - expectedRef.current) > 2) stop();
  };

  // Measure on mount, on content change and on window resize.
  useEffect(
    () => {
      setScrollable(measure());
      const onResize = () => setScrollable(measure());
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    },
    [content]
  );

  // Cancel the pause and the loop on unmount.
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
