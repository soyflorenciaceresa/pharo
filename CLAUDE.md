# CLAUDE.md — Pharo Prototyping Kit

Este kit existe para prototipar rápido reutilizando los componentes del design system (Figma: *Pharo Design System*), verificados uno por uno antes de sumarse.

Es una única app React (Vite) en `app/`. No hay versión vanilla — se eliminó a favor de esta.

## Estructura

```
app/src/
  components/   ← piezas reutilizables del design system (Sidebar, TopBar, LanguageSelector, futuros Button/Table/etc.)
  icons/        ← set de íconos compartido (bi-*)
  templates/    ← patrones de pantalla genéricos y reutilizables (ej. LayoutBase)
  modules/      ← un folder por módulo del sistema (ej. Operaciones), con las pantallas reales de ese módulo
  styles/       ← estilos globales (no de un componente puntual)
```

**La diferencia entre `components/`, `templates/` y `modules/`:**

- **`components/`** — piezas chicas y reutilizables en cualquier contexto (un Sidebar, un botón, un selector).
- **`templates/`** — composiciones genéricas de components que definen la estructura de una pantalla (ej. "sidebar + topbar + área de contenido"), sin datos ni lógica de negocio específica. Un template no sabe nada de "Proveedores" ni de ningún módulo — solo define el esqueleto.
- **`modules/<Módulo>/`** — las pantallas reales del sistema, agrupadas por módulo de negocio. Cada pantalla usa un template y le pone los datos/contenido específicos.

## Flujo para armar una pantalla nueva

1. En Figma, armar la pantalla insertando **instancias** de los componentes que ya existen (`SidebarFinal`, `TopBar`, etc.) — nunca recrearlos.
2. Identificar qué template le corresponde (¿es una pantalla de listado? ¿un formulario? — si no existe ese template todavía, armarlo primero en `templates/`).
3. Crear la pantalla dentro de `modules/<Módulo>/<Pantalla>/`, usando el template + los datos/contenido de esa pantalla puntual.
4. Si el pedido no aclara el módulo o el template a usar, preguntar antes de adivinar.

Ejemplo de pedido bien formado: *"Con el template de Pantalla de Listado, creá una pantalla dentro del módulo Operaciones. Debe tener: [datos/columnas/contenido específico]."*

## Regla general

1. Componer usando **solo** lo que ya existe documentado en este archivo. Nunca regenerar el markup o los estilos de un componente/template ya construido.
2. Si hace falta un componente o template que **no existe todavía**, avisar explícitamente en la respuesta en vez de improvisar una versión ad-hoc dentro de una pantalla — hay que agregarlo en su lugar correspondiente (`components/` o `templates/`) primero.
3. Los colores, spacing y radios salen siempre de `tokens/tokens.css` — el **único** archivo de tokens del kit. Nunca duplicar tokens ni hardcodear valores nuevos.
4. Cada componente expone su estado/datos por **props**, y su interacción por **eventos/callbacks** — la pantalla resuelve la lógica funcional (routing, validaciones, llamadas a API mock) escuchando esos callbacks, sin tocar el componente.
5. Un componente por carpeta (`Nombre.jsx` + `Nombre.module.css`), con CSS Modules para que los estilos no choquen entre sí.

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
- El ítem de nav activo y la empresa activa son semi-controlados: se inicializan por `defaultActiveHref`/`defaultActiveCompanyId`, y a partir de ahí el propio componente mueve el estado, avisando por los callbacks.
- **El diseño del `Sidebar` es siempre el mismo — lo que cambia es el contenido, y cambia POR MÓDULO (no por pantalla, no globalmente para toda la app).** Dentro de un mismo módulo, todas sus pantallas comparten un único contenido de sidebar (isotipo, logotipo, accent, grupos/ítems, companies, user) — eso no puede variar de pantalla a pantalla. Pero cada módulo tiene su propio contenido, distinto al de los demás. Cada módulo tiene su config en `app/src/config/sidebars/<módulo>.js` (hoy: `main.js` → `MAIN_SIDEBAR_PROPS`, `operaciones.js` → `OPERACIONES_SIDEBAR_PROPS`) — nunca hardcodear `brandLabel`/`groups`/etc. inline en una pantalla, siempre importar el config del módulo correspondiente. `brandIcon` = isotipo, `brandLabel` = logotipo (texto), `brandAccent` = color del badge del isotipo, uno de los 8 nombres fijos de la paleta de acento (`blue` default, `violet`, `green`, `amber`, `red`, `cyan`, `pink`, `indigo` — mismos tokens `color/accent/<n>`/`color/accent/<n>-subtle` que `CardModule`), tiñe el fondo+ícono del badge vía `[data-accent]` en `Sidebar.module.css`.
  - **`LayoutBase`** (el template de más bajo nivel) acepta `sidebarProps` completo — es intencionalmente genérico, cualquier pantalla que lo use directo (hoy: `Main/Home`) importa el config de su módulo y arma `{ ...MODULO_SIDEBAR_PROPS, onNavigate, ... }` ella misma.
  - **Los templates más específicos (`LayoutHomeModule`, `LayoutMaestroDataGrid`) reciben el config del módulo por prop (`sidebar`)** — no lo importan ni lo hardcodean internamente, así una misma instancia de template sirve para cualquier módulo. Además aceptan los 4 callbacks de interacción (`onNavigate`, `onCompanyChange`, `onLogout`, `onToggle`) y arman `{ ...sidebar, defaultActiveHref: activeHref, ...callbacks }` internamente antes de pasárselo a `LayoutBase`. La pantalla sigue sin poder inventar su propio `brandLabel`/`groups`/etc. — solo puede elegir *cuál* config de módulo usar, no modificarlo.
- **Íconos:** prefijo `bi-*` = aproximaciones dibujadas a mano de Bootstrap Icons; prefijo `icon-*` = trazas vectoriales exactas de Figma, no dibujadas a mano. Módulo `Operaciones` (página *Sidebar*, nodos 442:598, 450:679, 450:694, 450:693, 450:692, 450:691, 450:690): `icon-gear`, `icon-maestros`, `icon-buques`, `icon-clientes`, `icon-tipos-turnos`, `icon-nueva-operacion`. Módulo `Main` (nodos 438:3087–497:4644, ver `Main/Home` abajo): `icon-administracion`, `icon-usuarios`, `icon-roles-perfiles`, `icon-empresas`, `icon-modulos`, `icon-gear` (reusado — mismo glyph que "Configuración" de Main y que "Procesos" de Operaciones en Figma), `icon-parametros`, `icon-email`, `icon-datos-maestros`, `icon-paises`, `icon-monedas`, `icon-integraciones`, `icon-importar-novedades`, `icon-tokens-acceso`. `app-window` (isotipo de Main, 496:4632/496:4633) también es trazo exacto — se actualizó de una aproximación con `<rect stroke>` al trazo real la primera vez que se necesitó el asset. Los íconos de items/subitems del nav se renderizan a 16px (`.icon` en `Sidebar.module.css`).
- **Nombres largos de items/subitems:** siempre una sola línea, se truncan con `…` (`white-space: nowrap` + `text-overflow: ellipsis`) — nunca pasan a dos líneas. El nombre completo se ve al hacer hover vía `title` nativo del navegador (funciona igual colapsado o expandido, no lo recorta el `overflow: hidden` del sidebar).

### `TopBar` — `app/src/components/TopBar/`

Origen: Figma *Pharo Design System*, nodo `TopBar` (44:90).

```jsx
<TopBar />
```

Hoy no recibe props — compone `LanguageSelector` internamente. Si se necesita controlar el idioma desde afuera, levantar el estado a props (`language`, `onLanguageChange`) en vez de improvisar una segunda fuente de verdad.

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

**Variantes de color por módulo** (Figma, sección *Card-Module — Color accents*, página *Cards*, 446:14 — 14 cards, cada una un módulo real de `Main/Home`, ver esa entrada abajo): prop `accent` en `CardModule.jsx`, mismo patrón `[data-accent]` que `Sidebar.module.css`. 8 nombres fijos + `neutral` (gris, sin equivalente en la paleta de acento de Figma — lo usan 2 de los 14 módulos reales en vez de un color; mismos tokens que `StatusChip` `tone="neutral"` de `DataGrid`):

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

**Ambas cards comparten:**
- Mismo shell que `CardMetric` (`surface/card`, `color/border/default`, `radius/card`, ancho fluido `min-width: 169px`) pero sin la franja de acento — no se refactorizó a un "Card" base compartido todavía, cada una tiene su propio CSS.
- Hover es solo sombra sutil (dos capas, sin cambio de borde) — distinto del hover de `CardMetric`, que sí tiene borde + sombra más marcada. Son recetas de sombra reales de Figma, no inventadas.
- El ícono de badge (`app-window`) es un glyph propio de Figma, no un ícono de Bootstrap — vive en `icons.jsx` junto a los `bi-*` pero con nombre distinto para no confundirlo. Pasale otro `icon` (cualquier key de `ICONS`) si el módulo/acceso necesita uno distinto.
- Ambas son `<button>` (o `<a>` si les pasás `href`) — clickeables de verdad, no un `div` con `onClick`.
- Íconos de los 14 módulos reales (`icons.jsx`): `icon-truckshift`, `icon-check2circle`, `icon-box` son trazos nuevos, exactos de Figma. `bi-cart` se actualizó de aproximación dibujada a mano a trazo exacto (asset real de "Purchases", 445:56) — ya no está pendiente de reemplazo.

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

### `ButtonPrimary` / `ButtonSecondary` — `app/src/components/ButtonPrimary/`, `app/src/components/ButtonSecondary/`

Origen: Figma, `Button/Primary` (10:127) y `Button/Secondary` (261:228) — variantes Size (Medium/Large) × Icon (None/Leading/Trailing/Only) × State (Default/Hover/Pressed/Focus/Disabled/Loading).

```jsx
import ButtonPrimary from '../../components/ButtonPrimary/ButtonPrimary.jsx';
import ButtonSecondary from '../../components/ButtonSecondary/ButtonSecondary.jsx';

<ButtonPrimary label="Guardar" onClick={() => ...} />
<ButtonPrimary label="Guardar" size="lg" icon="leading" iconName="bi-box-arrow-right" />
<ButtonPrimary icon="only" iconName="bi-cart" label="Carrito" />   {/* label pasa a aria-label */}
<ButtonPrimary label="Guardando" loading />
<ButtonSecondary label="Cancelar" disabled />
```

- **`state` de Figma (Hover/Pressed/Focus) no es un prop** — son estados reales del navegador (`:hover`, `:active`, `:focus-visible`) resueltos en CSS, no algo que la pantalla setee a mano. Solo `disabled` y `loading` son props (booleanos), porque son los dos únicos estados que dependen de lógica de la app.
- Props: `label`, `size` (`'md'` default | `'lg'`), `icon` (`'none'` default | `'leading'` | `'trailing'` | `'only'`), `iconName` (key de `icons.jsx`, ignorado si `icon='none'`), `loading`, `disabled`, más cualquier prop nativa de `<button>` (`onClick`, `type`, `aria-label`, etc. — se pasan directo).
- `icon="only"`: no renderiza label visible; `label` se usa como `aria-label` automático salvo que se pase uno explícito.
- `loading`: fuerza `disabled` + `aria-busy`, reemplaza el ícono (o agrega uno si `icon='none'`) por un spinner animado en la misma posición que hubiera tenido el ícono normal.
- Foco con `outline` (no `border`) para no correr el layout al enfocar — mismo criterio que ya usa `Sidebar.module.css`.
- Tokens nuevos en `tokens.css` (`--color-action-hover`, `--color-action-secondary-hover-bg`, `--color-action-secondary-pressed-bg`, `--color-text-disabled`, `--color-border-focus`) — el resto de los colores reusa `--color-primary-*`/`--color-surface-*`/`--color-border-default` ya existentes.
- `icon-spinner` en `icons.jsx` es un arco vía `stroke-dasharray` (no un trazo exacto de Figma, que usa una máscara de relleno) — mismo look de anillo abierto, girado con `@keyframes` + `prefers-reduced-motion`.

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

- **`Focus` de Figma tampoco es un prop** (mismo criterio que `ButtonPrimary`/`ButtonSecondary`) — es el `:focus` real del `<input>`, incluido el grosor de borde 1px→2px que muestra el diseño (sin saltos de layout porque `box-sizing: border-box` mantiene fijo el tamaño total). `Default` es simplemente el estado sin foco.
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

- `<input type="checkbox">` real (accesible, `label` con `htmlFor`/`id` vía `useId()` si no se pasa `id`) posicionado invisible sobre la caja visual — mismo patrón de accesibilidad que `RowCheckbox` de `DataGrid` y que `TextField`.
- No comparte código con `RowCheckbox` (que sigue viviendo dentro de `DataGrid.jsx`, con su lógica propia de indeterminate) — mismo criterio ya establecido en el kit de "cada uno su propio CSS/lógica, no refactorizar a una base común antes de que haga falta de verdad".
- **`disabled`** (agregado para el modo "Visualizar" de `BuqueFormulario`): deshabilita el `<input>` real y aplica el mismo tratamiento visual que `TextField` (`--color-surface-input-disabled`/`--color-border-input-disabled`/`--color-text-disabled`) — el estilo `disabled` gana sobre `checked` si están ambos (orden de las reglas en el CSS). Sin prop `indeterminate` todavía — agregarla si algún formulario real la necesita (no confundir con el indeterminate de `RowCheckbox`/select-all en `DataGrid`, que es un caso distinto).

### `DataGrid` — `app/src/components/DataGrid/`

Origen: Figma, página *Data Grid* (304:388) — header row + filas con celda de checkbox, columnas de texto, `Status Chip` y celda de acciones (editar/eliminar/compartir). El buscador arriba de la tabla **no** está en el frame de Figma — se agregó a pedido, reusando `TextField` (sin label).

```jsx
import DataGrid, { StatusChip } from '../../components/DataGrid/DataGrid.jsx';

<DataGrid
  columns={[
    { key: 'nombre', label: 'Nombre' },
    { key: 'descripcion', label: 'Descripción' },
    { key: 'estado', label: 'Estado', render: (row) => <StatusChip label={row.estado.label} tone={row.estado.tone} /> },
    // { key: 'x', label: 'X', width: 120 } — width fijo opcional; sin width, la columna es flex:1 (como en Figma)
  ]}
  rows={[
    { id: 1, nombre: 'Ana Torres', descripcion: 'Informe mensual', estado: { label: 'Verified', tone: 'success' } },
    // id es obligatorio — se usa para selección y como key de React
  ]}
  selectable                          // agrega la columna de checkbox; default false
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

- **Buscador (`TextField` reusado, sin label)**: filtra las `rows` en el cliente, buscando el término (case-insensitive) en el texto de **todas** las columnas — incluida `estado`, comparando contra `.label` cuando la celda es un objeto (`{ label, tone }`) en vez de string. No hace falta marcar columnas como buscables. Vive **dentro** del mismo contenedor con borde/radio que la tabla (no arriba, en un toolbar aparte) — alineado a la derecha, con un divisor (`border-bottom`) que lo separa del header row, igual que el resto de las filas.
- **Selección semi-controlada** (mismo criterio que `Sidebar`/`Accordion`): el componente maneja el `Set` de ids seleccionados con `useState` y avisa por `onSelectionChange`; no hay prop `selected` controlada todavía — agregarla si algún caso de uso real la necesita. El checkbox del header soporta estado indeterminado (algunos, no todos, de las filas *visibles tras el filtro* están seleccionados) y el "seleccionar todo" opera solo sobre esas filas visibles — la selección de filas ocultas por el buscador se preserva.
- **`StatusChip`** (exportado aparte, no default): `tone` es uno de `success`/`warning`/`danger`/`primary`/`neutral`. Fondo "subtle" + texto del color sólido — el fondo no es una variable de Figma (es el mismo color base con opacidad ~15% aplicada a la capa), así que se resolvió el blend sobre blanco como tokens nuevos (`--color-success-subtle`, `--color-warning-subtle`, `--color-danger-subtle`) en vez de usar la paleta `--color-accent-*-subtle` de `CardModule` — mismo criterio que separa `color/accent/red` de `color/danger/default` (ver nota de `CardModule`), un estado de fila no es un acento de módulo. Tokens nuevos: `--color-success-default`, `--color-success-subtle`, `--color-warning-default`, `--color-warning-subtle`, `--color-danger-subtle` (`--color-danger-default` ya existía). `tone="primary"` reusa `--color-primary-default`/`--color-primary-subtle` existentes; `tone="neutral"` (ej. "Inactivo") no tiene equivalente en el frame original de Figma — se agregó reusando `--color-surface-selected`/`--color-text-secondary` ya existentes, sin token nuevo.
- **Fila `Hover`/`Selected`**: a diferencia del markup de Figma (que pinta el fondo celda por celda), acá el fondo vive en el contenedor de la fila (`background: transparent` en cada celda) — mismo resultado visual, menos repetición. `Selected` usa `--color-surface-selected`: es un estado puramente por selección (no hay concepto de fila "activa" separado).
- **`actions` es un array genérico** (`{ key?, icon, label, onClick }`), no las 3 acciones fijas de Figma (editar/eliminar/compartir) — el frame original solo tenía esas tres, pero un maestro real puede necesitar otra combinación (ej. `Buque` usa "Visualizar"/"Editar", sin eliminar ni compartir). `icon-edit`/`icon-delete`/`icon-share` en `icons.jsx` son trazado vectorial exacto de los assets de Figma de esta celda; `bi-eye` (visualizar) no tiene equivalente en el frame de Data Grid, así que es una aproximación dibujada a mano, mismo criterio que el resto de `bi-*`.
- El checkbox (`RowCheckbox`, interno del archivo) es un `<input type="checkbox">` real posicionado sobre una caja visual — accesible por teclado/lector de pantalla, no un `div` con `onClick`. El tick es el trazo exacto de Figma (`Frame` dentro de la celda checkbox seleccionada, 278:6).
- Ancho fijo solo en columnas checkbox (56px) y acciones (132px), igual que Figma — el resto de las columnas son `flex:1 0 0` a menos que la screen pase `width` explícito por columna.

### `FormContainer` — `app/src/components/FormContainer/`

Origen: Figma, página *Form Container* (469:48), componente `Form/Container` en su versión actual (ícono + título + línea divisoria + Content — sin fila de acciones, esa sección se borró en Figma en un ajuste posterior).

```jsx
import FormContainer from '../../components/FormContainer/FormContainer.jsx';
import TextField from '../../components/TextField/TextField.jsx';

<FormContainer icon="icon-buques" title="Nuevo proveedor">
  <TextField label="Nombre" value={...} onChange={...} />
  <TextField label="CUIT" value={...} onChange={...} />
</FormContainer>
```

- Props: `icon` (key de `icons.jsx`, default `'app-window'`), `title`, `children` (el Content — cualquier cosa, sin restricción).
- Estructura idéntica a la mitad de arriba de `Accordion` (mismo ícono badge, mismo `Heading/H3` para el título, mismo divisor, mismo padding) pero sin flecha ni collapse — es siempre-expandido. No se compartió CSS entre los dos todavía (mismo criterio que `CardMetric`/`CardQuickAccess`/`CardModule`: "cada una tiene su propio CSS", no se refactorizó a una base común).
- Token `--color-primary-subtle` (ya agregado para `Accordion`) — el resto reusa `--color-surface-card`/`--color-border-default`/`--radius-card`/`--spacing-*` ya existentes.

**Notas de la etapa en Figma (por si se retoma el `Form/Container` de Figma para otra cosa):** ahí `Content` es una property `SLOT` a nivel de esquema (Figma no deja agregar contenido libre dentro de una instancia por script — `"Cannot move node. New parent is an instance or is inside of an instance"`), y quedaron 4 properties huérfanas (`Title`/`Description`/`Show Description`/`Show Secondary Action`) sin conectar a ninguna capa visible desde que se editó a mano. Ninguna de las dos cosas aplica acá — en React `Content` es `children` sin restricciones, y `title` es un prop normal.

### `Accordion` — `app/src/components/Accordion/`

Origen: Figma, página *Accordion* (478:22) — mismo formato de card que `Form/Container` (mismos tokens: `surface/card`, `color/border/default`, `radius/card`, drop-shadow, `spacing/lg`), header con ícono + título igual a `Form/Header`, más una flecha para desplegar. Demo en la misma página: "Datos del buque" (Nombre del buque, IMO, Bandera, Eslora), con `Text field` real dentro del Content.

```jsx
import Accordion from '../../components/Accordion/Accordion.jsx';

<Accordion icon="icon-buques" title="Datos del buque" defaultExpanded={false} onToggle={(expanded) => ...}>
  {/* cualquier contenido — Text Field, Checkbox, otro Accordion, lo que sea */}
</Accordion>
```

- **`Expanded` de Figma no es un prop de estado controlado** — es semi-controlado, mismo criterio que `Sidebar`: `defaultExpanded` (default `true`, igual que en Figma) siembra el estado inicial, el propio componente lo maneja con `useState` a partir de ahí, y avisa por `onToggle(expanded)`. Clickear el header togglea.
- **`children` es el Content** — en Figma esto es una instancia reusada de `Form/Content` (con la limitación de que Figma no deja meter contenido libre dentro de una instancia por script); en React no hay ninguna limitación, `children` es simplemente lo que sea que la pantalla necesite ahí.
- La flecha rota con CSS real (`transform: rotate(90deg)` cuando está expandido) y el contenido se expande/colapsa con la misma animación `grid-template-rows: 0fr → 1fr` que ya usa `Sidebar` para sus grupos de nav — no hay nada de esto en Figma (ahí la flecha queda fija y el estado se ve como dos instancias separadas), es interacción pura de código.
- Token nuevo en `tokens.css`: `--color-primary-subtle` (fondo del badge del ícono) — el resto reusa `--color-primary-default`/`--color-surface-card`/`--color-border-default`/`--radius-card`/`--spacing-*` ya existentes.

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

## Templates disponibles (`app/src/templates/`)

### `LayoutBase` — `app/src/templates/LayoutBase/`

Sidebar + TopBar + área de contenido. Es el esqueleto de cualquier pantalla interna del sistema (todo lo que no sea login/pantallas públicas).

```jsx
import LayoutBase from '../../templates/LayoutBase/LayoutBase.jsx';

<LayoutBase sidebarProps={{ groups, companies, user, /* ...ver props de Sidebar */ }}>
  {/* contenido específico de la pantalla */}
</LayoutBase>
```

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
- Las secciones de texto (`sectionTitle` 24px/700/1.2, `sectionSubtitle` 14px/400/1.4) replican los estilos `Heading/H2`/`Body/Base` de Figma — mismos valores que ya usaba `Main/Home`, ahora centralizados acá.

### `LayoutMaestroDataGrid` — `app/src/templates/LayoutMaestroDataGrid/`

Origen: Figma, frame `Layout Maestro Data Grid` (492:3534) — pantalla principal de un maestro (ej. al clickear "Buque" en el sidebar, esta es la primera pantalla que aparece). Compone `LayoutBase` (Sidebar + TopBar) y, dentro: breadcrumb + título (`Heading/H2`) + fila de botones (`Nuevo`/`Recargar`/`Exportar`) a la derecha, y debajo el `DataGrid` (que ya trae su propio buscador arriba de la tabla).

```jsx
import LayoutMaestroDataGrid from '../../../templates/LayoutMaestroDataGrid/LayoutMaestroDataGrid.jsx';
import { StatusChip } from '../../../components/DataGrid/DataGrid.jsx';
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
    { key: 'estado', label: 'Estado', render: (row) => <StatusChip label={row.estado.label} tone={row.estado.tone} /> },
  ]}
  rows={rows}
  selectable
  actions={[{ key: 'edit', icon: 'icon-edit', label: 'Editar', onClick: (row) => ... }]}
/>
```

- **Mismo criterio que `LayoutHomeModule`** — recibe el config del sidebar del módulo por prop (`sidebar`), nunca lo hardcodea ni permite que la pantalla invente su propio `brandLabel`/`groups`/etc. (ver nota en `Sidebar` arriba). `activeHref` se pasa como `defaultActiveHref` al `Sidebar` — como cada navegación remonta la pantalla completa (ver `App.jsx`), esto alcanza para que el ítem resaltado siempre coincida con la pantalla actual sin manejar estado extra.
- **Los 3 botones de acción son opcionales e independientes** — cada uno solo se renderiza si se pasa su `on*` correspondiente (mismo patrón que `actions` de `DataGrid`, donde cada acción de fila aparece solo si hay handler). Los labels (`newLabel`/`reloadLabel`/`exportLabel`) tienen default en español pero son overrideables por si un maestro necesita otro texto.
- **Botones reusan `ButtonPrimary`/`ButtonSecondary`** ya existentes (`Nuevo` = primary, `Recargar`/`Exportar` = secondary), tamaño `md` default — coincide con el size de Figma sin pasar prop. Íconos nuevos en `icons.jsx` (`icon-plus`, `icon-refresh`, `icon-export`): trazado vectorial exacto de los assets de Figma de esta pantalla (`PlusLg`, `ArrowClockwise`, `BoxArrowRight`), con el fill original reemplazado por `currentColor` para heredar el color de texto del botón.
- **Breadcrumb**: array de `{ label }`, separados con el ícono ya existente `bi-chevron-right` (no se agregó un ícono nuevo — Figma trae un chevron con fill sólido distinto, pero visualmente es el mismo glyph que ya está en el set). El color de texto del breadcrumb en Figma es un hex suelto (`#9ca3af`) sin variable asociada, mientras que el ícono al lado sí está atado a `color/icon/default` (`#6a7883`, mismo valor que `--color-text-secondary`) — se usó `--color-text-secondary` para ambos por consistencia, tratando el hex suelto como un descuido del archivo de Figma (mismo criterio aplicado antes en `CardMetric`).
- El título usa `--color-text-default` (no `black` literal, que es lo que trae Figma sin token) — mismo criterio que el resto de los `Heading/H2` del kit.

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

- **Mismo criterio de sidebar por módulo, breadcrumb y título que `LayoutMaestroDataGrid`** — ver esas notas arriba, aplican igual acá.
- **`onSave`/`onCancel` son independientes**, mismo patrón que los botones de `LayoutMaestroDataGrid` — cada uno se renderiza solo si se pasa su handler. `ButtonPrimary` para Guardar, `ButtonSecondary` para Cancelar, tamaño `md` default. Íconos nuevos en `icons.jsx` (`icon-check2`, `icon-close`): trazado exacto de los assets de Figma de esta pantalla (`Check2`, `XLg`).
- **`FormContainer` no se modificó** — su `.content` ya es `flex-direction: column`, pensado para cualquier contenido (una fila, varias, un `Accordion`, etc.); si una pantalla necesita varios campos en una fila como en el ejemplo de Figma, arma ese wrapper flex ella misma como `children` — no es responsabilidad del template ni de `FormContainer` imponer esa disposición.
- El ícono del badge de `FormContainer` en este frame de Figma (`Ports`, 462:2886) es el mismo glyph que `icon-gear` ya existente — no se agregó un ícono nuevo.

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
];
```

- **`pattern` soporta segmentos dinámicos `:nombre`** (`matchRoute` en `App.jsx`) — matchea por cantidad de segmentos + coincidencia exacta de los fijos, devuelve un objeto `params` con lo capturado (ej. `{ id: '3' }` para `/buques/3/editar`). La pantalla resuelta recibe ese objeto como prop `params`. No es una librería, es a propósito minimal — si algún día hace falta más (rutas anidadas, query params, etc.) recién ahí se justifica sumar `react-router`.
- **`props` en una entrada de `ROUTES` son props fijas propias de esa ruta**, se le suman a las comunes (`onNavigate`/`rows`/`onCreate`/`onUpdate`/`params`) antes de renderizar — así una misma pantalla (`BuqueFormulario`) sirve para 3 rutas distintas (`create`/`view`/`edit`) sin duplicar código, solo cambia `mode`.
- Cada pantalla que quiera ser ruteable recibe `onNavigate` como prop (con fallback a `console.log` si se la usa sin router, ej. en pruebas sueltas) y se lo pasa tal cual a su template (`LayoutBase`/`LayoutHomeModule`/`LayoutMaestroDataGrid`/`LayoutMaestroBasico`), que a su vez se lo pasa al `Sidebar`. El `Sidebar` llama `onNavigate({ href, label })` al clickear un ítem de nav — `App.jsx` intercepta ese `href` y cambia de pantalla. Una pantalla también puede llamar a su propio `onNavigate({ href, label })` directo (no solo el `Sidebar`) para navegar por código — ej. el botón "Nuevo" de `Buque`, las acciones Visualizar/Editar de cada fila (arman el `href` con el `id` de esa fila), o "Cancelar"/"Volver" de `BuqueFormulario`.
- Funciona tanto para navegación por sidebar (soft nav, sin recargar) como para una URL pegada directo en el navegador o un `<a href>` normal (ej. las cards de `CardQuickAccess`/`CardModule`, que renderizan `<a>` reales) — Vite sirve `index.html` para cualquier ruta no encontrada (`appType: 'spa'`, default) y `App.jsx` lee `window.location.pathname` al montar. Esto incluye rutas con `:id` — probado navegando directo a `/buques/2/editar` sin pasar por `/buques` antes.
- **Al crear una pantalla nueva accesible desde el sidebar**: 1) agregarla a `ROUTES` en `App.jsx` con el mismo `href` que ya tiene su ítem en el config del sidebar de su módulo (`app/src/config/sidebars/<módulo>.js`), 2) pasarle `sidebar={MODULO_SIDEBAR_PROPS}` y `activeHref="<ese href>"` al template para que el ítem quede resaltado (ver nota en `LayoutHomeModule`/`LayoutMaestroDataGrid` arriba). Una pantalla accesible solo por botón/acción (no por el sidebar, ej. `/buques/nuevo`, `/buques/:id/ver`, `/buques/:id/editar`) no necesita `activeHref` propio — usa el mismo que la pantalla desde la que se llega (ej. `/buques`), así el sidebar no "pierde" el ítem resaltado al entrar al formulario.
- **Datos compartidos entre pantallas de un mismo maestro (ej. `/buques`, `/buques/nuevo`, `/buques/:id/editar`) viven en `App.jsx`**, no en la pantalla — no hay backend ni store todavía, así que el estado (`useState`) que necesitan leer/escribir varias rutas tiene que estar arriba de todas ellas. `App.jsx` le pasa `rows`/`onCreate`/`onUpdate`/`params` a **todas** las pantallas ruteadas por igual (las que no los usan simplemente no los destructuran — inofensivo). `onCreate`/`onUpdate` hacen el `setState` **y** navegan de vuelta a `/buques` — la pantalla de formulario no navega ella misma al guardar, solo arma el objeto y llama al callback. Ver `INITIAL_BUQUES`/`addBuque`/`updateBuque` en `App.jsx` y la nota de `Buque`/`BuqueFormulario` abajo como referencia para el próximo maestro con alta/edición.
- **Home de un módulo vs. maestro de un módulo**: la home de un módulo (ej. `/operaciones`) se abre desde una `CardModule` en la grilla de "Módulos" de `Main/Home` (`href` en el objeto de `MODULES`), no desde el sidebar de ese módulo — cada sidebar lista los ítems propios de SU módulo (Maestros/Procesos de Operaciones, Administración/Configuración/etc. de Main), no una lista de módulos. Un maestro (ej. `/buques`) sí se abre desde el sidebar del módulo al que pertenece.

## Módulos (`app/src/modules/`)

Un folder por módulo de negocio. Cada pantalla real va en `modules/<Módulo>/<Pantalla>/<Pantalla>.jsx`.

- **`Main/Home/`** — pantalla raíz de la app (`Desktop — Layout Home`, Figma 429:2249). **`Main` no es un módulo** — es el dashboard raíz / selector de módulos (por eso vive fuera de la regla "el home de un módulo siempre usa `LayoutHomeModule`", ver nota en `LayoutHomeModule` arriba); el folder se llama `Main` por convención histórica del kit, no porque sea un módulo de negocio como `Operaciones`. Es la ruta `/` en `App.jsx` (default cuando no hay ninguna otra ruta activa). Compone, de arriba a abajo:
  1. Sección "Acceso rápido" — fila de `CardQuickAccess` (uno por cada ítem de Maestros/Procesos del sidebar).
  2. Fila inferior de dos columnas: a la izquierda "Módulos" — grilla de 4 columnas de `CardModule` (12 por página) + `Pagination`; a la derecha "Actividad reciente" (302px fijo) — `ActivityList` con 6 ítems.

  No usa `CardMetric` — esa fila no forma parte del frame 429:2249 en Figma (se había agregado antes por error a partir de una versión previa de la pantalla; se sacó).

  El `Sidebar` de esta pantalla usa `MAIN_SIDEBAR_PROPS` de `app/src/config/sidebars/main.js` — **isotipo** (Figma 496:4632/496:4633): ícono `app-window` sobre acento `indigo`. **Logotipo** (496:4630): texto "Pharo" (no "Ports" — Main no es el módulo Operaciones, aunque hoy comparte visualmente el mismo componente `Sidebar` que todos). Grupos/ítems (438:3087–497:4644): Administración → Usuarios/Roles y perfiles/Empresas/Módulos; Configuración → Parámetros/Email; Datos maestros → Países/Monedas; Integraciones → Importar novedades/Tokens de acceso. Aunque `Main` no es un módulo de negocio (ver arriba), sigue necesitando su propia identidad de sidebar como cualquier otro consumidor del componente — por eso tiene su config igual que `Operaciones` (ver nota en `Sidebar` arriba).

  **`MODULES` son los 14 módulos reales** (Figma, sección *Card-Module — Color accents*, 446:14 — ver entrada de `CardModule` arriba): Ports, Free Zone, Human Resources, Tax, Purchases, Dashboard, Truckshift, Access Control, Scales, Billing, Accounting, Agro, Servicios, Stock — cada uno con su `icon`/`accent` tal cual Figma. La descripción de cada card sí es de ejemplo (Figma repetía "Gestión de operaciones portuarias" en las 14, placeholder de diseño — se completó una descripción propia por módulo, salvo en "Ports" donde el texto de Figma ya era correcto). Seis de los 14 ("Truckshift"/"Access Control"/"Scales"/"Billing"/"Accounting"/"Agro") comparten el mismo ícono en Figma (`icon-truckshift`) — no son assets distintos por módulo, es la misma instancia repetida con el fill recoloreado por accent; se mantuvo así en vez de inventar íconos distintos, fiel al archivo fuente. `QUICK_ACCESS`/`ACTIVITY` siguen siendo ejemplo — el diseño de Figma tenía esas dos secciones con la misma card repetida N veces; `QUICK_ACCESS` toma un ítem de cada grupo del sidebar de Main (Usuarios/Empresas/Parámetros/Países), `ACTIVITY` un feed inventado (`Carlos M. / Aprobó turno de camión`, etc. — la sección decía "Módulos" en Figma pero el contenido es un feed de actividad, se corrigió el título a "Actividad reciente" acá). Reemplazar `QUICK_ACCESS`/`ACTIVITY` por datos reales cuando estén disponibles.

  **La card "Ports" de `MODULES` es la única con `href` hoy** (`/operaciones`) — es como se abre el módulo Operaciones desde la UI (ver `Operaciones/Home` abajo y la nota de ruteo arriba). Los otros 13 módulos son reales (nombre/ícono/accent de Figma) pero no tienen pantalla propia todavía — agregarles `href` cuando exista.

- **`Operaciones/Home/`** — home del módulo Operaciones (Figma `Layout Home Module`, 456:699), armada con el template `LayoutHomeModule`. Es la ruta `/operaciones` en `App.jsx` — la pantalla que se muestra al **abrir el módulo** (a diferencia de sus maestros, ej. `Buque` en `/buques`, que se abren desde el sidebar). Se llega acá clickeando la card "Ports" en la grilla de Módulos de `Main/Home` (`MODULES[0].href = '/operaciones'` — el nombre visible es "Ports", el folder de código es "Operaciones"; ver nota de esa card abajo). Usa `OPERACIONES_SIDEBAR_PROPS` de `app/src/config/sidebars/operaciones.js`, pasado por prop (`sidebar={...}`) — distinto del sidebar de `Main` (ver nota en `Sidebar` arriba). Lo que sí es propio de esta pantalla: 4 `CardMetric` de ejemplo (KPIs de operaciones), 4 `CardQuickAccess` (uno por ítem real de Maestros/Procesos de este sidebar, con `href` real — navegan de verdad) y `ActivityList` con 5 ítems de ejemplo. Todos los datos de contenido son de ejemplo — mismo criterio que `Main/Home`.

- **`Operaciones/Buque/`** — pantalla principal del maestro "Buque" (Figma `Layout Maestro Data Grid`, 492:3534), armada con el template `LayoutMaestroDataGrid`. Es la ruta `/buques` en `App.jsx` — coincide con el `href` que ya tenía el ítem "Buque" en `OPERACIONES_SIDEBAR_PROPS`, así que clickearlo en el sidebar navega acá de verdad. Usa `sidebar={OPERACIONES_SIDEBAR_PROPS}` (mismo config que `Operaciones/Home`, no un sidebar propio de la pantalla). **Sin `breadcrumb`** (no se le pasa esa prop — la pantalla de grilla de un maestro no lo necesita, a diferencia de sus formularios). Columnas: Código (ancho fijo 120px), Denominación, Estado (`StatusChip` — tone `success` para "Activo", `neutral` para "Inactivo") — **`Tipo` no es columna de la grilla** aunque cada fila sí tenga ese dato (lo captura el formulario); si hiciera falta mostrarlo, agregarlo de vuelta a `COLUMNS`. Acciones por fila: Visualizar (`bi-eye`) y Editar (`icon-edit`) — sin eliminar ni compartir, a diferencia del ejemplo por default de `DataGrid`; **navegan** a `/buques/<id>/ver` y `/buques/<id>/editar` respectivamente (antes solo hacían `console.log`) — mismo `BuqueFormulario` del lado, distinto `mode` según la ruta (ver `BuqueFormulario` abajo y la nota de `Ruteo`). Botones de cabecera: los 3 (Nuevo/Recargar/Exportar) — "Nuevo" navega a `/buques/nuevo`. **Recibe `rows` por prop** (`App.jsx` le pasa el estado compartido `buques`) con fallback a `DEFAULT_ROWS` local (5 buques de ejemplo) si se usa la pantalla suelta sin ese prop — reemplazar `DEFAULT_ROWS`/`INITIAL_BUQUES` (en `App.jsx`) por el catálogo real.

- **`Operaciones/Buque/BuqueFormulario.jsx`** — alta/visualización/edición de un buque, armada con el template `LayoutMaestroBasico`. Una sola pantalla para las 3 rutas `/buques/nuevo`, `/buques/:id/ver` y `/buques/:id/editar` — el `mode` (`'create'`/`'view'`/`'edit'`) le llega como prop fija de `ROUTES` en `App.jsx` (ver nota de `Ruteo`), no lo decide la pantalla. Ninguna tiene ítem propio en el sidebar (`activeHref="/buques"` siempre, para que "Buque" siga resaltado). Mismo `sidebar={OPERACIONES_SIDEBAR_PROPS}` que el resto del módulo.
  - **Título y breadcrumb varían por `mode`** (`TITLES` — "Crear Buque"/"Visualizar Buque"/"Editar Buque"; breadcrumb siempre `Buque > <ese título>`).
  - **`view`**: cachea la fila (`rows.find` por `params.id`) y precarga los campos de solo lectura — cada `TextField`/`Checkbox` recibe `disabled={isView}` (ambos componentes ya soportaban `disabled`; se le sumó esa prop a `Checkbox`, que no la tenía). `onSave` no se pasa al template (`isView ? undefined : handleSave`) → el botón "Guardar" ni se renderiza (mismo patrón "el botón solo aparece si hay handler" de `LayoutMaestroBasico`/`LayoutMaestroDataGrid`). El botón de cancelar cambia de label a "Volver" (mismo botón/ícono, `cancelLabel` distinto).
  - **`edit`**: precarga los campos igual que `view` pero editables, y en vez de `onCreate` llama a `onUpdate` al guardar (reemplaza la fila por `id` en vez de agregar una nueva).
  - **`create`**: campos vacíos, llama a `onCreate`.
  - **Buque inexistente** (`view`/`edit` con un `id` que no matchea ninguna fila, ej. URL directa con id inválido): en vez de romper, se muestra el mismo shell con título "Buque no encontrado" y sin formulario — el `existing` se busca antes de todo, si no aparece se corta ahí con un `return` temprano.
  - **`Código` y `Denominación` son obligatorios** — `handleSave` valida ambos (`.trim()` vacío) antes de llamar a `onCreate`/`onUpdate`; si falla, `setErrors` pone `error`/`helperText="Campo requerido"` en el `TextField` correspondiente (ya soportaba esas props) y **no navega ni guarda nada**. El error de un campo se limpia solo en cuanto el usuario vuelve a tipear ahí (`updateField`), no hace falta reintentar el submit para verlo desaparecer. `Tipo` no es obligatorio.
  - Campos: `TextField` de Código/Denominación/Tipo en una fila (`children` propio de la pantalla, `FormContainer` no impone esa disposición — ver nota de `LayoutMaestroBasico` arriba) + `Checkbox` "Inactivo" debajo. `FormContainer` con ícono `icon-pencil-square` (trazo exacto de Figma, 503:970) y título "Datos del buque". Estado de los campos manejado con `useState` local (controlado, no semi-controlado). El objeto que arma "Guardar" deriva `estado` del checkbox: marcado → `{label:'Inactivo', tone:'neutral'}`, si no → `{label:'Activo', tone:'success'}`. "Cancelar"/"Volver" navega a `/buques` sin guardar nada, siempre (no depende de ningún prop externo) — a diferencia de Guardar, que delega el guardado + la navegación de vuelta al callback que le inyecta `App.jsx` (ver nota de `Ruteo`).

## Cómo agregar un componente nuevo

1. Seleccionar el componente en la app de escritorio de Figma (el MCP necesita una selección activa) y traer `get_design_context`.
2. Crear su carpeta en `app/src/components/<Nombre>/` con `<Nombre>.jsx` + `<Nombre>.module.css`.
3. Tokens desde `tokens/tokens.css` — si falta alguno, agregarlo ahí.
4. Si tiene estados interactivos (dropdown, hover, etc.), implementarlos igual que el diseño documenta y probarlos en el navegador antes de darlo por terminado.
5. Componentes controlados cuando tenga sentido (value/onChange) para que se puedan componer entre sí.
6. Agregar la entrada en "Componentes disponibles".

## Cómo agregar un template nuevo

1. Confirmar que realmente es un patrón reutilizable (se va a repetir en más de una pantalla) — si es específico de una sola pantalla, va directo en `modules/`, no acá.
2. Crear `app/src/templates/<Nombre>/<Nombre>.jsx` + `.module.css`, componiendo `components/` existentes.
3. No hardcodear datos de negocio — el template recibe todo por props.
4. Agregar la entrada en "Templates disponibles".

## Cómo agregar una pantalla nueva a un módulo

1. Si el módulo no tiene carpeta todavía, crear `app/src/modules/<Módulo>/`.
2. Crear `modules/<Módulo>/<Pantalla>/<Pantalla>.jsx`, usando el template correspondiente de `templates/`.
3. Si hace falta un template que no existe, avisar y armarlo primero (ver arriba) — no improvisar el layout dentro de la pantalla.
