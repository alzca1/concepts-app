/**
 * Utilidades pequeñas compartidas.
 */

let counter = 0;

/** ID único (suficiente para tarjetas; sin dependencias externas). */
export function uid() {
  counter += 1;
  return (
    `c_${Date.now().toString(36)}_${counter.toString(36)}_` +
    Math.random().toString(36).slice(2, 8)
  );
}

/** Copia barajada de un array (Fisher–Yates). */
export function shuffle(items) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Color estable por etiqueta: el mismo tag siempre pinta con el mismo color.
 */
const TAG_COLORS = [
  "#a78bfa",
  "#22d3ee",
  "#fbbf24",
  "#34d399",
  "#f472b6",
  "#f87171",
  "#60a5fa",
];

export function tagColor(tag) {
  if (!tag) return "#94a3b8";
  let hash = 0;
  for (let i = 0; i < tag.length; i += 1) {
    hash = (hash * 31 + tag.charCodeAt(i)) | 0;
  }
  return TAG_COLORS[Math.abs(hash) % TAG_COLORS.length];
}
