# AGENTS.md — Agent guide

> **Essential information only.** This file holds what agents need
> to operate in this repository and the content that does not exist
> anywhere else in `docs/`. Detailed documentation lives in:
>
> - [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — file and code
>   organization, conventions, data flow.
> - [`docs/GIT_CONVENTIONS.md`](docs/GIT_CONVENTIONS.md) — branches,
>   commits, PRs and language policy.
> - [`docs/CHANGELOG.md`](docs/CHANGELOG.md) — full change history.
> - `docs/modules/ROOT/pages/*.adoc` — application behavior site
>   (generate with `npm run docs`, browse with `npx serve build/site`).
>
> **Update this file whenever a requirement, decision or rule
> changes.** All content in English; the application UI is Spanish
> (product decision).

---

## 1. Vision

Flashcards web app to memorize tech and programming concepts.
React + Vite (TypeScript, strict mode), 100% client-side, no
backend. Two modes: **My cards** (browse, search, filter, edit,
delete) and **Study** (active-recall sessions with a shuffled deck
and a final summary).

---

## 2. Commands and dependency policy

```bash
npm run dev        # dev server at http://localhost:5173
npm run build      # typecheck (tsc --noEmit) + production build -> dist/
npm run typecheck  # tsc --noEmit only
npm run preview    # serve dist/
npm run lint       # oxlint
npm run docs       # Antora docs site -> build/site
```

**Dependency policy (no additions without justifying them here
first):**

- **Runtime**: React only, plus the single justified exception —
  `i18next` + `react-i18next` for ES/EN i18n (interpolation,
  fallback and language reactivity would otherwise be hand-rolled).
- **devDependencies**: `typescript` (strict; `tsc --noEmit` runs as
  part of `npm run build`) and `@antora/cli` + `@antora/site-generator`
  (docs site) — none of them loaded by the application bundle.
- `@types/react*` ship editor types for React.

---

## 3. Functional requirements registry

Status registry only — behavior details live in the linked pages.
Commit footers reference these IDs (`Closes R5.x`).

| ID | Requirement | Status | Details |
|---|---|---|---|
| R5.1 | Responsive card grid (CSS Grid, `minmax(250px, 1fr)`) | [x] | [home.adoc](docs/modules/ROOT/pages/home.adoc) |
| R5.2 | Card actions (edit/delete) inside the front face: flip with the card, out of the tab order while flipped | [x] | home.adoc |
| R5.3 | Only one visible answer at a time (grid-level `flippedId`) | [x] | home.adoc |
| R5.4 | Delete confirmation naming the card | [x] | home.adoc |
| R5.5 | Text search over question, answer and tag (case-insensitive, trimmed) | [x] | home.adoc |
| R5.6 | Tag filter chips with a first «Todos»/«All» chip that clears the filter | [x] | home.adoc |
| R5.7 | Distinct empty states (filters vs. empty deck) | [x] | home.adoc |
| R5.8 | Stats bar (cards, tags) + restore-to-seed with confirmation | [x] | home.adoc |
| R5.9 | Study session over a shuffled deck (Fisher–Yates) | [x] | [study-mode.adoc](docs/modules/ROOT/pages/study-mode.adoc) |
| R5.10 | Study card flips on click/keyboard, page-controlled | [x] | study-mode.adoc |
| R5.11 | Answer buttons appear 1500 ms after the flip (fade-in, cancelable, out of the tab order while waiting) | [x] | study-mode.adoc |
| R5.12 | «Got it» clears the card; «Review again» requeues it at the end | [x] | study-mode.adoc |
| R5.13 | Session ends when every card has been cleared at least once | [x] | study-mode.adoc |
| R5.14 | Session summary: visits, repeats, mastery % + restart/back | [x] | study-mode.adoc |
| R5.15 | Create/edit cards through a shared modal (same form, initial state per card) | [x] | — |
| R5.16 | Modal wider/taller above mobile: `min(720px, 90vw)`, textarea `min-height` 14rem (10rem on mobile); `max-height` + internal scroll | [x] | — |
| R5.17 | Form validation with a visible error when fields are missing | [x] | — |
| R5.18 | Every change auto-persisted to `localStorage` | [x] | [data-model.adoc](docs/modules/ROOT/pages/data-model.adoc) |
| R5.19 | 9 seed cards on first run (or when storage is corrupt) | [x] | data-model.adoc |
| R5.20 | 3D card: flip by click/keyboard only, always parent-controlled | [x] | [flash-card.adoc](docs/modules/ROOT/pages/flash-card.adoc) |
| R5.21 | No layout jumps on flip (hint stays in the DOM, question centered) | [x] | flash-card.adoc |
| R5.22 | Slow vertical hover/focus auto-scroll for overflowing text (750 ms pause, single pass, stops at the end) + bottom fade hint | [x] | flash-card.adoc |
| R5.23 | ES/EN UI switch in the header, persisted, reactive; seed content stays Spanish | [x] | [index.adoc](docs/modules/ROOT/pages/index.adoc) |

**Open requirements:** none yet — register new ones here with
`[ ]` and an ID.

---

## 4. Non-functional requirements

- [x] No backend: client-side only, `localStorage` is the only
  persistence.
- [x] Resilient persistence: all storage access wrapped in
  `try/catch` (in-memory fallback; corrupt JSON → seed).
- [x] Basic accessibility: ARIA roles, keyboard support on the
  card, dark-theme contrast.
- [x] Global dark theme.
- [ ] Performance: no metrics yet. If the grid exceeds ~200 cards,
  consider virtualization (see backlog).

---

## 5. Design decision log

Unique historical record — current behavior is documented in the
`.adoc` pages.

| Date | Decision | Rationale / effect |
|---|---|---|
| 2025-07-14 (initial v1) | Study mode: «review again» cards requeue at the end | Session ends when every card has been cleared at least once |
| 2025-07-14 (initial v1) | localStorage key `concepts-app:v1` | Explicit versioning to migrate future data shapes |
| 2025-07-14 (initial v1) | 9 seed cards | Instant demo without user-created content |
| 2025-07-14 (initial v1) | Global CSS (no modules) | One stylesheet organized by sections; `.flash-card` prefix for the 3D component |
| 2026-09-18 | Per-face rotation in `.flash-face` | Bug fix: home showed the answer instead of the question — both faces shared a 3D plane |
| 2026-09-18 | Requirements registry in `AGENTS.md` | Source of truth for agents and humans; update on every change |
| 2026-09-18 | Grid flip **click-only** (hover removed) | Hover rotated cards on home; requirement changed to click/keyboard |
| 2026-09-18 | Reveal hint stays in the DOM (hidden with `opacity: 0`) and the question is centered with `margin: auto` | Bug fix: conditionally removing the hint collapsed the face and the question jumped right before the flip |
| 2026-09-18 | Slow hover auto-scroll introduced (horizontal first) | `nowrap` text + `overflow-x: auto`; ping-pong at 16 px/s |
| 2026-09-18 | Auto-scroll becomes **vertical** | Content may be taller than the face (190/300 px): `overflow-y: auto` + `min-height: 0` + bottom fade hint |
| 2026-09-18 | No bounce: single downward pass, stop at the end | To re-read, leave and re-enter the hover/focus |
| 2026-09-18 | Flip always parent-controlled; grid keeps a single `flippedId` | Only one visible answer at a time; FlashCard's uncontrolled mode removed |
| 2026-09-18 | Edit/delete icons move inside the front face (`actions` prop) | They flip with the card instead of floating fixed over the animation |
| 2026-09-19 | Types/interfaces/enums live in `utils/types.ts` / `utils/interfaces.ts` / `utils/enums.ts` of each unit | One role per file inside the unit's `utils/`; improves discoverability; only inline a type when the unit is a single-file (e.g. `App.tsx`) and the type is local |

---

## 6. Rules for agents

1. **Read this file and the docs in `docs/` before writing code.**
2. **Keep documentation updated**: new requirement → section 3
   registry; new decision → section 5; change history →
   `docs/CHANGELOG.md`; structural changes → `docs/ARCHITECTURE.md`.
3. **Do not break the data model invariants** (see
   [data-model.adoc](docs/modules/ROOT/pages/data-model.adoc)): a
   schema change means a new `v2` key plus a documented migration,
   before touching the store.
4. **No new dependency** without justifying it in section 2 first.
5. **Respect the conventions** in
   [ARCHITECTURE.md](docs/ARCHITECTURE.md): TypeScript (strict),
   state in hooks, global sectioned CSS, ARIA on interactive
   controls, English comments.
   TypeScript types, interfaces and enums live in the unit's
   `utils/` folder — never inlined in the component file (see
   ARCHITECTURE.md §6).
6. **After a visible change** run `npm run lint` and, if the UI
   changed, verify the 3D card in **both** modes (grid via click,
   large study card).
7. **Git**: one branch per change from `develop`, Conventional
   Commits (English), PRs in English — see
   [`docs/GIT_CONVENTIONS.md`](docs/GIT_CONVENTIONS.md). Closing a
   requirement goes in the commit footer (e.g. `Closes R5.3`).
8. **If a requirement conflicts with a data invariant**, do not
   solve it silently: note it in the decision log and ask for
   confirmation.
9. **Git history management**: do not use `git commit --amend` or
   interactive rebase to rewrite shared history unless the user
   explicitly requests it. If a fix is needed, create a new commit
   with a clear message (e.g. `fix(scope): correct X`). When in
   doubt, ask before rewriting history.
10. **No magic strings**: string literals used as domain values,
    identifiers or sentinels (e.g. mode IDs, default values,
    empty-string sentinels) must live in a named constant.
    Extract to `application/config/constants.ts` when repeated **two
    or more times**; one-off literals are acceptable. User-facing
    UI strings that live in i18n JSON files are excluded from this
    rule.

---

## 7. Recent changes

Full history in [`docs/CHANGELOG.md`](docs/CHANGELOG.md).

| Date | Change |
|---|---|
| 2026-09-19 | **Architecture**: full TypeScript migration (strict `tsconfig`, `tsc --noEmit` inside `npm run build`, typed data model). |
| 2026-09-19 | **Feature**: ES/EN i18n with `i18next` + `react-i18next` (header switch, persisted locale) — first justified runtime dependency. |
| 2026-09-19 | **Docs**: AsciiDoc documentation site with Antora (`npm run docs`); behavior extracted from code comments into `.adoc` pages. |
| 2026-09-19 | **Architecture**: layered structure migration `pages/` / `common/` / `application/` (3 phases, no behavior changes). |
| 2026-09-19 | **Docs**: AGENTS.md restructured as a lean English agent guide; full changelog moved to `docs/CHANGELOG.md`. |
| 2026-09-19 | **Convention**: extract component/hook/page props and local types into `utils/{types,interfaces,enums}.ts`. | One file per kind (type alias vs. interface vs. enum); helpers private to the unit also live in the same `utils/`. |

---

## 8. Backlog (unordered)

- [ ] Test with 1000+ cards: measure grid performance; decide on
  virtualization.
- [ ] Export/import cards (JSON).
- [ ] Dark/light theme toggle.
- [ ] Persist session statistics (currently per-session only).
- [ ] Sub-tags or spaced-repetition priority (SRS / Leitner).
- [ ] Tests for the study-deck logic and utils (requires a
  dependency decision — rule 4).
