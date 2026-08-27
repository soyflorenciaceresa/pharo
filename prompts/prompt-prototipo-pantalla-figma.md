# Prompts reutilizables — Prototipar una pantalla de Figma en el Pharo Prototyping Kit

Copiá el prompt que corresponda en Claude Code (parado en la raíz del repo `pharo-prototyping-kit`, para que lea el `CLAUDE.md` del proyecto) y completá los campos entre `[ ]` antes de enviarlo.

Hay dos variantes, porque el flujo de CLAUDE.md es distinto según el caso:

- **Variante A** — la pantalla encaja en un template que **ya existe** en `templates/` (o querés que Claude Code lo identifique solo).
- **Variante B** — la pantalla es un patrón nuevo y hay que **crear el template primero**, porque ninguno de los existentes aplica.

---

## Variante A — Usando un template existente

```
Quiero prototipar en código una pantalla nueva del Pharo Design System, siguiendo el flujo que ya está documentado en CLAUDE.md.

Pantalla de Figma a prototipar: [LINK DE FIGMA A LA PANTALLA/FRAME, o "la pantalla que tengo seleccionada ahora en Figma"]

Módulo al que pertenece: [NOMBRE DEL MÓDULO, ej. "Operaciones" — si no estás seguro de cuál es, preguntame antes de asumir uno]

Nombre de la pantalla: [NOMBRE DE LA PANTALLA, ej. "Listado de Proveedores"]

Template que corresponde: [NOMBRE DEL TEMPLATE si ya sabés cuál es, ej. "Pantalla de Listado" — o "no estoy seguro, identificá cuál template de templates/ corresponde según el tipo de pantalla, y si no existe ninguno que aplique, avisame antes de crear uno nuevo"]

Datos/columnas/contenido específico de esta pantalla:
[DETALLE DE LO QUE TIENE QUE MOSTRAR: columnas de una tabla, campos de un formulario, filtros, acciones disponibles, estados vacíos, etc. Cuanto más específico, mejor.]

Instrucciones:
1. Traé el diseño de esa pantalla desde Figma (get_design_context / screenshot del frame correspondiente) para confirmar qué instancias de componentes usa.
2. Revisá primero la sección "Componentes disponibles" y "Templates disponibles" de CLAUDE.md — componé la pantalla usando SOLO lo que ya existe ahí. No reconstruyas a mano el markup ni el CSS de un componente o template que ya está hecho.
3. Si para armar esta pantalla hace falta un componente o template que todavía no existe en components/ o templates/, NO lo improvises dentro de la pantalla: avisame explícitamente en tu respuesta qué falta y dónde debería agregarse, y esperá antes de seguir.
4. Si el módulo o el template no quedaron claros en este prompt, preguntame antes de adivinar.
5. Creá la pantalla en app/src/modules/[MÓDULO]/[NOMBRE DE LA PANTALLA]/[NOMBRE DE LA PANTALLA].jsx, usando el template correspondiente y pasándole a cada componente los datos de esta pantalla por props, resolviendo la lógica (routing, validaciones, llamadas mock) escuchando los callbacks/eventos que cada componente ya expone — sin tocar el componente en sí.
6. Cualquier color, spacing o radio nuevo que necesites tiene que salir de tokens/tokens.css (agregalo ahí si falta) — nunca lo hardcodees ni dupliques un token existente.
7. Antes de darlo por terminado, corré `npm run dev` y probá la pantalla en el navegador para confirmar que renderiza bien y que las interacciones (si las tiene) funcionan.
```

---

## Variante B — La pantalla necesita un template nuevo

Usá esta variante cuando ya sabés (o Claude Code confirmó en la Variante A) que ningún template de `templates/` aplica, y este patrón de pantalla se va a repetir en más de un lugar — si fuera específico de una sola pantalla, no correspondería crear un template, iría directo resuelto dentro de `modules/`.

```
Quiero prototipar en código una pantalla nueva del Pharo Design System. Esta pantalla representa un patrón nuevo, así que antes de armar la pantalla en sí hace falta crear un template nuevo en templates/ — no uses ninguno de los templates ya existentes, este caso no encaja en ninguno.

Pantalla de Figma de referencia: [LINK DE FIGMA A LA PANTALLA/FRAME, o "la pantalla que tengo seleccionada ahora en Figma"]

Nombre del template nuevo: [NOMBRE DEL TEMPLATE, ej. "Pantalla de Detalle" — si no tenés un nombre en mente, proponeme uno vos]

Módulo y pantalla donde se va a usar primero: [MÓDULO, ej. "Operaciones" — y NOMBRE DE LA PANTALLA, ej. "Detalle de Buque"]

Datos/columnas/contenido específico de esta pantalla puntual:
[DETALLE DE LO QUE TIENE QUE MOSTRAR ESTA PANTALLA EN PARTICULAR: la usamos para completar el template con datos reales, pero no deben quedar hardcodeados en el template]

Instrucciones:
1. Confirmá primero que efectivamente ningún template de templates/ (ver CLAUDE.md, sección "Templates disponibles") cubre este patrón. Si encontrás que sí aplica alguno, avisame antes de seguir en vez de crear uno nuevo igual.
2. Traé el diseño de Figma (get_design_context / screenshot del frame) e identificá qué patrón estructural genérico define esta pantalla (ej. "sidebar + topbar + header con acciones + tabla"), separando eso de los datos/contenido específico de esta pantalla puntual.
3. Componé el template usando SOLO components/ ya existentes (ver "Componentes disponibles" en CLAUDE.md) — no reconstruyas a mano el markup ni el CSS de un componente ya hecho. Si para armar el template hace falta un componente que todavía no existe, NO lo improvises: avisame explícitamente qué falta y esperá antes de seguir.
4. El template NO debe tener datos de negocio hardcodeados — recibe todo por props (mismo criterio que LayoutBase). Nada de textos, labels o contenido específico de "[NOMBRE DE LA PANTALLA]" metido directo en el template.
5. Creá el template en app/src/templates/[NOMBRE DEL TEMPLATE]/[NOMBRE DEL TEMPLATE].jsx + .module.css.
6. Agregá la entrada correspondiente en la sección "Templates disponibles" de CLAUDE.md, documentando sus props igual que están documentados los templates existentes.
7. Usando ese template nuevo, creá la pantalla real en app/src/modules/[MÓDULO]/[NOMBRE DE LA PANTALLA]/[NOMBRE DE LA PANTALLA].jsx, pasándole los datos específicos de esta pantalla por props.
8. Cualquier color, spacing o radio nuevo tiene que salir de tokens/tokens.css (agregalo ahí si falta) — nunca lo hardcodees ni dupliques un token existente.
9. Antes de darlo por terminado, corré `npm run dev` y probá la pantalla en el navegador para confirmar que el template renderiza bien y que las interacciones (si las tiene) funcionan.
```

---

### Notas de uso

- Si todavía no tenés el link de Figma a mano, dejá esa línea como "la pantalla que tengo seleccionada ahora en Figma" y asegurate de tener esa pantalla realmente seleccionada en la app de escritorio de Figma antes de correr el prompt (el MCP de Figma necesita una selección activa).
- En la Variante A, si no sabés qué template corresponde, dejá esa línea tal como está en el placeholder — es intencional que Claude Code decida o pregunte, en vez de que se lo indiques a ciegas.
- La Variante B siempre termina creando dos cosas: el template en `templates/` y la pantalla en `modules/` que lo usa — no tiene sentido un template sin al menos una pantalla real que lo consuma.
- Cuanto más detallado el bloque de "Datos/columnas/contenido específico", menos placeholders o contenido inventado va a terminar teniendo la pantalla.
