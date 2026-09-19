import type { Concept } from "../../../application/api/types";

export interface SessionStats {
  initial: number;
  known: number;
  repeated: number;
}

export interface StudyPageProps {
  concepts: Concept[];
}
