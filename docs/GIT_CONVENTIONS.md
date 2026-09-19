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

### Hotfixes and keeping `main` and `develop` in sync

- Urgent fixes branch off **from `main`** as `hotfix/HOT-XXX-slug`,
  are merged into `main` with `--no-ff`, and are then synced back
  into `develop` so both branches converge.
- Whenever `main` gets ahead of `develop` (e.g. after a hotfix),
  sync it into `develop` before starting new work.

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
- Keep the full branch name short (≤ 60 characters).

| Type | Prefix | Use | Example |
|---|---|---|---|
| `feature/` | `FEAT` | New functionality | `feature/FEAT-001-hover-scroll` |
| `bugfix/` | `BUG` | Fixing wrong behavior | `bugfix/BUG-001-scroll-frozen` |
| `improvement/` | `IMP` | Improvement of something that already exists (UX, performance, accessibility), not new functionality | `improvement/IMP-001-bigger-modal` |
| `internal/` | `INT` | Internal changes with no visible effect: tooling, refactoring, dependencies | `internal/INT-001-rename-utils` |
| `docs/` | `DOCS` | Documentation (AGENTS.md, README, guides) | `docs/DOCS-001-add-git-conventions` |
| `hotfix/` | `HOT` | Urgent fix that goes straight into `main` (section 1) | `hotfix/HOT-001-crash-on-save` |
| `revert/` | `REV` | Revert of a change already merged | `revert/REV-001-revert-hover-scroll` |

---

## 3. Commits: Conventional Commits

**Golden rule — touch only what the task is about**: keep commits
small and atomic, each one grouping changes of a single context.
They are easier to read, review, revert and trace. Never commit
secrets or credentials.

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
| `refactor` | Code change with no behavior change | `internal/` |
| `docs` | Documentation | `docs/` |
| `style` | Formatting / code style (not UI CSS) | `internal/` |
| `perf` | Performance improvement | `improvement/` / `internal/` |
| `test` | Tests | `internal/` |
| `chore` | Tooling, build, dependencies | `internal/` |

### Scope (optional)

Lowercase, consistent with the app sections:
`home`, `study`, `card`, `modal`, `filter`, `css`, `docs`, `deps`…

### Description, body and footer

- Description in **English**, imperative, lowercase, **no trailing
  period**; it states the *what*. The *why* goes in the body.
- If the commit closes or touches a requirement from AGENTS.md
  (section 5), mention it in the footer (e.g. `Closes R5.4`,
  `Refs R5.1`).
- AGENTS.md / README.md updates required by the change (rule 2 of
  AGENTS.md) travel **in the same branch**, either in the same
  commit or in a dedicated `docs:` commit within the branch.

### Examples

```
feat(home): add «Todos» chip to the tag filter

Lets the user see every topic without extra clicks to clear the
filter. aria-pressed on all chips.

Closes R5.1

fix(study): hover auto-scroll froze due to scrollTop quantization

Browsers truncate the sub-pixel per-frame increment (~0.3 px at
16 px/s). The position now accumulates in posRef.

Closes R5.4

internal: Git conventions (numbered branches + conventional commits)

docs(study): document the answer buttons delay
```

---

## 4. Pull Requests

- One PR per branch, with **`develop` as the base branch**.
- Title in the same format as the main commit:
  `<type>(<scope>): <description>`.
- **Title and body always in English**, as well as all their content
  (see section 5).
- Suggested body structure: *What* (what changes), *Why / Notes for
  reviewers* (why and decisions), *Verification* (how it was checked:
  lint, build, manual steps).
- **Work in progress**: if the change is not ready for review, open
  the PR as a **draft** and mark it as ready once it is.
- **Pre-merge checklist**: lint and build green, diff reviewed,
  every comment resolved, and the branch up to date with
  `develop`.
- **Who pushes, merges**: the author performs the merge once the
  checklist is met.
- `--no-ff` merge into `develop` and branch deletion after approval.

### Automation (pending decision)

The reference repository enforces part of this with tooling:
`commitlint` for Conventional Commits and pre-commit hooks (secret
scanning, import order). Adopting any of it here requires adding dev
dependencies — decide first via AGENTS.md rule 4.

---

## 5. Language

- Commits and pull requests: **English**.
- Repository documentation (`README.md`, guides, every `.md` file):
  **English** from now on. Existing Spanish documents are translated
  in dedicated `docs/` branches (README.md translation is pending).
- Application UI: **Spanish** (product decision, unchanged).
