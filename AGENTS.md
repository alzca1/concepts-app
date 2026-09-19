# AGENTS.md — concepts-app

> **Documento vivo de requerimientos.** Este archivo es la fuente de verdad para
> la intención del proyecto. Cualquier agente (o humano) que trabaje en el repo
> debe leerlo antes de tocar código y **actualizarlo** cuando se agregue, cambie
> o cierre un requerimiento.

---

## 1. Visión

Aplicación web de *flashcards* («tarjetas de memoria») para recordar conceptos
tecnológicos y de programación. Construida con **React + Vite** (JavaScript,
sin TypeScript), 100% client-side, sin backend ni API externa.

Dos modos de uso:

- **Mis tarjetas (Home)** — explorar, buscar, filtrar, editar y eliminar tarjetas.
- **Modo estudio** — sesiones de repetición activa con pila barajada y resumen final.

---

## 2. Stack y convenciones de proyecto

| Herramienta | Versión (package.json) |
|---|---|
| React | ^19.2.8 |
| React DOM | ^19.2.8 |
| Vite | ^8.3.0 |
| oxlint | ^1.81.0 |
| Node / package type | ESM (`"type": "module"`) |

### Comandos

| Comando | Uso |
|---|---|
| `npm run dev` | Dev server en `http://localhost:5173` |
| `npm run build` | Build de producción → `dist/` |
| `npm run preview` | Sirve `dist/` para probar el build |
| `npm run lint` | Lint con oxlint (reglas: `rules-of-hooks`, `only-export-components`) |

### Convenciones

- **JavaScript, no TypeScript.** Los `@types/react*` solo dan autocompletado.
- **Sin dependencias runtime externas.** Todo el estado vive en React + `localStorage`.
- **Estados globales con hooks custom** (`hooks/`), no context ni librerías externas.
- **Una responsabilidad por componente.** Componentes de UI puramente presentativos;
  la lógica de estado se inyecta por props (p. ej. `deleteConcept(concept.id)`).
- **CSS global en `src/App.css`** (no CSS modules), con prefijos de sección (`h1`,
  `.deck`, `.flash-card`, …). Variables de color por custom property
  (`--chip-color`, `--tag-color`).
- **Componentes solo exportan componentes** (oxlint: `react/only-export-components`,
  `allowConstantExport: true`): no mezclar funciones de utilidad exportadas en
  los mismos archivos que componentes (ver `lib/utils.js` vs `components/`).
- **Accesibilidad**: controles con `role`, `aria-label`, y soporte teclado
  (`Enter` / espacio) donde haya interacción.
- **Idioma**: UI en español.

---

## 3. Arquitectura (estructura del repo)

```
concepts-app/
├── index.html
├── vite.config.js
├── AGENTS.md            ← ESTE ARCHIVO
├── GIT_CONVENTIONS.md   ← convenciones de Git (ramas + commits)
├── README.md
├── package.json
├── public/
│   └── favicon.svg
└── src/
    ├── main.jsx          # Punto de entrada (React 19 createRoot)
    ├── App.jsx           # Modo (cartas / estudio), estado global, modal
    ├── App.css           # Estilos de la aplicación (tarjeta 3D, grid, modal…)
    ├── index.css         # Reset y estilos base (fondo oscuro, tipografía)
    ├── components/
    │   ├── FlashCard.jsx     # Tarjeta 3D reutilizable (front = pregunta, back = respuesta)
    │   ├── ConceptList.jsx   # Home: búsqueda, filtros por etiqueta, parrilla
    │   ├── ConceptForm.jsx   # Modal crear / editar tarjeta
    │   ├── StudyView.jsx     # Sesión de estudio + resumen
    │   └── StatsBar.jsx      # Estadísticas + restaurar a seed
    ├── data/
    │   └── seed.js           # 9 tarjetas de ejemplo (se carga solo si no hay nada guardado)
    ├── hooks/
    │   └── useConcepts.js    # Estado + persistencia en localStorage
    └── lib/
        └── utils.js          # uid, shuffle, tagColor
```

**Flujo de datos (una sola fuente de verdad):**

```
localStorage (clave `concepts-app:v1`)
        ↑↓  JSON.stringify / parse
   useConcepts()  (useState + useEffect de guardado)
        ↓  props
  App.jsx  ──►  ConceptList / StudyView / StatsBar
                   ↓ props (concept, onEdit, deleteConcept…)
            FlashCard (solo muestra, no muta)
```

---

## 4. Modelo de datos

```js
{
  id:        "string",  // único por tarjeta
  front:     "string",  // PREGUNTA o concepto (cara frontal)
  back:      "string",  // RESPUESTA o explicación (cara trasera)
  tag:       "string",  // categoría / etiqueta
  createdAt: number     // timestamp (ms)
}
```

**Invariantes (no cambiar sin migrar):**

- La clave de `localStorage` es **`concepts-app:v1`**. Si se necesita una nueva
  forma de datos, usar una nueva clave (`v2`) y migrar o conservar la antigua.
- `id` se genera con `uid()` (`lib/utils.js`).
- El campo `createdAt` se preserva al editar (no se sobreescribe).
- En la primera carga, si no hay nada guardado (o está corrupto), se semilla
  con `seedConcepts()` (9 tarjetas).

---

## 5. Requerimientos funcionales

### 5.1 Modo «Mis tarjetas» (Home)

- [x] Parrilla de tarjetas **responsive** (CSS Grid, `minmax(250px, 1fr)`).
- [x] Cada celda muestra una `FlashCard` con acciones **editar** (✎) y
      **eliminar** (✕). Los iconos viven en la cara frontal (prop `actions`
      de `FlashCard`), de modo que **voltean junto con la tarjeta**; con la
      cara de espaldas quedan ocultos y fuera del tab
      (`.flash-card.flipped .cell-actions { visibility: hidden }`).
      *(Voltear con la tarjeta desde 2026-09-18; antes flotaban fijos.)*
- [x] **Solo una respuesta visible a la vez**: voltear una tarjeta reinicia la
      anterior; el estado de volteo vive en `ConceptList` como `flippedId`.
      *(Añadido 2026-09-18.)*
- [x] Confirmación con `window.confirm` antes de eliminar (texto con el título de la tarjeta).
- [x] **Búsqueda** por texto: busca en `front`, `back` y `tag` (case-insensitive,
      normaliza `trim`).
- [x] **Filtro por etiqueta** (chips con color por `tagColor(tag)`); el chip
      **«Todos»**, primero de la fila, limpia el filtro y muestra todas las
      tarjetas (activo cuando no hay etiqueta seleccionada); clic en el chip
      activo lo desactiva. *(Chip «Todos» añadido 2026-09-18.)*
- [x] **Estado vacío**: mensaje distinto si hay filtros activos vs. parrilla realmente vacía.

### 5.2 Modo estudio

- [x] Sesión con **pila barajada** (`shuffle` de Fisher–Yates en `lib/utils.js`).
- [x] Tarjeta grande que se **voltea** (controlada por estado, no por hover).
- [x] Los **botones de respuesta** («La tengo clara» / «Volver a ver»)
      aparecen con un **retardo de 1500 ms** tras voltear la tarjeta
      (`STUDY_ACTIONS_DELAY` en `StudyView`), con fade-in y reservando su
      espacio (`.study-actions--waiting`, fuera del tab mientras esperan);
      al volver a la pregunta, avanzar o reiniciar, se ocultan y se cancela
      el arranque pendiente. *(Añadido 2026-09-18.)*
- [x] Botón «La tengo clara» → siguiente tarjeta (marcada como visitada).
- [x] Botón «Volver a ver» → la tarjeta se reinserta **al final de la pila**
      (no se cuenta como clara).
- [x] La sesión termina cuando todas las tarjetas han sido al menos una vez «claras».
- [x] **Resumen final**: visitas totales, repeticiones (volver a ver), y
      porcentaje de dominio (claras / visitas totales).
- [x] Acciones tras el resumen: repetir sesión / volver a las tarjetas.

### 5.3 CRUD y persistencia

- [x] **Crear** tarjeta vía modal (`ConceptForm`).
- [x] **Editar** tarjeta vía modal reutilizado (puedo iniciar en edit desde cualquier tarjeta).
- [x] **Modal más ancho y alto por encima de mobile** (≥641px): `width: min(720px, 90vw)` y textarea de respuesta con `min-height: 14rem`, para ver mejor los textos largos; en mobile el textarea también arranca más alto que el mínimo (`min-height: 10rem`). El modal nunca excede el alto del viewport (`max-height` + scroll interno). *(Añadido 2026-09-18; altura mobile ampliada el mismo día.)*
- [x] **Eliminar** tarjeta (con confirmación).
- [x] Validación del formulario (error visible si faltan campos; ver `ConceptForm`).
- [x] Cada cambio se persiste **automáticamente** en `localStorage`
      (efecto en `useConcepts`).
- [x] **Restaurar a iniciales** (botón en `StatsBar`, confirma antes de borrar todo y sembrar).
- [x] 9 **tarjetas de ejemplo** (`data/seed.js`) la primera vez.
- [x] Estadísticas de `StatsBar`: total de tarjetas, número de etiquetas.

### 5.4 Tarjeta 3D y UX

- [x] Tarjeta **3D** con animación de volteo (0.55s, `cubic-bezier(0.4,0,0.2,1)`).
- [x] Volteado **solo con clic** (o teclado: `Enter` / espacio) en la parrilla y
      cualquier dispositivo; **sin volteo por hover**.
- [x] El volteo es **controlado por el padre** en todos los modos (la parrilla
      mantiene un único `flippedId`; el estudio controla su tarjeta grande).
      El antiguo modo no controlado de `FlashCard` se eliminó al quedar sin
      uso. *(Desde 2026-09-18.)*
- [x] **Mantener la pila 3D estable**: cada cara debe tener su rotación propia
  (`.flash-front { transform: rotateY(0) }`, `.flash-back { transform: rotateY(180deg) }`);
  sin esto ambas caras quedan en el mismo plano y la trasera (respuesta) pinta
  por encima de la frontal. *(Corregido 2026-09-18.)*
- [x] **Sin saltos de layout al voltear**: la pregunta debe mantenerse centrada y
  el texto «Clic para revelar» no se elimina del DOM al voltear: se oculta con
  `opacity: 0`, la cara frontal no pierde altura y el `h3` no se pega al borde
  inferior al iniciar el giro (aplica a la parrilla y a la tarjeta grande de
  estudio). *(Corregido 2026-09-18.)*
- [x] **Accesibilidad**: `role="button"`, teclado, `aria-label` en controles.
- [x] **Scroll lento en hover para contenido más alto que la tarjeta**: la
      pregunta y la respuesta envuelven. Si el contenido es más alto que la
      cara (`scrollHeight > clientHeight`), al hacer hover (o foco) sobre la
      tarjeta se activa —tras una pausa de **750 ms** (cancelable si el
      cursor sale antes)— un scroll vertical muy lento (recorrido único
      de arriba abajo, 16 px/s, que **se detiene al llegar al final** —
      `hooks/useHoverScroll.js`) para poder leerlo; si el contenido
      cabe, la
      tarjeta se mantiene estática y su altura pequeña (190/300 px) se
      conserva. Un degradado inferior (`.flash-face--overflow`) indica el
      desborde. *(Vertical desde 2026-09-18; antes horizontal.)*

### 5.5 Requisitos abiertos / pendiente

- [ ] (none yet) → registrar aquí nuevos requerimientos con estado.

---

## 6. Requerimientos no funcionales

- [x] **Sin backend**: todo client-side; la única persistencia es `localStorage`.
- [x] **Persistencia resiliente**: `try/catch` alrededor de `localStorage` (modo
      de solo memoria si no está disponible) y de `JSON.parse` (falla → seed).
- [x] **Accesibilidad básica**: roles ARIA, soporte teclado en la tarjeta,
      contraste en tema oscuro.
- [x] **Tema oscuro** global (fondo `#070818` aprox., tipografía variable).
- [ ] **Rendimiento**: sin métricas explícitas aún. Si la parrilla supera ~200
      tarjetas, considerar virtualización (ver backlog).

---

## 7. Decisiones de diseño

| Fecha | Decisión | Motivo / efecto |
|---|---|---|
| 2025-07-14 (v1 inicial) | Modo estudio: las «volver a ver» se reinsertan al final | La sesión termina cuando cada tarjeta se vio «clara» al menos una vez |
| 2025-07-14 (v1 inicial) | Key de localStorage `concepts-app:v1` | Versión explícita para migrar formas de datos futuras |
| 2025-07-14 (v1 inicial) | 9 tarjetas de seed | Demo inmediata sin que el usuario tenga que crear nada |
| 2025-07-14 (v1 inicial) | CSS global (no módulos) | Un solo estilo por sección; prefijo `.flash-card` para el componente 3D |
| 2026-09-18 | Rotación propia por cara en `.flash-face` | **Fix bug**: en Home se veía la respuesta en vez de la pregunta; las dos caras compartían plano 3D y la trasera pintaba encima. |
| 2026-09-18 | Registro de requisitos en `AGENTS.md` | Fuente de verdad para agentes y humanos; actualizarse ante cada cambio |
| 2026-09-18 | Volteo en la parrilla **solo por clic** (se elimina el hover) | El hover rotaba la tarjeta en Home; el requisito cambia a clic/teclado para revelar la respuesta. |
| 2026-09-18 | Hint «Clic para revelar» permanece en el DOM al voltear (oculto con `opacity: 0` + transición) y pregunta centrada con `margin: auto` | **Fix bug**: al condicionar el hint con `{!isFlipped && …}`, la cara frontal perdía altura al girar y con `justify-content: space-between` la pregunta saltaba al borde inferior antes del flip |
| 2026-09-18 | Scroll horizontal automático lento al hacer hover/foco, solo si el contenido es más ancho que la tarjeta | El texto de cada cara no envuelve (`white-space: nowrap` + `overflow-x: auto` con barra oculta). El hook `useHoverScroll` mide `scrollWidth > clientWidth` y, solo con desborde, arranca un scroll ping-pong a 16 px/s; se detiene al salir del hover/foco (posición → 0) y se interrumpe si el usuario hace un scroll manual. Se re-mide al editar la tarjeta y al redimensionar.
| 2026-09-18 | El auto-scroll por hover pasa a **vertical**: el texto de las caras envuelve y el desborde es de altura | A petición del usuario: el contenido puede ser más alto que la cara (190/300 px). `overflow-y: auto` + **`min-height: 0`** en `.flash-face h3/p` (sin `min-height: 0` el ítem flex no encoge y nunca scrollea) + `overscroll-behavior: contain`. `.flash-face--overflow::after` añade un degradado inferior como pista visual (consume el estado `scrollable` del hook, antes sin uso). |
| 2026-09-18 | El auto-scroll elimina el rebote: recorrido único de arriba abajo, con parada al llegar al final | A petición del usuario: al terminar el scroll descendente se detiene (antes hacía ping-pong de vuelta arriba). Para releer, basta salir del hover/foco y volver a entrar: rearranca desde arriba tras la pausa. |
| 2026-09-18 | Volteo siempre controlado por el padre; la parrilla mantiene un único `flippedId` | A petición del usuario: al voltear una tarjeta se reinicia la anterior, de modo que solo se ve una respuesta a la vez. El modo no controlado de `FlashCard` (estado local de volteo) queda sin uso y se elimina. |

---

## 8. Reglas para agentes que trabajan en este repo

1. **Lee este archivo y el README antes de escribir código.**
2. **Mantén este archivo actualizado**: cada requisito nuevo → sección 5 (con
   `[ ]`/`[x]`); cada decisión → sección 7; cada fecha relevante → sección 5/7
   y, si es grande, el changelog (sección 9).
3. **No rompas invariantes del modelo de datos** (sección 4): si cambias el
   schema, cambia la clave a `v2` y documenta la migración aquí antes de tocar
   `useConcepts`.
4. **No añadas dependencias** sin justificarlas aquí primero (sección 2).
5. **Respetá las convenciones** (sección 2): JS (no TS), estados en hooks, CSS
   global por secciones, `aria` en controles interactivos.
6. **Después de un cambio visible** ejecuta `npm run lint` y, si cambia la UI,
   verifica el estado de la tarjeta 3D en los **dos** modos (parrilla por clic
   y tarjeta grande controlada).
7. **Git**: una rama por cambio desde `develop` y commits con formato
   Conventional Commits, según `GIT_CONVENTIONS.md`. Los commits son
   pequeños y con descripción en español que explique el *por qué*;
   si se cierra un requisito de la sección 5, el commit debe
   mencionarlo en el footer (p. ej. `Cierra R5.4`).
8. **Si un requisito entra en conflicto** con un invariantes (4), no lo resuelvas
   en silencio: anótalo en la sección 7 y pide confirmación.

---

## 9. Changelog (breve)

| Fecha | Cambio |
|---|---|
| 2026-09-18 | **v1 del proyecto en git**: primer commit (`1a3abe7`). |
| 2026-09-18 | **Fix UI**: tarjetas de Home mostraban la respuesta en vez de la pregunta. Faltaban las rotaciones 3D por cara (`.flash-front`/`.flash-back`). Ver sección 7. |
| 2026-09-18 | Añadido `AGENTS.md` como fuente de verdad de requisitos. |
| 2026-09-18 | **UX**: se elimina el volteo por hover en «Mis tarjetas»: ahora solo clic (o teclado) revela la respuesta. Se sincronizan README, JSDoc de `FlashCard` y AGENTS.md. |
| 2026-09-18 | **Fix UX**: al voltear una tarjeta, la pregunta se pegaba al borde inferior (el hint «Clic para revelar» se eliminaba del DOM justo al girar). El hint ahora se oculta con opacidad y la pregunta se centra con márgenes auto, en parrilla y en modo estudio. |
| 2026-09-18 | **UX**: si una pregunta o respuesta es más ancha que la tarjeta, un scroll horizontal muy lento (ping-pong, 16 px/s) se activa al hacer hover/foco sobre la tarjeta; solo cuando hay desborde real, la tarjeta se mantiene estática y con su altura pequeña. Se crea `hooks/useHoverScroll.js`. |
| 2026-09-18 | **UX**: el auto-scroll por hover pasa de horizontal a vertical (texto que envuelve, desborde de altura, `min-height: 0` en los ítems flex); nuevo degradado inferior (`.flash-face--overflow`) en caras con desborde. |
| 2026-09-18 | **Fix**: el auto-scroll no avanzaba — `scrollTop` se cuantiza a píxeles enteros, así que releer la posición del DOM cada frame truncaba a 0 el incremento (~0,3 px/frame a 16 px/s). La posición ahora se acumula en `posRef` (patrón de animación) y solo se escribe en el DOM; `onScroll` tolera ±2 px por la cuantización. |
| 2026-09-18 | **UX**: el auto-scroll por hover arranca tras una pausa de 750 ms (`HOVER_SCROLL_DELAY`), cancelable saliendo del hover/foco antes de que venza; también se limpia al desmontar. |
| 2026-09-18 | **UX**: el auto-scroll deja de hacer ping-pong (rebote al final): recorrido único hacia abajo que se detiene al llegar al final; para releer, salir del hover/foco y volver a entrar. |
| 2026-09-18 | **Home**: chip «Todos» en el filtro por etiqueta que limpia el filtro y muestra tarjetas de todas las temáticas; `aria-pressed` en todos los chips. |
| 2026-09-18 | **Home**: al voltear una tarjeta se reinicia la anterior — solo una respuesta visible a la vez. `FlashCard` pasa a volteo siempre controlado (se elimina el modo no controlado, ya sin uso). |
| 2026-09-18 | **Estudiar**: los botones de respuesta aparecen con retardo de 1500 ms tras voltear la tarjeta (fade-in sin salto de layout, temporizador cancelable). |
| 2026-09-18 | **Home**: los iconos de editar/eliminar pasan a vivir dentro de la cara frontal (nueva prop `actions` de `FlashCard`) y voltean con la tarjeta; ocultos fuera del tab con la cara de espaldas. |
| 2026-09-18 | **Modal**: más ancho (720px) y con textarea más alto (14rem) por encima de mobile, para textos largos; `max-height` + scroll interno como cota en ventanas bajas. |
| 2026-09-18 | **Modal**: el textarea de respuesta sube también en mobile (`min-height: 10rem` en vez de las 4 filas por defecto). |
| 2026-09-18 | **Proceso**: se crea `GIT_CONVENTIONS.md` (una rama por cambio desde `develop`; conventional commits) y se referencia en la regla 7 de la sección 8. |

---

## 10. Backlog / ideas (sin orden)

- [ ] Probar con 1000+ tarjetas: medir rendimiento de la parrilla; decidir si
      virtualizar.
- [ ] Exportar/importar tarjetas (JSON).
- [ ] Modo oscuro/light (si se añade, documentar aquí).
- [ ] Persistencia de estadísticas de sesiones (actualmente solo la sesión
      activa).
- [ ] Soporte de sub-etiquetas o prioridad de repetición (SRS / Leitner).
- [ ] Testes de la lógica de la pila de estudio (`StudyView` / `utils`) con
      una herramienta de testing (requiere decisión de dependencia — regla 4).
