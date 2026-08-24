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
  brandLabel="PHARO°"
  brandIcon="bi-cart"
  homeHref="/"
  groups={[
    { label: 'Maestros', icon: 'bi-archive-fill', items: [
      { label: 'Proveedores', icon: 'bi-building', href: '/proveedores' },
    ]},
  ]}
  companies={[{ id: 'pn', name: 'Puerto Norte S.A.' }]}
  defaultActiveCompanyId="pn"
  user={{ name: 'Carlos Mendoza', email: 'carlos@mendoza.com', role: 'Administrador' }}
  defaultActiveHref="/proveedores"
  onNavigate={({ href, label }) => ...}
  onCompanyChange={(company) => ...}
  onLogout={() => ...}
  onToggle={({ expanded, pinned }) => ...}
/>
```

- **Comportamiento fijo (no tocar):** expande al hover, colapsa al mouse-leave (no es toggle por click); botón de pin fija el estado expandido; grupos de navegación se abren de a uno; selector de empresa y menú de usuario son desplegables independientes (mutuamente excluyentes) — el de usuario expande hacia arriba.
- El ítem de nav activo y la empresa activa son semi-controlados: se inicializan por `defaultActiveHref`/`defaultActiveCompanyId`, y a partir de ahí el propio componente mueve el estado, avisando por los callbacks.
- **Íconos:** prefijo `bi-*`, definidos en `app/src/icons/icons.jsx` (aproximaciones dibujadas a mano de Bootstrap Icons, pendientes de reemplazar por los SVG reales).

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

Origen: Figma, página *Cards*, componente `Card-Metric / Default` (426:13) y `Card-Metric / Hover` (426:14).

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
- Hover (sombra + borde en `color-accent-metric`) es CSS puro, sin estado de React.
- Usa `color/accent/metric` — token nuevo, no existía en Figma antes de este componente.

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
  icon="app-window"
  title="Ports"
  description="Gestión de operaciones portuarias"
  onClick={() => ...}    // o href="/ruta"
/>
```

**Ambas cards comparten:**
- Mismo shell que `CardMetric` (`surface/card`, `color/border/default`, `radius/card`, ancho fluido `min-width: 169px`) pero sin la franja de acento — no se refactorizó a un "Card" base compartido todavía, cada una tiene su propio CSS.
- Hover es solo sombra sutil (dos capas, sin cambio de borde) — distinto del hover de `CardMetric`, que sí tiene borde + sombra más marcada. Son recetas de sombra reales de Figma, no inventadas.
- El ícono de badge (`app-window`) es un glyph propio de Figma, no un ícono de Bootstrap — vive en `icons.jsx` junto a los `bi-*` pero con nombre distinto para no confundirlo. Pasale otro `icon` (cualquier key de `ICONS`) si el módulo/acceso necesita uno distinto.
- Ambas son `<button>` (o `<a>` si les pasás `href`) — clickeables de verdad, no un `div` con `onClick`.

### `ActivityItem` — `app/src/components/ActivityItem/`

Origen: Figma, página *Cards*, componente `Activity Item` (433:2719), variantes `Propiedad 1=Default/Hover` (436:3049).

```jsx
<ActivityItem name="Carlos M." time="hace 3 min" description="Aprobó turno de camión" />
```

- `initials` es opcional — si no se pasa, se calcula solo a partir de `name` (primeras letras de las dos primeras palabras).
- Borde solo en los costados y abajo (no arriba) — está pensado para **apilarse**, no para usarse suelto con los 4 bordes. Para eso existe `ActivityList`.
- Hover cambia el fondo a `color/surface/hover` — CSS puro (`:hover`), sin estado de React.

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

## Templates disponibles (`app/src/templates/`)

### `LayoutBase` — `app/src/templates/LayoutBase/`

Sidebar + TopBar + área de contenido. Es el esqueleto de cualquier pantalla interna del sistema (todo lo que no sea login/pantallas públicas).

```jsx
import LayoutBase from '../../templates/LayoutBase/LayoutBase.jsx';

<LayoutBase sidebarProps={{ groups, companies, user, /* ...ver props de Sidebar */ }}>
  {/* contenido específico de la pantalla */}
</LayoutBase>
```

## Módulos (`app/src/modules/`)

Un folder por módulo de negocio. Cada pantalla real va en `modules/<Módulo>/<Pantalla>/<Pantalla>.jsx`.

- **`Main/Home/`** — pantalla raíz de la app (`Desktop — Layout Home`, Figma 429:2249), home del módulo `Main`. Es lo que renderiza `App.jsx` hoy. Compone, de arriba a abajo:
  1. Sección "Acceso rápido" — fila de 6 `CardQuickAccess` (uno por cada ítem de Maestros/Procesos del sidebar).
  2. Fila inferior de dos columnas: a la izquierda "Módulos" — grilla de 4 columnas de `CardModule` (12 por página) + `Pagination`; a la derecha "Actividad reciente" (302px fijo) — `ActivityList` con 6 ítems.

  No usa `CardMetric` — esa fila no forma parte del frame 429:2249 en Figma (se había agregado antes por error a partir de una versión previa de la pantalla; se sacó).

  **Todos los datos de esta pantalla son de ejemplo** — reemplazar por datos reales cuando estén disponibles. En particular: el diseño de Figma tenía "Acceso rápido"/"Módulos"/"Actividad" con la misma card repetida N veces (placeholder de diseño); se completaron con contenido de ejemplo distinto por card, conservando el primer valor real de cada grupo (`Ports / Gestión de operaciones portuarias` para Módulos, `Carlos M. / Aprobó turno de camión` para Actividad). La sección derecha decía "Módulos" en Figma pero el contenido es un feed de actividad — se corrigió el título a "Actividad reciente" acá.

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
