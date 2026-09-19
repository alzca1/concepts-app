let counter = 0;

/** Unique ID (good enough for cards; no external dependencies). */
export function uid(): string {
  counter += 1;
  return (
    `c_${Date.now().toString(36)}_${counter.toString(36)}_` +
    Math.random().toString(36).slice(2, 8)
  );
}
