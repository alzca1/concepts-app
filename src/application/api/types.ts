/** A flashcard, exactly as persisted in localStorage (v1 model). */
export interface Concept {
  id: string;
  front: string;
  back: string;
  tag: string;
  createdAt: number;
}

/** User-editable fields of a card (form payload). */
export type ConceptInput = Pick<Concept, "front" | "back" | "tag">;
