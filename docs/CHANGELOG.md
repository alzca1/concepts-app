# CHANGELOG

Full change history of the project. New entries go here (newest
first); the last few are mirrored in [`AGENTS.md`](../AGENTS.md).

| Date | Change |
|---|---|
| 2026-09-19 | **Feature**: Supabase multi-user backend (`feature/FEAT-001-supabase-auth-and-multi-user`) — email + password Auth via `@supabase/supabase-js`; `public.concepts` table with RLS scoped by `auth.uid()`; `useConcepts` is now async and reacts to the session; `<ProtectedRoute>` redirects unauthenticated users to `/login` while preserving the requested URL; new `/login` and `/signup` pages; header shows the user's email and a sign-out button. Seed cards and `localStorage` persistence of cards are removed — new users start with an empty deck. Schema documented in `supabase/schema.sql` and `docs/modules/ROOT/pages/data-model.adoc`. Closes R5.18 (re-purposed), R5.19 (removed), R6.1, R6.2, R6.3, R6.4. |
| 2026-09-19 | **Architecture**: full TypeScript migration (`internal/INT-004-typescript-migration`) — strict `tsconfig.json`, `tsc --noEmit` wired into `npm run build` (+ new `npm run typecheck`), all sources renamed to `.ts`/`.tsx`, typed data model (`Concept`/`ConceptInput`). Also: component/hook props and local interfaces live in the unit's `utils/{types,interfaces,enums}.ts`; the `App.tsx` `MODES` array drives its own `ModeId` via `as const` instead of a duplicated union. |
| 2026-09-19 | **Docs**: AGENTS.md restructured as a lean English agent guide (requirements registry + unique content only); full changelog moved to `docs/CHANGELOG.md`. |
| 2026-09-19 | **Feature**: ES/EN i18n with `i18next` + `react-i18next` (header switch, persisted locale in `concepts-app:locale`); UI strings in `application/i18n/locales/*.json`. First justified exception to the "no runtime dependencies" rule. |
| 2026-09-19 | **Docs**: AsciiDoc documentation site with Antora (`npm run docs` → `build/site`); `.adoc` pages in `docs/modules/ROOT/pages` carrying the behavior extracted from code comments (Antora as devDependencies only — rule 4). |
| 2026-09-19 | **Internal**: all source comments translated to English (language policy); language rule added to `docs/GIT_CONVENTIONS.md` section 5. |
| 2026-09-19 | **Architecture**: migration to the layered structure `pages/` / `common/` / `application/` (branch `internal/INT-001-structure-migration`, 3 phases, no behavior changes); constants centralised in `application/config/constants.js`; `App.jsx` becomes a shell. Details in `docs/ARCHITECTURE.md`. |
| 2026-09-18 | **Docs**: `GIT_CONVENTIONS.md` created (one branch per change from `develop`; conventional commits, numbered branches, PRs in English). |
| 2026-09-18 | **Modal**: answer textarea starts taller on mobile too (`min-height: 10rem` instead of the default 4 rows). |
| 2026-09-18 | **Modal**: wider (720px) and taller answer textarea (14rem) above mobile for long texts; `max-height` + internal scroll as a viewport guard. |
| 2026-09-18 | **Home**: edit/delete icons move inside the front face (new `actions` prop of `FlashCard`) and flip with the card; hidden and out of the tab order while the face is away. |
| 2026-09-18 | **Study**: answer buttons appear 1500 ms after the flip (fade-in without layout jump, cancellable timer). |
| 2026-09-18 | **Home**: flipping a card resets the previous one — only one visible answer at a time. `FlashCard` becomes always controlled (uncontrolled mode removed, it had no remaining users). |
| 2026-09-18 | **Home**: «Todos» chip in the tag filter clearing the filter and showing every topic; `aria-pressed` on all chips. |
| 2026-09-18 | **UX**: hover auto-scroll drops the bounce — single downward pass that stops at the end; to re-read, leave and re-enter hover/focus. |
| 2026-09-18 | **UX**: hover auto-scroll starts after a 750 ms pause (`HOVER_SCROLL_DELAY`), cancellable by leaving hover/focus before it fires; cleaned up on unmount. |
| 2026-09-18 | **Fix**: auto-scroll never advanced — `scrollTop` is quantized to whole pixels, so re-reading the position from the DOM each frame truncated the ~0.3 px/frame increment to 0. The position now accumulates in `posRef` (animation pattern) and is only written to the DOM; `onScroll` tolerates ±2 px due to quantization. |
| 2026-09-18 | **UX**: hover auto-scroll goes from horizontal to vertical (wrapping text, height overflow, `min-height: 0` on flex items); new bottom fade (`.flash-face--overflow`) on overflowing faces. |
| 2026-09-18 | **UX**: if a question or answer is wider than the card, a very slow horizontal auto-scroll (ping-pong, 16 px/s) starts on hover/focus; only with real overflow the card stays static and small. Creates `hooks/useHoverScroll.js`. |
| 2026-09-18 | **Fix UX**: when flipping, the question stuck to the bottom edge (the «Clic para revelar» hint was removed from the DOM on flip). The hint is now hidden with opacity and the question centred with auto margins, in grid and study mode. |
| 2026-09-18 | **UX**: hover flip removed in «My cards»: only click (or keyboard) reveals the answer. README, `FlashCard` JSDoc and AGENTS.md synced. |
| 2026-09-18 | **Fix UI**: home cards showed the answer instead of the question. Per-face 3D rotations were missing (`.flash-front`/`.flash-back`). |
| 2026-09-18 | `AGENTS.md` added as the source of truth for requirements. |
| 2026-09-18 | **v1 of the project in git**: initial commit (`1a3abe7`). |
