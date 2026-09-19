import { uid } from "../../../common/utils/uid";
import type { Concept, ConceptInput } from "../types";

/**
 * Sample cards. Only used the first time there is nothing stored in
 * localStorage (or when pressing "Restore initial data").
 */
export function seedConcepts(): Concept[] {
  const base: ConceptInput[] = [
    {
      tag: "JavaScript",
      front: "¿Qué es un cierre (closure)?",
      back:
        "Una función que \"recuerda\" las variables del alcance en el que fue creada, incluso después de que esa función haya terminado. Es la base de los callbacks, los módulos y el patrón de fábrica: por ejemplo, un temporizador que lee el contador de la función que lo creó.",
    },
    {
      tag: "JavaScript",
      front: "¿Cuál es la diferencia entre `var`, `let` y `const`?",
      back:
        "`var`: scope de función, se hoistea (existe antes de la línea de declaración como `undefined`) y puede redeclararse. `let`: scope de bloque, no se puede redeclarar en el mismo bloque. `const`: también de bloque, pero la variable no puede reasignarse (aunque el objeto que apunta sigue siendo mutable).",
    },
    {
      tag: "JavaScript",
      front: "¿Qué es una promesa y cuáles son sus estados?",
      back:
        "Un objeto que representa el eventual resultado (éxito o fallo) de una operación asíncrona. Tiene tres estados: `pending`, `fulfilled` y `rejected`. Una vez que deja de ser `pending` no vuelve a cambiar. Se consume con `.then()` / `.catch()` o con `async/await`.",
    },
    {
      tag: "React",
      front: "¿Qué es una re-renderización y cuándo ocurre?",
      back:
        "Es la re-ejecución de la función de un componente para recalcular su árbol. Ocurre cuando cambian su state, sus props o el state de un antepasado que afecta a sus props. React no actualiza el DOM completo: compara el árbol nuevo con el anterior y aplica solo los cambios necesarios.",
    },
    {
      tag: "React",
      front: "¿En qué momento se ejecuta un `useEffect`?",
      back:
        "Después de que React pinta los cambios en el DOM. Con un array de dependencias vacío `[]`, solo al montaje; con dependencias, cada render en el que cambie alguno de los valores. Para limpiar recursos (suscripciones, temporizadores) se devuelve una función de desmontaje.",
    },
    {
      tag: "React",
      front: "¿Cuándo conviene usar `useMemo`?",
      back:
        "Cuando un cálculo costoso depende de pocos valores que cambian raramente: evita recalcularlo en cada render. No lo uses para valores simples ni como \"optimización por defecto\": el coste de crear la memo puede superar el del propio cálculo.",
    },
    {
      tag: "React",
      front: "¿Qué es la conciliación (reconciliation)?",
      back:
        "El algoritmo de React que, al cambiar el state o las props, compara el árbol nuevo con el anterior (principalmente por el tipo de elemento y la `key`) para calcular la lista mínima de mutaciones del DOM. Usar `key` estables (y nunca el índice en listas dinámicas) ayuda a React a identificar bien los elementos.",
    },
    {
      tag: "CSS",
      front: "¿Qué son los container queries?",
      back:
        "Reglas que se aplican según las medidas de un contenedor (y no del viewport). Se activan con `container-type: inline-size` y se escriben con `@container (min-width: 320px) { ... }`. Son ideales para componentes reutilizables que se adaptan a su propio tamaño.",
    },
    {
      tag: "CSS",
      front: "¿Qué hace la función `:is()`?",
      back:
        "Agrupa una lista de seletores en uno solo: `:is(h1, [data-title], .title)` equivale a `(h1, [data-title], .title)` pero aporta especificidad 0, evitando inflar la especificidad. Reduce repetición en hojas de estilo.",
    },
  ];

  const now = Date.now();
  return base.map((card, i) => ({
    ...card,
    id: uid(),
    createdAt: now - (base.length - i) * 8_640_000,
  }));
}
