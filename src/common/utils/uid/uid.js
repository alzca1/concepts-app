let counter = 0;

/** ID único (suficiente para tarjetas; sin dependencias externas). */
export function uid() {
  counter += 1;
  return (
    `c_${Date.now().toString(36)}_${counter.toString(36)}_` +
    Math.random().toString(36).slice(2, 8)
  );
}
