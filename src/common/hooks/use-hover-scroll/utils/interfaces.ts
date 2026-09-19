import type { RefObject } from "react";

export interface HoverScrollResult<T extends HTMLElement> {
  ref: RefObject<T | null>;
  scrollable: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onFocus: () => void;
  onBlur: () => void;
  onScroll: () => void;
}