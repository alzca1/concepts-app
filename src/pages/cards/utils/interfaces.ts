import type { Concept } from "../../../application/api/types";

export interface CardsPageProps {
  concepts: Concept[];
  isLoading: boolean;
  error: Error | null;
}
