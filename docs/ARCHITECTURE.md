# ARCHITECTURE.md — Arquitectura y organización del repositorio

> Cómo se organiza el código y los archivos de este repositorio:
> capas, responsabilidad de cada carpeta, convenciones de nomenclatura
> y colocación de tests. Cualquier cambio estructural debe reflejarse
> aquí; AGENTS.md (sección 3) referencia este documento.

---

## 1. Visión general

SPA 100% client-side de *flashcards*: React + Vite, JavaScript (sin
TypeScript), sin backend ni librerías externas en runtime. La única
persistencia es `localStorage`. El estado global vive en hooks
custom; los componentes son presentacionales y reciben comportamiento
por props.

---

## 2. Principios de organización

1. **Organización por capas con dependencia unidireccional**:
   `pages/` → `common/` → `application/`. Una capa solo importa de
   capas inferiores (una página usa componentes comunes y hooks de
   aplicación; nunca al revés).
2. **Una unidad por carpeta**: cada componente, hook o utilidad vive
   en su propia carpeta, junto a sus tests (`__tests__/`) y sus
   utilidades privadas (`utils/`).
3. **Componentes de dominio vs. presentacionales**: los
   presentacionales solo pintan (no saben de negocio); los de dominio
   encapsulan un concepto de la aplicación y su interacción.
4. **Páginas autocontenidas**: una carpeta por página/vista con sus
   componentes, hooks y utilidades locales; lo compartido se promociona
   a `common/`.
5. **Nomenclatura predecible**: archivos en kebab-case, componentes
   en PascalCase, funciones y variables en camelCase, CSS con BEM.

---

## 3. Estructura actual

```
src/
├── main.jsx               # Entry point (createRoot) — no modificar
├── App.jsx                # Shell: modo activo (cartas/estudio) + modal
├── App.css                # Estilos de la aplicación (por secciones)
├── index.css              # Reset y estilos base
├── components/            # Todos los componentes, sin capas
│   ├── FlashCard.jsx
│   ├── ConceptList.jsx
│   ├── ConceptForm.jsx
│   ├── StudyView.jsx
│   └── StatsBar.jsx
├── data/
│   └── seed.js            # 9 tarjetas de ejemplo
├── hooks/
│   ├── useConcepts.js     # Estado + persistencia localStorage
│   └── useHoverScroll.js  # Auto-scroll en hover para desbordes
└── lib/
    └── utils.js           # uid, shuffle, tagColor (mezclados)
```

Problemas: `components/` mezcla páginas, modales y componentes
reutilizables; las utilidades conviven en un único `utils.js`; los
tests no tienen sitio definido; la persistencia está embebida en el
hook de estado.

---

## 4. Estructura objetivo

Modelo por capas (adaptado de un SPA en producción con React):

```
src/
├── main.jsx                          # Entry point — no modificar
├── App.jsx                           # Shell: modo activo + modal raíz
├── pages/                            # Una carpeta por vista/modo
│   ├── home/
│   │   ├── index.js                  # Barrel de la página
│   │   ├── home.jsx                  # Vista: parrilla + búsqueda + filtros
│   │   ├── components/               # Componentes locales de la página
│   │   │   ├── concept-list/
│   │   │   └── stats-bar/
│   │   └── __tests__/
│   └── study/
│       ├── index.js
│       ├── study.jsx                 # Vista: sesión + resumen
│       ├── components/study-view/
│       └── __tests__/
├── common/                           # Reutilizable, sin lógica de página
│   ├── components/
│   │   ├── presentational/
│   │   │   └── flash-card/           # flash-card.jsx + flash-card.css + __tests__/
│   │   └── domain/
│   │       └── concept-form/         # Modal crear/editar tarjeta
│   ├── hooks/
│   │   └── use-hover-scroll/         # use-hover-scroll.js + __tests__/
│   └── utils/
│       ├── uid/                      # Una utilidad por carpeta
│       ├── shuffle/
│       └── tag-color/
└── application/                      # Infraestructura de la aplicación
    ├── api/
    │   ├── concepts-storage.js       # Lectura/escrita localStorage (try/catch)
    │   └── seed/                     # Datos semilla
    ├── store/
    │   └── use-concepts/             # Estado global + __tests__/
    ├── config/
    │   └── constants.js              # STORAGE_KEY, delays, velocidades…
    └── assets/styles/                # index.css y estilos globales
```

### Reglas de pertenencia

| ¿El código…? | Va a |
|---|---|
| Pinta una vista completa o pertenece a un solo modo | `pages/{modo}/` |
| Lo usan dos o más páginas | `common/` |
| No sabe nada de la UI (persistencia, configuración, estado global) | `application/` |
| Es una función pura reutilizable | `common/utils/{nombre}/` |

---

## 5. Plan de migración

La reorganización se hará por fases (una rama `internal/INT-XXX-*`
por fase), sin cambios de comportamiento:

| Actual | Destino | Fase |
|---|---|---|
| `lib/utils.js` | `common/utils/{uid,shuffle,tag-color}/` | 1 |
| `hooks/useHoverScroll.js` | `common/hooks/use-hover-scroll/` | 1 |
| `components/FlashCard.jsx` | `common/components/presentational/flash-card/` | 1 |
| `data/seed.js` + lógica localStorage de `useConcepts` | `application/api/` | 2 |
| `hooks/useConcepts.js` | `application/store/use-concepts/` | 2 |
| `components/ConceptForm.jsx` | `common/components/domain/concept-form/` | 2 |
| `components/ConceptList.jsx` + `StatsBar.jsx` | `pages/home/` | 3 |
| `components/StudyView.jsx` | `pages/study/` | 3 |
| Constantes dispersas (`STORAGE_KEY`, delays, velocidad de scroll) | `application/config/constants.js` | 3 |

Decisión abierta: **CSS**. Hoy es global por secciones (`App.css`,
decisión de 2025-07-14). El objetivo a largo plazo es colocation
(un `.css` por componente con clases BEM, importado por el
componente), que permite borrar un componente sin huérfanos. Migrar
solo cuando la parrilla de estilos esté estable.

---

## 6. Convenciones de código

### Nomenclatura

| Tipo | Convención | Ejemplo |
|---|---|---|
| Archivos y carpetas | kebab-case | `flash-card.jsx`, `use-hover-scroll/` |
| Componentes | PascalCase | `FlashCard` |
| Funciones/variables | camelCase | `getButtonConfig` |
| Handlers de evento | prefijo `handle` | `handleClick` |
| Hooks custom | prefijo `use` | `useHoverScroll` |
| CSS | BEM (bloque__elemento--modificador) | `.flash-card__tag` |
| Tests | `{nombre}.test.jsx` en `__tests__/` | `flash-card.test.jsx` |

### Colocación

- Tests junto al código, en `__tests__/` dentro de la carpeta de la
  unidad.
- Utilidades privadas de una unidad en `utils/` dentro de su carpeta;
  si otra unidad las necesita, promocionar a `common/utils/`.
- Funciones puras con nombre descriptivo de intención: verbos para
  acciones (`shuffle`), `should-*` / `is-*` / `has-*` para
  predicados.

### Barrels

Cada página (y, si aporta, cada componente compartido) expone un
`index.js` como única puerta de entrada: los imports externos apuntan
a la carpeta, no al archivo interno.

### Orden de imports

Agrupados por tipo de dependencia, con línea en blanco entre bloques
y orden alfabético dentro de cada grupo:

1. librerías externas de runtime (`react` primero),
2. tipos externos (`import type`),
3. módulos internos globales,
4. tipos internos,
5. servicios / API / infraestructura (`application/`),
6. hooks,
7. store / context / providers,
8. componentes,
9. constantes / helpers / utils / mappers,
10. assets,
11. estilos (siempre al final).

---

## 7. Flujo de datos

```
localStorage (clave `concepts-app:v1`)
        ↑↓  JSON.stringify / parse
application/api  (concepts-storage)
        ↓
application/store  (use-concepts: useState + useEffect de guardado)
        ↓ props
App.jsx  ──► pages/home  |  pages/study
                   ↓ props (concept, onEdit, deleteConcept…)
        common/components (solo muestran, no mutan)
```

Invariante: los componentes presentacionales nunca acceden a
`application/`; todo les llega por props.

---

## 8. Checklist de nueva funcionalidad

Nueva página/vista:

1. [ ] Crear carpeta `src/pages/{nombre}/`
2. [ ] Componente `{nombre}.jsx` + barrel `index.js`
3. [ ] Estilos (BEM) y estado vacío/loading si aplica
4. [ ] Tests en `__tests__/`
5. [ ] Registrar requisito en AGENTS.md (sección 5)
6. [ ] Rama `feature/FEAT-XXX-slug` + PR a `develop` (inglés)

Nuevo componente/hook/utilidad compartido: carpeta propia en
`common/` (o `application/` si es infra), con tests, y solo si hay
un segundo consumidor real o previsto — no crear abstracciones por
anticipación.

---

## 9. Mapa de documentación

La documentación de referencia vive en la carpeta `docs/`; solo
`README.md` y `AGENTS.md` permanecen en la raíz.

| Documento | Contenido |
|---|---|
| `README.md` (raíz) | Qué es, cómo ejecutarlo, estructura rápida |
| `AGENTS.md` (raíz) | Fuente de verdad de requisitos y decisiones |
| `docs/ARCHITECTURE.md` (este) | Organización de archivos y código |
| `docs/GIT_CONVENTIONS.md` | Ramas, commits y PRs |

Al añadir un documento nuevo: crearlo en `docs/`, referenciarlo aquí
y en AGENTS.md.

---

## 10. Archivos que raramente se modifican

| Archivo | Motivo |
|---|---|
| `src/main.jsx` | Bootstrap de la aplicación |
| `vite.config.js` | Configuración de build estable |
| `index.html` | Plantilla raíz |
