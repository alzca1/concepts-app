import { useTranslation } from "react-i18next";

import { NEW_CARD_SENTINEL } from "../../App";
import { useConcepts } from "../../application/store/use-concepts";
import { useConceptModal } from "../../context/use-concept-modal";
import { ConceptList } from "./components/concept-list";
import { StatsBar } from "./components/stats-bar";

export function HomePage() {
  const { t } = useTranslation();
  const { concepts, deleteConcept, resetToSeed } = useConcepts();
  const { openModal } = useConceptModal();

  return (
    <>
      <StatsBar concepts={concepts} resetToSeed={resetToSeed} />

      <div className="add-row">
        <button
          className="btn btn-primary"
          onClick={() => openModal(NEW_CARD_SENTINEL)}
        >
          {t("home.addCard")}
        </button>
      </div>

      <ConceptList concepts={concepts} deleteConcept={deleteConcept} onEdit={openModal} />
    </>
  );
}
