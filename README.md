# Concepts — Tarjetas de memoria

Aplicación de *flashcards* construida con **React + Vite** para recordar conceptos.

![Pantalla de la app](./public/favicon.svg)

## Características

- 🗂️ **Mis tarjetas** — parrilla responsive con búsqueda (preguntas, respuestas y etiquetas) y filtro por etiqueta.
- 🎯 **Modo estudio** — sesión con barajeo: cada tarjeta se voltea y puedes marcarla como «la tengo clara» (sigue) o «volver a ver» (vuelve al final de la pila).
- 📊 **Resumen de sesión** — visitas, repeticiones y porcentaje dominado al terminar.
- ✏️ **CRUD completo** — crea, edita y elimina tarjetas mediante una modal.
- 💾 **Persistencia en `localStorage`** — se guarda cada cambio; incluye 9 tarjetas de ejemplo la primera vez.
- 🎨 **Tarjetas 3D** con animación de volteo (clic o teclado, en cualquier dispositivo).

## Ejecución

```bash
cd concepts-app
npm install
npm run dev     # abre http://localhost:5173
npm run build   # genera dist/ para producción
```

## Estructura

```
concepts-app/
├── index.html
├── vite.config.js
└── src/
    ├── main.jsx              # Punto de entrada
    ├── App.jsx               # Enrutado de modo (cartas / estudio) y estado global
    ├── App.css               # Estilos de la aplicación
    ├── index.css             # Reset y estilos base (fondo, tipografía)
    ├── App.jsx
    ├── components/
    │   ├── FlashCard.jsx     # Tarjeta 3D reutilizable
    │   ├── ConceptList.jsx   # Búsqueda, filtros y parrilla
    │   ├── ConceptForm.jsx   # Modal de crear / editar
    │   ├── StudyView.jsx     # Sesión de estudio y resumen
    │   └── StatsBar.jsx      # Estadísticas + restaurar a iniciales
    ├── data/
    │   └── seed.js           # Tarjetas de ejemplo
    ├── hooks/
    │   └── useConcepts.js    # Estado + persistencia en localStorage
    └── lib/
        └── utils.js          # uid, shuffle, tagColor
```

## Modelo de datos

```js
{
  id: "string",        // único por tarjeta
  front: "string",     // pregunta o concepto
  back: "string",      // respuesta o explicación
  tag: "string",       // categoría (etiqueta)
  createdAt: number    // timestamp
}
```

## Notas de diseño

- **Modo estudio**: las tarjetas marcadas como "volver a ver" se reinsertan al final de la pila, así que la sesión termina cuando todas las tarjetas han sido al menos una vez "claras".
- **Persistencia**: clave `concepts-app:v1` en `localStorage`; si no hay nada guardado se cargan las semillas.
- **Accesibilidad**: las tarjetas son `role="button"` y se voltean con teclado (`Enter` / `espacio`).
