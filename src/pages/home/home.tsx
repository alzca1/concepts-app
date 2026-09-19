import { useTranslation } from "react-i18next";

import type { Concept } from "../../application/api/types";
import { ConceptList } from "./components/concept-list";
import { StatsBar } from "./components/stats-bar";

/**
 * «My cards» page: stats bar, new-card action and the card grid
 * with search and filters.
 */
export function HomePage({
  concepts,
  deleteConcept,
  onEdit,
  resetToSeed,
}: {
  concepts: Concept[];
  deleteConcept: (id: string) => void;
  onEdit: (id: string) => void;
  resetToSeed: () => void;
}) {
  const { t } = useTranslation();

  return (
    <>
      <StatsBar concepts={concepts} resetToSeed={resetToSeed} />

      <div className="add-row">
        <button className="btn btn-primary" onClick={() => onEdit("nueva")}>
          {t("home.addCard")}
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
