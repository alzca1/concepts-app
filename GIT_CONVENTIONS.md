# GIT_CONVENTIONS.md — Git Conventions

> Branch workflow, naming and commit format for this repository.
> AGENTS.md (section 8, rule 7) references this file: any agent or
> human making changes to the repo must follow it.

---

## 1. Branch workflow

- **`main`** — stable branch: always buildable and consistent with
  the documentation.
- **`develop`** — integration branch: finished changes land here.
- **One branch per change** (feature, bugfix…), always created
  **from `develop`** and merged back into `develop` with
  `git merge --no-ff` (keeps the change's history). After the merge,
  the branch is deleted.
- `develop` → `main` only when consolidating a stable version
  (merge --no-ff and, if applicable, a tag).

---

## 2. Branch naming

Format: `<type>/<PREFIX-XXX-slug>`

- `PREFIX` identifies the type of change (table below).
- `XXX` is a **3-digit sequential number per type** (`001`, `002`,
  …): it must be **greater than the last used number** of that type,
  and numbers are never reused even if the branch is deleted. To
  find the next one, list existing branches (`git branch -a`) and
  look for the highest number of that type.
- `slug`: description of the change in **2–3 words**, kebab-case,
  no accented characters (English recommended, e.g.
  `add-git-conventions`).
- One change = one branch; if a change grows into another scope,
  split it into several branches instead.

| Type | Prefix | Use | Example |
|---|---|---|---|
| `feature/` | `FEAT` | New functionality | `feature/FEAT-001-hover-scroll` |
| `bugfix/` | `BUG` | Fixing wrong behavior | `bugfix/BUG-001-scroll-frozen` |
| `improvement/` | `IMP` | Improvement of something that already exists (UX, performance, accessibility), not new functionality | `improvement/IMP-001-bigger-modal` |
| `internal/` | `INT` | Internal changes with no visible effect: tooling, refactoring, dependencies | `internal/INT-001-rename-utils` |
| `docs/` | `DOCS` | Documentation (AGENTS.md, README, guides) | `docs/DOCS-001-add-git-conventions` |

---

## 3. Commits: Conventional Commits

Format:

```
<type>(<scope>): <description>

[optional body: the why, decisions made]

[optional footer: AGENTS.md requirements]
```

### Types (standard Conventional Commits)

| Type | Use | Typical branch |
|---|---|---|
| `feat` | New functionality | `feature/` |
| `fix` | Bug fix | `bugfix/` |
| `improvement`* | Improvement of an existing feature | `improvement/` |
| `refactor` | Code change with no behavior change | `internal/` |
| `docs` | Documentation | `docs/` |
| `style` | Formatting / code style (not UI CSS) | `internal/` |
| `perf` | Performance improvement | `improvement/` / `internal/` |
| `test` | Tests | `internal/` |
| `chore` | Tooling, build, dependencies | `internal/` |

\* `improvement` is not a standard type in the specification, but it
is adopted here for being expressive; if strict spec compliance is
preferred, use `feat` or `refactor` as appropriate.

### Scope (optional)

Lowercase, consistent with the app sections:
`home`, `study`, `card`, `modal`, `filter`, `css`, `docs`, `deps`…

### Description, body and footer

- Description in **Spanish**, imperative, lowercase, **no trailing
  period**; it states the *what*. The *why* goes in the body.
- If the commit closes or touches a requirement from AGENTS.md
  (section 5), mention it in the footer (e.g. `Cierra R5.4`,
  `Refs R5.1`).
- AGENTS.md / README.md updates required by the change (rule 2 of
  AGENTS.md) travel **in the same branch**, either in the same
  commit or in a dedicated `docs:` commit within the branch.

### Examples

```
feat(home): chip «Todos» en el filtro por etiqueta

Permite ver todas las temáticas sin desactivar el filtro a base de
clics. aria-pressed en todos los chips.

Cierra R5.1

fix(estudio): el auto-scroll no avanzaba por cuantización de scrollTop

Los navegadores truncaban el incremento subpíxel por frame (~0,3 px a
16 px/s). La posición se acumula ahora en posRef.

Cierra R5.4

internal: convenciones de Git (ramas + conventional commits)

docs(estudio): documentar el retardo de los botones de respuesta
```

---

## 4. Pull Requests

- One PR per branch, with **`develop` as the base branch**.
- Title in the same format as the main commit:
  `<type>(<scope>): <description>`.
- **Title and body always in English**, as well as all their content
  (commits and the app UI remain in Spanish).
- Suggested body structure: *What* (what changes), *Why / Notes for
  reviewers* (why and decisions), *Verification* (how it was checked:
  lint, build, manual steps).
- `--no-ff` merge into `develop` and branch deletion after approval.
