# ARCHITECTURE.md — Repository architecture and organization

> How the code and files of this repository are organized: layers,
> responsibility of each folder, naming conventions and test
> placement. Any structural change must be reflected here; AGENTS.md
> (section 3) references this document.

---

## 1. Overview

Static SPA (React + Vite, TypeScript strict mode, `tsc --noEmit`
runs inside `npm run build`) backed by a managed Supabase project
(Postgres + Auth + Row-Level Security). The frontend has three
runtime dependencies — `i18next` + `react-i18next`, `react-router-dom`,
and `@supabase/supabase-js` — each justified in AGENTS.md §2.
The app is 100% client-side; all persistence lives in Supabase and
is scoped to the signed-in user by the database policy.

Global state lives in custom hooks (`useAuth`, `useConcepts`);
components are presentational and receive behavior through props.
Routes (`/`, `/study`, `/login`, `/signup`) are protected by
`<ProtectedRoute>` which redirects unauthenticated users to
`/login` while preserving the requested URL.

---

## 2. Organization principles

1. **Layered organization with one-way dependencies**:
   `pages/` → `common/` → `application/`. A layer only imports from
   lower layers (a page uses common components and application
   hooks; never the other way around).
2. **One unit per folder**: every component, hook or utility lives
   in its own folder, next to its tests (`__tests__/`) and its
   private utilities (`utils/`).
3. **Domain vs. presentational components**: presentational
   components only render (they know nothing about the business);
   domain components encapsulate an application concept and its
   interaction.
4. **Self-contained pages**: one folder per page/view with its local
   components, hooks and utilities; anything shared is promoted to
   `common/`.
5. **Predictable naming**: files in kebab-case, components in
   PascalCase, functions and variables in camelCase, CSS with BEM.

---

## 3. Current structure

Migrated to the layered layout in `internal/INT-001-structure-migration`
and to TypeScript (strict) in `internal/INT-004-typescript-migration`
(September 2026): the layout matches the target in section 4, except
the CSS files, which still live at `src/` root (open decision, see
section 5).

```
src/
├── main.tsx               # Entry point (createRoot) — do not modify
├── App.tsx                # Shell: AuthProvider + routes + modal
├── App.css                # Application styles (by sections)
├── index.css              # Reset and base styles
├── vite-env.d.ts          # Vite client types (CSS/asset imports)
├── application/           # Infrastructure (no UI)
│   ├── api/
│   │   ├── supabase-client.ts     # createClient singleton
│   │   ├── concepts-repository.ts # Typed CRUD over public.concepts
│   │   ├── types.ts               # Concept / ConceptInput
│   │   └── utils/interfaces.ts    # ConceptRow (DB shape)
│   ├── config/
│   │   └── constants.ts          # Locale key, delays and speeds
│   ├── i18n/
│   │   ├── i18n.ts               # i18next init + changeLocale
│   │   ├── locales/              # es.json / en.json (flat keys)
│   │   └── index.ts
│   └── store/
│       └── use-concepts/         # Async card state bound to the session
├── common/                # Reusable, page-agnostic
│   ├── components/
│   │   ├── domain/
│   │   │   └── concept-form/     # Create/edit card modal
│   │   ├── presentational/
│   │   │   └── flash-card/       # 3D card (front/back)
│   │   └── protected-route/      # <ProtectedRoute> route guard
│   ├── hooks/
│   │   └── use-hover-scroll/     # Slow auto-scroll on hover
│   └── utils/
│       ├── shuffle/
│       ├── tag-color/
│       └── uid/                  # One utility per folder
├── context/
│   ├── auth-context.ts           # AuthContext type
│   ├── auth-provider.tsx         # Session tracker + sign-in/up/out
│   ├── use-auth.ts               # Hook
│   ├── concept-modal-context.ts
│   ├── concept-modal.tsx
│   ├── use-concept-modal.ts
│   └── index.ts                  # Auth barrel
└── pages/                 # One folder per view
    ├── home/
    │   ├── home.tsx       # Page: stats bar + new-card action + grid
    │   ├── index.ts
    │   ├── utils/interfaces.ts   # HomePageProps
    │   └── components/
    │       ├── concept-list/  # Search, tag filters, card grid
    │       └── stats-bar/     # Cards + tags counts
    ├── study/
    │   ├── study.tsx      # Page: study session + summary
    │   ├── index.ts
    │   └── utils/interfaces.ts
    └── auth/
        ├── login.tsx
        ├── signup.tsx
        ├── index.ts
        └── utils/interfaces.ts
```

The `supabase/` folder at the repo root holds the database schema
(`schema.sql`) and a short setup guide (`README.md`).

---

## 4. Target structure

Layered model (adapted from a production SPA):

```
src/
├── main.tsx                          # Entry point — do not modify
├── App.tsx                           # Shell: AuthProvider + routes + modal
├── pages/                            # One folder per view
│   ├── home/                         # My cards
│   │   ├── index.ts                  # Page barrel
│   │   ├── home.tsx
│   │   ├── utils/                    # Page-local types
│   │   └── components/
│   │       ├── concept-list/
│   │       └── stats-bar/
│   ├── study/                        # Active-recall sessions
│   │   ├── index.ts
│   │   ├── study.tsx
│   │   └── utils/
│   └── auth/                         # Login + signup pages
│       ├── index.ts
│       ├── login.tsx
│       ├── signup.tsx
│       └── utils/
├── context/                          # React contexts shared across pages
│   ├── auth-context.ts               # AuthContext type
│   ├── auth-provider.tsx             # Session tracker
│   ├── use-auth.ts                   # Hook
│   ├── concept-modal-context.ts
│   ├── concept-modal.tsx
│   ├── use-concept-modal.ts
│   └── index.ts                      # Auth barrel
├── common/                           # Reusable, page-agnostic
│   ├── components/
│   │   ├── presentational/
│   │   │   └── flash-card/           # 3D card
│   │   ├── domain/
│   │   │   └── concept-form/         # Create/edit card modal
│   │   └── protected-route/          # Route guard
│   ├── hooks/
│   │   └── use-hover-scroll/
│   └── utils/
│       ├── uid/
│       ├── shuffle/
│       └── tag-color/
└── application/                      # Application infrastructure
    ├── api/
    │   ├── supabase-client.ts        # createClient singleton
    │   ├── concepts-repository.ts    # Typed CRUD over public.concepts
    │   ├── types.ts                  # Concept / ConceptInput
    │   └── utils/interfaces.ts       # ConceptRow
    ├── store/
    │   └── use-concepts/             # Async state bound to session
    ├── config/
    │   └── constants.ts              # LOCALE_STORAGE_KEY, delays, speeds…
    └── i18n/
        ├── i18n.ts
        ├── locales/                  # es.json / en.json
        └── index.ts
```

### Ownership rules

| If the code… | It goes to |
|---|---|
| Renders a full view or belongs to a single mode | `pages/{mode}/` |
| Is used by two or more pages | `common/` |
| Knows nothing about the UI (persistence, configuration, global state) | `application/` |
| Is a reusable pure function | `common/utils/{name}/` |

---

## 5. Migration plan

> **Status: completed** — 2026-09-19, `internal/INT-001-structure-migration`,
> one commit per phase, no behavior changes.

The reorganization happened in phases (one `internal/INT-XXX-*`
branch per phase), with no behavior changes:

| Current | Target | Phase |
|---|---|---|
| `lib/utils.js` | `common/utils/{uid,shuffle,tag-color}/` | 1 |
| `hooks/useHoverScroll.js` | `common/hooks/use-hover-scroll/` | 1 |
| `components/FlashCard.jsx` | `common/components/presentational/flash-card/` | 1 |
| `data/seed.js` + localStorage logic in `useConcepts` | `application/api/` | 2 |
| `hooks/useConcepts.js` | `application/store/use-concepts/` | 2 |
| `components/ConceptForm.jsx` | `common/components/domain/concept-form/` | 2 |
| `components/ConceptList.jsx` + `StatsBar.jsx` | `pages/home/` | 3 |
| `components/StudyView.jsx` | `pages/study/` | 3 |
| Scattered constants (`STORAGE_KEY`, delays, scroll speed) | `application/config/constants.js` | 3 |

Open decision: **CSS**. It is currently global by sections
(`App.css`, decision from 2025-07-14). The long-term goal is
colocation (one `.css` per component with BEM classes, imported by
the component), which leaves no orphans when deleting a component.
Migrate only once the stylesheet layout is stable.

---

## 6. Code conventions

### Naming

| Type | Convention | Example |
|---|---|---|
| Files and folders | kebab-case | `flash-card.tsx`, `use-hover-scroll/` |
| Components | PascalCase | `FlashCard` |
| Functions/variables | camelCase | `getButtonConfig` |
| Event handlers | `handle` prefix | `handleClick` |
| Custom hooks | `use` prefix | `useHoverScroll` |
| CSS | BEM (block__element--modifier) | `.flash-card__tag` |
| Tests | `{name}.test.tsx` in `__tests__/` | `flash-card.test.tsx` |

### Placement

- Tests live next to the code, inside the unit folder's
  `__tests__/`.
- A unit's private utilities go in a `utils/` folder inside its own
  folder; if another unit needs them, promote them to
  `common/utils/`.
- A unit's **TypeScript types, interfaces and enums live inside
  that same `utils/`**, split by kind: `types.ts` for `type`
  aliases, `interfaces.ts` for `interface` declarations,
  `enums.ts` for `enum` declarations. Helpers private to the unit
  (e.g. `format-fix-item.ts`) also live here. Convention: one role
  per file inside the unit's `utils/`. A
  component, hook or page whose only artefact is a single `.tsx`/
  `.ts` file in `src/` (e.g. `App.tsx`) may keep its local types
  inline; the rule applies once the unit lives in its own folder.
- Pure functions are named after their intent: verbs for actions
  (`shuffle`), `should-*` / `is-*` / `has-*` for predicates.

### Barrels

Every page (and, when it helps, every shared component) exposes an
`index.ts` as its single entry point: external imports point to the
folder, not to an internal file.

### Import order

Grouped by dependency type, with a blank line between groups and
alphabetical order within each group:

1. external runtime libraries (`react` first),
2. external types (`import type`),
3. global internal modules,
4. internal types,
5. services / API / infrastructure (`application/`),
6. hooks,
7. store / context / providers,
8. components,
9. constants / helpers / utils / mappers,
10. assets,
11. styles (always last).

---

## 7. Data flow

```
localStorage (key `concepts-app:v1`)
        ↑↓  JSON.stringify / parse
application/api  (concepts-storage)
        ↓
application/store  (use-concepts: useState + save useEffect)
        ↓ props
App.tsx  ──► pages/home  |  pages/study
                   ↓ props (concept, onEdit, deleteConcept…)
        common/components (render only, never mutate)
```

Invariant: presentational components never access `application/`;
everything reaches them through props.

---

## 8. New feature checklist

New page/view:

1. [ ] Create folder `src/pages/{name}/`
2. [ ] Component `{name}.tsx` + `index.ts` barrel
3. [ ] Styles (BEM) and empty/loading states if applicable
4. [ ] Tests in `__tests__/`
5. [ ] Register the requirement in AGENTS.md (section 5)
6. [ ] Branch `feature/FEAT-XXX-slug` + PR into `develop` (English)

New shared component/hook/utility: its own folder in `common/` (or
`application/` if it is infrastructure), with tests, and only when
there is a real or planned second consumer — do not build
abstractions up front.

---

## 9. Documentation map

Reference documentation lives in the `docs/` folder; only `README.md`
and `AGENTS.md` stay at the root.

| Document | Content |
|---|---|
| `README.md` (root) | What it is, how to run it, quick structure |
| `AGENTS.md` (root) | Lean agent guide: requirements registry, decision log, agent rules |
| `docs/ARCHITECTURE.md` (this file) | File and code organization |
| `docs/GIT_CONVENTIONS.md` | Branches, commits and PRs |
| `docs/CHANGELOG.md` | Full change history |
| `docs/modules/ROOT/pages/*.adoc` | Application documentation site (AsciiDoc, generated with `npm run docs`) |

When adding a new document: create it in `docs/` (repo meta) or as
an AsciiDoc page in `docs/modules/ROOT/pages/` (application
documentation, registered in `nav.adoc`), and reference it here and
in AGENTS.md.

---

## 10. Rarely-modified files

| File | Reason |
|---|---|
| `src/main.tsx` | Application bootstrap |
| `vite.config.ts` | Stable build configuration |
| `index.html` | Root template |
