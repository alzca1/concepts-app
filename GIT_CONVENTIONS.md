# GIT_CONVENTIONS.md — Convenciones de Git

> Flujo de ramas, nomenclatura y formato de commits del proyecto.
> AGENTS.md (sección 8, regla 7) referencia este archivo: cualquier
> agente o humano que haga cambios en el repo debe seguirlo.

---

## 1. Flujo de ramas

- **`main`** — rama estable: siempre en estado buildable y coherente
  con la documentación.
- **`develop`** — rama de integración: aquí confluyen los cambios
  terminados.
- **Una rama por cambio** (feature, bugfix…), creada **siempre desde
  `develop`** y fusionada de vuelta a `develop` con
  `git merge --no-ff` (conserva el histórico del cambio). Tras el
  merge, la rama se elimina.
- `develop` → `main` solo al querer consolidar una versión estable
  (merge --no-ff y, si procede, tag).

---

## 2. Nomenclatura de ramas

Formato: `<tipo>/<PREFIJO-XXX-slug>`

- `PREFIJO` identifica el tipo de cambio (tabla siguiente).
- `XXX` es un **número secuencial de 3 dígitos por tipo** (`001`,
  `002`, …): debe ser **mayor que el último usado** de ese tipo y no
  se reutilizan números aunque la rama se borre. Para saber cuál
  toca, listar las ramas existentes (`git branch -a`) y buscar el
  mayor del tipo.
- `slug`: descripción del cambio en **2–3 palabras**, kebab-case,
  sin acentos (se recomienda en inglés, p. ej.
  `add-git-conventions`).
- Un cambio = una rama; si el cambio crece hacia otro ámbito, mejor
  dividir en varias ramas.

| Tipo | Prefijo | Uso | Ejemplo |
|---|---|---|---|
| `feature/` | `FEAT` | Funcionalidad nueva | `feature/FEAT-001-hover-scroll` |
| `bugfix/` | `BUG` | Corrección de un comportamiento erróneo | `bugfix/BUG-001-scroll-frozen` |
| `improvement/` | `IMP` | Mejora de algo existente (UX, rendimiento, accesibilidad) sin ser funcionalidad nueva | `improvement/IMP-001-bigger-modal` |
| `internal/` | `INT` | Cambios internos sin efecto visible: tooling, refactor, dependencias | `internal/INT-001-rename-utils` |
| `docs/` | `DOCS` | Documentación (AGENTS.md, README, guías) | `docs/DOCS-001-add-git-conventions` |

---

## 3. Commits: Conventional Commits

Formato:

```
<tipo>(<ámbito>): <descripción>

[cuerpo opcional: el por qué, decisiones tomadas]

[footer opcional: requisitos de AGENTS.md]
```

### Tipos (estándar de Conventional Commits)

| Tipo | Uso | Rama típica |
|---|---|---|
| `feat` | Funcionalidad nueva | `feature/` |
| `fix` | Corrección de bug | `bugfix/` |
| `improvement`* | Mejora de una funcionalidad existente | `improvement/` |
| `refactor` | Cambio de código sin cambio de comportamiento | `internal/` |
| `docs` | Documentación | `docs/` |
| `style` | Formato / estilos que no afectan al código (no CSS de UI) | `internal/` |
| `perf` | Mejora de rendimiento | `improvement/` / `internal/` |
| `test` | Tests | `internal/` |
| `chore` | Tooling, build, dependencias | `internal/` |

\* `improvement` no es un tipo estándar de la especificación, pero se
adopta aquí por ser expresivo; si se prefiere rigor estricto con la
spec, usar `feat` o `refactor` según el caso.

### Ámbito (opcional)

En minúsculas, coherente con las secciones de la app:
`home`, `estudio`, `tarjeta`, `modal`, `filtro`, `css`, `docs`, `deps`…

### Descripción, cuerpo y footer

- Descripción en **español**, imperativa, minúsculas, **sin punto
  final**; cuenta el *qué*. El *por qué* va en el cuerpo.
- Si el commit cierra o toca un requisito de AGENTS.md (sección 5),
  mencionarlo en el footer (p. ej. `Cierra R5.4`, `Refs R5.1`).
- Las actualizaciones de `AGENTS.md` / `README.md` que exija el
  cambio (regla 2 de AGENTS.md) viajan **en la misma rama**, en el
  mismo commit o en uno `docs:` propio de la rama.

### Ejemplos

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

- Una PR por rama, con **`develop` como rama base**.
- Título con el mismo formato que el commit principal:
  `<tipo>(<ámbito>): <descripción>`.
- **Título y cuerpo siempre en inglés**, igual que todo su contenido
  (los commits y la UI de la app siguen en español).
- Estructura sugerida del cuerpo: *What* (qué cambia), *Why / Notes
  for reviewers* (por qué y decisiones), *Verification* (cómo se ha
  comprobado: lint, build, pasos manuales).
- Merge `--no-ff` a `develop` y borrado de la rama tras aprobarse.
