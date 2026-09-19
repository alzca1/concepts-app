import { useTranslation } from "react-i18next";

import { NEW_CARD_SENTINEL } from "../../App";
import { useConcepts } from "../../application/store/use-concepts";
import { useConceptModal } from "../../context/use-concept-modal";
import { ConceptList } from "./components/concept-list";
import { StatsBar } from "./components/stats-bar";

import type { HomePageProps } from "./utils/interfaces";

export function HomePage({ concepts, isLoading, error }: HomePageProps) {
  const { t } = useTranslation();
  const { deleteConcept } = useConcepts();
  const { openModal } = useConceptModal();

  if (isLoading) {
    return <p className="empty-state">{t("home.loading")}</p>;
  }

  if (error) {
    return (
      <p className="empty-state" role="alert">
        {t("home.loadError", { message: error.message })}
      </p>
    );
  }

  return (
    <>
      <StatsBar concepts={concepts} />

      <div className="add-row">
        <button
          className="btn btn-primary"
          onClick={() => openModal(NEW_CARD_SENTINEL)}
        >
          {t("home.addCard")}
        </button>
      </div>

      <ConceptList
        concepts={concepts}
        deleteConcept={deleteConcept}
        onEdit={openModal}
      />
    </>
  );
}
