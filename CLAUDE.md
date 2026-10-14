# CLAUDE.md — Pharo Prototyping Kit

Este kit existe para prototipar rápido reutilizando los componentes del design system (Figma: *Pharo Design System*), verificados uno por uno antes de sumarse.

Es una única app React (Vite) en `app/`. No hay versión vanilla — se eliminó a favor de esta.

## Estructura

```
app/src/
  components/   ← piezas reutilizables del design system (Sidebar, TopBar, LanguageSelector, futuros Button/Table/etc.)
  icons/        ← set de íconos compartido (`bi-*` = Bootstrap Icons oficiales vía paquete `bootstrap-icons`; `icon-*` = glifos propios de Figma)
  templates/    ← patrones de pantalla genéricos y reutilizables (ej. LayoutBase)
  modules/      ← un folder por módulo del sistema (ej. Operaciones), con las pantallas reales de ese módulo
  styles/       ← estilos globales (no de un componente puntual)
  utils/        ← helpers sin UI, sin estado de React (ej. generateSimplePdf)
```

**La diferencia entre `components/`, `templates/` y `modules/`:**

- **`components/`** — piezas chicas y reutilizables en cualquier contexto (un Sidebar, un botón, un selector).
- **`templates/`** — composiciones genéricas de components que definen la estructura de una pantalla (ej. "sidebar + topbar + área de contenido"), sin datos ni lógica de negocio específica. Un template no sabe nada de "Proveedores" ni de ningún módulo — solo define el esqueleto.
- **`modules/<Módulo>/`** — las pantallas reales del sistema, agrupadas por módulo de negocio. Cada pantalla usa un template y le pone los datos/contenido específicos.

## Flujo para armar una pantalla nueva

1. En Figma, armar la pantalla insertando **instancias** de los componentes que ya existen (`SidebarFinal`, `TopBar`, etc.) — nunca recrearlos.
2. Identificar qué template le corresponde (¿es una pantalla de listado? ¿un formulario? — si no existe ese template todavía, armarlo primero en `templates/`).
   - **Pantallas de Maestros** (listado o formulario): elegir entre Listado y M-01…M-04 con el catálogo `app/src/templates/maestros.js` (`MAESTRO_TEMPLATES`: cuándo usar / cuándo no / estructura de datos). Ver "Templates de Maestros" más abajo.
3. Crear la pantalla dentro de `modules/<Módulo>/<Pantalla>/`, usando el template + los datos/contenido de esa pantalla puntual.
4. Si el pedido no aclara el módulo o el template a usar, preguntar antes de adivinar.

Ejemplo de pedido bien formado: *"Con el template de Pantalla de Listado, creá una pantalla dentro del módulo Operaciones. Debe tener: [datos/columnas/contenido específico]."*

## Regla general

1. Componer usando **solo** lo que ya existe documentado en este archivo. Nunca regenerar el markup o los estilos de un componente/template ya construido.
2. Si hace falta un componente o template que **no existe todavía**, la IA **puede crearlo**, pero siempre en su lugar correspondiente (`components/` o `templates/`), nunca como una versión ad-hoc dentro de una pantalla.
3. **Declarar siempre que se crea un componente (o template) nuevo que no está en esta documentación — es obligatorio e innegociable.** Cada vez que una pantalla requiera un componente que no figura en "Componentes disponibles" / "Templates disponibles", la IA debe:
   - **Avisarlo de forma explícita en la respuesta**, en un apartado visible aparte (no perdido en el resumen), con: nombre del componente, para qué pantalla lo necesitó, dónde quedó (`components/<Nombre>/`), su API (props/callbacks) y qué decisiones tomó sin referencia de Figma (valores, tokens nuevos, comportamientos supuestos).
   - **Marcar que no tiene frame de Figma ni validación de diseño** (sin origen en Figma = no verificado): queda como propuesta a revisar por el equipo de diseño, no como parte aprobada del design system.
   - **Documentarlo en este archivo en el mismo cambio**, en "Componentes disponibles" (o "Templates disponibles"), con el mismo formato que los demás, indicando "Sin frame de Figma" y qué falta validar. Un componente nuevo sin entrada en este archivo se considera incompleto.
   - Si un cambio *modifica* un componente existente (props nuevas, otro comportamiento), también se declara y se actualiza su entrada.
   - Nunca crear un componente "de paso" ni resolverlo con markup suelto dentro de la pantalla para evitar declararlo: si se repite o es una pieza con identidad propia, es un componente y se declara.
4. Los colores, spacing y radios salen siempre de `tokens/tokens.css` — el **único** archivo de tokens del kit. Nunca duplicar tokens ni hardcodear valores nuevos.
5. Cada componente expone su estado/datos por **props**, y su interacción por **eventos/callbacks** — la pantalla resuelve la lógica funcional (routing, validaciones, llamadas a API mock) escuchando esos callbacks, sin tocar el componente.
6. Un componente por carpeta (`Nombre.jsx` + `Nombre.module.css`), con CSS Modules para que los estilos no choquen entre sí.

## Cómo correr la app

```bash
cd ~/Documents/pharo-prototyping-kit/app
npm install
npm run dev
```

(Si `npm install` falla por permisos en el caché global de npm — problema del sistema, no del proyecto — usar `npm install --cache /tmp/npm-cache-pharo` como alternativa.)

## Componentes disponibles (`app/src/components/`)

### `Sidebar` — `app/src/components/Sidebar/`

```jsx
import Sidebar from '../../components/Sidebar/Sidebar.jsx';

<Sidebar
  brandLabel="Ports"
  brandIcon="icon-gear"
  brandAccent="violet"
  homeHref="/"
  groups={[
    { label: 'Maestros', icon: 'icon-maestros', items: [
      { label: 'Buque', icon: 'icon-buques', href: '/buques' },
    ]},
  ]}
  companies={[{ id: 'pn', name: 'Puerto Norte S.A.' }]}
  defaultActiveCompanyId="pn"
  user={{ name: 'Carlos Mendoza', email: 'carlos@mendoza.com', role: 'Administrador' }}
  defaultActiveHref="/buques"
  onNavigate={({ href, label }) => ...}
  onCompanyChange={(company) => ...}
  onLogout={() => ...}
  onToggle={({ expanded, pinned }) => ...}
/>
```

- **Comportamiento fijo (no tocar):** expande al hover, colapsa al mouse-leave (no es toggle por click); botón de pin fija el estado expandido; grupos de navegación se abren de a uno; selector de empresa y menú de usuario son desplegables independientes (mutuamente excluyentes) — el de usuario expande hacia arriba.
- **`defaultPinned` (prop nueva) siembra `pinned`/`expanded` al montar** — igual que `defaultActiveHref`/`defaultActiveCompanyId`, semi-controlado: el componente sigue manejando el estado con `useState` a partir de ahí. Se agregó porque el router casero de `App.jsx` remonta la pantalla completa (con el `Sidebar` adentro) en **cada** navegación — sin esto, el pin se perdía siempre al cambiar de página, aunque el usuario lo hubiera fijado. La persistencia real (que el valor sobreviva entre pantallas) no vive en `Sidebar` ni en cada pantalla — ver `SidebarPinnedContext`/`LayoutBase` más abajo, que es quien realmente guarda el valor entre navegaciones y se lo pasa como `defaultPinned` a cada `Sidebar` nuevo.
- **Líneas divisorias**: color `--divider: rgba(255, 255, 255, 0.07)` — variable local propia (a pedido, no reusa `--border`, que sigue en `--color-border-default` para el borde de los dropdowns de empresa/usuario, un elemento distinto). `margin: 0 var(--sp-3)` (12px, alias local del componente para `--spacing-md-dense`) en vez de ocupar todo el ancho — a pedido, aplica a las 3 ubicaciones (header/selector de empresa, nav/menú de usuario, entre grupos de nav).
  - **Header/selector de empresa y nav/menú de usuario** usan `.divider` — siempre visibles, sin condición. La de header/selector de empresa antes era un `border-bottom` directo en `.header` (full-width, sin inset) — se reemplazó por un `<div className={styles.divider} />` real entre ambos bloques para que tenga el mismo padding de 12px que el resto; `.header` ya no lleva borde propio.
  - **Entre cada grupo de nav y el siguiente** usa una clase separada, `.groupDivider` (mismo `.map` de `groups`, se renderiza salvo después del último grupo: `gi < groups.length - 1`) — pero **solo se ve mientras el grupo anterior está abierto** (`.group.open + .groupDivider` por sibling selector; colapsado: `height:0; opacity:0; overflow:hidden`, con la misma transición 0.25s que ya usa `.groupBody` para el acordeón). No es un separador fijo de la lista — marca el cierre del grupo expandido, y desaparece apenas se colapsa. También oculto por completo cuando el sidebar está colapsado (`.sidebar:not(.expanded) .groupDivider { display: none; }`), igual que el resto del contenido de un grupo. Un grupo nuevo agregado a `groups` no necesita nada especial para heredar este comportamiento.
- El ítem de nav activo y la empresa activa son semi-controlados: se inicializan por `defaultActiveHref`/`defaultActiveCompanyId`, y a partir de ahí el propio componente mueve el estado, avisando por los callbacks.
- **El diseño del `Sidebar` es siempre el mismo — lo que cambia es el contenido, y cambia POR MÓDULO (no por pantalla, no globalmente para toda la app).** Dentro de un mismo módulo, todas sus pantallas comparten un único contenido de sidebar (isotipo, logotipo, accent, grupos/ítems, companies, user) — eso no puede variar de pantalla a pantalla. Pero cada módulo tiene su propio contenido, distinto al de los demás. Cada módulo tiene su config en `app/src/config/sidebars/<módulo>.js` (hoy: `main.js` → `MAIN_SIDEBAR_PROPS`, `operaciones.js` → `OPERACIONES_SIDEBAR_PROPS`) — nunca hardcodear `brandLabel`/`groups`/etc. inline en una pantalla, siempre importar el config del módulo correspondiente. `brandIcon` = isotipo, `brandLabel` = logotipo (texto), `brandAccent` = color del badge del isotipo, uno de los 8 nombres fijos de la paleta de acento (`blue` default, `violet`, `green`, `amber`, `red`, `cyan`, `pink`, `indigo` — mismos tokens `color/accent/<n>`/`color/accent/<n>-subtle` que `CardModule`), tiñe el fondo+ícono del badge vía `[data-accent]` en `Sidebar.module.css`.
  - **`LayoutBase`** (el template de más bajo nivel) acepta `sidebarProps` completo — es intencionalmente genérico, cualquier pantalla que lo use directo (hoy: `Main/Home`) importa el config de su módulo y arma `{ ...MODULO_SIDEBAR_PROPS, onNavigate, ... }` ella misma.
  - **Los templates más específicos (`LayoutHomeModule`, `LayoutMaestroDataGrid`) reciben el config del módulo por prop (`sidebar`)** — no lo importan ni lo hardcodean internamente, así una misma instancia de template sirve para cualquier módulo. Además aceptan los 4 callbacks de interacción (`onNavigate`, `onCompanyChange`, `onLogout`, `onToggle`) y arman `{ ...sidebar, defaultActiveHref: activeHref, ...callbacks }` internamente antes de pasárselo a `LayoutBase`. La pantalla sigue sin poder inventar su propio `brandLabel`/`groups`/etc. — solo puede elegir *cuál* config de módulo usar, no modificarlo.
- **Íconos — SIEMPRE SIN RELLENO (outline), regla del kit:** nunca usar variantes `-fill` de Bootstrap Icons (`pin-fill`, `archive-fill`, etc.) ni glifos sólidos; un estado (fijado, activo) se comunica con color u otro ícono outline, no rellenando el glifo. **Única excepción, a pedido: `bi-star-fill` (la estrella del favorito marcado en `ToggleIcon`), que sí va rellena** (está en la lista `FILL_EXCEPTIONS` de `icons.jsx`; cualquier otra excepción debe pedirse explícitamente). `Icon` avisa por `console.warn` en desarrollo si se pide un `bi-*-fill`. Ejemplos ya resueltos: el pin del `Sidebar` usa `bi-pin-angle` (sin fijar) / `bi-pin` (fijado); eliminar y compartir usan `bi-trash` / `bi-share` (outline oficiales) en lugar de los trazos sólidos de Figma `icon-delete`/`icon-share`, que se quitaron de `icons.jsx`.
- **Íconos — cómo pasar íconos de Bootstrap (regla):** los `bi-*` son los **Bootstrap Icons oficiales**, tomados del paquete npm `bootstrap-icons` (MIT) — **nunca se dibujan ni se copian a mano**. `<Icon name="bi-eye" />` (o `icon="bi-eye"` en cualquier componente) resuelve `node_modules/bootstrap-icons/icons/eye.svg`. Para usar uno que todavía no está: **agregar su nombre (sin el prefijo `bi-`) a la lista de `BOOTSTRAP_GLOB` en `app/src/icons/icons.jsx`** (solo los listados entran al bundle) — no hace falta escribir ningún SVG. Los íconos heredan el color del texto (`currentColor`, viewBox 16). Si el nombre no existe, `Icon` avisa por `console.warn` en desarrollo. `icon-*` (y `app-window`) = glifos propios del sistema, trazas vectoriales exactas de Figma que no existen en Bootstrap; esos sí viven escritos en `ICONS` del mismo archivo. `getIconMarkup(name)` (exportado) resuelve cualquiera de los dos y lo usa también `utils/moduleFavicon.js`. Módulo `Operaciones` (página *Sidebar*, nodos 442:598, 450:679, 450:694, 450:693, 450:692, 450:691, 450:690): `icon-gear`, `icon-maestros`, `icon-buques`, `icon-clientes`, `icon-tipos-turnos`, `icon-nueva-operacion`. Módulo `Main` (nodos 438:3087–497:4644, ver `Main/Home` abajo): `icon-administracion`, `icon-usuarios`, `icon-roles-perfiles`, `icon-empresas`, `icon-modulos`, `icon-gear` (reusado — mismo glyph que "Configuración" de Main y que "Procesos" de Operaciones en Figma), `icon-parametros`, `icon-email`, `icon-datos-maestros`, `icon-paises`, `icon-monedas`, `icon-integraciones`, `icon-importar-novedades`, `icon-tokens-acceso`. `app-window` (isotipo de Main, 496:4632/496:4633) también es trazo exacto — se actualizó de una aproximación con `<rect stroke>` al trazo real la primera vez que se necesitó el asset. Los íconos de items/subitems del nav se renderizan a 16px (`.icon` en `Sidebar.module.css`). `app-window` se reusa también (mismo nodo de Figma, "App" 431:2474 — misma pieza que 496:4632/4633, solo una instancia distinta del mismo componente) como placeholder en Administración → Equipos, Configuración → Desencadenantes, Datos maestros → Provincias/Ciudades y en el grupo nuevo Sistema (ícono del grupo + sus 3 subítems) — ver nota en `config/sidebars/main.js`, reemplazar por el ícono real de cada uno cuando esté definido en Figma.
- **Nombres largos de items/subitems:** siempre una sola línea, se truncan con `…` (`white-space: nowrap` + `text-overflow: ellipsis`) — nunca pasan a dos líneas. El nombre completo se ve al hacer hover vía `title` nativo del navegador (funciona igual colapsado o expandido, no lo recorta el `overflow: hidden` del sidebar).

### `TopBar` — `app/src/components/TopBar/`

Origen: Figma *Pharo Design System*, nodo `TopBar` (44:90). No está en el frame original de Figma — se agregó a pedido, referencia visual aparte (captura de pantalla, no link de Figma).

```jsx
<TopBar onSearch={(query) => ...} searchPlaceholder="Buscar módulos, usuarios, procesos..." />
```

Compone `Buscador` (izquierda) + `LanguageSelector` (derecha, internamente con su propio estado) — `justify-content: space-between` en `.root`. `onSearch`/`searchPlaceholder` son opcionales, se pasan directo a `Buscador`. Si se necesita controlar el idioma desde afuera, levantar el estado a props (`language`, `onLanguageChange`) en vez de improvisar una segunda fuente de verdad.

### `Buscador` — `app/src/components/Buscador/`

Sin frame de Figma — referencia visual por captura de pantalla (buscador de la TopBar), no un link de Figma. **Solo el buscador en sí** — todavía no existe la pantalla de chat de IA a la que debería llevar; se deja el punto de enganche (`onSearch`) para cuando se construya.

```jsx
import Buscador from '../../components/Buscador/Buscador.jsx';

<Buscador
  placeholder="¿Qué necesitás hacer?"  // default, ver arriba
  onSearch={(query) => ...}  // se dispara al confirmar (Enter) con el texto ya trimeado; sin handler, solo hace console.log
/>
```

- Input de texto libre (no controlado por la pantalla — estado interno con `useState`, mismo criterio que `LanguageSelector`) + ícono de lupa (`bi-search`, aproximación dibujada a mano — no hay equivalente en ningún frame de Figma todavía).
- Clickear en cualquier parte de la caja (no solo el input) enfoca el input — mismo criterio de "área de click generosa" que otros controles del kit. Sin atajo de teclado global (se probó `Cmd+K`/`Ctrl+K` y se sacó a pedido).
- **Ya conectado al chatbot de IA**: al confirmar (Enter) se llama a `onSearch(query)`. `App.jsx` le pasa a **todas** las pantallas un `onSearch` que guarda la consulta y navega a `/asistente-ia` (ver `AsistenteIA` en Módulos y la nota de Ruteo) — la consulta se envía sola al llegar, como si el usuario la hubiera tipeado directo en el chat. Cada template (`LayoutBase` y los que lo envuelven) hilan `onSearch` hasta acá; una pantalla que no lo reciba simplemente no lo pasa (el buscador sigue andando, solo que sin destino — mismo criterio de "prop opcional" del resto del kit).

### `LanguageSelector` — `app/src/components/LanguageSelector/`

Origen: Figma, componente `Language Selector` (50:38), variantes `State=Closed/Open`.

```jsx
<LanguageSelector
  languages={[{ code: 'ES', label: 'Español' }, { code: 'EN', label: 'English' }]}
  value="ES"
  onChange={(code) => ...}
/>
```

Controlado (`value`/`onChange`) — no decide el idioma activo, solo avisa.

### `CardMetric` — `app/src/components/CardMetric/`

Origen: Figma, página *Cards*, componente `Card-Metric` (457:1054) — `Propiedad 1=Default` (426:13) y `Propiedad 1=Variante2` (457:1055, estado hover).

```jsx
<CardMetric
  label="Recepciones activas"
  value={47}
  trendLabel="+8 vs ayer"
  trendDirection="up"     // 'up' | 'down'
  data={[20, 24, 21, 30, 27, 36, 32]}
/>
```

- `data` genera el mini-gráfico (sparkline) real a partir de la serie — no es decorativo fijo.
- `trendDirection` rota la flecha de tendencia.
- Ancho fluido (`width: 100%`, `min-width: 169px`) — pensado para ir en una fila con `flex: 1` por card (ver `modules/Operaciones/Home`), no un tamaño fijo.
- **Alto fijo** (`height: 104.25px` en `.card`, `box-sizing: border-box`) — todas las `CardMetric` de una fila miden exactamente lo mismo sin importar el largo de `label` o si vienen `data`/`trendLabel`. `.label` tiene `height: 30.25px` (exacto a 2 líneas con su `font-size`/`line-height`) + `-webkit-line-clamp: 2` (con `line-clamp: 2` sin prefijo también, `overflow: hidden`, `text-overflow: ellipsis`) — un `label` que no entra en 2 líneas se trunca con `…` en vez de agregar una tercera línea y estirar la card. Los 104.25px salen de sumar padding (`--spacing-md` × 2) + gap (`--spacing-md`) + alto del label (30.25px, el más alto de la primera fila, más que el sparkline de 20px) + alto de `.value` (line-height 1 × font-size 26px) — si se cambia algún token/tamaño de esos, recalcular este valor a mano (no hay `calc()` con las custom properties de por medio, están hardcodeadas en px como el resto del archivo).
- Hover es solo una sombra sutil en la franja de acento (`0px 1px 3px rgba(15,30,52,0.06), 0px 1px 2px rgba(15,30,52,0.04)`, sin cambio de borde) — CSS puro, sin estado de React.
- El acento (franja izquierda, sparkline y texto de tendencia) usa `--color-primary-default` — el mismo azul del resto del sistema. (Antes usaba un token `color/accent/metric` violeta inventado porque esa variable no existía en Figma; se corrigió tras confirmar que el Figma actual está atado a `color/primary/default`/`text/action/secondary/default`, ambos `#4059fd`.)

### `CardQuickAccess` — `app/src/components/CardQuickAccess/`

Origen: Figma, página *Cards*, componente `Card-Quick-Access` (431:2506), variantes Default/Hover. Ícono + texto en fila.

```jsx
<CardQuickAccess
  icon="app-window"      // opcional, default 'app-window'
  title="Mapa de calor"
  subtitle="Ports"
  onClick={() => ...}    // o href="/ruta" para que renderice <a>
/>
```

### `EmptyState` — `app/src/components/EmptyState/`

Origen: Figma, página *Empty State*, componente `Empty State` (788:7). Estado vacío: se muestra **en lugar del contenido** de una sección que todavía no tiene datos (ej. "Actividad reciente" en una empresa nueva). Para avisos de contexto que conviven con el contenido, usar `Message`.

```jsx
<EmptyState
  icon="icon-history"   // default
  title="Todavía no hay actividad"
  description="Cuando empieces a trabajar en Pharo, vas a encontrar acá un resumen de tus últimas acciones."
/>
```

- Card vertical y centrada: badge de ícono 44px (fondo `--color-info-subtle`, trazo `--color-accent-indigo`, radio 12px), título 14px/600, descripción 12px/1.5 en `--color-text-secondary`. Ocupa el ancho de su contenedor (en Figma, 270px → 237px de alto). Padding `40px 24px`.
- Tokens nuevos en `tokens.css`: `--spacing-9` (40px) y `--radius-5` (12px) — en Figma el componente usa esas primitivas directo, no hay alias semántico.
- Ícono nuevo `icon-history` (reloj con flecha antihoraria, trazo estilo Lucide): dibujado en Figma (`Icon/History`, 788:6), no existe en la página *Icon*.
- Props = propiedades de Figma (`Title`, `Description`, `Icon`). Ninguna pantalla lo usa todavía.

### `Message` — `app/src/components/Message/`

Origen: Figma, página *Message*, component set `Message` (783:22) — copia de `Card-Quick-Access` pensada para **mensajes de contexto**. Mismo diseño que `CardQuickAccess` (badge de ícono azul claro + título + texto), pero **no interactiva**: `<div>` sin hover, foco ni cursor. **Sin variante Hover (a pedido, por ahora)** — en Figma el set quedó con una sola variante `State=Default` (la API no permite borrar la propiedad de variante `State`; se puede ignorar).

```jsx
<Message icon="app-window" title="Facturación en proceso" message="Las facturas emitidas hoy se verán reflejadas en la cuenta del cliente en las próximas 24 horas." />
```

- Props (= propiedades de Figma): `icon` (key de `icons.jsx`, default `app-window`), `title`, `message` (opcional). **Ocupa todo el ancho de su contenedor** (`width: 100%`, mínimo 169px; los 274px son solo el tamaño por defecto de la instancia en Figma, donde se puede estirar); el texto envuelve y la card crece en alto.
- `message` respeta saltos de línea (`\n`, `white-space: pre-line`): una línea por dato. En `LayoutMaestroFormulario`, `belowHeader` permite ubicarlo justo bajo el Page header.
- Sin `accent`: el badge es siempre el azul del diseño. Si hace falta color por tipo de mensaje, definirlo antes en Figma.

### `CardModule` — `app/src/components/CardModule/`

Origen: Figma, página *Cards*, componente `Card-Module` (431:2608), variantes Default/Hover. Ícono + texto apilado (para launchers de módulos).

```jsx
<CardModule
  icon="icon-gear"
  accent="violet"         // default 'blue' — ver tabla de acentos abajo
  title="Ports"
  description="Gestión de operaciones portuarias"
  onClick={() => ...}    // o href="/ruta"
/>
```

**Variantes de color por módulo** (Figma, sección *Card-Module — Color accents*, página *Cards*, 446:14 — 14 cards, cada una un módulo real de `Main/Home`, ver esa entrada abajo): prop `accent` en `CardModule.jsx`, mismo patrón `[data-accent]` que `Sidebar.module.css`. 8 nombres fijos + `neutral` (gris, sin equivalente en la paleta de acento de Figma — lo usan 2 de los 14 módulos reales en vez de un color; reusa `--color-surface-selected`/`--color-text-secondary`):

| Accent | Ícono (`color/accent/<n>`) | Fondo badge (`color/accent/<n>-subtle`) |
|---|---|---|
| `blue` (default) | `--color-primary-default` | `--color-primary-disabled` |
| `violet` | `--color-accent-violet` `#7c3aed` | `--color-accent-violet-subtle` `#ede8fd` |
| `green` | `--color-accent-green` `#16a34a` | `--color-accent-green-subtle` `#dcfce7` |
| `amber` | `--color-accent-amber` `#d97706` | `--color-accent-amber-subtle` `#fef3c7` |
| `red` | `--color-accent-red` `#dc2626` | `--color-accent-red-subtle` `#fee2e2` |
| `cyan` | `--color-accent-cyan` `#0891b2` | `--color-accent-cyan-subtle` `#cffafe` |
| `pink` | `--color-accent-pink` `#db2777` | `--color-accent-pink-subtle` `#fce7f3` |
| `indigo` | `--color-accent-indigo` `#4f46e5` | `--color-accent-indigo-subtle` `#e0e7ff` |
| `neutral` | `--color-text-secondary` | `--color-surface-selected` |

Nota: `color/accent/red` es un token distinto de `color/danger/default` (mismo tono, pero semánticamente separado — uno es decorativo, el otro es de error) para no acoplar el color de un módulo al color de un estado de error.

- **Con `href`, siempre abre en pestaña nueva** (`target="_blank" rel="noopener noreferrer"`, hardcodeado en el componente, no un prop) — a pedido: abrir un módulo desde Main nunca reemplaza la pestaña de Main. `rel="noopener noreferrer"` es buena práctica estándar al usar `target="_blank"` (corta el acceso de la pestaña nueva a `window.opener`). Sin `href` (variant `onClick`/`button`) no aplica, no hay nada que abrir aparte. Uso real hoy: la grilla de Módulos en `Main/Home` (ver esa entrada) — los 23 módulos del catálogo (`config/modules.js`) tienen `href` (ver nota de "Home de los 22 módulos nuevos" más abajo, junto a `Operaciones/Home`).

**Ambas cards comparten:**
- Mismo shell que `CardMetric` (`surface/card`, `color/border/default`, `radius/card`, `min-width: 169px` como piso) pero sin la franja de acento — no se refactorizó a un "Card" base compartido todavía, cada una tiene su propio CSS.
- **`CardModule` (no `CardQuickAccess`) tiene tamaño fijo, no fluido, en sus dos usos reales** (grilla de Módulos de `Main/Home` y `Main/Modulos`, ver esas entradas) — a pedido, para que no se estire/achique con el ancho de pantalla. **174px** (`min-width` del componente, ajustado a pedido — arrancó igual al piso que ya tenía el componente, 169px, el tamaño real que se veía antes con el sidebar expandido: a ese ancho, 4 columnas de `1fr` no entraban y el `min-width` terminaba mandando; ver la nota completa en `Main/Home`) — no un tamaño inventado, solo +5px sobre ese piso. Antes de esto se probó (y se descartó) una escala más grande (ícono 24px, `padding: var(--spacing-lg)`, título 16px/700) que resultó ser más grande de lo pedido; se revirtió todo a la tipografía/padding original de Figma (11px/11px, ícono 16px, `padding: var(--spacing-md)`, `iconBadge` con `padding: 10px`) — el ajuste de 169→174 es puramente el ancho, no volvió a tocar tipografía/padding. El propio componente sigue siendo `width: 100%` (llena la columna del grid que le toque) — el tamaño fijo real lo impone el `grid-template-columns: repeat(auto-fill, 174px)` del contenedor, no el componente en sí.
- Hover es solo sombra sutil (dos capas, sin cambio de borde) — distinto del hover de `CardMetric`, que sí tiene borde + sombra más marcada. Son recetas de sombra reales de Figma, no inventadas.
- El ícono de badge (`app-window`) es un glyph propio de Figma, no un ícono de Bootstrap — vive en `icons.jsx` (en `ICONS`, aparte de los `bi-*` oficiales de Bootstrap) con nombre distinto para no confundirlo. Pasale otro `icon` (cualquier `bi-*` o key de `ICONS`) si el módulo/acceso necesita uno distinto.
- Ambas son `<button>` (o `<a>` si les pasás `href`) — clickeables de verdad, no un `div` con `onClick`.
- Íconos de los módulos reales (`icons.jsx`): `icon-truckshift`, `icon-check2circle`, `icon-box` son trazos nuevos, exactos de Figma. `bi-cart` se actualizó de aproximación dibujada a mano a trazo exacto (asset real de "Purchases", 445:56) — ya no está pendiente de reemplazo. El catálogo completo de módulos (hoy 23, ver `config/modules.js`) vive fuera de `Main/Home` desde que se agregó `Main/Modulos` — ver esa entrada más abajo.

### `ModuleAccessCard` — `app/src/components/ModuleAccessCard/`

Mismo shell visual que `CardModule` (icon badge con acento + título + descripción) pero como `<div>` plano, no un `<button>`/`<a>` — la usa `Main/Modulos` (ver Módulos abajo), donde el click no navega a ningún lado, la interacción es habilitar/deshabilitar el módulo.

```jsx
import ModuleAccessCard from '../../components/ModuleAccessCard/ModuleAccessCard.jsx';

<ModuleAccessCard
  icon="icon-gear"
  accent="violet"
  title="Ports"
  description="Gestión de operaciones portuarias"
  checked={enabled}
  onChange={() => toggle(id)}
/>
```

- Reusa `Checkbox` (`components/Checkbox/`) tal cual, posicionado arriba a la derecha del icon badge (fila `.top`, `justify-content: space-between`) — no se reimplementó un checkbox propio. Un checkbox anidado dentro de un `<button>` (como es `CardModule`) sería inválido/confuso a nivel accesibilidad, por eso este componente es un contenedor plano en vez de reusar `CardModule` directo pese a compartir el resto del look — mismo criterio que ya separa `ChatSuggestionCard` de `CardModule` (misma familia visual, distinto contrato de interacción).
- Sin `href`/`onClick` a nivel card — controlado enteramente por `checked`/`onChange` del Checkbox.
- Misma tipografía/padding compacto que `CardModule` (título 13px/600, descripción 12px/400 — un toque más grande que los 11px de `CardModule` porque acá conviven con el `Checkbox`, nunca se tocaron en el vaivén de tamaños que sí afectó a `CardModule`, ver esa nota) y mismo tamaño fijo por grid (`repeat(auto-fill, 174px)` en `Modulos.module.css`), para que ambas pantallas se vean consistentes.

### `ActivityItem` — `app/src/components/ActivityItem/`

Origen: Figma, página *Cards*, componente `Activity Item` (433:2719), variantes `Propiedad 1=Default/Hover` (436:3049).

```jsx
<ActivityItem name="Carlos M." time="hace 3 min" description="Aprobó turno de camión" />
```

- `initials` es opcional — si no se pasa, se calcula solo a partir de `name` (primeras letras de las dos primeras palabras).
- Borde solo en los costados y abajo (no arriba) — está pensado para **apilarse**, no para usarse suelto con los 4 bordes. Para eso existe `ActivityList`.
- Hover cambia el fondo a `color/surface/hover` — CSS puro (`:hover`), sin estado de React.
- **El color de fondo del avatar varía por persona**, igual que en el `Activity List` de Figma (6 colores hardcodeados ahí, sin token — `#3563e9`/`#14b8a6`/`#8b5cf6`/`#f97316`/`#ec4899`/`#22c55e`, ahora en `tokens.css` como `--color-avatar-1..6`). Se elige de forma determinística con un hash simple sobre `name`, así la misma persona siempre cae en el mismo color en cualquier lista.

### `ActivityList` — `app/src/components/ActivityList/`

Origen: Figma, página *Cards*, componente `Activity List` (433:2810) — 6 `ActivityItem` apilados, con borde superior y radios (`radius-md`) solo en las puntas de la lista, no en cada fila.

```jsx
<ActivityList
  items={[
    { name: 'Carlos M.', time: 'hace 3 min', description: 'Aprobó turno de camión' },
    // ...
  ]}
/>
```

- Compone `ActivityItem` sin reimplementar nada — el CSS de `ActivityList` solo le agrega el borde superior + radios al primer/último hijo vía `:first-child`/`:last-child` (selector `:global(*)`, no necesita conocer el nombre de clase interno de `ActivityItem`).

### `Pagination` — `app/src/components/Pagination/`

Origen: Figma, página *Cards*, componente `Pagination` (435:3022) — visto dentro de la pantalla `Desktop — Layout Home` (429:2249), sección Módulos.

```jsx
<Pagination
  page={1}
  totalPages={2}
  onPrevious={() => ...}
  onNext={() => ...}
/>
```

- Totalmente controlado — no guarda estado propio, la pantalla decide qué página mostrar.
- Chevrons (`bi-chevron-left`/`bi-chevron-right`, agregado a `icons.jsx`) se deshabilitan solos en los extremos (`page <= 1` / `page >= totalPages`).

### `SelectWithOther` — `app/src/components/SelectWithOther/`

Sin frame de Figma. `Select` de un maestro + opción **"Otro"**: un valor distinto al del maestro. Al elegir "Otro (escribir manualmente)" aparece un `TextField` para escribirlo; al elegir otra opción vuelve a ocultarse. Reemplaza el patrón de dos cajas (código + denominación) + check "Otro". **Versión con `Select` nativo** — pendiente: un selector con búsqueda (código o nombre) para catálogos largos.

```jsx
<SelectWithOther label="Producto *" options={[{ value: 'PR-01', label: 'PR-01 · Soja' }]}
  value={producto} onChange={setProducto} otherValue={productoOtro} onOtherChange={setProductoOtro}
  error={Boolean(err)} helperText={err} />
```

- `value` = valor del maestro, `OTHER_VALUE` (`'__otro__'`, exportado) si eligió "Otro", o `''`. `otherValue` = texto escrito — se guarda **aparte** para distinguir valores del maestro (con código) de valores escritos a mano. El `error`/`helperText` se muestran en el control activo (Select o TextField).

### `SectionIndex` — `app/src/components/SectionIndex/`

Sin frame de Figma. Índice de secciones de un formulario **largo**: fila fija (se pega debajo del Page header usando `--page-header-height`, que publica `PageHeader`) con un botón por sección que salta a ella y su estado (`complete` check / `pending` círculo / `error` rojo) + contador "N de M completas". Orientación y progreso sin esconder secciones — alternativa liviana al wizard.

```jsx
<SectionIndex sections={[{ id: 'sec-viaje', label: 'Datos del viaje', status: 'complete' }]} />
```

- Cada sección debe tener un elemento con ese `id`: en `LayoutMaestroFormulario`, un bloque `{ type: 'form', id: 'sec-viaje', ... }` lo envuelve en un ancla con `scroll-margin-top`. Se pasa por la prop `belowHeader` del template. Uso real: `Operaciones/GiroBuque/SolicitudGiro`.

### `HorizontalScroller` — `app/src/components/HorizontalScroller/`

Sin frame de Figma — referencia visual: carrusel de categorías de Behance. Fila de ítems de **ancho fijo** (`itemWidth`, default 274px) con scroll horizontal cuando no entran; aparecen botones circulares (`bi-chevron-left/right`) en los bordes para avanzar/retroceder (80% del ancho visible por click), y la fila también se desplaza con trackpad/rueda/táctil (scrollbar oculta, `scroll-snap`). Sin overflow no hay botones y los ítems no se estiran.

```jsx
<HorizontalScroller aria-label="Accesos rápidos">
  {items.map((qa) => <CardQuickAccess key={qa.title} {...qa} />)}
</HorizontalScroller>
```

- Cada hijo directo es un ítem. Uso real: "Acceso rápido" de `Main/Home` (11 ítems de ejemplo). El Home de cada módulo (`LayoutHomeModule`) todavía usa grilla de 274px fijos, no este componente.

### `Badge` — `app/src/components/Badge/`

Origen: Figma, component set `Badge` (619:47) — Type (Success/Warning/Error/Info/Neutral) × Show dot, 10 variantes, tamaño único. Documentación en Figma: *Badge - Spec* (623:2, uso y reglas) y *Badge — Handoff para developers* (630:44, API/tokens/estados) — la API de código sigue la del handoff. Reemplazó a `StatusChip` (eliminado de `DataGrid`) en todas las grillas.

```jsx
import Badge from '../../components/Badge/Badge.jsx';

<Badge type="success">Activo</Badge>
<Badge type="neutral">Inactivo</Badge>
<Badge type="warning" showDot={false}>Por vencer</Badge>
```

- **Props**: `type` = `'success' | 'warning' | 'error' | 'info' | 'neutral'` (default `'neutral'` — en Figma el default es Success, el handoff recomienda neutral en código); `children` = el label (obligatorio, 1–2 palabras); `showDot` (default `true`); `className`/`...rest` se propagan al `<span>` contenedor (`aria-label`, `data-*`).
- **Elegir `type` por significado, no por color**: success = activo/aprobado/completado; warning = pendiente/por vencer; error = rechazado/fallido/bloqueado; info = en revisión/en proceso/nuevo; neutral = inactivo/borrador/archivado. Mantener el mismo `showDot` en toda una columna.
- **No interactivo**: `<span>` sin `role`, sin foco, sin eventos, sin estados hover/disabled. El Dot es un `<span>` con `background: currentColor` y `aria-hidden` (no un ícono) — comparte el token de texto.
- **Edge cases del handoff**: `children` vacío → no renderiza nada (`return null`; en una tabla la pantalla muestra "—"); `type` inválido → cae a `neutral` + `console.warn` en dev; texto largo → una sola línea, ellipsis si el padre limita el ancho, con `title` con el texto completo; `tabular-nums` en el label; `outline: 1px solid transparent` para modo alto contraste. Sin `height` fija (18.4px resultan de padding + line-height).
- **Tokens** (colección Maps de Figma, mismo nombre en `tokens.css`): `--surface-badge-<type>`, `--text-badge-<type>`, `--spacing-padding-badge-x` (8px), `--spacing-padding-badge-y` (2px), `--spacing-gap-badge` (4px), `--radius-badge` (full), `--font-size-label` (12px), `--font-weight-medium` (500).

### `Button` — `app/src/components/Button/`

Origen: Figma, component set `Button` (591:1937) — Variant (Solid/Outline/Text/Right Icon/Left Icon/Icon Only) × State (Default/Hover/Pressed/Focus/Disabled), 30 variantes, tamaño único (md). Documentación en Figma: *Button - Spec* (595:17, uso y reglas) y *Button — Handoff para developers* (605:91, API/tokens/estados) — la API de código sigue la del handoff. Reemplazó a `ButtonPrimary`/`ButtonSecondary` (eliminados): donde había `ButtonPrimary` ahora va `variant="solid"`, donde había `ButtonSecondary`, `variant="outline"`.

```jsx
import Button from '../../components/Button/Button.jsx';

<Button onClick={() => ...}>Guardar</Button>                              {/* variant="solid" default */}
<Button variant="outline" onClick={() => ...}>Cancelar</Button>
<Button variant="text">Limpiar filtros</Button>
<Button iconStart="icon-plus">Nuevo buque</Button>                       {/* = Left Icon de Figma */}
<Button iconEnd="bi-chevron-right">Siguiente</Button>                    {/* = Right Icon de Figma */}
<Button iconOnly iconStart="icon-plus" aria-label="Agregar fila" />      {/* aria-label obligatorio */}
<Button disabled>Guardar</Button>
<Button href="/buques">Ir a Buques</Button>                             {/* navega → renderiza <a> */}
```

- **Props** (handoff, sección 00): `variant` (`'solid'` default | `'outline'` | `'text'`), `iconStart`, `iconEnd` (key de `icons.jsx` o cualquier nodo — se renderizan a 16×16, `aria-hidden`), `iconOnly` (boolean — solo muestra el ícono, cuadrado de 32px; **requiere `aria-label`**), `children` (el label), `disabled`, `type` (default `'button'`, para evitar submits accidentales), `href` (opcional — renderiza `<a>` con los mismos estilos; ignorado si `disabled`), `className`, más cualquier prop nativa (`onClick`, `aria-*`, etc.).
- **Figma mezcla jerarquía y posición de ícono en `Variant`; en código están separadas** (recomendación del handoff, Pregunta abierta #1): `variant` es solo la jerarquía, y los íconos son props independientes. En Figma los íconos solo existen en Solid; en código se permiten también en Outline/Text (heredan el color del label con `currentColor`) porque `LayoutMaestroDataGrid` (Recargar/Exportar) y `LayoutMaestroBasico` (Cancelar) ya los usaban con el botón secundario — ⚠️ pendiente de confirmar con diseño (Pregunta #2 del handoff).
- **Hover/Pressed/Focus no son props** — `:hover`, `:active`, `:focus-visible`. Solo `disabled` es prop. Disabled gana sobre todo (no recibe hover/active/foco).
- **Focus, tal cual Figma**: Solid y Text → anillo interno de 2px (`inset box-shadow`, `--color-border-focus`); Outline → borde 1px + anillo externo de 2px.
- **Borde de Outline con `box-shadow: inset`** (no `border`) — recomendación del handoff: en Figma el borde queda fuera de la caja y Outline mide 2px más que el resto; así todas las jerarquías miden 32.8px y se alinean en fila. Verificado en el navegador: Solid y Outline miden 32.8px exactos.
- **Sin `loading` ni `size="lg"`** — no existen en el componente de Figma (Pendientes de la spec: el componente anterior tenía Loading y este no). No había ningún uso real de ninguno de los dos. `icon-spinner` sigue en `icons.jsx` sin uso.
- Texto largo: una sola línea; si el padre limita el ancho, ellipsis en el label y los íconos no se encogen. Transiciones 120ms ease-out (sin tokens de motion en Figma), desactivadas con `prefers-reduced-motion`. `forced-colors`: borde `ButtonText`.
- **Tokens**: los de Figma (colección Maps/Alias) con el mismo nombre (`--surface-action-*`, `--surface-action-secondary-*`, `--border-action-secondary-*`, `--text-on-action`, `--text-action-secondary-*`, `--spacing-padding-button-x/y`, `--spacing-gap-button`, `--radius-button`, `--size-icon-sm`, `--border-width-focus`, `--font-*-button-label`, `--font-family-base`) — agregados a `tokens.css` como **alias** de los valores existentes (`--color-primary-*`, `--color-action-*`, etc.), no como valores nuevos. `--color-action-*` se mantiene porque también lo usa `ChatInput`.

### `ActionGroup` — `app/src/components/ActionGroup/`

Origen: Figma, component set `Action Group` (669:189, página *Action Group*) — `Buttons=2..5`. Molécula compuesta por `Button`. Documentación en Figma: *Action Group - Spec* (672:16, uso y reglas) y *Action Group - Handoff Dev* (676:50, API/tokens/estados) — el código sigue el handoff.

```jsx
import ActionGroup from '../../components/ActionGroup/ActionGroup.jsx';

<ActionGroup
  aria-label="Acciones del formulario"
  primary={{ label: 'Guardar', onClick: handleSave }}
  secondary={[
    { label: 'Cancelar', onClick: handleCancel },
    { label: 'Recargar', onClick: handleReload, disabled: true },
  ]}
/>
```

- **Regla básica**: SIEMPRE un solo botón primario (`Solid`) a la izquierda, más de 1 a 4 secundarios (`Outline`) — de 2 a 5 botones en total. La API hace imposible romperla (opción A de la Pregunta abierta #1 del handoff): `primary` es una prop aparte (siempre el primer hijo del DOM) y `secondary` una lista. El `variant` de cada botón lo fija la posición; cualquier `variant` que llegue dentro de una acción se ignora.
- **Cada acción** (`primary` y cada ítem de `secondary`) es `{ label, ...propsDeButton }`: `label` va como `children`, el resto (`onClick`, `disabled`, `type`, `href`, `iconStart`, `iconEnd`, `aria-*`) se pasa tal cual a `Button`. Para que Enter envíe un `<form>`, el primario lleva `type: 'submit'`.
- **Contenedor**: `<div role="group">` con `display: flex`, `align-items: center`, `gap: var(--spacing-sm)` (8px); ancho hug. Sin estados propios: hover/pressed/focus/disabled los resuelve cada `Button`; se deshabilita por acción, no hay `disabled` a nivel grupo. `aria-label` (y cualquier prop de `<div>`) se propaga al contenedor — recomendado siempre.
- **Contrato validado en desarrollo** (`console.warn`, solo con `import.meta.env.DEV`): sin `primary` → no renderiza nada; `secondary` vacío → renderiza solo el primario (con una acción usar `Button` suelto); más de 4 `secondary` → muestra las primeras 4. ⚠️ Comportamiento supuesto, pendiente de validar con el equipo.
- **`flex-wrap: wrap`** (supuesto, Responsive del handoff): si no entran en una línea pasan a la siguiente. En desktop con espacio suficiente no cambia nada.
- **Dónde se usa hoy**: `LayoutMaestroDataGrid` (cabecera: **Nuevo** primario + **Recargar**/**Exportar** secundarios, `aria-label="Acciones del listado"`), `LayoutMaestroBasico` (cabecera: **Guardar** primario + **Cancelar**, `aria-label="Acciones del formulario"`) y el footer del `Modal` "Agregar concesionario" de `PerfilFormulario` (**Agregar** primario + **Cancelar**, `aria-label="Acciones del diálogo"`). En los dos templates el grupo solo se usa cuando hay primario **y** al menos un secundario; con una sola acción (ej. solo "Volver" en modo `view`, o `Nuevo` sin Recargar/Exportar) o sin primario van `Button` sueltos, como antes (el grupo es de 2 a 5 botones). **`TourPopup` (Anterior / Siguiente) no lo usa a propósito**: es navegación entre slides (Anterior a la izquierda, Siguiente a la derecha), no un grupo de acciones. Tampoco hay menú de acciones para más de 5 (Pregunta abierta #5).

### `PageHeader` — `app/src/components/PageHeader/`

Origen: Figma, component set `Page header` (680:39, página *Page header*) — `Type=Home` / `Maestro` / `Form`. Organismo compuesto por `Breadcrumb` (en código: `<nav>` propio, ver abajo), `ToggleIcon` y `ActionGroup`. Documentación en Figma: *Page header - Spec* (682:23, uso y reglas) y *Page header - Handoff Dev* (687:105, API/tokens/estados) — el código sigue el handoff.

```jsx
import PageHeader from '../../components/PageHeader/PageHeader.jsx';

<PageHeader type="maestro" title="Buque" favorite={isFav} onToggleFavorite={toggle}
  actions={{ label: 'Acciones del listado', primary: { label: 'Nuevo', onClick: onNew }, secondary: [{ label: 'Recargar', onClick: onReload }] }} />
<PageHeader type="form" breadcrumb={[{ label: 'Buque', href: '/buques' }, { label: 'Crear Buque' }]} title="Crear Buque"
  actions={{ label: 'Acciones del formulario', primary: { label: 'Guardar', onClick: save }, secondary: [{ label: 'Cancelar', onClick: cancel }] }} />
<PageHeader type="home" title="Acceso rápido" subtitle="Tus maestros y procesos favoritos" />
```

- **Prop `type` explícita (opción B de la Pregunta abierta #1 del handoff)**: `'home' | 'maestro' | 'form'`, igual a `Type` de Figma. Cada tipo admite solo algunas props y el componente hace `console.warn` en desarrollo (`import.meta.env.DEV`) si se pasa una que no aplica (se ignora): `home` → `title`, `subtitle`; `maestro` → `title`, `breadcrumb` (opcional, sin variante en Figma), `favorite`/`onToggleFavorite`, `actions`; `form` → `title`, `breadcrumb`, `actions`. `type` inválido → no renderiza nada.
- **Nivel del título según el tipo** (no hay prop `level`): `home` → `<h2>` (título de sección), `maestro`/`form` → `<h1>` (uno por pantalla).
- **Favorito**: solo se renderiza si hay `onToggleFavorite` (opt-in, mismo criterio de antes: las pantallas de Main no lo pasan). Es el `ToggleIcon`, a 4px del título.
- **Acciones** (`{ label, primary?, secondary? }`; `label` = `aria-label` del grupo; cada acción tiene la forma de las de `ActionGroup`): con `primary` **y** al menos un `secondary` → `ActionGroup`; con una sola acción (ej. "Volver" en modo view, o "Nuevo" solo) o sin primario → `Button` suelto (el grupo es de 2 a 5 botones), tal como antes. Sin acciones no se reserva espacio.
- **Ruta de navegación**: `<nav aria-label="Ruta de navegación"><ol>` con chevron `aria-hidden`; el último ítem lleva `aria-current="page"` y va en `--color-text-default` (Breadcrumb `State=Active` de Figma); el resto en `--color-text-secondary`. Un ítem con `href` (y que no sea el último) es un `<a>`; sin `href` es texto — como antes, ningún template lo pasa todavía. No usa un componente `Breadcrumb` separado: el markup vive acá.
- **Layout**: `home` en columna (gap `--spacing-xs`); `maestro`/`form` en fila, `align-items: flex-end`, `justify-content: space-between`, gap `--spacing-md`; columna de título `flex: 1 0 0; min-width: 0`; acciones `flex-shrink: 0`. Ancho 100% del contenedor. Tipografía con valores fijos (24px/700/1.2 título, 14px/400/1.4 subtítulo y ruta), igual que antes — sin tokens tipográficos todavía (Pregunta abierta #9).
- **Dónde se usa**: `LayoutMaestroDataGrid` (`type="maestro"`), `LayoutMaestroBasico` (`type="form"`), `LayoutHomeModule` y `Main/Home` (`type="home"`, para cada título de sección). **No lo usa** `Main/Modulos` (breadcrumb + título + subtítulo + un solo "Guardar": combinación que no existe en ningún `Type` de Figma) ni `LayoutChat` (su header de panel es otro patrón) — decidir si se suma un tipo o se deja como excepción.

### `TextField` — `app/src/components/TextField/`

Origen: Figma, `Text field` (327:22) — estados Default/Focus/Disabled/Error.

```jsx
import TextField from '../../components/TextField/TextField.jsx';

<TextField
  label="Nombre"
  value={value}
  onChange={(e) => setValue(e.target.value)}
  placeholder="Placeholder text"
/>
<TextField label="Nombre" disabled />
<TextField label="Nombre" value={value} onChange={...} error helperText="Campo requerido" />
```

- **`Focus` de Figma tampoco es un prop** (mismo criterio que `Button`) — es el `:focus` real del `<input>`, incluido el grosor de borde 1px→2px que muestra el diseño (sin saltos de layout porque `box-sizing: border-box` mantiene fijo el tamaño total). `Default` es simplemente el estado sin foco.
- Es un `<input>` controlado de verdad — `value`/`onChange` van directo al input nativo, más cualquier otra prop de `<input>` (`type`, `name`, `maxLength`, etc.) se pasa directo.
- `label` usa `htmlFor`/`id` reales (`React.useId()` si no se pasa `id` explícito) — accesible por teclado y lector de pantalla, no son elementos sueltos.
- `error` (boolean) + `helperText`: el texto de ayuda solo se muestra cuando `error` es true (igual que en Figma, donde el helper text solo aparece en el estado Error) y queda asociado al input vía `aria-describedby`.
- Tokens nuevos en `tokens.css`: `--color-text-placeholder`, `--color-surface-input-disabled`, `--color-border-input-disabled` — el resto reusa `--color-border-default`/`--color-danger-default`/`--color-border-focus`/`--color-text-default`/`--color-text-disabled`/`--radius-sm`/`--spacing-*` ya existentes.

### `Checkbox` — `app/src/components/Checkbox/`

Origen: mismo trazo/visual que la celda de checkbox de `DataGrid` (Figma `Checkbox`, 278:4, y el tick 278:6) — acá como control de formulario independiente (checkbox + label), no como parte de una tabla. No había un componente de checkbox reusable todavía (el de `DataGrid` es interno del archivo, acoplado a selección/indeterminate); esta es la versión genérica.

```jsx
import Checkbox from '../../components/Checkbox/Checkbox.jsx';

<Checkbox label="Inactivo" checked={inactivo} onChange={(e) => setInactivo(e.target.checked)} />
```

- **Regla general: los checkboxes SIEMPRE van en vertical** — uno por línea, alineados a la izquierda, con `--spacing-sm` (8px) entre filas; nunca en fila horizontal ni envueltos (lectura más rápida de una columna, etiquetas largas no rompen el layout; NN/g y Baymard). Dentro de un `FormContainer` ya se apilan solos (`.content` es columna); si hay varios en un grupo propio, envolverlos en un `flex-direction: column` con ese gap (ver `DepositoFormulario`, `UsuarioFormulario`). Orden: primero las propiedades del registro, al final "Inactivo" (estado), con un espacio extra de separación cuando hay 3 o más.
- `<input type="checkbox">` real (accesible, `label` con `htmlFor`/`id` vía `useId()` si no se pasa `id`) posicionado invisible sobre la caja visual — mismo patrón de accesibilidad que `RowCheckbox` de `DataGrid` y que `TextField`.
- No comparte código con `RowCheckbox` (que sigue viviendo dentro de `DataGrid.jsx`, con su lógica propia de indeterminate) — mismo criterio ya establecido en el kit de "cada uno su propio CSS/lógica, no refactorizar a una base común antes de que haga falta de verdad".
- **`disabled`** (agregado para el modo "Visualizar" de `BuqueFormulario`): deshabilita el `<input>` real y aplica el mismo tratamiento visual que `TextField` (`--color-surface-input-disabled`/`--color-border-input-disabled`/`--color-text-disabled`) — el estilo `disabled` gana sobre `checked` si están ambos (orden de las reglas en el CSS). Sin prop `indeterminate` todavía — agregarla si algún formulario real la necesita (no confundir con el indeterminate de `RowCheckbox`/select-all en `DataGrid`, que es un caso distinto).

### `Select` — `app/src/components/Select/`

Sin frame de Figma — no existía un dropdown en el kit todavía (surgió al armar `UsuarioFormulario`, campo "Tipo de autenticación"). `<select>` nativo estilizado (no un listbox custom como `LanguageSelector`) a propósito: es un campo de formulario más junto a `TextField`/`Checkbox`, así que prioriza teclado/accesibilidad/mobile nativos sobre un look 100% custom.

```jsx
import Select from '../../components/Select/Select.jsx';

<Select
  label="Tipo de autenticación"
  value={tipo}
  onChange={(e) => setTipo(e.target.value)}
  options={[{ value: 'local', label: 'Local (usuario y contraseña)' }, { value: 'ldap', label: 'LDAP / Active Directory' }]}
/>
<Select label="Tipo" value={tipo} onChange={...} options={...} disabled />
<Select label="Tipo" value={tipo} onChange={...} options={...} error helperText="Campo requerido" />
```

- Mismo box que `TextField` (mismo `border`/`radius-sm`/`padding`/estados `:focus`/`:disabled`/`error`) para que ambos convivan en una misma fila sin desentonar — mismos tokens, sin ninguno nuevo salvo el ícono.
- Un `<option value="" disabled hidden>{placeholder}</option>` hace de placeholder real (`<select>` no soporta `::placeholder`) — mientras `value` esté vacío, el texto se pinta con `--color-text-placeholder` (clase `.placeholder`) para verse igual que el placeholder de `TextField`.
- Ícono nuevo en `icons.jsx`: `bi-chevron-down` (aproximación dibujada a mano, mismo `stroke-width` que `bi-chevron-left`/`bi-chevron-right` — sin equivalente en Figma todavía). Posicionado absoluto a la derecha con `pointer-events: none` sobre un `<select appearance:none>` para reemplazar la flecha nativa del navegador por una consistente con el resto del kit.
- `error`/`helperText`/`disabled`/`label` con el mismo contrato que `TextField` (mismos ids vía `useId()`, mismo `aria-describedby`) — pensado para poder alternar TextField/Select en una pantalla sin que la screen tenga que recordar una API distinta.

### `CheckboxList` — `app/src/components/CheckboxList/`

Sin frame de Figma — no existía un checklist de selección múltiple en el kit (surgió al armar `UsuarioFormulario`, bloque "Accesos y permisos": Empresas/Perfiles/Roles). Distinto de `ModuleAccessCard` (grilla de cards con ícono+acento, pensada para catálogos con identidad visual propia como los módulos) — acá el catálogo es una lista simple de nombres sin ícono/acento por ítem, así que una lista liviana encaja mejor que forzar cards.

```jsx
import CheckboxList from '../../components/CheckboxList/CheckboxList.jsx';

<CheckboxList
  items={[{ id: 'admin', label: 'Administrador', description: 'Acceso total a la configuración del sistema' }]}
  selectedIds={perfilIds}
  onChange={setPerfilIds}
  searchPlaceholder="Buscar perfil..."
/>
<CheckboxList items={...} selectedIds={...} onChange={...} disabled />
```

- **Controlado** (`selectedIds`/`onChange`), a diferencia de la selección de `DataGrid` (semi-controlada/transitoria) — acá el formulario que lo usa necesita persistir la selección al guardar, así que no puede vivir solo como estado interno.
- Buscador interno (mismo criterio que el de `DataGrid`): filtra la vista por `label`/`description`, no afecta `selectedIds` — ítems ocultos por el filtro se preservan seleccionados.
- **Sin "seleccionar todo" ni contador de seleccionados** — ambos se sacaron a pedido (en catálogos como Empresas/Perfiles/Roles, tildar todo de una y ver cuántos hay tildados no son acciones/datos que se usen). Si algún caso futuro necesita "seleccionar todo", es el mismo patrón indeterminate que ya usa `RowCheckbox` de `DataGrid` — no reusar `Checkbox`, que no lo soporta.
- **Cada ítem es un `Checkbox` liso, sin modificar** — a pedido, mismo formato exacto que "Inactivo"/"Bloqueado" en `UsuarioFormulario` (sin borde de fila, sin hover, sin look de grilla/tabla que tenía antes). El título + descripción se pasan como el prop `label` (que acepta cualquier nodo, no solo texto); la lista completa es simplemente `.items { display:flex; flex-direction:column; gap: var(--spacing-sm) }` apilando los `Checkbox` — nada de bordes/hover por fila.
- `disabled` se propaga al buscador y a cada `Checkbox` de fila — usado en modo `view` de formularios (ver `UsuarioFormulario`, `PerfilFormulario`).
- **`columns={2}`** — grilla de 2 columnas (`display: grid; grid-template-columns: 1fr 1fr`) en vez de una sola columna apilada, para catálogos largos donde el scroll vertical resultaba excesivo y el contenedor tenía ancho de sobra sin usar (patrón tipo Auth0 "Assign APIs"/Google Workspace para listas largas de checkboxes). Prop opcional, default `1` (columna única, comportamiento original) — es la pantalla la que decide si tiene sentido, no se activa automáticamente por cantidad de ítems. Usado hoy solo en "Módulos" de `PerfilFormulario` (~20 ítems); las 3 listas de "Accesos y permisos" en `UsuarioFormulario` (Empresas/Perfiles/Roles) siguen en 1 columna porque son catálogos cortos. Un ítem "impar" al final simplemente queda solo en la columna izquierda — el grid no necesita ningún ajuste extra para eso.

### `Modal` — `app/src/components/Modal/`

Sin frame de Figma — no existía un popup genérico en el kit (`TourPopup` es específico de anuncios multi-slide: alto fijo, dots, sin relación con esto). Surgió al armar `PerfilFormulario` (popup "Agregar concesionario", ver Módulos). Mismo mecanismo de overlay/cierre que `TourPopup` (click afuera compara `e.target === e.currentTarget`, tecla `Escape`, botón X) pero sin slides — una sola pantalla.

```jsx
import Modal from '../../components/Modal/Modal.jsx';
import ActionGroup from '../../components/ActionGroup/ActionGroup.jsx';

<Modal
  open={modalOpen}
  title="Agregar concesionario"
  onClose={() => setModalOpen(false)}
  footer={
    <ActionGroup
      aria-label="Acciones del diálogo"
      primary={{ label: 'Agregar', onClick: handleConfirm, disabled: !selection }}
      secondary={[{ label: 'Cancelar', onClick: () => setModalOpen(false) }]}
    />
  }
>
  {/* contenido — cualquier cosa, sin restricciones, mismo criterio que FormContainer */}
</Modal>
```

- **`children` es el body, sin restricciones** (mismo criterio que `FormContainer`/`Accordion`) — no sabe qué hay adentro (un `Select`, un formulario completo, texto). `footer` es un slot aparte (opcional — sin `footer` no se renderiza esa sección ni su divisor) para los botones de acción (usar `ActionGroup`: primario a la izquierda del grupo, el grupo alineado a la derecha del footer — antes Cancelar iba a la izquierda y el primario a la derecha), así el layout footer siempre queda alineado a la derecha sin que cada pantalla tenga que repetir ese wrapper.
- **No se monta si `open` es false** (`return null`), mismo criterio que `TourPopup` — quien lo usa decide cuándo mostrarlo, sin lógica propia de "primera vez" ni nada por el estilo.
- `z-index: 100` en el overlay — mismo valor que `TourPopup`, por encima de cualquier dropdown del `Sidebar` (`z-index: 20`). Si en algún momento coexisten un `Modal` y un `TourPopup` abiertos a la vez (no debería pasar en un flujo normal), quedan al mismo nivel — no está resuelto ese caso porque no hay un escenario real que lo necesite.

### `FileUpload` — `app/src/components/FileUpload/`

Sin frame de Figma — no existía un campo de carga de archivos en el kit (surgió al armar `EmpresaFormulario`: Logo + Certificado AFIP, ver Módulos).

```jsx
import FileUpload from '../../components/FileUpload/FileUpload.jsx';

<FileUpload
  label="Logo"
  value={logoFileName}
  onChange={(e) => setLogoFileName(e.target.files[0]?.name ?? '')}
  accept="image/*"
/>
<FileUpload label="Certificado AFIP" value={certificadoAfipFileName} onChange={...} disabled />
```

- **`<input type="file">` real, visualmente oculto** (mismo patrón de accesibilidad que `Checkbox`/`RowCheckbox`: el control real no se ve, un `<label htmlFor>` hace de botón visible que lo activa) — box del botón con el mismo `border`/`radius-sm`/tipografía que `TextField`/`Select`, para que las tres convivan en una fila sin desentonar.
- **`value` es el nombre del archivo (string), no el `File`** — el kit no tiene backend, no hay nada real que subir; se guarda solo el nombre para mostrarlo, mismo criterio que el resto de los datos de ejemplo del kit (ver `INITIAL_EMPRESAS` en `App.jsx`). `onChange` reenvía el evento nativo del input (mismo contrato que `TextField`/`Select`) — quien lo usa hace `e.target.files[0]?.name`.
- `accept` se pasa directo al input nativo (filtra qué ofrece el selector del navegador, no valida nada del lado del componente).

### `ToggleIcon` — `app/src/components/ToggleIcon/`

Origen: Figma, component set **`Toggle Icon`** (657:39, página *Toggle Icon*) — `State=Inactive` / `State=Active`, 20×20. Documentación: *Toggle Icon - Spec* (660:2, uso y reglas) y *Toggle Icon - Handoff Dev* (663:5, API/tokens/estados) — el código sigue el handoff. **El nombre en Figma es `Toggle Icon` y en código `ToggleIcon`** (antes se llamaba `FavoriteButton`; se renombró para que coincidan — resuelve la Pregunta abierta #1 del handoff). Las props del template que lo usa (`favorite`/`onToggleFavorite` en `LayoutMaestroDataGrid`) conservan su nombre: describen el caso de uso (favoritos), no el componente. Surgió al pedirse el marcador de favorito en la pantalla principal de un maestro/proceso (la primera que se abre al clickear un ítem del sidebar — ej. `Buque` en `/buques` — no sus formularios de alta/edición/vista).

```jsx
import ToggleIcon from '../../components/ToggleIcon/ToggleIcon.jsx';

<ToggleIcon favorite={favoriteHrefs.includes('/buques')} onToggle={() => onToggleFavorite('/buques')} />
```

- **Controlado** (`favorite`/`onToggle`), no semi-controlado — a diferencia de `Accordion`/`Sidebar` (que sí manejan su propio estado con un `default*`), acá el estado tiene que vivir en `App.jsx`: la Home de cada módulo necesita leer el mismo set de favoritos para armar su "Acceso rápido" (ver `utils/favorites.js` y la entrada de `LayoutHomeModule` abajo), así que el botón no puede ser dueño de su propio estado interno.
- **Ícono**: `bi-star` (contorno, sin marcar) / `bi-star-fill` (relleno, marcado) — **excepción explícita y a pedido a la regla de íconos "siempre sin relleno"** — trazos estándar de Bootstrap Icons en `icons.jsx`, renderizados a 20px con `aria-hidden="true"` (decorativo). En Figma la estrella es un vector propio dentro de `Toggle Icon` (no hay estrellas en la página *Icon*; pasar a instancia cuando existan — Pregunta abierta #6).
- **Accesibilidad (handoff, sección 06)**: patrón APG *toggle button* — `aria-pressed={favorite}` comunica el estado y la etiqueta es **fija**, `aria-label="Favorito"` (antes cambiaba entre "Agregar a favoritos"/"Quitar de favoritos" junto con `aria-pressed`, y el lector anunciaba acción + estado a la vez). Se puede pisar pasando `aria-label`; cualquier otra prop nativa de `<button>` se propaga (`...rest`). ⚠️ Etiqueta fija = decisión recomendada por el handoff, pendiente de validar con el equipo (Pregunta abierta #4).
- **Foco visible**: `:focus-visible` con anillo `outline: var(--border-width-focus) solid var(--color-border-focus)`, `outline-offset: 2px` — el `all: unset` anterior eliminaba el anillo del navegador y el foco no se veía. Es la propuesta del handoff, todavía sin diseño en Figma (Pregunta abierta #2).
- **Área clicable**: el ícono sigue midiendo 20×20 (tamaño visual de Figma), pero un `::after` con `inset: -2px` amplía el área a 24×24 (mínimo AA) y `@media (pointer: coarse)` la sube a 44×44 (`inset: -12px`, supuesto pendiente de validar con diseño). `all: unset` borra `position`, por eso `position: relative` se declara después.
- **Sin diseño todavía (no inventado)**: Hover (solo `cursor: pointer`), Pressed y Disabled — no existen en Figma ni como prop (Preguntas abiertas #2 y #10).
- **Color**: `var(--color-yellow)`, siempre — no cambia entre marcado/sin marcar (solo cambia el ícono contorno vs. relleno). Token nuevo en `tokens.css`, resuelto contra la variable primitiva real de Figma `color/yellow/500` (`#eab308`, vía `use_figma`/`importVariableByKeyAsync` — no adivinado). Coincide en hex con `--color-warning-default` pero se mantiene como variable separada a propósito: son semánticamente distintos (estado de alerta vs. marcador de favorito), mismo criterio ya documentado en `tokens.css` para `--color-accent-*-subtle` vs. `--color-*-subtle`.
- **No es un componente de uso libre en cualquier pantalla** — hoy solo lo renderiza `LayoutMaestroDataGrid` (ver esa entrada en Templates), y solo si se le pasa `onToggleFavorite` (prop opcional — sin ella, ni se importa el ícono ni ocupa espacio). Por eso las pantallas de Main (`Usuarios`/`Perfiles`/`Empresas`, que también usan `LayoutMaestroDataGrid`) no lo tienen: a pedido explícito, el favorito es un concepto de "maestro/proceso de un módulo de negocio", no de las pantallas administrativas de Main.
- Ícono nuevo en `icons.jsx`: `bi-upload` (aproximación dibujada a mano, mismo trazo que `bi-download` con la flecha invertida — sin equivalente en Figma todavía).

### `DataGrid` — `app/src/components/DataGrid/`

Origen: Figma, página *Data Grid* (304:388) — header row + filas con celda de checkbox, columnas de texto, columna de estado (hoy `Badge`, ver esa entrada) y celda de acciones (editar/eliminar/compartir). El buscador arriba de la tabla **no** está en el frame de Figma — se agregó a pedido, reusando `TextField` (sin label).

```jsx
import DataGrid from '../../components/DataGrid/DataGrid.jsx';
import Badge from '../../components/Badge/Badge.jsx';

<DataGrid
  columns={[
    { key: 'nombre', label: 'Nombre' },
    { key: 'descripcion', label: 'Descripción' },
    { key: 'estado', label: 'Estado', render: (row) => <Badge type={row.estado.type}>{row.estado.label}</Badge> },
    // { key: 'x', label: 'X', width: 120 } — width fijo opcional; sin width, la columna es flex:1 (como en Figma)
  ]}
  rows={[
    { id: 1, nombre: 'Ana Torres', descripcion: 'Informe mensual', estado: { label: 'Verificado', type: 'success' } },
    // id es obligatorio — se usa para selección y como key de React
  ]}
  selectable                          // agrega la columna de checkbox; default false — NO pasarlo salvo que el requerimiento lo pida
  onSelectionChange={(ids) => ...}    // ids = array de row.id seleccionados
  actions={[
    { key: 'view', icon: 'bi-eye', label: 'Visualizar', onClick: (row) => ... },
    { key: 'edit', icon: 'icon-edit', label: 'Editar', onClick: (row) => ... },
    // array libre — cualquier ícono de icons.jsx, cualquier cantidad; la columna "Acciones" solo aparece si el array no está vacío
  ]}
  searchPlaceholder="Buscar..."       // default 'Buscar...'
  emptyMessage="No se encontraron resultados."
/>
```

- **`searchable` (default `true`)**: con `false` no se dibuja el buscador ni su divisor (lo usa `ChildGridSection`, que en Figma no lo tiene).
- **Sin checkbox en la primera columna por defecto**: ninguna grilla lleva `selectable` salvo que el requerimiento pida seleccionar filas (selección múltiple, acciones en lote, etc.). Ni `DataGrid` ni `LayoutMaestroDataGrid` lo activan por su cuenta (`selectable = false`), y ninguna pantalla actual lo pasa.
- **Buscador (`TextField` reusado, sin label)**: filtra las `rows` en el cliente, buscando el término (case-insensitive) en el texto de **todas** las columnas — incluida `estado`, comparando contra `.label` cuando la celda es un objeto (`{ label, type }`) en vez de string. No hace falta marcar columnas como buscables. Vive **dentro** del mismo contenedor con borde/radio que la tabla (no arriba, en un toolbar aparte) — alineado a la derecha, con un divisor (`border-bottom`) que lo separa del header row, igual que el resto de las filas.
- **Selección semi-controlada** (mismo criterio que `Sidebar`/`Accordion`): el componente maneja el `Set` de ids seleccionados con `useState` y avisa por `onSelectionChange`; no hay prop `selected` controlada todavía — agregarla si algún caso de uso real la necesita. El checkbox del header soporta estado indeterminado (algunos, no todos, de las filas *visibles tras el filtro* están seleccionados) y el "seleccionar todo" opera solo sobre esas filas visibles — la selección de filas ocultas por el buscador se preserva.
- **Columna de estado → `Badge`** (`components/Badge/`, ver esa entrada). `DataGrid` no exporta ningún chip propio — el `StatusChip` que vivía acá se eliminó y fue reemplazado por `Badge` en todas las grillas (`Buque`, `Usuarios`, `Perfiles`, `Empresas`), junto con sus tokens (`--color-success-*`, `--color-warning-*`; `--color-danger-subtle` se conservó porque lo usa `ChatInput`).
- **Fila `Hover`/`Selected`**: a diferencia del markup de Figma (que pinta el fondo celda por celda), acá el fondo vive en el contenedor de la fila (`background: transparent` en cada celda) — mismo resultado visual, menos repetición. `Selected` usa `--color-surface-selected`: es un estado puramente por selección (no hay concepto de fila "activa" separado).
- **`actions` es un array genérico** (`{ key?, icon, label, onClick }`), no las 3 acciones fijas de Figma (editar/eliminar/compartir) — el frame original solo tenía esas tres, pero un maestro real puede necesitar otra combinación. **A pedido, el default de cualquier maestro nuevo (mientras no se indique lo contrario) son SIEMPRE "Visualizar" (`bi-eye`) + "Editar" (`icon-edit`)** — no "Editar"/"Eliminar" ni las 3 de Figma (ej. `Buque` y `Usuarios` usan este default). `icon-edit` en `icons.jsx` es trazado vectorial exacto del asset de Figma de esta celda (eliminar y compartir pasaron a `bi-trash`/`bi-share` outline oficiales, regla de íconos sin relleno); `bi-eye` (visualizar) no tiene equivalente en el frame de Data Grid, así que se usa el `eye` oficial de Bootstrap Icons.
- El checkbox (`RowCheckbox`, interno del archivo) es un `<input type="checkbox">` real posicionado sobre una caja visual — accesible por teclado/lector de pantalla, no un `div` con `onClick`. El tick es el trazo exacto de Figma (`Frame` dentro de la celda checkbox seleccionada, 278:6).
- Ancho fijo solo en columnas checkbox (56px) y acciones (132px), igual que Figma — el resto de las columnas son `flex:1 0 0` a menos que la screen pase `width` explícito por columna.

### `FormContainer` — `app/src/components/FormContainer/`

Origen: Figma, página *Form Container* (469:48), componente `Form/Container` en su versión actual (título + línea divisoria + Content — sin fila de acciones, esa sección se borró en Figma en un ajuste posterior).

```jsx
import FormContainer from '../../components/FormContainer/FormContainer.jsx';
import TextField from '../../components/TextField/TextField.jsx';

<FormContainer title="Nuevo proveedor">
  <TextField label="Nombre" value={...} onChange={...} />
  <TextField label="CUIT" value={...} onChange={...} />
</FormContainer>
```

- Props: `title`, `children` (el Content — cualquier cosa, sin restricción).
- **Sin ícono en el header** — a pedido, se sacó el badge de ícono a la izquierda del título (tanto acá como en `Accordion`); el header es solo texto. El prop `icon` ya no existe — se quitó de la firma del componente en vez de dejarlo aceptado-pero-ignorado, y se limpiaron todos los call sites (`BuqueFormulario`, `UsuarioFormulario`, `PerfilFormulario`, `EmpresaFormulario`, y `formIcon` en `LayoutMaestroBasico`, que ya no existe tampoco). Si se reintroduce en el futuro, hacerlo a propósito, no reabrir el prop sin revisar por qué se sacó.
- Estructura idéntica a la mitad de arriba de `Accordion` (mismo tamaño de título, mismo divisor, mismo padding) pero sin flecha ni collapse — es siempre-expandido. No se compartió CSS entre los dos todavía (mismo criterio que `CardMetric`/`CardQuickAccess`/`CardModule`: "cada una tiene su propio CSS", no se refactorizó a una base común).
- **Título: 16px / 600 (Semi Bold) / line-height 120%, no los 20px de `Heading/H3` "puro".** El nodo `Title` del símbolo `Form/Header` en Figma (464:1294) tiene aplicado el estilo `Heading/H3` pero con un **override local de tamaño** (20px→16px) — el estilo de base quedó vinculado nominalmente, pero el tamaño real que se ve y se usa es 16px (weight y line-height sí coinciden con la base del estilo, no tienen override). Se detectó leyendo `fontSize` directo del nodo en Figma (no alcanza con mirar el nombre del text style — hay que chequear el valor resuelto). Antes de este ajuste el código tenía 20px a secas, asumiendo que "aplica el estilo" significaba "usa el valor de base del estilo" — no siempre es así.
- **`FormContainer` es el contenedor default del kit — nunca queda contenido suelto, sin wrapper, en una pantalla.** Ver la sección **"Cuándo usar cada patrón de organización de contenido"** más abajo para la regla de decisión completa (`FormContainer`/`Accordion`/`Tabs`/`Progress Tracker`/`Modal`, con fuentes).

**Notas de la etapa en Figma (por si se retoma el `Form/Container` de Figma para otra cosa):** ahí `Content` es una property `SLOT` a nivel de esquema (Figma no deja agregar contenido libre dentro de una instancia por script — `"Cannot move node. New parent is an instance or is inside of an instance"`), y quedaron 4 properties huérfanas (`Title`/`Description`/`Show Description`/`Show Secondary Action`) sin conectar a ninguna capa visible desde que se editó a mano. Ninguna de las dos cosas aplica acá — en React `Content` es `children` sin restricciones, y `title` es un prop normal.

### `FormRow` — `app/src/components/FormRow/`

Figma: `Fields row` dentro de `Form Section` (696:2). Fila de campos: grilla de `columns` columnas iguales (default 3), 16px entre sí. Con menos campos que columnas, cada uno mantiene su ancho de 1/3 para alinear con las otras filas.

```jsx
<FormRow><TextField label="Código" /><TextField label="Denominación" /><TextField label="Tipo" /></FormRow>
```

### `ChildGridSection` — `app/src/components/ChildGridSection/`

Origen: Figma, `Child Grid Section` (733:198), página *Maestros* (M-04). Card con la misma piel que `FormContainer` (Form Section): título + botón `Agregar` (outline) a la derecha, divisor, y un `DataGrid` **sin buscador** (`searchable={false}` por default). Las filas hijas se editan en Drawer/Modal, no inline (resuelve la pantalla desde `onAdd`/`actions`).

```jsx
<ChildGridSection title="Contactos" onAdd={openDrawer} columns={[...]} rows={[...]} actions={[{ icon: 'bi-eye', label: 'Visualizar', onClick }, { icon: 'icon-edit', label: 'Editar', onClick }]} />
```

`Form Section` de Figma (antes *Form Container*) = `FormContainer`; no hay componente aparte.

### `Accordion` — `app/src/components/Accordion/`

Origen: Figma, página *Accordion*. **La página estaba vacía y el componente se reconstruyó en Figma a partir de este código** (component set `Accordion`, nodo 851:29: variantes `Expanded=False/True`, propiedad de texto `Title`, tokens enlazados, `ChevronRight` rotado 90° al expandir; frame de ejemplos `Accordion / Ejemplos`). Falta spec/handoff y dibujar el estado Focus. Referencia previa: (478:22) — mismo formato de card que `Form/Container` (mismos tokens: `surface/card`, `color/border/default`, `radius/card`, drop-shadow, `spacing/lg`), más una flecha para desplegar. Demo en la misma página: "Datos del buque" (Nombre del buque, IMO, Bandera, Eslora), con `Text field` real dentro del Content.

```jsx
import Accordion from '../../components/Accordion/Accordion.jsx';

<Accordion title="Datos del buque" defaultExpanded={false} onToggle={(expanded) => ...}>
  {/* cualquier contenido — Text Field, Checkbox, otro Accordion, lo que sea */}
</Accordion>
```

- **Sin ícono en el header** — a pedido, mismo cambio que `FormContainer` (ver esa entrada): el header del botón es solo `title` + flecha, ya no lleva el badge de ícono a la izquierda. El prop `icon` se quitó de la firma del componente.
- **Título: 16px / 600 / line-height 120%, no los 20px "de manual" de `Heading/H3`** — mismo override local detectado en el nodo de Figma, ver la nota completa en la entrada de `FormContainer`.
- **`Expanded` de Figma no es un prop de estado controlado** — es semi-controlado, mismo criterio que `Sidebar`: `defaultExpanded` (default `true`, igual que en Figma) siembra el estado inicial, el propio componente lo maneja con `useState` a partir de ahí, y avisa por `onToggle(expanded)`. Clickear el header togglea.
- **`children` es el Content** — en Figma esto es una instancia reusada de `Form/Content` (con la limitación de que Figma no deja meter contenido libre dentro de una instancia por script); en React no hay ninguna limitación, `children` es simplemente lo que sea que la pantalla necesite ahí.
- La flecha rota con CSS real (`transform: rotate(90deg)` cuando está expandido) y el contenido se expande/colapsa con la misma animación `grid-template-rows: 0fr → 1fr` que ya usa `Sidebar` para sus grupos de nav — no hay nada de esto en Figma (ahí la flecha queda fija y el estado se ve como dos instancias separadas), es interacción pura de código.

### `Tabs` — `app/src/components/Tabs/`

Origen: Figma, página *Tabs* (armado a partir de una captura de referencia, no de un link de Figma) — fila de tabs con indicador (línea de 2px) debajo del tab activo + borde inferior a todo el ancho.

```jsx
import Tabs from '../../components/Tabs/Tabs.jsx';

<Tabs
  items={[
    { id: 'datos', label: 'Datos generales' },
    { id: 'contactos', label: 'Contactos' },
    { id: 'documentos', label: 'Documentos' },
  ]}
  value={activeTab}
  onChange={setActiveTab}
/>
```

- **Totalmente controlado** (`value`/`onChange`, mismo criterio que `LanguageSelector`) — a diferencia de `Sidebar`/`Accordion` (semi-controlados), acá tiene más sentido que la pantalla sea dueña del tab activo, porque normalmente coordina qué panel de contenido mostrar al lado.
- El indicador (`.indicator`) tiene `width: 100%` dentro de un tab que hace *hug* de su propio contenido — así el ancho de la línea siempre matchea el ancho del texto, igual que en Figma, sin necesidad de medir nada a mano.
- Sin tokens nuevos — reusa `--color-primary-default`, `--color-text-secondary`, `--color-border-default`, `--color-border-focus`, `--spacing-sm/md/lg/xl` ya existentes.
- **Sin `padding-top` propio** — tenía un `padding-top: var(--spacing-md)` en `.tabs` que sumaba a los `var(--spacing-lg)` de gap que ya pone `FormContainer` entre su `.divider` y `.content` (único lugar donde se usa `Tabs` hoy, dentro de "Accesos y permisos" de `UsuarioFormulario`), dejando el espacio entre la línea divisoria y las tabs visiblemente más grande que el resto de los gaps del formulario (24px + 16px = 40px). Se sacó porque `Tabs` no necesita separación propia respecto de lo que venga antes — eso es responsabilidad de quien lo contiene (acá, `FormContainer`) — y hoy no hay otro caso de uso que dependiera de ese padding.

### Componentes del chatbot de IA (`ChatSuggestionCard`, `ChatMessage`, `ChatResultCard`, `ChatInput`, `ChatConversationList`)

Sin frame de Figma — armados a partir de una captura de referencia (pantalla "Pharo IA"), no de un link de Figma. Se usan juntos, compuestos por el template `LayoutChat` (ver Templates abajo) — no hace falta armarlos a mano en una pantalla nueva, solo pasarle datos a `LayoutChat`/`AsistenteIA`.

#### `ChatSuggestionCard` — `app/src/components/ChatSuggestionCard/`

```jsx
<ChatSuggestionCard
  icon="bi-bar-chart"
  accent="violet"        // misma paleta de 8 nombres + neutral que CardModule
  title="Obtener resumen de cuenta"
  description="Consultá el estado financiero de un cliente"
  onClick={() => ...}
/>
```

- Mismo patrón visual que `CardModule` (icon badge con acento + título + descripción) pero a mayor escala (padding `--spacing-lg`, título 14px/600, descripción 13px) — es una card "hero" para el estado vacío del chat, no para una grilla densa. Se armó como componente propio en vez de reusar `CardModule` tal cual porque la escala de tipografía es otra — mismo criterio que ya separa `CardMetric`/`CardQuickAccess`/`CardModule` entre sí ("cada una su propio CSS").

#### `ChatMessage` — `app/src/components/ChatMessage/`

```jsx
<ChatMessage role="user" text="buscar cliente Martín Comparetto" time="12:36 p. m." />

<ChatMessage role="assistant" text="Cliente encontrado en el sistema." time="12:36 p. m." assistantName="Pharo IA">
  <ChatResultCard ... />   {/* children opcional — contenido estructurado debajo del texto */}
</ChatMessage>
```

- `role="user"`: burbuja azul (`--color-primary-default`) alineada a la derecha, texto blanco, hora debajo a la derecha.
- `role="assistant"` (default): avatar circular con ícono `bi-chat` + burbuja blanca bordeada alineada a la izquierda, `assistantName · hora` debajo. `children` es el slot de contenido estructurado (ej. `ChatResultCard`) — sin restricción, mismo criterio que `FormContainer`/`Accordion`.

#### `ChatResultCard` — `app/src/components/ChatResultCard/`

```jsx
<ChatResultCard
  title="Cliente Martín Comparetto"
  rows={[{ label: 'Nombre', value: 'Martín Comparetto' }, { label: 'CUIT', value: '20-12345678-9' }]}
  actions={[{ label: 'Descargar PDF', icon: 'bi-download', onClick: () => ... }]}
/>
```

- Card de resultado estructurado para incrustar dentro de un `ChatMessage` del asistente — `rows` es un array libre de `{ label, value }` (lista de definición, no una tabla), `actions` un array libre de botones en el footer. No está atado a ningún dominio (cliente/pedido/factura) — cualquier módulo arma su propia respuesta mock con esta misma card (ver `AsistenteIA` abajo).

#### `ChatInput` — `app/src/components/ChatInput/`

```jsx
<ChatInput onSend={(text, attachments) => ...} disabled={isResponding} />
```

- Textarea con auto-resize (hasta 160px) + toolbar: adjuntar (`bi-paperclip`, abre el file picker nativo del navegador — **funciona de verdad**, no es un mock: `attachments` en `onSend` son objetos `File` reales) y mic (`bi-mic`) + botón de enviar circular (`bi-send`, deshabilitado sin texto ni adjuntos).
- **Enter envía, Shift+Enter inserta línea nueva** (`onKeyDown`, mismo patrón que cualquier chat) — el placeholder ya lo aclara.
- **El mic es un toggle visual sin transcripción real** (`aria-pressed`, ícono pasa a rojo + hint "Escuchando…") — no hay integración de voz todavía (necesitaría un backend/API externa). Documentado acá para que quede claro que no es un bug si no transcribe nada.
- Los adjuntos elegidos se muestran como chips removibles arriba del textarea y, al enviar, se anexan al texto del mensaje como `[Adjunto: nombre.ext]` (`buildDisplayText` en `AsistenteIA.jsx`) — así el intercambio queda legible en el historial sin necesidad de renderizar previews de archivo.

#### `ChatConversationList` — `app/src/components/ChatConversationList/`

```jsx
<ChatConversationList
  conversations={[{ id: 'c1', title: 'Buscar cliente Martín Comparetto', group: 'Hoy' }]}
  activeId={activeConversationId}
  onSelect={(id) => ...}
  onNewChat={() => ...}
/>
```

- Panel "Conversaciones": header con ícono de búsqueda que revela un `TextField` (filtra `conversations` por título, case-insensitive, en cliente — mismo criterio que el buscador de `DataGrid`) + botón "Nuevo chat" (`Button` solid, ancho completo) + lista agrupada por `group` (ej. "Hoy"/"Ayer"/"Última semana" — el componente no ordena por fecha real, agrupa preservando el orden en que llega `conversations`, la pantalla que lo usa manda los datos ya ordenados).
- Ítem activo: `--color-surface-selected` + negrita, mismo criterio que la fila seleccionada de `DataGrid`.

### `TourPopup` — `app/src/components/TourPopup/`

Sin frame de Figma — armado a partir de una captura de referencia (popup "Nuevo buscador con IA integrada"), no de un link de Figma. **Genérico**: no sabe nada de Pharo ni de ningún feature puntual — sirve para cualquier popup de anuncio/tour multi-slide en cualquier módulo, no solo el Product Tour de Main (ver ese uso en Módulos → `Main/Home`).

```jsx
import TourPopup from '../../components/TourPopup/TourPopup.jsx';

<TourPopup
  open={tourOpen}
  slides={[
    { title: 'Chatbot con IA integrada', description: 'Lorem ipsum...', icon: 'bi-chat', accent: 'indigo' },
    // ...cualquier cantidad — dots/footer se adaptan solos
  ]}
  onClose={() => ...}          // X, click en el overlay, Escape, o el botón del último slide
  nextLabel="Siguiente"        // default
  finishLabel="Comenzar"       // default — label del botón "siguiente" en el último slide
  previousLabel="Anterior"     // default
/>
```

- **No se monta si `open` es false o `slides` está vacío** (`return null`) — quien lo usa decide cuándo mostrarlo, el componente no tiene lógica de "primera vez"/localStorage adentro (eso es responsabilidad de la pantalla, ver `Main/Home`).
- El slide actual es estado interno (`useState`, arranca en 0 y se resetea a 0 cada vez que `open` pasa a `true` — así reabrir el popup siempre arranca desde el primer slide). Los dots (centrados, debajo de la imagen, arriba de la línea) son clickeables (saltan a cualquier slide), no solo indicadores.
- **Alto fijo** (`height: 560px` en `.card`, no `min-height`) — todas las slides miden exactamente lo mismo sin importar el largo de `title`/`description`. Para garantizarlo, `.title` está clampeado a 1 línea y `.description` a 2 líneas (`-webkit-line-clamp`, `overflow: hidden` + ellipsis) — un texto que no entra se trunca con `…` en vez de estirar la card. Si se cambia algún token/tamaño de estos, reajustar el valor a mano (mismo criterio que el alto fijo de `CardMetric`).
- **Línea divisoria borde a borde**: mismo patrón que `FormContainer` (`Accordion` no lo usa, pero es el mismo truco) — `.card` tiene `padding: var(--spacing-xl) 0` (vertical solo) y cada sección interna (`.header`, `.media` vía `margin`, `.dots`, `.footer`) agrega su propio padding/margin horizontal; `.divider` no tiene ninguno de los dos, así que ocupa el 100% del ancho del popup. Verificado con `getBoundingClientRect()`: el ancho de `.divider` coincide exacto con el de `.card`.
- **Footer**: `Button` `variant="outline"` "Anterior" (izquierda, `disabled` en el primer slide) + `Button` `variant="solid"` "Siguiente"/"Comenzar" (derecha) — mismo lugar donde antes estaban los dots, que se movieron arriba de la línea. **Ambos botones llevan `key={`prev-${index}`}`/`key={`next-${index}`}`** — fuerza a React a montar un nodo DOM nuevo en cada cambio de slide en vez de reusar el mismo botón parcheándole solo el label. Se agregó a propósito tras detectar, durante las pruebas de este ajuste, que el botón "Siguiente" podía quedar con `background-color` transparente (texto blanco invisible sobre fondo blanco) al reusar el mismo nodo entre slides — reproducible tanto en dev como en build de producción, ajeno a `backdrop-filter`/transiciones/StrictMode (se descartaron uno por uno). Con el `key` por slide el bug no volvió a aparecer en ninguna prueba. Si en el futuro se notara algo similar en otro componente con transición de `background-color` reusado entre renders rápidos, este es el fix de referencia.
- Se cierra (llamando a `onClose`) de 4 formas: botón X, click en el overlay (fuera de la card — compara `e.target === e.currentTarget`, un click dentro de la card no lo dispara por bubbling), tecla `Escape`, o el botón del footer en el último slide (ahí cambia de label a `finishLabel`).
- `slide.icon`/`slide.accent` arman un badge circular grande a modo de placeholder visual (`.media`) — mismo sistema de 8 acentos + `neutral` que `CardModule`/`ChatSuggestionCard`. No hay imágenes reales todavía; cuando existan assets por feature, esto es lo que hay que reemplazar (ver nota en `config/productTour.js`).
- `z-index: 100` en el overlay — por encima de cualquier dropdown del `Sidebar` (que usa `z-index: 20`).

## Cuándo usar cada patrón de organización de contenido

Regla de decisión para elegir entre `FormContainer`, `Accordion`, `Tabs`, **Progress Tracker** y `Modal` — documentada también en Figma, página *Guidelines*, con las mismas fuentes citadas ahí. No es "cuánto contenido hay" — es qué relación tiene ese contenido con la tarea de la pantalla.

**El marco: 3 preguntas, en dos niveles distintos.** Progress Tracker no compite con los otros tres en el mismo nivel — es una decisión de **arquitectura de toda la pantalla** (¿esta pantalla completa es un wizard de varios pasos, o una página plana de una sola vista?), que se responde primero. `FormContainer`/`Tabs`/`Accordion` (y `Modal`, para algo puntual) son decisiones **por sección**, dentro de una página ya plana — o dentro de cada paso individual de un wizard, si se eligió Progress Tracker.
1. ¿Es alta nueva, secuencial/dependiente y larga? (arquitectura de pantalla completa → Progress Tracker)
2. Dentro de una página plana: ¿se abre aparte, o se queda en la misma vista? (overlay/navegación vs. in-page)
3. Si se queda in-page: ¿el orden importa entre sus secciones? (independiente → Tabs; sin orden explícito → FormContainer/Accordion según si es central u opcional)

### Progress Tracker (Wizard / Stepper) — **patrón sin componente propio todavía**

Decisión de **arquitectura de toda la pantalla**, se responde primero. El usuario avanza paso a paso (Paso 1 de 4), un paso a la vez, con Atrás/Siguiente — la diferencia con `Tabs` es que **el orden importa**; la diferencia con `Accordion` es que los pasos no conviven abiertos en la misma pantalla. **Cuándo sí:** el proceso es genuinamente secuencial/dependiente (el paso 2 necesita datos del paso 1); es un **alta nueva**, no edición; el formulario es tan largo que mostrarlo todo junto abruma y partirlo en pasos reduce el esfuerzo percibido; se quiere validar cada paso antes de avanzar. **Cuándo no:** edición de un registro existente (forzar a un admin a recorrer 4 pantallas para corregir un teléfono es mal UX — ahí gana la pantalla plana con `FormContainer` que ya usamos en `BuqueFormulario`/`UsuarioFormulario`/`PerfilFormulario`/`EmpresaFormulario`); las secciones son independientes entre sí sin dependencia de datos (eso es `Tabs`); es una acción chica y de baja frecuencia (eso es `Modal`). **Regla concreta para el kit:** este patrón, si se usa, aplica solo a `mode === 'create'` — nunca a `edit`/`view`. Fuente: sin artículo de NN/g dedicado — se apoya en consenso general de UX, con un dato puntual de NN/g (ver `Modal` abajo): "romper un proceso complejo en pasos digeribles vía wizards" es uno de sus 7 casos legítimos para usar un modal, es decir, un wizard puede vivir dentro de un `Modal` (tareas cortas) o como página completa (tareas largas). **No existe todavía como componente en el kit** — ninguna pantalla lo necesitó hasta ahora (todas las pantallas de alta del kit son lo bastante cortas, o ya están resueltas con `FormContainer`/`Accordion`); si en el futuro hace falta, construirlo y documentarlo acá, no improvisarlo dentro de una pantalla.

### `Modal`

Dentro de una página plana (no eligió Progress Tracker), la primera pregunta por bloque de contenido: ¿se abre aparte? Overlay que bloquea el resto de la pantalla, exige una acción antes de seguir. **Cuándo sí** (NN/g, [*Modal & Nonmodal Dialogs*](https://www.nngroup.com/articles/modal-nonmodal-dialog/), 7 casos): prevenir un error crítico/irreversible; pedir un dato esencial para continuar algo que el usuario inició; segmentar un proceso complejo (wizard); pedir datos de alto valor. **Nunca** para contenido no esencial (newsletters, marketing). Ejemplo real: "Agregar concesionario" en `PerfilFormulario` — calza en "pedir un dato esencial para continuar una acción que el usuario mismo inició".

### `FormContainer`

Si el contenido se queda in-page (no es Modal): card fija, siempre visible, sin mecanismo para ocultarse. **Cuándo:** el contenido es central — la mayoría de los usuarios necesita ver o completar la mayor parte. **Cuándo no:** si es algo que la mayoría va a saltear, ahí entra `Accordion`. Fuente: regla propia del kit, respaldada por el caso "evitar" de NN/g en Accordion (la información esencial nunca debe depender de que alguien abra un panel para encontrarla). Es el **contenedor default** — nunca queda contenido suelto, sin wrapper, en una pantalla; en cualquier caso que no califique para los otros patrones, el fallback es `FormContainer`.

### `Tabs`

Switches de contenido en la misma página, un panel visible a la vez — pero **sin orden**, el usuario salta libremente. **Cuándo sí** (NN/g, [*Tabs, Used Right*](https://www.nngroup.com/articles/tabs-used-right/)): agrupaciones claras y pocas; el usuario **no** necesita comparar dos secciones a la vez. **Cuándo no:** demasiadas opciones (carrusel de tabs, nadie las ve); contenido que no entra en una etiqueta corta. Implementación: ≥2 señales de tab activa, una sola fila, pegadas al panel que controlan, etiquetas de 1-2 palabras, nunca mezclar tabs de navegación (cambian de página) con tabs de contenido (se quedan, cambian el panel). Ejemplo real: Empresas/Perfiles/Roles en `UsuarioFormulario` — auditado contra el artículo campo por campo, cumple las 8 reglas sin necesitar ajustes.

### `Accordion`

Card colapsable dentro de la misma página; pueden convivir varios paneles abiertos a la vez. **Cuándo sí** (NN/g, [*Accordions on Desktop*](https://www.nngroup.com/articles/accordions-on-desktop/)): pocas piezas de info que la mayoría va a saltear; el contenido de cada sección es independiente (no hace falta verlas juntas); el contenido es largo relativo al viewport. **Cuándo no:** el usuario necesita la mayoría o todo el contenido; hay poco contenido (genera sensación de vacío); **nunca** para algo obligatorio — un campo requerido dentro de un panel colapsado arriesga esconder un error de validación. Implementación: ≥2 señales de estado (chevron + texto), permitir varios paneles abiertos si aplica. Ejemplo real en el kit: "Certificados y documentos" en `EmpresaFormulario` (genuinamente diferible — la mayoría no tiene el certificado a mano al crear la empresa).

### Árbol de decisión completo

```
¿Es un alta nueva (no edición), con pasos que dependen entre sí, y larga?
├─ Sí → Progress Tracker (arquitectura de TODA la pantalla — un wizard).
│       Dentro de cada paso, se vuelve a aplicar este mismo árbol para
│       decidir cómo se organiza el contenido de ESE paso puntual.
└─ No → página plana de una sola vista. Por cada bloque de contenido:
   ¿Se abre aparte de la pantalla actual (overlay/navegación)?
   ├─ Sí, bloqueando el fondo, para pedir un dato esencial puntual → Modal
   └─ No, se queda en la misma pantalla
      ├─ ¿El usuario necesita ver/completar esto siempre? → FormContainer
      ├─ ¿Hay 2+ secciones paralelas, sin orden, que se miran de a una? → Tabs
      └─ ¿Es un bloque único que la mayoría va a saltear? → Accordion
         (si ninguna de las tres aplica → FormContainer, el default)
```

## Templates disponibles (`app/src/templates/`)

### `LayoutBase` — `app/src/templates/LayoutBase/`

Sidebar + TopBar + área de contenido. Es el esqueleto de cualquier pantalla interna del sistema (todo lo que no sea login/pantallas públicas).

```jsx
import LayoutBase from '../../templates/LayoutBase/LayoutBase.jsx';

<LayoutBase
  sidebarProps={{ groups, companies, user, /* ...ver props de Sidebar */ }}
  onSearch={(query) => ...}        // opcional — se pasa directo al Buscador del TopBar
  searchPlaceholder="..."          // opcional — override del placeholder default del Buscador
  fullBleed                        // opcional, default false — ver abajo
>
  {/* contenido específico de la pantalla */}
</LayoutBase>
```

- **`fullBleed`**: por default `.content` tiene `padding: var(--spacing-xl)` y fondo `--color-surface-hover` (así arrancan todas las pantallas del kit). Una pantalla que necesita ocupar el área de contenido borde a borde, sin ese padding (hoy: `LayoutChat`) pasa `fullBleed` — cambia a `.contentFullBleed` (sin padding, `display:flex` para que un layout de columnas interno pueda estirarse a 100% de alto). **El fondo (`--color-surface-hover`) es el mismo en las dos clases a propósito** — el color de fondo de cualquier pantalla, borde a borde o no, tiene que ser idéntico al de Main/el resto del kit; los paneles/cards que van arriba (ej. `ChatConversationList`, las burbujas de `ChatMessage`, `ChatInput`) son los que usan `--color-surface-default` (blanco) para destacarse, no el fondo de página. Son dos clases separadas (no una que se sobre-escribe) para no depender del orden de cascada de CSS Modules.
- **`onSearch`**: se hila hasta el `Buscador` de la `TopBar`. Los templates que envuelven a `LayoutBase` (`LayoutHomeModule`, `LayoutMaestroDataGrid`, `LayoutMaestroBasico`, `LayoutChat`) reciben `onSearch` por prop y lo re-pasan tal cual — la pantalla real es quien decide qué hacer con la consulta (ver `App.jsx`/Ruteo abajo: hoy todas las pantallas navegan al chatbot de IA).
- **`LayoutBase` es el único punto por el que pasa CUALQUIER pantalla del kit para renderizar el `Sidebar`** (directo o vía `LayoutHomeModule`/`LayoutMaestroDataGrid`/`LayoutMaestroBasico`/`LayoutChat`, que lo componen) — por eso es donde vive la persistencia del pin del sidebar entre navegaciones: consume `useSidebarPinned()` de `app/src/context/SidebarPinnedContext.jsx` (Provider montado una sola vez en `App.jsx`, que nunca se remonta — a diferencia de `LayoutBase`/`Sidebar`, que sí, en cada cambio de ruta) y le inyecta `defaultPinned`/`onToggle` a `<Sidebar>` **por encima** de lo que traiga `sidebarProps` (`handleSidebarToggle` guarda el valor en el Context y después llama al `onToggle` original de la pantalla, si tenía uno — no lo pisa, lo envuelve). Ninguna de las ~12 pantallas del kit necesitó cambiar nada para heredar este comportamiento — es a propósito: agregar la persistencia pantalla por pantalla hubiera significado tocar cada una y confiar en que las futuras se acuerden de hacerlo también.
- **Favicon por módulo** — mismo motivo que el punto anterior (único chokepoint), `LayoutBase` setea el favicon de la pestaña (`<link id="app-favicon">` en `index.html`) en un `useEffect` a partir de `sidebarProps.brandIcon`/`sidebarProps.brandAccent` — el mismo isotipo que se ve en el header del `Sidebar`, generado como SVG standalone por `buildModuleFaviconHref` (`app/src/utils/moduleFavicon.js`). Cobra sentido ahora que cada módulo abre en pestaña nueva desde Main (ver `CardModule`): antes, con todo en una sola pestaña de SPA, un favicon fijo alcanzaba. Los colores de acento están hardcodeados en hex en `moduleFavicon.js` (no pueden leer `tokens.css` — un favicon es una imagen standalone) — si se agrega un accent nuevo al Sidebar, agregarlo ahí también, están duplicados a propósito, ver la nota en ese archivo.
- **Título de pestaña por módulo** — mismo mecanismo que el favicon (mismo chokepoint, otro `useEffect` en `LayoutBase`), pero a partir de `sidebarProps.brandLabel` en vez de icon/accent: `document.title = sidebarProps.brandLabel` — el mismo texto del logotipo del `Sidebar` ("Pharo" en Main, "Ports" en Operaciones, "Free Zone" en ese módulo, etc.), no el nombre fijo del proyecto. `index.html` mantiene `<title>Pharo Prototyping Kit</title>` como fallback estático — se ve un instante antes de que React monte y corra el efecto, mismo rol que cumple el `<link id="app-favicon">` vacío para el favicon.

### `LayoutHomeModule` — `app/src/templates/LayoutHomeModule/`

Origen: Figma, página *Cards*, frame `Layout Home Module` (456:699) — pantalla de inicio de un módulo. **Regla dura: el home de cualquier módulo real (Ports/Operaciones, Almacenes, etc.) SIEMPRE se arma con este template — nunca componiendo `LayoutBase` directo con secciones custom.** `Main` es la excepción explícita: no es un módulo, es el dashboard raíz/selector de módulos (ver nota en `Main/Home` abajo), así que no usa este template. Compone `LayoutBase` (Sidebar + TopBar) y, dentro, de arriba a abajo: fila de `CardMetric`, y debajo dos columnas — a la izquierda "Acceso rápido" (grilla de 4 columnas de `CardQuickAccess`) y a la derecha (302px fijo) una lista de actividad (`ActivityList`).

```jsx
import LayoutHomeModule from '../../../templates/LayoutHomeModule/LayoutHomeModule.jsx';
import { OPERACIONES_SIDEBAR_PROPS } from '../../../config/sidebars/operaciones.js';

<LayoutHomeModule
  sidebar={OPERACIONES_SIDEBAR_PROPS}  // config del sidebar del módulo — obligatorio, ver nota en Sidebar arriba
  activeHref="/operaciones"    // opcional — qué ítem del sidebar queda resaltado (ver nota de ruteo en App.jsx)
  onNavigate={(d) => ...}      // los 4 callbacks del Sidebar — opcionales, ver nota en Sidebar arriba
  onCompanyChange={(c) => ...}
  onLogout={() => ...}
  onToggle={(d) => ...}
  metrics={[
    { label: 'Recepciones activas', value: 47, trendLabel: '+8 vs ayer', trendDirection: 'up', data: [20, 24, 21, 30, 27, 36, 32] },
    // ...una CardMetric por entrada, ancho fluido — cualquier cantidad
  ]}
  quickAccessTitle="Acceso rápido"               // default
  quickAccessSubtitle="Tus maestros y procesos favoritos"
  quickAccess={[{ icon: 'icon-buques', title: 'Buque', subtitle: 'Maestros', href: '/buques' }]}
  activityTitle="Actividad reciente"             // default
  activitySubtitle="Últimas acciones del equipo"
  activity={[{ name: 'Carlos M.', time: 'hace 3 min', description: 'Aprobó turno de camión' }]}
/>
```

- No inventa markup nuevo — compone únicamente `LayoutBase`/`CardMetric`/`CardQuickAccess`/`ActivityList` ya existentes.
- `metrics` y `quickAccess` no tienen cantidad fija: `metrics` es una fila flex (cada card `flex:1 0 0`, igual que su ancho fluido nativo) y `quickAccess` es una grilla de 4 columnas que envuelve solo — el frame de Figma mostraba 5 metrics y 8 quick-access (2 filas de 4) a modo de ejemplo, no como límite.
- Si `metrics` viene vacío, la fila no se renderiza (no deja hueco/gap de más).
- `quickAccessTitle`/`activityTitle` tienen default en español acorde a Figma; los subtítulos no tienen default — el texto que trae Figma en ese frame ("Notificaciones" / "14 módulos disponibles" para la columna derecha) es placeholder mal copiado de otra sección, igual que se documentó para `Main/Home` — cada pantalla que use el template debe pasar su propio texto.
- Las secciones de texto (`sectionTitle` 24px/700/1.2, `sectionSubtitle` 14px/400/1.4) replican los estilos `Heading/H2`/`Body/Base` de Figma — mismos valores que ya usaba `Main/Home`, ahora centralizados acá. **Desde que existe `PageHeader`, los títulos de sección (`quickAccessTitle`/`activityTitle` + subtítulos) los dibuja `<PageHeader type="home">`** — las clases `.sectionHeader`/`.sectionTitle`/`.sectionSubtitle` se sacaron de este template y de `Main/Home`; los estilos (24px/700/1.2 y 14px/400/1.4) viven ahora en `PageHeader.module.css`.
- **`quickAccess` ahora son los favoritos reales del módulo, no ejemplo estático** — a pedido, se agregó `ToggleIcon` a la pantalla principal de cada maestro/proceso (ver esa entrada en Componentes y `LayoutMaestroDataGrid` abajo); todas las Home de módulo (`Operaciones/Home` y las 22 generadas, ver esa entrada en Módulos) arman `quickAccess` con `favoriteQuickAccess(sidebar, favoriteHrefs)` (`utils/favorites.js`) en vez de un array `QUICK_ACCESS` hardcodeado — cada Home filtra los ítems de SU propio sidebar por los hrefs marcados favoritos. Como `favoriteHrefs` arranca vacío (sin backend, sin persistencia — ver `App.jsx`), la sección puede empezar sin ningún card: `quickAccessEmptyMessage` (prop nueva, default "Todavía no marcaste ningún maestro o proceso como favorito.") se muestra en ese caso, mismo tratamiento visual que `CheckboxList.emptyMessage`.

### `LayoutMaestroDataGrid` — `app/src/templates/LayoutMaestroDataGrid/`

Origen: Figma, frame `Layout Maestro Data Grid` (492:3534) — pantalla principal de un maestro (ej. al clickear "Buque" en el sidebar, esta es la primera pantalla que aparece). Compone `LayoutBase` (Sidebar + TopBar) y, dentro: breadcrumb + título (`Heading/H2`) + fila de botones (`Nuevo`/`Recargar`/`Exportar`) a la derecha, y debajo el `DataGrid` (que ya trae su propio buscador arriba de la tabla).

```jsx
import LayoutMaestroDataGrid from '../../../templates/LayoutMaestroDataGrid/LayoutMaestroDataGrid.jsx';
import Badge from '../../../components/Badge/Badge.jsx';
import { OPERACIONES_SIDEBAR_PROPS } from '../../../config/sidebars/operaciones.js';

<LayoutMaestroDataGrid
  sidebar={OPERACIONES_SIDEBAR_PROPS}  // config del sidebar del módulo — obligatorio, ver nota en Sidebar arriba
  activeHref="/buques"         // opcional — qué ítem del sidebar queda resaltado (ver nota de ruteo en App.jsx)
  onNavigate={(d) => ...} onCompanyChange={(c) => ...} onLogout={() => ...} onToggle={(d) => ...}  // callbacks del Sidebar
  breadcrumb={[{ label: 'Maestros' }, { label: 'Buque' }]}  // opcional — no se renderiza si viene vacío
  title="Buque"
  onNew={() => ...}      newLabel="Nuevo"       // cada botón solo aparece si se pasa su handler
  onReload={() => ...}   reloadLabel="Recargar"
  onExport={() => ...}   exportLabel="Exportar"
  // el resto son las props de DataGrid, tal cual (ver arriba) — se pasan directo:
  columns={[
    { key: 'nombre', label: 'Nombre' },
    { key: 'estado', label: 'Estado', render: (row) => <Badge type={row.estado.type}>{row.estado.label}</Badge> },
  ]}
  rows={rows}
  // selectable   ← NO se pasa por default: solo si el requerimiento pide selección de filas
  actions={[{ key: 'edit', icon: 'icon-edit', label: 'Editar', onClick: (row) => ... }]}
/>
```

- **Mismo criterio que `LayoutHomeModule`** — recibe el config del sidebar del módulo por prop (`sidebar`), nunca lo hardcodea ni permite que la pantalla invente su propio `brandLabel`/`groups`/etc. (ver nota en `Sidebar` arriba). `activeHref` se pasa como `defaultActiveHref` al `Sidebar` — como cada navegación remonta la pantalla completa (ver `App.jsx`), esto alcanza para que el ítem resaltado siempre coincida con la pantalla actual sin manejar estado extra.
- **Los 3 botones de acción son opcionales e independientes** — cada uno solo se renderiza si se pasa su `on*` correspondiente (mismo patrón que `actions` de `DataGrid`, donde cada acción de fila aparece solo si hay handler). Los labels (`newLabel`/`reloadLabel`/`exportLabel`) tienen default en español pero son overrideables por si un maestro necesita otro texto. **Cuando hay `onNew` y al menos uno de `onReload`/`onExport`, se renderizan juntos como un `ActionGroup`** (Nuevo primario a la izquierda + secundarios, ver esa entrada en Componentes); con `Nuevo` solo o sin `Nuevo` van `Button` sueltos, como antes.
- **Botones reusan `Button`** (`Nuevo` = `variant="solid"`, `Recargar`/`Exportar` = `variant="outline"`, todos con `iconStart`). Íconos nuevos en `icons.jsx` (`icon-plus`, `icon-refresh`, `icon-export`): trazado vectorial exacto de los assets de Figma de esta pantalla (`PlusLg`, `ArrowClockwise`, `BoxArrowRight`), con el fill original reemplazado por `currentColor` para heredar el color de texto del botón.
- **Breadcrumb**: array de `{ label }`, separados con el ícono ya existente `bi-chevron-right` (no se agregó un ícono nuevo — Figma trae un chevron con fill sólido distinto, pero visualmente es el mismo glyph que ya está en el set). El color de texto del breadcrumb en Figma es un hex suelto (`#9ca3af`) sin variable asociada, mientras que el ícono al lado sí está atado a `color/icon/default` (`#6a7883`, mismo valor que `--color-text-secondary`) — se usó `--color-text-secondary` para ambos por consistencia, tratando el hex suelto como un descuido del archivo de Figma (mismo criterio aplicado antes en `CardMetric`). **Ahora lo dibuja `PageHeader` (`type="maestro"`)**: mismo layout y mismos valores, pero con semántica (`<nav>` + `<ol>`, `aria-current` en el último ítem, que va en color de texto default) — ver la entrada de `PageHeader` en Componentes. Las clases de header/breadcrumb/título/acciones se sacaron del CSS de este template.
- El título usa `--color-text-default` (no `black` literal, que es lo que trae Figma sin token) — mismo criterio que el resto de los `Heading/H2` del kit.
- **`favorite`/`onToggleFavorite`** (props opcionales, nuevas) — a pedido, renderiza `ToggleIcon` (ver esa entrada en Componentes) a la derecha del título, separado por `gap: var(--spacing-xs)` en un `.titleRow` nuevo que envuelve solo el `<h1>` (no el breadcrumb, que sigue arriba en `.titleCol`). **Opt-in**: sin `onToggleFavorite` no se renderiza nada (ni el ícono ni el espacio) — así las pantallas de Main (`Usuarios`/`Perfiles`/`Empresas`, que usan este mismo template) no lo tienen, a pedido explícito ("de cada módulo, NO del main"). Hoy solo lo usa `Buque` (`/buques`, el único maestro real de un módulo de negocio fuera de Main) — ver esa entrada en Módulos y la de `ToggleIcon` en Componentes.

### `LayoutMaestroBasico` — `app/src/templates/LayoutMaestroBasico/`

Origen: Figma, frame `Layout Maestro Basico` (458:1396) — pantalla de alta/edición básica de un maestro (formulario simple, a diferencia de `LayoutMaestroDataGrid` que es el listado). Compone `LayoutBase` (Sidebar + TopBar) y, dentro: mismo header que `LayoutMaestroDataGrid` (breadcrumb + título + botones a la derecha, acá `Guardar`/`Cancelar` en vez de `Nuevo`/`Recargar`/`Exportar`), y debajo un único `FormContainer` — **ya existente**, no se creó nada nuevo para el card de icono+título+divisor+contenido, coincide exacto con la card "Nuevo proveedor" de Figma.

```jsx
import LayoutMaestroBasico from '../../../templates/LayoutMaestroBasico/LayoutMaestroBasico.jsx';
import TextField from '../../../components/TextField/TextField.jsx';
import { OPERACIONES_SIDEBAR_PROPS } from '../../../config/sidebars/operaciones.js';

<LayoutMaestroBasico
  sidebar={OPERACIONES_SIDEBAR_PROPS}  // config del sidebar del módulo — obligatorio, ver nota en Sidebar
  activeHref="/buques"
  onNavigate={(d) => ...} onCompanyChange={(c) => ...} onLogout={() => ...} onToggle={(d) => ...}
  breadcrumb={[{ label: 'Familias de productos' }, { label: 'Crear familias de productos' }]}
  title="Crear familias de productos"
  onSave={() => ...}   saveLabel="Guardar"     // cada botón solo aparece si se pasa su handler
  onCancel={() => ...} cancelLabel="Cancelar"
  formIcon="icon-gear"      // se pasan directo a FormContainer
  formTitle="Nuevo proveedor"
>
  {/* children = Content de FormContainer, sin restricciones — acá, 3 TextField en una fila (wrapper flex propio de la pantalla, FormContainer no fuerza fila) */}
  <div style={{ display: 'flex', gap: 16 }}>
    <div style={{ flex: 1 }}><TextField label="Nombre" placeholder="Del Sur Logística S.A." /></div>
    <div style={{ flex: 1 }}><TextField label="CUIT" placeholder="30-71234567-8" /></div>
    <div style={{ flex: 1 }}><TextField label="Email de contacto" placeholder="compras@delsurlogistica.com" /></div>
  </div>
</LayoutMaestroBasico>
```

- **Mismo criterio de sidebar por módulo, breadcrumb y título que `LayoutMaestroDataGrid`** — ver esas notas arriba, aplican igual acá. **El header (breadcrumb + título + acciones Guardar/Cancelar) lo dibuja `PageHeader` (`type="form"`)**, incluida la regla de `ActionGroup` con dos acciones y `Button` suelto con una sola ("Volver" en modo `view`).
- **`onSave`/`onCancel` son independientes**, mismo patrón que los botones de `LayoutMaestroDataGrid` — cada uno se renderiza solo si se pasa su handler. `Button` `variant="solid"` para Guardar, `variant="outline"` para Cancelar, tamaño `md` default. Íconos nuevos en `icons.jsx` (`icon-check2`, `icon-close`): trazado exacto de los assets de Figma de esta pantalla (`Check2`, `XLg`). **Cuando están los dos se renderizan como un `ActionGroup`** (Guardar primario a la izquierda + Cancelar); con uno solo (ej. "Volver" en modo `view`) va un `Button` suelto, como antes.
- **`FormContainer` no se modificó** — su `.content` ya es `flex-direction: column`, pensado para cualquier contenido (una fila, varias, un `Accordion`, etc.); si una pantalla necesita varios campos en una fila como en el ejemplo de Figma, arma ese wrapper flex ella misma como `children` — no es responsabilidad del template ni de `FormContainer` imponer esa disposición.
- El ícono del badge de `FormContainer` en este frame de Figma (`Ports`, 462:2886) es el mismo glyph que `icon-gear` ya existente — no se agregó un ícono nuevo.
- **Modo multi-sección (sin `formTitle`)** — agregado a pedido para `UsuarioFormulario`, que necesita varias secciones independientes (tres `FormContainer`) en vez de una sola. Si no se pasa `formTitle`, el template **no** envuelve `children` en ningún `FormContainer` — los renderiza tal cual dentro de un contenedor `flex-column` con el mismo `gap` que ya separa el header del contenido, y la pantalla arma sus propias secciones como bloques independientes:

  ```jsx
  <LayoutMaestroBasico
    sidebar={MAIN_SIDEBAR_PROPS}
    activeHref="/admin/usuarios"
    breadcrumb={[{ label: 'Usuarios' }, { label: 'Crear Usuario' }]}
    title="Crear Usuario"
    onSave={handleSave} onCancel={handleCancel}
    {/* sin formIcon/formTitle */}
  >
    <FormContainer icon="icon-usuarios" title="Datos personales">...</FormContainer>
    <FormContainer icon="icon-tokens-acceso" title="Credenciales y estado">...</FormContainer>
    <FormContainer icon="icon-roles-perfiles" title="Accesos y permisos">...</FormContainer>
  </LayoutMaestroBasico>
  ```

  No rompe el caso original: cualquier pantalla que ya pasaba `formIcon`/`formTitle` (`BuqueFormulario`, el ejemplo de arriba) sigue exactamente igual, envuelta en su único `FormContainer`. Ver `UsuarioFormulario` (Módulos) para el caso real.

- **`max-width: 960px` + `margin: 0 auto` en `.root`** — en pantallas grandes (>960px) el formulario dejaba de estar acotado y cada campo se estiraba (`flex: 1` en el `.fieldsRow` propio de cada pantalla) hasta un ancho que no tiene relación con lo que ese campo necesita mostrar, perjudicando la legibilidad (Baymard, [Readability: The Optimal Line Length](https://baymard.com/blog/line-length-readability) y [Form Field Usability: Matching User Expectations](https://baymard.com/blog/form-field-sizing)). El límite vive acá, en `LayoutMaestroBasico`, y **no** en `LayoutBase`: un `LayoutMaestroDataGrid` sí se beneficia de usar todo el ancho disponible (más columnas visibles sin scroll), un formulario no. En pantallas chicas no cambia nada — el padding de `.content` de `LayoutBase` ya acota el ancho antes de llegar a este tope. Verificado a 1920px: el formulario queda centrado, capado en 960px de ancho real. Pendiente (no pedido aún): "punto 2" de la misma recomendación — hacer que el ancho de cada campo individual dentro de un `.fieldsRow` responda a lo que ese campo necesita mostrar (ej. CP más angosto que Email) en vez de repartir `flex: 1` parejo entre todos.

### Templates de Maestros — `LayoutMaestroFormulario` + catálogo `maestros.js`

Origen: Figma *Pharo Design System*, páginas *Templates* y *Maestros* (nodo 735:5260), **numeración vigente desde la actualización del 30/09/2026**: M-01 Formulario simple, M-02 Formulario por secciones, M-03 Formulario con tabs, M-04 Formulario compuesto (a/b/c). El **Listado** es `LayoutMaestroDataGrid` (ya existía). Para M-01…M-04 hay **un solo template**, `app/src/templates/LayoutMaestroFormulario/`, que se elige con la prop `template`; `app/src/templates/maestros.js` (`MAESTRO_TEMPLATES`, más `MAESTRO_COMPUESTO_SPEC` para M-04) es el catálogo con cuándo usar / cuándo no / reglas.

> ⚠️ **Numeración antigua** (antes de esa actualización, ya no vale): M-02→M-01, M-03→M-02, M-04→M-03, M-05a/b/c→M-04a/b/c. Y el **Listado**: las specs lo llaman "Listado" (sin número), pero el frame de la página *Templates* se llama "M-01 · Listado" y choca con "M-01 · Formulario simple" — pendiente de resolver en Figma; en código el Listado va sin número.

| Id | Nombre | Usar cuando | Estructura |
|---|---|---|---|
| Listado | Listado | listar/buscar registros | `LayoutMaestroDataGrid` |
| M-01 | Formulario simple | un solo grupo de pocos campos, sin scroll (Depósitos, Envases) | 1 Form Section (+ Accordion opcional) |
| M-02 | Formulario por secciones | varios grupos del mismo contexto, sin límite de campos (Clientes, Productos) | N Form Section (+ Accordion colapsado al final) |
| M-03 | Formulario con tabs | grupos de distinto contexto que se completan por separado (Buques), sin importar la cantidad de campos | Tabs + una Form Section por tab (+ Accordion opcional) |
| M-04a | Compuesto · cabecera + grilla | una colección hija | Form Section(s) + Child Grid Section al final |
| M-04b | Compuesto · cabecera + tabs de formularios | cabecera fija + tabs de formularios | Form Section(s) + Tabs(Form Section) |
| M-04c | Compuesto · cabecera + tabs con grilla | 2+ colecciones hijas | Form Section(s) + Tabs(Child Grid Section) |

**Ya no hay umbral de campos** (antes: 9 / 20): el criterio es el *contexto* de los datos — mismo contexto → M-01/M-02; contextos distintos que se completan por separado → M-03; colecciones hijas o identificación siempre visible → M-04. Cuándo no usar (resumen): M-01 no usa tabs; M-02 no es para grupos de distinto contexto (→ M-03) ni colecciones hijas (→ M-04); M-03 no con una sola tab (→ M-01/M-02; un bloque secundario opcional va como Accordion, no necesita tabs); M-04 no sin grilla hija ni cabecera fija (→ M-01…M-03).

```jsx
import LayoutMaestroFormulario from '../../../templates/LayoutMaestroFormulario/LayoutMaestroFormulario.jsx';

<LayoutMaestroFormulario
  template="M-04c"                      // 'M-01' | 'M-02' | 'M-03' | 'M-04a' | 'M-04b' | 'M-04c'
  sidebar={OPERACIONES_SIDEBAR_PROPS} activeHref="/buques"
  onNavigate onCompanyChange onLogout onToggle onSearch   // igual que LayoutMaestroBasico
  breadcrumb={[{ label: 'Buque' }, { label: 'Crear buque' }]} title="Crear buque"
  onSave={...} onCancel={...}           // cada botón solo aparece si hay handler
  blocks={[                             // cabecera (siempre visible si hay tabs)
    { type: 'form', title: 'Datos generales', children: <FormRow>…campos…</FormRow> },
    { type: 'accordion', title: 'Datos adicionales (opcional)', children: … },   // opcional, solo info NO obligatoria, siempre al final
  ]}
  tabs={[                               // UNA fila de tabs por pantalla
    { id: 'contactos', label: 'Contactos', blocks: [{ type: 'grid', title: 'Contactos', columns, rows, actions, onAdd }] },
    { id: 'direcciones', label: 'Direcciones', blocks: [{ type: 'grid', … }] },
  ]}
  defaultTab="contactos" onTabChange={(id) => …}
/>
```

- **Bloques**: `{ type: 'form', title, children }` → `FormContainer` (Form Section); `{ type: 'grid', title, columns, rows, actions, onAdd, addLabel?, searchable?, emptyMessage? }` → `ChildGridSection`; `{ type: 'accordion', title, children, defaultExpanded = false, onToggle? }` → `Accordion`. Dentro de un form, los campos van en `FormRow` (3 por fila).
- **Qué acepta cada template** (si la pantalla rompe la regla, en desarrollo hay un `console.warn` con el motivo; se renderiza igual): M-01 `blocks` con exactamente 1 form, sin tabs · M-02 `blocks` con 2+ forms, sin tabs · M-03 solo `tabs` (≥2, **una** form por tab) · M-04a `blocks` con forms + grid al final · M-04b `blocks` (cabecera) + `tabs` (≥2, forms) · M-04c `blocks` (cabecera) + `tabs` (≥2, cada una con un grid). **En todos** se admiten además 1–2 `accordion` al final de `blocks`.
- **Uso del Accordion (spec M-02, sección 03; vale para TODOS los templates de Maestros M-01…M-04, siempre que no contenga información obligatoria)**: es para un bloque **claramente secundario** (datos opcionales o poco usados); las tabs son para grupos de peso parecido que se completan por separado. Va **al final de la pantalla** (el template lo renderiza último, aunque esté en `blocks` en otro orden), **colapsado por defecto**, con un título que diga que es opcional (ej. "Datos adicionales (opcional)"). Máximo uno o dos por pantalla (con más grupos de peso parecido → M-03) `[Supuesto — validar]`; nunca para campos obligatorios ni anidado; si hay un error adentro, se abre solo con un indicador `[Supuesto — validar]` (todavía no implementado en `Accordion`). En M-04: un bloque opcional va como Accordion colapsado al final, nunca en lugar de una tab, ni para esconder la grilla hija.
- **Reglas de composición (spec M-04)**: piezas apiladas a 960px con 16px entre sí; lo que está arriba de las Tabs es la cabecera y siempre se ve (código, denominación); máximo una `Tabs` por pantalla, nunca tabs dentro de tabs; dentro de cada tab se apilan Form Section y/o Child Grid Section; sin tabs, las Form Section primero y la Child Grid Section al final; con una sola colección hija no hacen falta tabs, con dos o más una tab por colección `[Supuesto — validar]`. Las filas hijas se editan en Drawer/Modal, no inline (`Drawer` todavía no existe en el kit: `Modal` hasta que se arme).
- `tabs`: `Tabs` es semi-controlado acá (`defaultTab`/`onTabChange`); el template guarda la tab activa.
- El `Page header` es `type="form"` (breadcrumb + título + Guardar/Cancelar), igual que `LayoutMaestroBasico`, que se mantiene para las pantallas existentes (`BuqueFormulario`, etc.) — no se migraron. Uso real hoy: `Main/Usuarios/UsuarioFormulario` con **M-04b**.

### `LayoutChat` — `app/src/templates/LayoutChat/`

Sin frame de Figma — armado a partir de una captura de referencia (pantalla "Pharo IA"), no de un link de Figma. Compone `LayoutBase` (con `fullBleed`) + `ChatConversationList` (panel izquierdo) + un panel de chat (header "Pharo IA" con badge `Beta` + área de mensajes/estado vacío + `ChatInput`). **Genérico, sin lógica de negocio ni respuestas mock** — no sabe nada de "clientes" ni "pedidos" (eso vive en la pantalla que lo usa, ver `AsistenteIA` abajo), mismo criterio que el resto de los templates.

```jsx
import LayoutChat from '../../templates/LayoutChat/LayoutChat.jsx';

<LayoutChat
  sidebar={MAIN_SIDEBAR_PROPS}   // config del sidebar — obligatorio, ver nota en Sidebar arriba
  onNavigate={(d) => ...} onCompanyChange={(c) => ...} onLogout={() => ...} onToggle={(d) => ...}  // callbacks del Sidebar
  onSearch={(query) => ...}      // Buscador del TopBar — normalmente el mismo handler que onSendMessage
  assistantName="Pharo IA"       // default
  assistantTag="Beta"            // default — pasar '' o null para ocultarlo
  conversations={[{ id, title, group }]}   // lista plana, agrupada por `group` en el orden que llega — ver ChatConversationList
  activeConversationId={activeId}
  onSelectConversation={(id) => ...}
  onNewChat={() => ...}
  messages={[{ id, role, text, time, content }]}   // mensajes de la conversación activa — `content` opcional, ver ChatMessage
  onSendMessage={(text, attachments) => ...}
  isResponding={false}           // true mientras se espera la respuesta mock — muestra "Escribiendo…" y deshabilita el input
  suggestions={[{ icon, accent, title, description, onClick }]}   // cards del estado vacío, ver ChatSuggestionCard
  emptyTitle="¿En qué puedo ayudarte?"                                                          // default
  emptySubtitle="Consultá clientes, obtené documentos y ejecutá acciones utilizando lenguaje natural."  // default
  disclaimer="Pharo IA puede cometer errores. Verificá la información importante."               // default
/>
```

- **`messages` vacío → estado vacío** (ícono grande + título + subtítulo + `suggestions`); con mensajes, se renderiza la lista de `ChatMessage` en su lugar. El scroll (`.body`) se auto-ajusta al final cada vez que cambian `messages`/`isResponding` (`useEffect` + `scrollTop = scrollHeight`).
- **No genera ids ni maneja historial** — `conversations`/`messages`/`activeConversationId` son props puras, la pantalla que lo usa (`AsistenteIA`) es dueña del estado, arma los mensajes y decide qué responder. Esto es a propósito: así cualquier módulo puede reusar el mismo template con su propio "respondedor" mock (o, el día que exista, su propia integración real de IA) sin tocar `LayoutChat`.
- **`.panelHeader` (el header "Pharo IA") es la única sección con fondo blanco explícito** (`--color-surface-default`) — el resto del panel (`.body`/`.footer`) hereda el fondo gris de `.contentFullBleed` (ver nota de `fullBleed` en `LayoutBase` arriba). El header necesita destacarse como barra fija (con su borde inferior), a diferencia del área de mensajes/input que se funde con el fondo de la página.
- **Sin línea divisoria entre los mensajes y el `ChatInput`** (`.footer` no tiene `border-top`) — a pedido, para que el área de mensajes y el input se sientan como una sola superficie continua en vez de dos secciones separadas. `ChatInput` sigue teniendo su propio borde (es una caja/card en sí misma), así que igual se distingue del fondo sin necesitar la línea del contenedor.

## Ruteo (`app/src/App.jsx`)

El kit no tiene `react-router` ni ninguna librería de ruteo — es un router mínimo casero, a propósito (agregar una dependencia de routing es más de lo que necesita un kit de prototipado). `App.jsx` mapea un `pattern` de ruta → componente de pantalla en un array `ROUTES`, y usa la History API real (`pushState`/`popstate`) para que la URL del navegador quede sincronizada:

```jsx
const ROUTES = [
  { pattern: '/', Component: Home },
  { pattern: '/operaciones', Component: OperacionesHome },  // home del módulo Operaciones — se abre desde la card "Ports" en Módulos
  { pattern: '/buques', Component: Buque },                 // maestro, se abre desde el sidebar
  { pattern: '/buques/nuevo', Component: BuqueFormulario, props: { mode: 'create' } },
  { pattern: '/buques/:id/ver', Component: BuqueFormulario, props: { mode: 'view' } },
  { pattern: '/buques/:id/editar', Component: BuqueFormulario, props: { mode: 'edit' } },
  { pattern: '/asistente-ia', Component: AsistenteIA },      // chatbot de IA — cross-módulo, ver Módulos abajo
];
```

- **`pattern` soporta segmentos dinámicos `:nombre`** (`matchRoute` en `App.jsx`) — matchea por cantidad de segmentos + coincidencia exacta de los fijos, devuelve un objeto `params` con lo capturado (ej. `{ id: '3' }` para `/buques/3/editar`). La pantalla resuelta recibe ese objeto como prop `params`. No es una librería, es a propósito minimal — si algún día hace falta más (rutas anidadas, query params, etc.) recién ahí se justifica sumar `react-router`.
- **`props` en una entrada de `ROUTES` son props fijas propias de esa ruta**, se le suman a las comunes (`onNavigate`/`rows`/`onCreate`/`onUpdate`/`params`) antes de renderizar — así una misma pantalla (`BuqueFormulario`) sirve para 3 rutas distintas (`create`/`view`/`edit`) sin duplicar código, solo cambia `mode`.
- Cada pantalla que quiera ser ruteable recibe `onNavigate` como prop (con fallback a `console.log` si se la usa sin router, ej. en pruebas sueltas) y se lo pasa tal cual a su template (`LayoutBase`/`LayoutHomeModule`/`LayoutMaestroDataGrid`/`LayoutMaestroBasico`), que a su vez se lo pasa al `Sidebar`. El `Sidebar` llama `onNavigate({ href, label })` al clickear un ítem de nav — `App.jsx` intercepta ese `href` y cambia de pantalla. Una pantalla también puede llamar a su propio `onNavigate({ href, label })` directo (no solo el `Sidebar`) para navegar por código — ej. el botón "Nuevo" de `Buque`, las acciones Visualizar/Editar de cada fila (arman el `href` con el `id` de esa fila), o "Cancelar"/"Volver" de `BuqueFormulario`.
- **Clickear un ítem de sidebar sin pantalla propia todavía no hace nada** (a pedido) — la mayoría de los ítems de cada sidebar son placeholders sin ruta en `ROUTES` (ver notas en `config/sidebars/*.js`); antes, `resolveRoute` caía a su fallback (`Home`, para que cargar una URL rota en el navegador no muestre una pantalla en blanco) también para estos clicks, así que cualquier ítem sin pantalla te mandaba a Main — confuso, no era la intención de ese fallback. Fix: `routeExists(href)` (nueva función en `App.jsx`, reusa `matchRoute` contra `ROUTES`) envuelve el `onNavigate` que le llega a `<Screen>` — si el href no matchea ninguna ruta real, no llama a `navigate()` (no hay `pushState`, no cambia `path`, la pantalla actual sigue igual). El fallback de `resolveRoute` a `Home` se mantiene intacto para el caso de URL directa/typo en el navegador — ese es un caso distinto (carga de página, no click dentro de la app) y no lo pidió el usuario. Además, `Sidebar.selectItem` dejó de actualizar `activeHref` de forma optimista antes de llamar a `onNavigate` (lo hacía siempre, incluso cuando terminaba siendo un no-op) — así un ítem sin pantalla ya no queda marcado como "activo" en el sidebar sin haber navegado de verdad; como cada navegación real remonta la pantalla (ver más abajo), el `defaultActiveHref` que trae la pantalla nueva ya resiembra ese estado, no hacía falta adelantarlo.
- Funciona tanto para navegación por sidebar (soft nav, sin recargar) como para una URL pegada directo en el navegador o un `<a href>` normal (ej. las cards de `CardQuickAccess`/`CardModule`, que renderizan `<a>` reales) — Vite sirve `index.html` para cualquier ruta no encontrada (`appType: 'spa'`, default) y `App.jsx` lee `window.location.pathname` al montar. Esto incluye rutas con `:id` — probado navegando directo a `/buques/2/editar` sin pasar por `/buques` antes.
- **Al crear una pantalla nueva accesible desde el sidebar**: 1) agregarla a `ROUTES` en `App.jsx` con el mismo `href` que ya tiene su ítem en el config del sidebar de su módulo (`app/src/config/sidebars/<módulo>.js`), 2) pasarle `sidebar={MODULO_SIDEBAR_PROPS}` y `activeHref="<ese href>"` al template para que el ítem quede resaltado (ver nota en `LayoutHomeModule`/`LayoutMaestroDataGrid` arriba). Una pantalla accesible solo por botón/acción (no por el sidebar, ej. `/buques/nuevo`, `/buques/:id/ver`, `/buques/:id/editar`) no necesita `activeHref` propio — usa el mismo que la pantalla desde la que se llega (ej. `/buques`), así el sidebar no "pierde" el ítem resaltado al entrar al formulario.
- **Datos compartidos entre pantallas de un mismo maestro (ej. `/buques`, `/buques/nuevo`, `/buques/:id/editar`) viven en `App.jsx`**, no en la pantalla — no hay backend ni store todavía, así que el estado (`useState`) que necesitan leer/escribir varias rutas tiene que estar arriba de todas ellas. `App.jsx` le pasa `rows`/`onCreate`/`onUpdate`/`params` a **todas** las pantallas ruteadas por igual (las que no los usan simplemente no los destructuran — inofensivo). `onCreate`/`onUpdate` hacen el `setState` **y** navegan de vuelta a `/buques` — la pantalla de formulario no navega ella misma al guardar, solo arma el objeto y llama al callback. Ver `INITIAL_BUQUES`/`addBuque`/`updateBuque` en `App.jsx` y la nota de `Buque`/`BuqueFormulario` abajo como referencia para el próximo maestro con alta/edición.
- **Home de un módulo vs. maestro de un módulo**: la home de un módulo (ej. `/operaciones`) se abre desde una `CardModule` en la grilla de "Módulos" de `Main/Home` (`href` en `ALL_MODULES`, `config/modules.js`), no desde el sidebar de ese módulo — cada sidebar lista los ítems propios de SU módulo (Maestros/Procesos de Operaciones, Administración/Configuración/etc. de Main), no una lista de módulos. Un maestro (ej. `/buques`) sí se abre desde el sidebar del módulo al que pertenece.
- **Empresa activa y módulos habilitados por empresa**: `App.jsx` mantiene `activeCompanyId` (default `'puerto-norte'`) y `companyModules` (objeto `{ [companyId]: [ids habilitados] }`, seedeado con `DEFAULT_COMPANY_MODULES` de `config/modules.js`), y le pasa ambos + `onCompanyChange`/`onSaveCompanyModules` a **todas** las pantallas (mismo criterio que `rows`/`onSearch` — las que no los usan no los destructuran). Solo `Main/Home` y `Main/Modulos` los usan de verdad hoy: le pasan `activeCompanyId` como `defaultActiveCompanyId` al `Sidebar` y `onCompanyChange` real (en vez del `console.log` placeholder que sigue usando el resto de las pantallas) — como cada navegación entre pantallas remonta el `Sidebar` (ver nota de ruteo general), esto alcanza para que la empresa seleccionada se mantenga sincronizada entre esas dos pantallas sin manejar nada más. El resto de las pantallas (Operaciones, Buque, AsistenteIA) no se tocaron — su selector de empresa sigue siendo cosmético/local, mismo comportamiento que ya tenían antes de este feature, no es una regresión.
- **Favoritos**: `App.jsx` mantiene `favoriteHrefs` (`[]` por default, un solo array plano de hrefs — ej. `['/buques']`, sin namespacing por módulo porque los hrefs ya son únicos en toda la app) y `toggleFavorite(href)` (agrega/saca del array), pasados a **todas** las pantallas como `favoriteHrefs`/`onToggleFavorite` (mismo criterio que `activeCompanyId`/`companyModules`). `Buque.jsx` los traduce a la firma puntual que espera `LayoutMaestroDataGrid` (`favorite={favoriteHrefs.includes('/buques')}`, `onToggleFavorite={() => onToggleFavorite('/buques')}`); cada Home de módulo los usa vía `favoriteQuickAccess` (ver `LayoutHomeModule`) para armar su "Acceso rápido". Sin backend/persistencia — mismo comportamiento que `buques`/`usuarios`/etc.: se pierde al recargar la pestaña o al navegar por URL directa en vez de por la SPA (los links de `CardQuickAccess` son `<a href>` reales, no interceptados — ver esa nota en Componentes — así que clickear una card de Acceso Rápido hace una navegación dura y resetea el estado, comportamiento ya existente, no introducido acá).
- **Buscador → chatbot de IA**: `App.jsx` le pasa `onSearch` a **todas** las pantallas (mismo criterio que `rows`/`onCreate`/`onUpdate` — las que no lo usan no lo destructuran). `onSearch(query)` guarda la consulta en estado (`pendingQuery`) y navega a `/asistente-ia`. `AsistenteIA` recibe ese `pendingQuery` (más `onConsumePendingQuery` para limpiarlo) y, al montar, si hay una consulta pendiente, arranca una conversación nueva con ella — así escribir en el Buscador de **cualquier** pantalla (Main, un módulo, un maestro, un formulario) manda derecho al chat con la pregunta ya enviada. Cada pantalla que compone un template debe pasarle `onSearch={onSearch}` para que esto funcione (ver la nota de `onSearch` en `LayoutBase` arriba) — una pantalla nueva que se olvide de pasarlo simplemente tiene un Buscador sin destino, no rompe nada.

## Módulos (`app/src/modules/`)

Un folder por módulo de negocio. Cada pantalla real va en `modules/<Módulo>/<Pantalla>/<Pantalla>.jsx`.

- **`Main/Home/`** — pantalla raíz de la app (`Desktop — Layout Home`, Figma 429:2249). **`Main` no es un módulo** — es el dashboard raíz / selector de módulos (por eso vive fuera de la regla "el home de un módulo siempre usa `LayoutHomeModule`", ver nota en `LayoutHomeModule` arriba); el folder se llama `Main` por convención histórica del kit, no porque sea un módulo de negocio como `Operaciones`. Es la ruta `/` en `App.jsx` (default cuando no hay ninguna otra ruta activa). Compone, de arriba a abajo:
  1. Sección "Acceso rápido" — fila de `CardQuickAccess` (uno por cada ítem de Maestros/Procesos del sidebar).
  2. Fila inferior de dos columnas: a la izquierda "Módulos" — grilla de 4 columnas de `CardModule` (12 por página) + `Pagination`; a la derecha "Actividad reciente" (302px fijo) — `ActivityList` con 6 ítems.

  No usa `CardMetric` — esa fila no forma parte del frame 429:2249 en Figma (se había agregado antes por error a partir de una versión previa de la pantalla; se sacó).

  El `Sidebar` de esta pantalla usa `MAIN_SIDEBAR_PROPS` de `app/src/config/sidebars/main.js` — **isotipo** (Figma 496:4632/496:4633): ícono `app-window` sobre acento `indigo`. **Logotipo** (496:4630): texto "Pharo" (no "Ports" — Main no es el módulo Operaciones, aunque hoy comparte visualmente el mismo componente `Sidebar` que todos). Grupos/ítems (438:3087–497:4644, más los agregados después — ver nota de `app-window` como placeholder arriba): Administración → Usuarios/Roles y perfiles/Empresas/Módulos/**Equipos**; Configuración → Parámetros/Email/**Desencadenantes**; Datos maestros → Países/**Provincias**/**Ciudades**/Monedas (ese orden puntual, a pedido); Integraciones → Importar novedades/Tokens de acceso; **Sistema** (grupo nuevo, sin frame de Figma) → Registro de sesiones/Tareas programadas/Información de versión. Aunque `Main` no es un módulo de negocio (ver arriba), sigue necesitando su propia identidad de sidebar como cualquier otro consumidor del componente — por eso tiene su config igual que `Operaciones` (ver nota en `Sidebar` arriba).

  **La grilla de Módulos muestra solo los módulos habilitados para la empresa activa** — el catálogo completo (23, ver `config/modules.js` → `ALL_MODULES`) vive fuera de esta pantalla desde que se agregó `Main/Modulos` (habilitar/deshabilitar por empresa, ver esa entrada abajo); acá solo se filtra (`ALL_MODULES.filter(m => enabledIds.includes(m.id))`).
  - **Paginación dinámica por filas, no por cantidad fija de cards** (a pedido) — `CardModule` tiene ancho fijo (174px, ver esa nota arriba), así que cuántas entran por fila depende del ancho real disponible, no de un número fijo. `Home.jsx` mide el ancho de `.modulesGrid` con `ResizeObserver` (`modulesGridRef`) y calcula `columns = Math.floor((width + MODULE_GRID_GAP) / (MODULE_CARD_WIDTH + MODULE_GRID_GAP))` — la misma cuenta que hace CSS Grid internamente con `repeat(auto-fill, 174px)`, replicada a mano porque el JS necesita saber el número para armar la paginación. `modulesPerPage = columns * 3` (**siempre 3 filas máximo**, a pedido — lo que no entra en 3 filas pasa a la página siguiente). `MODULE_CARD_WIDTH` (174) / `MODULE_GRID_GAP` (16, `--spacing-md`) en `Home.jsx` tienen que coincidir siempre con `grid-template-columns`/`gap` de `.modulesGrid` en `Home.module.css` — si se cambia uno, cambiar el otro. Se remide solo (observer), así que colapsar/expandir el sidebar o agrandar la ventana suma o resta columnas y la paginación se recalcula sola (vuelve a página 1). Verificado en el navegador a 1280px de viewport: sidebar colapsado → 4 columnas por fila; sidebar expandido y fijado → 3 columnas, sin desbordar (ancho de card confirmado por código: 174px exacto en los dos casos).
  - Los primeros 13 del catálogo (Ports…Stock, sin contar los 10 nuevos) son los módulos reales de Figma (sección *Card-Module — Color accents*, 446:14 — ver entrada de `CardModule` arriba) y conservan su `icon`/`accent`/`description` original; el resto son módulos nuevos agregados a pedido (ver nota completa en `config/modules.js`, incluye por qué llevan `app-window` como ícono). `QUICK_ACCESS`/`ACTIVITY` siguen siendo ejemplo — el diseño de Figma tenía esas dos secciones con la misma card repetida N veces; `QUICK_ACCESS` toma un ítem de cada grupo del sidebar de Main (Usuarios/Empresas/Parámetros/Países), `ACTIVITY` un feed inventado (`Carlos M. / Aprobó turno de camión`, etc. — la sección decía "Módulos" en Figma pero el contenido es un feed de actividad, se corrigió el título a "Actividad reciente" acá). Reemplazar `QUICK_ACCESS`/`ACTIVITY` por datos reales cuando estén disponibles.

- **`Main/Modulos/`** — habilitar/deshabilitar módulos por empresa, armada con `LayoutBase` directo (como `Main/Home` — no es un módulo de negocio, así que no aplica la regla de `LayoutHomeModule`). Es la ruta `/admin/modulos` en `App.jsx`, mismo `href` que ya tenía el ítem "Módulos" del grupo Administración en `MAIN_SIDEBAR_PROPS` (`config/sidebars/main.js`), así que clickearlo en el sidebar navega acá de verdad. Sin frame de Figma — el header (breadcrumb + título + botón "Guardar") sigue el mismo patrón visual que `LayoutMaestroDataGrid`/`LayoutMaestroBasico` pero armado a mano acá en vez de con esos templates (no encajan: esta pantalla no es un listado ni un formulario de alta, es una grilla de `ModuleAccessCard` con checkboxes).
  - **Qué empresa se está editando lo decide el selector de empresa del propio `Sidebar`** — no hay un selector de empresa propio en la pantalla. `activeCompanyId` le llega por prop desde `App.jsx` (mismo estado que usa `Main/Home` para filtrar) y se pasa como `defaultActiveCompanyId` al `Sidebar`; cambiarlo dispara el `useEffect` que resetea el borrador de checkboxes al set guardado de la empresa recién seleccionada — **cualquier cambio sin guardar se pierde al cambiar de empresa**, no hay confirmación ni tracking de "cambios sin guardar" (no se pidió, mismo criterio simple del resto del kit).
  - **Estado de checkboxes es un borrador local** (`useState(() => new Set(...))`), no escribe en `companyModules` hasta que se clickea "Guardar" (`Button` solid, llama a `onSaveCompanyModules(activeCompanyId, Array.from(draftEnabled))`, prop que le inyecta `App.jsx`). Verificado en el navegador: habilitar "Custom PY" + deshabilitar "Dashboard" en Puerto Norte S.A., guardar, navegar a Home (sin recargar el navegador — recargar perdería el estado, no hay persistencia real todavía) → el cambio se refleja ahí; cambiar de empresa a Del Sur Logística → vuelve a mostrar el set original (Dashboard, sin Custom PY), confirmando que cada empresa tiene su propio set independiente.
  - **`ALL_MODULES` se recorre completo, sin paginar** (a diferencia de la grilla de `Main/Home`, que sí pagina) — es una pantalla de administración, no de consumo, tiene sentido ver los 23 de una.

  **Los 23 módulos de `ALL_MODULES` tienen `href` hoy** — cada uno abre su propio Home (`/operaciones` para "Ports", ver `Operaciones/Home` abajo; el resto, ver "Home de los 22 módulos nuevos" más abajo, junto a `Operaciones/Buque/BuqueFormulario.jsx`).

  **Product Tour**: la primera vez que se abre Main (`localStorage['pharo-product-tour-seen']` ausente), se muestra automáticamente el popup `TourPopup` con las 4 slides de `config/productTour.js`. `Home.jsx` es dueño de esa lógica (`useEffect` al montar, chequea/setea la key envuelto en `try/catch` por si `localStorage` no está disponible — navegación privada, site data bloqueado) — `TourPopup` en sí no sabe nada de "primera vez" ni de Pharo (ver su entrada en Componentes arriba). El contenido de las 4 slides es **placeholder a pedido** (títulos + lorem ipsum + íconos existentes de `icons.jsx`, sin imágenes reales todavía) — reemplazar `PRODUCT_TOUR_SLIDES` en `config/productTour.js` cuando estén definidos los features reales a anunciar; la primera slide ("Chatbot con IA integrada") ya describe una feature real del kit (`Buscador`/`AsistenteIA`, ver arriba), las otras tres ("Nuevo menú lateral", "Nuevo diseño de módulos", "Accesos directos") son inventadas. Si el día de mañana se necesita re-mostrar el tour a todos los usuarios (ej. nueva tanda de novedades), alcanza con cambiar el valor de `PRODUCT_TOUR_SEEN_KEY` en `Home.jsx` (ej. `'pharo-product-tour-seen-v2'`) — no hay backend que trackee "visto" por usuario todavía.

- **`Main/Usuarios/`** — alta de usuarios al sistema de Gestión Portuaria. Sin frame de Figma — arquitectura definida a pedido (rol de Product Designer) antes de construirse: separar "ficha del usuario" (corto, siempre visible, validación crítica) de "asignación de acceso" (largo, variable, exploratorio), y tratar cada uno con el patrón que corresponde. Dos pantallas:
  - **`Usuarios.jsx`** — grilla del maestro, armada con `LayoutMaestroDataGrid` (mismo patrón que `Buque`). Es la ruta `/admin/usuarios` en `App.jsx`, mismo `href` que ya tenía el ítem "Usuarios" del grupo Administración en `MAIN_SIDEBAR_PROPS`. Columnas: Nombre (`nombreApellido`), Correo Electrónico, Activo (`Badge` — `success` "Activo" / `neutral` "Inactivo" —, derivado del boolean `activo` de cada fila, no de un objeto `{label,type}` como `Buque` — acá se guarda el boolean crudo porque `UsuarioFormulario` lo necesita como boolean para el checkbox "Usuario inactivo"). Acciones: Visualizar/Editar (default del kit, ver nota de `DataGrid` arriba). Botones de cabecera: Crear (primario) + Recargar (secundario) — sin Exportar, a pedido. **Recibe `usuarios` por prop** (`App.jsx` le pasa el estado compartido, mismo criterio que `rows`/`buques` de `Buque` pero con nombre propio para no pisarse — ver `Ruteo`) con fallback a `DEFAULT_ROWS` local si se usa la pantalla suelta.
  - **`UsuarioFormulario.jsx`** — alta/visualización/edición, para las rutas `/admin/usuarios/nuevo`, `/admin/usuarios/:id/ver`, `/admin/usuarios/:id/editar` (mismo patrón de `mode` que `BuqueFormulario`, ver `Ruteo`). Usa `LayoutMaestroBasico` **sin `formTitle`** (modo multi-sección, ver esa entrada en Templates) para apilar 3 bloques independientes en vez de un único `FormContainer`:
    1. `FormContainer` "Datos personales" — Nombre y apellido, Correo electrónico, Teléfono en una fila.
    2. `FormContainer` "Credenciales y estado" — Usuario + `Select` "Tipo de autenticación" en una fila, y debajo dos `Checkbox` independientes: "Usuario inactivo" (invertido — unchecked es el default, mismo criterio que `BuqueFormulario`; se guarda como `activo: !inactivo`) y "Bloqueado" (eje de estado aparte, no excluyente con Activo — un usuario puede estar activo y bloqueado a la vez).
    3. `FormContainer` "Accesos y permisos" con `Tabs` internos **Empresas | Perfiles | Roles** — cada tab muestra un `CheckboxList` (componente nuevo, ver Componentes) del catálogo correspondiente. **No es `Accordion`** — se armó así en un primer intento (razonando que era "contenido opcional/secundario"), pero esa justificación contradecía el propio `defaultExpanded` (que argumentaba que asignar acceso es "central al alta") y no coincidía con las referencias reales del rubro (Entra ID, Okta muestran roles/permisos siempre visibles, nunca colapsados) — se corrigió a `FormContainer` para que sea consistente con los otros dos bloques, todos igual de centrales a la tarea, siguiendo la regla de decisión documentada en la entrada de `FormContainer` (Componentes) y en Figma (página *Guidelines*). El `Tabs` interno sigue igual — se eligió Tabs (no 3 `Accordion` apilados, no las 3 listas sueltas) porque son 3 catálogos del mismo peso, cada uno de largo variable — acota la altura total de la pantalla al catálogo más largo en vez de sumar los tres, y separa el flujo mental de "ahora reviso perfiles" del resto. Empresas reusa `MAIN_SIDEBAR_PROPS.companies` (mapeado a `{id,label}` — son las mismas empresas del selector del Sidebar, no un catálogo propio); Perfiles y Roles son catálogos nuevos, `config/perfiles.js`/`config/roles.js` (ver Config).
  - **Validación**: Nombre y apellido, Correo electrónico, Usuario y Tipo de autenticación obligatorios (mismo patrón `error`/`helperText` que `BuqueFormulario`, extendido a `Select`); Teléfono y los 3 checklists de acceso pueden quedar vacíos sin bloquear el guardado. **Usuario no encontrado**: mismo fallback que `BuqueFormulario` (shell sin formulario) si se pide `ver`/`editar` un id inexistente.
  - **Modo `view`**: TextField/Select/Checkbox/CheckboxList reciben `disabled={isView}` — incluye el buscador y el "seleccionar todo" de cada `CheckboxList`. Botón Guardar oculto (`onSave` undefined), Cancelar pasa a label "Volver" — mismo patrón que `BuqueFormulario`.
  - **Datos compartidos**: `usuarios`/`onCreateUsuario`/`onUpdateUsuario` viven en `App.jsx` (`INITIAL_USUARIOS`, `addUsuario`, `updateUsuario`) — mismo criterio que `buques`/`onCreate`/`onUpdate` de `Buque`, pero con nombres de prop propios (no reusa `onCreate`/`onUpdate`/`rows`, que ya están tomados por `Buque` y se pasan a todas las pantallas por igual — ver `Ruteo`). `empresaIds`/`perfilIds`/`rolIds` en cada fila guardan arrays de ids, nunca labels.

- **`Main/RolesYPerfiles/`** — alta de perfiles al sistema. Mismo `href` que ya tenía el ítem "Roles y perfiles" del grupo Administración en `MAIN_SIDEBAR_PROPS` (`/admin/roles-y-perfiles`) — a pesar del nombre del ítem del sidebar, hoy la pantalla solo gestiona **Perfiles** ("Roles" queda pendiente, mismo criterio que otros ítems del sidebar sin pantalla propia todavía). Dos pantallas, mismo patrón que `Main/Usuarios`:
  - **`Perfiles.jsx`** — grilla del maestro, armada con `LayoutMaestroDataGrid`. Columnas: Código (ancho fijo 120px, igual que `Buque`), Denominación, Activo (`Badge`, derivado del boolean `activo` de cada fila — mismo criterio que `Usuarios`, no el objeto `{label,type}` de `Buque`). Acciones: Visualizar/Editar (default del kit). Botones de cabecera: Crear (primario) + Recargar (secundario) — sin Exportar, a pedido, mismo criterio que `Usuarios`. **Recibe `perfiles` por prop** con fallback a `DEFAULT_ROWS` local si se usa la pantalla suelta.
  - **`PerfilFormulario.jsx`** — alta/visualización/edición, rutas `/admin/roles-y-perfiles/nuevo`, `/admin/roles-y-perfiles/:id/ver`, `/admin/roles-y-perfiles/:id/editar` (mismo patrón de `mode` que `BuqueFormulario`/`UsuarioFormulario`). Usa `LayoutMaestroBasico` **sin `formTitle`** (modo multi-sección) para apilar 3 `FormContainer` — los tres son centrales a la tarea, ninguno es Accordion, mismo criterio corregido que `UsuarioFormulario` (ver esa entrada y la nota de `FormContainer` en Componentes):
    1. `FormContainer` "Datos del perfil" — Código + Denominación en una fila, y debajo `Checkbox` "Inactivo" (no "Perfil inactivo" — mismo wording corto que `BuqueFormulario`, no el "Usuario inactivo" de `UsuarioFormulario`; acá la entidad es un perfil, no un usuario, así que no hace falta calificarlo).
    2. `FormContainer` "Módulos" — un único `CheckboxList` (sin `Tabs`, a diferencia de `UsuarioFormulario`: acá hay un solo catálogo — Módulos — no 2+ vistas paralelas, así que no aplica Tabs por la misma regla de decisión) con el catálogo completo `ALL_MODULES` de `config/modules.js` (mapeado a `{id, label: title, description}` — mismo catálogo que ya usa `Main/Modulos` para habilitar módulos por empresa, no uno nuevo).
    3. `ChildGridSection` "Concesionarios" (componente `Child Grid Section` de Figma, 733:198 — card con título + botón "Agregar" outline a la derecha + grilla sin buscador; el botón no se renderiza en modo `view`) — "Agregar" abre un `Modal` (componente nuevo, ver Componentes) con un `Select` para elegir el concesionario (las opciones excluyen los ya agregados, `CONCESIONARIOS.filter(c => !concesionarioIds.includes(c.id))`) y confirmarlo con "Agregar" (deshabilitado sin selección). Debajo, un `DataGrid` (reusado tal cual, sin `selectable`) muestra los concesionarios ya agregados — columnas Denominación + Acciones (acá **no** son Visualizar/Editar del default del kit: es una lista de asignación, no un maestro, así que la única acción real es "Eliminar" — saca el id del array local, oculta en modo `view`). Catálogo nuevo `config/concesionarios.js` (ejemplo).
  - **Validación**: Código y Denominación obligatorios (mismo patrón que `BuqueFormulario`); Módulos y Concesionarios pueden quedar vacíos. **Perfil no encontrado**: mismo fallback que `BuqueFormulario`/`UsuarioFormulario`.
  - **Modo `view`**: mismo criterio que `UsuarioFormulario` — todo `disabled`, botón Guardar oculto, "Agregar concesionario" y la columna Acciones de esa grilla no se renderizan (no `disabled`, directamente ausentes — no hay nada que deshabilitar en un botón/acción que no debería existir en modo lectura).
  - **Datos compartidos**: `perfiles`/`onCreatePerfil`/`onUpdatePerfil` viven en `App.jsx` (`INITIAL_PERFILES`, `addPerfil`, `updatePerfil`) — mismo criterio que `usuarios`/`buques`. `moduloIds` guarda ids de `config/modules.js` (`ALL_MODULES`), `concesionarioIds` ids de `config/concesionarios.js` — nunca labels.

- **`Main/Empresas/`** — alta de empresas al sistema. Mismo `href` que ya tenía el ítem "Empresas" del grupo Administración en `MAIN_SIDEBAR_PROPS` (`/admin/empresas`). Dos pantallas, mismo patrón que `Main/Usuarios`/`Main/RolesYPerfiles`:
  - **`Empresas.jsx`** — grilla del maestro, armada con `LayoutMaestroDataGrid`. Columnas: Código (120px), Nombre legal, Activo (`Badge`, boolean — mismo criterio que `Usuarios`/`Perfiles`). Acciones: Visualizar/Editar (default del kit). Botones de cabecera: Crear (primario) + Recargar (secundario) — sin Exportar, mismo criterio que `Usuarios`/`Perfiles`. **Recibe `empresas` por prop** con fallback a `DEFAULT_ROWS` local.
  - **`EmpresaFormulario.jsx`** — alta/visualización/edición, rutas `/admin/empresas/nuevo`, `/admin/empresas/:id/ver`, `/admin/empresas/:id/editar` (mismo patrón de `mode`). Es el formulario más largo del kit hoy (13 campos + 2 archivos + 1 campo condicional) — la arquitectura se pensó explícitamente para eso, aplicando la regla de decisión de `FormContainer`/`Accordion`/`Tabs` (ver esa entrada en Componentes y la página *Guidelines* de Figma) a un formulario grande, no solo a uno chico como `UsuarioFormulario`/`PerfilFormulario`. Usa `LayoutMaestroBasico` **sin `formTitle`** (modo multi-sección) con 4 bloques — 3 `FormContainer` + 1 `Accordion`, la primera vez que un formulario del kit combina ambos patrones a la vez en vez de solo uno:
    1. `FormContainer` "Datos de la empresa" — Código, Nombre legal, Nombre comercial en una fila, y debajo `Checkbox` "Inactivo". Identidad de la empresa — central, siempre visible.
    2. `FormContainer` "Datos fiscales" — Número de identificación fiscal, Número de ingresos brutos, Fecha de inicio de actividad (`TextField type="date"`, sin componente de fecha propio — el `<input type="date">` nativo alcanza) en una fila. Separado de "Datos de la empresa" por dominio (identidad vs. fiscal), no por jerarquía — mismo criterio que separa "Datos personales" de "Credenciales y estado" en `UsuarioFormulario`: son igual de centrales, ninguno es más importante, así que ambos son `FormContainer`, no uno `Accordion`.
    3. `FormContainer` "Domicilio y contacto" — País y Zona horaria como `Select` (no `TextField` — son de opciones acotadas, no texto libre; catálogos de ejemplo `PAISES`/`ZONAS_HORARIAS` locales al archivo, no en `config/` porque son listas chicas específicas de esta pantalla, mismo criterio que `TIPOS_AUTENTICACION` en `UsuarioFormulario`) + CP + Localidad + Domicilio (fila propia, ancho completo — una dirección no entra cómoda en una fila de 3) + Teléfono + Email. También central — hace falta para facturación/notificaciones — por eso `FormContainer`, no `Accordion`.
    4. `Accordion` "Certificados y documentos" (`defaultExpanded={false}`) — Logo + Certificado AFIP (`FileUpload`, componente nuevo, ver Componentes) en una fila, `Checkbox` "Tiene clave de certificado", y si está tildado, un `TextField type="password"` "Clave del certificado" que aparece condicionalmente (`{tieneClaveCertificado && (...)}` — no hay ningún componente de "campo condicional", es JSX plano). **Este sí es Accordion, sin la contradicción que tuvo `UsuarioFormulario` al principio** (ver esa entrada): acá el razonamiento es consistente de punta a punta — cargar logo/certificado es genuinamente diferible, no hace falta para crear el registro básico de una empresa, así que arranca colapsado (`defaultExpanded={false}`, no `true`) y en ningún lugar se lo describe como "central".
  - **Validación**: Código, Nombre legal y Número de identificación fiscal obligatorios (los tres campos sin los cuales una empresa no es identificable) — mismo patrón `error`/`helperText`. El resto (fiscales secundarios, domicilio, certificados) puede quedar vacío. **Empresa no encontrada**: mismo fallback que el resto de los formularios del kit.
  - **Modo `view`**: mismo criterio que `UsuarioFormulario`/`PerfilFormulario` — todo `disabled`, incluidos los dos `FileUpload` y el `Select` de País/Zona horaria; botón Guardar oculto.
  - **Datos compartidos**: `empresas`/`onCreateEmpresa`/`onUpdateEmpresa` viven en `App.jsx` (`INITIAL_EMPRESAS`, `addEmpresa`, `updateEmpresa`) — mismo criterio que `usuarios`/`perfiles`/`buques`. Distinto de `activeCompanyId`/`companyModules` (también en `App.jsx`, para el selector de empresa del `Sidebar` y `Main/Modulos`) — dos conceptos de "empresa" que hoy coexisten sin relación: uno es el maestro CRUD de esta pantalla, el otro es la empresa activa de la sesión. No están vinculados (crear una empresa acá no la agrega al selector del Sidebar) — unificarlos requeriría más alcance del que se pidió.

- **`Main/Equipos/`** — maestro "Equipos" (grupo Administración de `MAIN_SIDEBAR_PROPS`, `href` `/admin/equipos`). Sin frame de Figma. Dos pantallas, mismo patrón que `Main/Usuarios`:
  - **`Equipos.jsx`** — grilla con `LayoutMaestroDataGrid`. Columnas: IP (160px), Denominación, Activo (`Badge`, boolean — mismo criterio que `Usuarios`/`Perfiles`). Acciones: Visualizar/Editar (default del kit). Cabecera: Crear (primario) + Recargar. **Recibe `equipos` por prop** con fallback a `DEFAULT_ROWS`.
  - **`EquipoFormulario.jsx`** — alta/visualización/edición (`/admin/equipos/nuevo`, `/:id/ver`, `/:id/editar`, mismo patrón de `mode`), con el template **M-01 · Formulario simple** (`LayoutMaestroFormulario`, una sola Form Section "Datos del equipo"): `FormRow` con **Empresa** (`Select` con las empresas del selector del Sidebar de Main, `MAIN_SIDEBAR_PROPS.companies`), **IP** y **Denominación**, y debajo, en vertical, los `Checkbox` **Equipo seguro** e **Inactivo** (este último → `activo: !inactivo`). Empresa, IP y Denominación son obligatorios. Modo `view`: todo `disabled`, sin Guardar, "Volver". Equipo inexistente: shell con "Equipo no encontrado".
  - **Datos compartidos**: `equipos`/`onCreateEquipo`/`onUpdateEquipo` viven en `App.jsx` (`INITIAL_EQUIPOS`, `addEquipo`, `updateEquipo`). `empresaId` guarda el id de la empresa, nunca el nombre. Sin validación de formato de IP todavía.

- **`Operaciones/NuevaOperacion/`** — proceso "Planificar nueva operación" (Procesos → Nueva Operación del sidebar de Ports, `/nueva-operacion`). Rediseño de un proceso del sistema anterior; **no es un Stepper** (proceso corto, y los pasos no dependen secuencialmente — ver regla de decisión). Dos fases en la misma ruta, estado local:
  1. **Contexto** (`LayoutMaestroFormulario` M-01): `Select` de Movimiento, Tipo de carga y Modo + botón "Continuar" (sin "Cancelar"). Cada combinación cambia qué datos se piden. Una combinación no diseñada muestra un `Message` ("todavía no está disponible"); con el contexto incompleto no se muestra ningún mensaje.
  2. **Formulario de la operación** (M-04a): hoy **solo Recepción / Graneles / Camión**. Título fijo "Planificar nueva operación" (el tipo ya no va en el título, por largo). El tipo se identifica con un `Message` justo **debajo del título** (prop `belowHeader` de `LayoutMaestroFormulario`): título "Tipo de operación" y, una línea debajo de otra, "Movimiento: …", "Tipo de carga: …", "Modo: …", sin botón para cambiarlo (para elegir otro tipo hay que salir con Cancelar) — no se repite la Form Section "Tipo de operación". Bloques: "Datos de la operación" (Operación Nº solo lectura, Producto, Envase, Tipo de turno — obligatorios, `FormRow columns={4}`), `ChildGridSection` "Clientes" (Cliente + Cantidad (tn); "Agregar" abre un `Modal` con Select de cliente + cantidad; al menos un cliente para confirmar) y `Accordion` "Notas (opcional)". Confirmar valida y vuelve al Home de Ports; Cancelar también.
  - ⚠️ **Pendientes**: no existe la matriz de reglas de las demás combinaciones — cuando exista, el formulario debe armarse **leyendo reglas como datos** (campos/bloques, obligatorios, filtros de opciones) y no con una pantalla por combinación; hoy hay una sola armada a mano. Catálogos de ejemplo locales (opciones de los selectores, productos, envases, tipos de turno, clientes). Producto/Envase/Tipo de turno son `Select` porque **no existe todavía el selector con búsqueda** (código + denominación). No hay plantilla de "Proceso" en el kit: se usó M-04a; si se suman más procesos, definir `LayoutProceso`. Qué pasa después de Confirmar no está definido (hoy vuelve al Home). Sin persistencia.

- **`Operaciones/GiroBuque/`** — proceso "Solicitud de giro buque" (grupo **Giro buque** del sidebar de Ports, ítem **Giros** → `/giros`). Rediseño de un proceso del sistema anterior **conservando todos sus campos**. Dos pantallas:
  - **`Giros.jsx`** — listado (`LayoutMaestroDataGrid`): ID de viaje, Buque, Zarpada estimada, Estado (`Badge`: Borrador/Enviada/Aprobada/Rechazada — el flujo de aprobación completo vive en otra pantalla del sistema), acciones Visualizar/Editar; botones **Nueva solicitud** + Recargar. Es el punto de entrada (un solo ítem de sidebar, patrón listado + crear del kit).
  - **`SolicitudGiro.jsx`** — formulario (`/giros/nueva`, `/giros/:id/ver`, `/giros/:id/editar`), **página única** (M-02 + 2 `Accordion` opcionales: Otros muelles o puertos, Observaciones), no wizard (las secciones son casi independientes, se edita/duplica y el kit no tiene Stepper). Secciones: Datos del viaje, Información del buque, Agentes y responsables, Operación y carga, Calados, Solicitante. Mejoras: **`SectionIndex`** fijo con progreso; **`SelectWithOther`** en todas las entidades (buque, armador, agentes, cliente, producto, puertos, destino, muelles); **autocompletado editable** de los datos del buque (y domicilio del armador) al elegirlo del maestro, con un `Message` que lo avisa; fechas `datetime-local` **sin precarga** y validación de orden (zarpada posterior al arribo a rada); unidades en los rótulos (tn, m, t/cm) y validación numérica; obligatorios marcados con `*`; al enviar con errores, `Message` con la cantidad, scroll a la primera sección con error y chips en rojo; **Guardar borrador** (sin validar) + **Enviar solicitud** (acciones del Page header vía la prop `secondaryActions` de `LayoutMaestroFormulario`), E-mail precargado con el del usuario. Al guardar/enviar vuelve a **Giros**.
  - ⚠️ **Supuestos a confirmar con el área**: obligatorios (Buque, F/H arribo rada Rosario, F/H estimativa zarpada, Producto, Agente marítimo aduanero, E-mail); qué datos del buque salen del maestro y cuáles son por viaje (hoy se autocompletan pero **siguen editables**); el **texto completo de los Art. 193 y 194 de la Ley 20094** (hoy solo el rótulo original, a mostrar completo); quién la completa. Catálogos de ejemplo en `config/giroBuque.js`. Sin persistencia ni autoguardado (el borrador solo se guarda con el botón); `Select` nativo hasta que exista el selector con búsqueda. `giros`/`onCreateGiro`/`onUpdateGiro` viven en `App.jsx`.

- **`Operaciones/Maestros/MaestroPorts.jsx`** — pantalla principal **genérica** de los maestros de Ports que todavía no tienen pantalla propia (los 23 del grupo Maestros del sidebar salvo Buque y Depósitos: Acuerdos comerciales, Agentes marítimos aduaneros, Armadores, Capitales, Categoría de horarios, Clientes, Envases, Esquema de horarios, Estados de carga, Familias de productos, Navieras, OPB, Productos, Puertos, Recursos, Sectores, Servicios, Tipos de buques, Tipos de movimientos, Tipos de turnos, Ubicaciones, Unidades de medida, Viajes). **Todos los maestros de Ports comparten la grilla de Depósitos**: Código (120px), Denominación, Estado (`Badge`) y Acciones (Visualizar/Editar), con Nuevo/Recargar/Exportar y `ToggleIcon` de favorito (href propio). Las filas son **de ejemplo, adaptadas a cada maestro** (5 por maestro, el 4.º inactivo) y salen de `config/maestrosPorts.js` (`MAESTROS_PORTS` — de ahí también salen los ítems del sidebar y las rutas de `App.jsx`; `maestroRows()` arma las filas). Nuevo/Visualizar/Editar apuntan a rutas que no existen todavía (no hacen nada). Para volver real un maestro: armar su pantalla propia (como Buque/Depósitos), sacarlo de `MAESTROS_PORTS` y registrarlo a mano en `ROUTES`/sidebar. Buque pasó a mostrar la columna Código (antes IMO) para quedar igual.

- **`AccessControl/Personas/`** — maestro "Personas" (Access Control → Maestros → Personas, `/access-control/personas`). Rediseño de una pantalla del sistema anterior con **todos sus datos**. Dos pantallas:
  - **`Personas.jsx`** — listado (`LayoutMaestroDataGrid`). Columnas: Código (= DNI), Denominación, Grupo, Subgrupo, DocUX / Recursos humanos / Turnos de camiones (ícono ✓/✗ con texto accesible), Activo (`Badge`); acciones Visualizar/Editar. Cabecera: **Crear**, Recargar, **Importar**, Exportar (`LayoutMaestroDataGrid` ganó la prop `onImport`/`importLabel`; `DataGrid` ganó `minWidth` por columna para que Denominación no colapse). Es una excepción a la grilla estándar de los maestros de Ports (Código/Denominación/Estado/Acciones): se agregaron las columnas del original. Ejemplo con 5 personas.
  - **`PersonaFormulario.jsx`** — alta/visualización/edición (`/nuevo`, `/:id/ver`, `/:id/editar`) con **M-04a**: Form Sections "Datos personales" (DNI*, Nombre*, Apellido*, Denominación automática de solo lectura "APELLIDO, Nombre", Dirección, Ciudad), "Credencial y acceso" (Grupo*, Subgrupo* dependiente del grupo, Tarjeta RFID*, Imagen con `FileUpload`), "Permisos y estado" (checkboxes DocUX, Recursos humanos, Turnos de camiones, Inactivo en vertical) + `ChildGridSection` **"Razón social"** (Razón social, CUIT, Activo; Agregar/Editar en `Modal`, CUIT de 11 dígitos) + `Accordion`s "Suspensión (opcional)" (fechas inicio/fin, fin posterior al inicio) y "Observaciones (opcional)". **Se quitaron las tabs** del original (Datos generales | Razón social): con una sola colección hija el kit no usa tabs. Validaciones: DNI de 7–8 dígitos y **sin duplicados**, obligatorios con `*`. Catálogos de ejemplo en `config/accessControl.js`. `personas`/`onCreatePersona`/`onUpdatePersona` viven en `App.jsx`.
  - ⚠️ **Pendientes**: paginación y filtros por columna del listado original (el `DataGrid` no los tiene; con 200+ páginas hacen falta), dropzone de imagen (hoy botón `FileUpload`), campo de texto largo para Observaciones, selector con búsqueda para Ciudad, y la **tercera acción de fila** del original (ícono de credencial), cuyo significado no está definido.

- **`Grains/Clientes/`** — maestro "Clientes" (Grains → Maestros → Clientes, `/grains/clientes`). Rediseño de una pantalla de 5 tabs **siguiendo la regla de decisión del kit**: las tabs son para colecciones hijas paralelas, no para grupos de campos. Dos pantallas:
  - **`Clientes.jsx`** — listado (`LayoutMaestroDataGrid`): #, Identificador fiscal (CUIT, con guiones), Razón social, Nombre extendido, Rol, Activo (`Badge`), acciones Visualizar/Editar; Crear, Recargar, Importar, Exportar y favorito. Sin paginación ni filtros por columna (el `DataGrid` no los tiene).
  - **`ClienteFormulario.jsx`** — alta/visualización/edición con **M-04c**: cabecera de 4 Form Sections — Datos generales (Rol*, CUIT*, Razón social*, Actividad, Nombre extendido), Dominio fiscal (Calle*, Número*, Piso, Departamento, Tipo de domicilio*, Localidad*, Nacionalidad, País AFIP*), Datos impositivos (Categoría IVA, Categoría Ganancias, Alícuota IIBB, Condición impositiva*), Otros datos (Fecha alta* — hoy por defecto —, Fecha baja, Observaciones, Inactivo) — y UNA fila de tabs, una por colección hija con `ChildGridSection`: **Teléfonos** (Teléfono, Comentario), **Correos electrónicos** (Correo, Comentario, Tipo de email, Email principal) y **Actividad SISA** (Categoría; botón extra **Actualizar** — `ChildGridSection` ganó la prop `extraActions` — placeholder sin consulta real). Las filas se agregan/editan en `Modal`. **Página web** (Página web, Usuario, Clave) va en un `Accordion` opcional al final.
  - **Mejoras**: CUIT validado con **dígito verificador** (`isValidCuit`) y sin duplicados; un solo email principal (el nuevo desplaza al anterior, el primero lo es por defecto); fecha de baja posterior a la de alta; obligatorios con `*`. Catálogos de ejemplo en `config/grainsClientes.js`; `clientes`/`onCreateCliente`/`onUpdateCliente` en `App.jsx` (`clientesGrains`).
  - ⚠️ **Pendientes**: selector con búsqueda (Localidad, País AFIP), campo de texto largo (Observaciones), Actualizar SISA real, y **la clave de la página web se guarda en claro** (resolver con backend).

- **`Billing/CondicionesImpositivas/`** — maestro "Condiciones impositivas" (Billing → Maestros, `/billing/condiciones-impositivas`). Listado con la **grilla estándar de maestro** (Código, Denominación, Estado, Acciones) y formulario (`/nuevo`, `/:id/ver`, `/:id/editar`) con **M-02 · Formulario por secciones**: "Datos generales" (Código*, Denominación*, Impuestos, Código fiscal) y "Comprobantes asociados" (Comprobante Factura / Nota de Crédito / Nota de Débito y sus 3 variantes MiPyme, cada uno un `Select` filtrado por su tipo + `Checkbox` "Inactivo" al final). Código sin duplicados. El original los mezclaba en una sola card de 11 campos. Pendiente: selector con búsqueda para los comprobantes (hoy `Select`). Catálogos de ejemplo en `config/billingImpositivas.js`; `condiciones`/`onCreateCondicion`/`onUpdateCondicion` en `App.jsx`.

- **`Billing/Servicios/`** — maestro "Servicios" (Billing → Maestros, `/billing/servicios`). Listado con la **grilla estándar de maestro** y formulario (`/nuevo`, `/:id/ver`, `/:id/editar`) con **M-01 · Formulario simple** (un solo grupo de pocos campos del mismo contexto, como Depósitos): Form Section "Datos del servicio" con Código*, Denominación*, Moneda / Precio unitario (el rótulo muestra la moneda elegida, ej. "Precio unitario (USD)"; validación numérica ≥ 0), Unidad de medida, Impuesto / Cuenta y `Checkbox` "Inactivo" al final. Código sin duplicados. Moneda, Unidad, Impuesto y Cuenta eran lookups: hoy `Select` (pendiente: selector con búsqueda). Catálogos de ejemplo en `config/billingServicios.js` (+ `IMPUESTOS` de `config/billingImpositivas.js`); `servicios`/`onCreateServicio`/`onUpdateServicio` en `App.jsx`.

- **`Billing/Clientes/`** — maestro "Clientes" de Billing (`/billing/clientes`; distinto de Clientes de Grains). Listado con la **grilla estándar de maestro** y formulario (`/nuevo`, `/:id/ver`, `/:id/editar`) con **M-02 · Formulario por secciones** (el catálogo `maestros.js` lista a Clientes como ejemplo de M-02): 4 Form Section — "Datos generales" (Razón social*, Nombre fantasía, Identificación fiscal (CUIT)*, Condición impositiva, Dirección, Ciudad, Número de IIBB, Observaciones, Inactivo), "Contabilidad" (Cuenta, Cliente grande), "Comercial" (Nombre y apellido / Teléfono / E-mail de contacto, Condición de venta) y "Correos" (General, Facturación, Cobranzas). El original tenía **4 tabs** con 1–9 campos cada una: sin colecciones hijas y con ~19 campos en total, las tabs ocultaban datos sin necesidad, así que pasaron a secciones apiladas. CUIT validado con dígito verificador (`isValidCuit`) y sin duplicados; e-mails validados. Supuesto: Razón social e Identificación fiscal obligatorios (el original no marcaba ninguno). Pendientes: selector con búsqueda y campo de texto largo. Catálogos de ejemplo en `config/billingClientes.js`; `clientesBilling`/`onCreateClienteBilling`/`onUpdateClienteBilling` en `App.jsx`.

- **Maestros genéricos de Billing, Grains y Access Control** — mismo mecanismo que los de Ports (`MaestroPorts.jsx`, que ahora acepta la prop `sidebar`): los maestros de esos módulos que todavía **no tienen pantalla propia** se abren con la **grilla estándar de maestro (Código, Denominación, Estado, Acciones — la de Depósitos)** y filas de ejemplo adaptadas a cada uno, desde `config/maestrosModulos.js` (`MAESTROS_BILLING` — 11 —, `MAESTROS_GRAINS` — 10 — y `MAESTROS_ACCESS_CONTROL` — 11 —; de ahí salen también los ítems del sidebar y las rutas de `App.jsx`). **Regla**: la pantalla principal de cualquier maestro nuevo usa esta grilla (Código/Denominación/Estado/Acciones) salvo que se indique otras columnas (excepciones hoy: Personas de Access Control y Clientes y Contratos de Grains, que tienen pantalla propia). Nuevo/Visualizar/Editar apuntan a rutas inexistentes (no hacen nada). Para volver real un maestro: armar su pantalla, sacarlo de la lista y registrar ruta/sidebar a mano.

- **`Operaciones/Home/`** — home del módulo Operaciones (Figma `Layout Home Module`, 456:699), armada con el template `LayoutHomeModule`. Es la ruta `/operaciones` en `App.jsx` — la pantalla que se muestra al **abrir el módulo** (a diferencia de sus maestros, ej. `Buque` en `/buques`, que se abren desde el sidebar). Se llega acá clickeando la card "Ports" en la grilla de Módulos de `Main/Home` (`MODULES[0].href = '/operaciones'` — el nombre visible es "Ports", el folder de código es "Operaciones"; ver nota de esa card abajo). Usa `OPERACIONES_SIDEBAR_PROPS` de `app/src/config/sidebars/operaciones.js`, pasado por prop (`sidebar={...}`) — distinto del sidebar de `Main` (ver nota en `Sidebar` arriba). Lo que sí es propio de esta pantalla: 4 `CardMetric` de ejemplo (KPIs de operaciones), 4 `CardQuickAccess` (uno por ítem real de Maestros/Procesos de este sidebar, con `href` real — navegan de verdad) y `ActivityList` con 5 ítems de ejemplo. Todos los datos de contenido son de ejemplo — mismo criterio que `Main/Home`.

- **`Operaciones/Buque/`** — pantalla principal del maestro "Buque" (Figma `Layout Maestro Data Grid`, 492:3534), armada con el template `LayoutMaestroDataGrid`. Es la ruta `/buques` en `App.jsx` — coincide con el `href` que ya tenía el ítem "Buque" en `OPERACIONES_SIDEBAR_PROPS`, así que clickearlo en el sidebar navega acá de verdad. Usa `sidebar={OPERACIONES_SIDEBAR_PROPS}` (mismo config que `Operaciones/Home`, no un sidebar propio de la pantalla). **Sin `breadcrumb`** (no se le pasa esa prop — la pantalla de grilla de un maestro no lo necesita, a diferencia de sus formularios). Columnas: Código (ancho fijo 120px, campo `codigo`; antes era IMO), Denominación, Estado (`Badge` — `type="success"` para "Activo", `type="neutral"` para "Inactivo") — **`Código`, `Tipo` y el resto de los campos del formulario no son columnas de la grilla** aunque cada fila los tenga; si hiciera falta mostrarlos, agregarlos a `COLUMNS`. Acciones por fila: Visualizar (`bi-eye`) y Editar (`icon-edit`) — sin eliminar ni compartir, a diferencia del ejemplo por default de `DataGrid`; **navegan** a `/buques/<id>/ver` y `/buques/<id>/editar` respectivamente (antes solo hacían `console.log`) — mismo `BuqueFormulario` del lado, distinto `mode` según la ruta (ver `BuqueFormulario` abajo y la nota de `Ruteo`). Botones de cabecera: los 3 (Nuevo/Recargar/Exportar) — "Nuevo" navega a `/buques/nuevo`. **Recibe `rows` por prop** (`App.jsx` le pasa el estado compartido `buques`) con fallback a `DEFAULT_ROWS` local (5 buques de ejemplo) si se usa la pantalla suelta sin ese prop — reemplazar `DEFAULT_ROWS`/`INITIAL_BUQUES` (en `App.jsx`) por el catálogo real. **Primera (y hoy única) pantalla del kit con `ToggleIcon`** (ver esa entrada en Componentes) — traduce `favoriteHrefs`/`onToggleFavorite` (genéricos, por href, inyectados por `App.jsx` a toda pantalla) a `favorite`/`onToggleFavorite` de `LayoutMaestroDataGrid` fijando el href `/buques` a mano.

- **`Operaciones/Buque/BuqueFormulario.jsx`** — alta/visualización/edición de un buque, armada con el template `LayoutMaestroBasico`. Una sola pantalla para las 3 rutas `/buques/nuevo`, `/buques/:id/ver` y `/buques/:id/editar` — el `mode` (`'create'`/`'view'`/`'edit'`) le llega como prop fija de `ROUTES` en `App.jsx` (ver nota de `Ruteo`), no lo decide la pantalla. Ninguna tiene ítem propio en el sidebar (`activeHref="/buques"` siempre, para que "Buque" siga resaltado). Mismo `sidebar={OPERACIONES_SIDEBAR_PROPS}` que el resto del módulo.
  - **Título y breadcrumb varían por `mode`** (`TITLES` — "Crear Buque"/"Visualizar Buque"/"Editar Buque"; breadcrumb siempre `Buque > <ese título>`).
  - **`view`**: cachea la fila (`rows.find` por `params.id`) y precarga los campos de solo lectura — cada `TextField`/`Checkbox` recibe `disabled={isView}` (ambos componentes ya soportaban `disabled`; se le sumó esa prop a `Checkbox`, que no la tenía). `onSave` no se pasa al template (`isView ? undefined : handleSave`) → el botón "Guardar" ni se renderiza (mismo patrón "el botón solo aparece si hay handler" de `LayoutMaestroBasico`/`LayoutMaestroDataGrid`). El botón de cancelar cambia de label a "Volver" (mismo botón/ícono, `cancelLabel` distinto).
  - **`edit`**: precarga los campos igual que `view` pero editables, y en vez de `onCreate` llama a `onUpdate` al guardar (reemplaza la fila por `id` en vez de agregar una nueva).
  - **`create`**: campos vacíos, llama a `onCreate`.
  - **Buque inexistente** (`view`/`edit` con un `id` que no matchea ninguna fila, ej. URL directa con id inválido): en vez de romper, se muestra el mismo shell con título "Buque no encontrado" y sin formulario — el `existing` se busca antes de todo, si no aparece se corta ahí con un `return` temprano.
  - **`Código` y `Denominación` son obligatorios** — `handleSave` valida ambos (`.trim()` vacío) antes de llamar a `onCreate`/`onUpdate`; si falla, `setErrors` pone `error`/`helperText="Campo requerido"` en el `TextField` correspondiente (ya soportaba esas props) y **no navega ni guarda nada**. El error de un campo se limpia solo en cuanto el usuario vuelve a tipear ahí (`updateField`), no hace falta reintentar el submit para verlo desaparecer. `Tipo` no es obligatorio.
  - **Template M-02 · Formulario por secciones** (`LayoutMaestroFormulario`). Tres Form Section + un Accordion colapsado al final: **Datos generales** (Código, Denominación, IMO / Tipo, Bandera, Naviera — cada uno un par código + denominación / `Checkbox` Inactivo), **Dimensiones** (Eslora, Manga, Puntal / Coeficiente), **Tonelaje y capacidad** (VRN, TRN, TBT / TPC, Lastre) y `Accordion` **Datos adicionales (opcional)** (Calado de entrada, Calado de salida, Año de construcción, Indicativo de llamada, Matrícula). ⚠️ El grupo "Tonelaje y capacidad" es una inferencia a partir de la pantalla de referencia (no está en Figma): validar. **Tipo/Bandera/Naviera** son dos `TextField` (código + denominación) bajo una misma etiqueta (`LookupField`, local al archivo): **no existe todavía un componente de selector con búsqueda** (el diseño original abre un catálogo con un ícono) — hay que armarlo en `components/`. Estado en un solo objeto `values` (`EMPTY` define las claves); `tipo` (string original de las filas) sigue guardándose, copia de `tipoDenominacion`.

- **`Operaciones/Deposito/`** — maestro "Depósitos" del módulo Ports (Operaciones). Ítem "Depósitos" en el grupo Maestros de `OPERACIONES_SIDEBAR_PROPS` (`/depositos`; ícono `app-window` como placeholder, no hay ícono definido en Figma todavía).
  - **`Deposito.jsx`** — grilla con `LayoutMaestroDataGrid`, **mismas columnas que la de Buque** (Código 120px, Denominación, Estado con `Badge`), acciones Visualizar/Editar, botones Nuevo/Recargar/Exportar y `ToggleIcon` de favorito (href `/depositos`). Sin checkbox de selección (ver `DataGrid`). Recibe `depositos` por prop; fallback a `DEFAULT_ROWS`.
  - **`DepositoFormulario.jsx`** — alta/visualización/edición (`/depositos/nuevo`, `/depositos/:id/ver`, `/depositos/:id/editar`, mismo patrón de `mode` que `BuqueFormulario`), con el template **M-01 · Formulario simple** (`LayoutMaestroFormulario`, una sola Form Section "Datos del depósito"): `FormRow` con Código, Denominación y Código LOT, y al final de la misma sección los `Checkbox` Actualiza Stock, Depósito Fiscal, Trabaja con sectorización e Inactivo (este último deriva `estado` Activo/Inactivo de la grilla). Código y Denominación son obligatorios. Modo `view`: todo `disabled`, sin Guardar, "Volver". Depósito inexistente: shell con "Depósito no encontrado" (`LayoutMaestroBasico`, como Buque).
  - **Datos compartidos**: `depositos`/`onCreateDeposito`/`onUpdateDeposito` viven en `App.jsx` (`INITIAL_DEPOSITOS`, `addDeposito`, `updateDeposito`).

- **Home de los 22 módulos nuevos** (`FreeZone`, `Tax`, `Truckshift`, `CustomPy`, `Dashboard`, `Tos`, `Audit`, `HumanResources`, `AccessControl`, `Scales`, `Billing`, `Accounting`, `Purchases`, `Containers`, `Afip`, `Ia`, `Devops`, `Treasury`, `Grains`, `Services`, `Stock`, `ExternalUsers` — carpetas en `app/src/modules/`) — a pedido, se generó en bloque un shell para cada uno de los módulos de `ALL_MODULES` que todavía no tenía pantalla propia (todos menos "Ports"/`Operaciones`, el único armado a mano), siguiendo exactamente el mismo patrón que `Operaciones/Home` (ver esa entrada arriba): un `config/sidebars/<slug>.js` propio (`brandLabel`/`brandIcon`/`brandAccent` tomados de la entrada correspondiente en `ALL_MODULES`, 2 grupos "Maestros"/"Procesos" con 2-3 ítems placeholder cada uno, mismas `companies`/`user` que el resto de los sidebars) + un `modules/<Módulo>/Home/Home.jsx` con `LayoutHomeModule` (4 `CardMetric`, "Acceso rápido" armado con `favoriteQuickAccess` a partir de los favoritos reales — ver nota de `LayoutHomeModule`/`ToggleIcon`, ya no un `QUICK_ACCESS` hardcodeado como en la versión original de este bloque, 4 `ActivityList`) + su ruta en `ROUTES` de `App.jsx` (`/<slug>`) + `href` en `ALL_MODULES`. Sin frame de Figma para ninguno de los 22 — todo el contenido (KPIs, actividad, nombres de maestros/procesos de cada sidebar) es de ejemplo, inventado a partir del nombre/descripción de cada módulo en `ALL_MODULES`, mismo criterio que ya usa `Operaciones/Home`/`Main/Home` para datos de contenido.
  - **Ningún ítem de sidebar de estos 22 módulos tiene pantalla propia todavía** (mismo estado inicial que tuvo `Operaciones` antes de construirse `Buque` — `Clientes`/`Tipos de turnos`/`Nueva Operación` siguen sin ruta hoy) — son placeholders de navegación, `icon: 'app-window'` en cada ítem (mismo criterio que `MAIN_SIDEBAR_PROPS` para ítems sin ícono definido en Figma, ver esa nota). Construir el maestro real de alguno (ej. "Proveedores" de Purchases) es trabajo aparte, no alcanza con este shell.
  - **Gap encontrado y corregido de paso**: `accent: 'neutral'` (usado por `access-control`/`devops`/`stock` en `ALL_MODULES`) ya tenía soporte en `CardModule.module.css` (`.iconBadge[data-accent='neutral']`, con nota explícita de por qué no es uno de los 8 accents con nombre propio) pero **no** en `Sidebar.module.css` — como ninguno de esos 3 módulos tenía `href` antes de este cambio, su `brandIconBox` con accent `neutral` nunca se había renderizado de verdad. Se agregó `.brandIconBox[data-accent="neutral"]` (mismos tokens que `CardModule`: `--color-surface-selected`/`--color-text-secondary`) y el mismo accent en `ACCENT_COLORS` de `utils/moduleFavicon.js` (mismos hex, hardcodeados por la razón ya documentada ahí) — sin este fix, el isotipo de esos 3 módulos en el Sidebar y el favicon de su pestaña habrían quedado sin estilo/con el fallback azul de `moduleFavicon.js`. Verificado en el navegador: `/access-control` — `brandIconBox` resuelve `background: rgb(241, 242, 244)` / `color: rgb(106, 120, 131)`, exactamente `--color-surface-selected`/`--color-text-secondary`.

- **`AsistenteIA/`** — el chatbot de IA ("Pharo IA"), armado con el template `LayoutChat`. Es la ruta `/asistente-ia` en `App.jsx`. **Cross-módulo, igual que `Main`** — no pertenece a ningún módulo de negocio (por eso el folder no cuelga de ningún módulo puntual), se llega ahí desde el Buscador de **cualquier** TopBar (ver la nota de "Buscador → chatbot de IA" en Ruteo arriba) o navegando dentro del propio chat (conversaciones existentes, "Nuevo chat", suggestion cards). Usa `sidebar={MAIN_SIDEBAR_PROPS}` — no hay `activeHref` que le corresponda (no es un ítem de ningún sidebar), así que ningún ítem queda resaltado, mismo comportamiento aceptado que tendría cualquier pantalla fuera de la navegación normal.
  - **Estado de conversaciones/mensajes vive en `AsistenteIA.jsx`** (`useState`, no hay backend todavía) — `LayoutChat` es puramente presentacional (ver nota en Templates arriba). `SEED_CONVERSATIONS` son 7 conversaciones de ejemplo agrupadas en "Hoy"/"Ayer"/"Última semana", cada una con su intercambio inicial ya resuelto — reemplazar por el historial real del usuario cuando exista backend.
  - **`getMockResponse(query)` es un respondedor mock por palabra clave** (sin integración real de IA todavía — placeholder documentado a propósito, no un descuido): `"cliente"` → busca en dos clientes de ejemplo (`MARTIN_COMPARETTO`/`CAPUTO_ASOCIADOS`) y arma un `ChatResultCard` con acción "Descargar PDF"; `"pedido"` → lista de pedidos abiertos de ejemplo; `"resumen"`/`"cuenta"`/`"factura"` → resumen de cuenta de ejemplo (también con PDF); `"contrato"` → respuesta textual sin datos (no hay flujo de contratos armado todavía); cualquier otra cosa → texto genérico que aclara explícitamente que es una respuesta de ejemplo sin IA real conectada. Reemplazar por la integración real cuando exista — la función es el único lugar que hay que tocar, `LayoutChat`/`ChatMessage`/`ChatResultCard` no cambian.
  - **"Descargar PDF" genera un PDF real** (no un mock ni un `.txt` disfrazado) vía `utils/simplePdf.js` (`generateSimplePdf` + `downloadBlob`, sin dependencias — un único objeto de página, fuente Helvetica con `WinAnsiEncoding` para que tildes/ñ se vean bien, xref armado a mano). Verificado con `file` (`PDF document, version 1.4, 1 pages`).
  - **Enviar un mensaje sin conversación activa** (`activeConversationId === null`, el estado "Nuevo chat") crea una conversación nueva en el grupo "Hoy" con el texto tipeado como título (recortado a 48 caracteres) y la selecciona — a partir de ahí los mensajes siguientes se agregan a esa misma conversación.
  - **`pendingQuery`/`onConsumePendingQuery`** (props que le inyecta `App.jsx`, ver Ruteo arriba): al montar, si hay una consulta pendiente (llegó desde el Buscador de otra pantalla), arranca la conversación automáticamente con esa consulta — un `useRef` (`consumedInitialQuery`) evita que se vuelva a disparar si el componente re-renderiza antes de que `App.jsx` termine de limpiar `pendingQuery`.

## Cómo agregar un componente nuevo

1. Seleccionar el componente en la app de escritorio de Figma (el MCP necesita una selección activa) y traer `get_design_context`.
2. Crear su carpeta en `app/src/components/<Nombre>/` con `<Nombre>.jsx` + `<Nombre>.module.css`.
3. Tokens desde `tokens/tokens.css` — si falta alguno, agregarlo ahí.
4. Si tiene estados interactivos (dropdown, hover, etc.), implementarlos igual que el diseño documenta y probarlos en el navegador antes de darlo por terminado.
5. Componentes controlados cuando tenga sentido (value/onChange) para que se puedan componer entre sí.
6. Agregar la entrada en "Componentes disponibles".
7. **Si el componente no viene de Figma (lo crea la IA para resolver una pantalla), declararlo explícitamente al usuario** (ver Regla general, punto 3): decir en la respuesta que se creó un componente nuevo fuera de la documentación, con su API y los supuestos tomados, y dejar en su entrada de este archivo la marca "Sin frame de Figma — pendiente de validar con diseño".

## Cómo agregar un template nuevo

1. Confirmar que realmente es un patrón reutilizable (se va a repetir en más de una pantalla) — si es específico de una sola pantalla, va directo en `modules/`, no acá.
2. Crear `app/src/templates/<Nombre>/<Nombre>.jsx` + `.module.css`, componiendo `components/` existentes.
3. No hardcodear datos de negocio — el template recibe todo por props.
4. Agregar la entrada en "Templates disponibles". Si el template no viene de Figma, declararlo explícitamente (Regla general, punto 3) y marcarlo "Sin frame de Figma — pendiente de validar con diseño".

## Cómo agregar una pantalla nueva a un módulo

1. Si el módulo no tiene carpeta todavía, crear `app/src/modules/<Módulo>/`.
2. Crear `modules/<Módulo>/<Pantalla>/<Pantalla>.jsx`, usando el template correspondiente de `templates/`.
3. Si hace falta un template que no existe, armarlo primero (ver arriba) — no improvisar el layout dentro de la pantalla — y **declararlo explícitamente** al usuario y en este archivo (ver Regla general, punto 3).
