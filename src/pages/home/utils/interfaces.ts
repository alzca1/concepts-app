import type { Concept } from "../../../application/api/types";

export interface HomePageProps {
  concepts: Concept[];
  isLoading: boolean;
  error: Error | null;
}
