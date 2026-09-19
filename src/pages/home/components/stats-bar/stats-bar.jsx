export function StatsBar({ concepts, resetToSeed }) {
  const tags = new Set(concepts.map((c) => c.tag || "General"));

  return (
    <div className="stats-bar">
      <div className="stat">
        <span>{concepts.length}</span>
        <em>tarjetas</em>
      </div>
      <div className="stat">
        <span>{tags.size}</span>
        <em>etiquetas</em>
      </div>
      <div className="stats-bar__spacer" />
      <button
        type="button"
        className="btn btn-ghost btn-sm"
        onClick={() =>
          window.confirm(
            "¿Restaurar las tarjetas de ejemplo? Se perderán los cambios guardados."
          ) && resetToSeed()
        }
      >
        ↺ Restaurar iniciales
      </button>
    </div>
  );
}
