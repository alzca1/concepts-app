import type { Concept } from "../../../../../application/api/types";

export interface StatsBarProps {
  concepts: Concept[];
  resetToSeed: () => void;
}