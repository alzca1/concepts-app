import { ConceptList } from "./components/concept-list";
import { StatsBar } from "./components/stats-bar";

/**
 * Página «Mis tarjetas»: estadísticas, acceso a nueva tarjeta y
 * parrilla con búsqueda y filtros.
 */
export function HomePage({ concepts, deleteConcept, onEdit, resetToSeed }) {
  return (
    <>
      <StatsBar concepts={concepts} resetToSeed={resetToSeed} />

      <div className="add-row">
        <button className="btn btn-primary" onClick={() => onEdit("nueva")}>
          ＋ Nueva tarjeta
        </button>
      </div>

      <ConceptList
        concepts={concepts}
        deleteConcept={deleteConcept}
        onEdit={onEdit}
      />
    </>
  );
}
