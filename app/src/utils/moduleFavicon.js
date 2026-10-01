import { ICONS } from '../icons/icons.jsx';

// Mismos dos tokens que usa el badge del isotipo en el Sidebar
// (`.brandIconBox[data-accent]` en Sidebar.module.css: fondo "-subtle" +
// color sólido) — hardcodeados en hex acá porque un favicon es una imagen
// standalone (data URI), no puede leer las custom properties de tokens.css
// del documento. Si se agrega un accent nuevo al Sidebar, agregarlo acá
// también.
const ACCENT_COLORS = {
  blue: { bg: '#d9deff', fg: '#4059fd' },
  violet: { bg: '#ede8fd', fg: '#7c3aed' },
  green: { bg: '#dcfce7', fg: '#16a34a' },
  amber: { bg: '#fef3c7', fg: '#d97706' },
  red: { bg: '#fee2e2', fg: '#dc2626' },
  cyan: { bg: '#cffafe', fg: '#0891b2' },
  pink: { bg: '#fce7f3', fg: '#db2777' },
  indigo: { bg: '#e0e7ff', fg: '#4f46e5' },
  // Mismo caso que `.brandIconBox[data-accent="neutral"]` en
  // Sidebar.module.css — no es uno de los 8 accents con nombre propio, usa
  // los mismos hex que --color-surface-selected/--color-text-secondary.
  neutral: { bg: '#f1f2f4', fg: '#6a7883' },
};

// Arma el favicon de una pantalla a partir del isotipo de su propio Sidebar
// — mismo ícono + mismo accent que `brandIcon`/`brandAccent` (ver
// config/sidebars/*.js) — para que la pestaña del navegador se identifique
// con el módulo que está abierto. Surgió junto con que cada módulo ahora
// abre en una pestaña nueva desde Main (ver `CardModule`): antes, al ser
// todo una sola pestaña de SPA, un favicon fijo alcanzaba; ahora cada
// pestaña es un módulo distinto y tiene sentido que cada una se distinga.
//
// `<style>:root{--bg:...}</style>` es para íconos que usan
// `fill="var(--bg)"` para un detalle recortado (ver icons.jsx, ej.
// bi-archive-fill) — en un SVG standalone esa variable no existe salvo que
// se declare acá; el resto de los íconos (que usan `currentColor`) la
// resuelven vía el atributo `color` en el `<g>` que los envuelve, sin
// necesitar la variable.
export function buildModuleFaviconHref(iconName, accent) {
  const path = ICONS[iconName] || ICONS['app-window'];
  const { bg, fg } = ACCENT_COLORS[accent] || ACCENT_COLORS.blue;
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">` +
    `<style>:root{--bg:${bg};}</style>` +
    `<rect width="64" height="64" rx="16" fill="${bg}"/>` +
    `<g transform="translate(16,16) scale(2)" color="${fg}">${path}</g>` +
    `</svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}
