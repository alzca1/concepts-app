import type { ReactNode } from "react";

import type { Concept } from "../../../../../application/api/types";

export interface FlashCardProps {
  concept: Concept;
  flipped?: boolean;
  onFlip?: () => void;
  size?: "normal" | "large";
  actions?: ReactNode;
}