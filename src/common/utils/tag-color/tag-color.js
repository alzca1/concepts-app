/**
 * Stable color per tag: the same tag always paints with the same
 * color.
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
