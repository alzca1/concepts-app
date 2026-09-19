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
├── vite.config.ts
├── tsconfig.json
└── src/
    ├── main.tsx                # Punto de entrada
    ├── App.tsx                 # Shell: modos (cartas / estudio) y modal
    ├── App.css                 # Estilos de la aplicación
    ├── index.css               # Reset y estilos base
    ├── application/            # Infraestructura (sin UI)
    │   ├── api/                # Persistencia localStorage + seed + tipos
    │   ├── config/constants.ts # Claves y retardos compartidos
    │   ├── i18n/               # i18next: init + locales es/en
    │   └── store/use-concepts/ # Estado global de tarjetas
    ├── common/                 # Reutilizable, agnóstico de página
    │   ├── components/
    │   │   ├── domain/concept-form/       # Modal crear / editar
    │   │   └── presentational/flash-card/ # Tarjeta 3D reutilizable
    │   ├── hooks/use-hover-scroll/        # Auto-scroll lento en hover
    │   └── utils/{uid,shuffle,tag-color}/ # Una utilidad por carpeta
    └── pages/                  # Una carpeta por vista
        ├── home/               # «Mis tarjetas»: home + concept-list + stats-bar
        └── study/              # «Estudiar»: sesión + resumen
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
