// Arma el "Acceso rápido" de la Home de un módulo a partir de los ítems de
// SU sidebar (ver config/sidebars/<módulo>.js) que estén marcados como
// favoritos — `favoriteHrefs` es el mismo array plano que vive en App.jsx
// (un solo Set de hrefs, sin distinguir a qué módulo pertenece cada uno:
// como los hrefs ya son únicos en toda la app, alcanza con filtrar los
// ítems del propio sidebar por pertenencia, no hace falta namespacing por
// módulo). Cada módulo la llama con su propio `*_SIDEBAR_PROPS`, así que
// automáticamente solo ve sus propios favoritos, nunca los de otro módulo.
export function favoriteQuickAccess(sidebar, favoriteHrefs = []) {
  const items = [];
  for (const group of sidebar?.groups ?? []) {
    for (const item of group.items ?? []) {
      if (favoriteHrefs.includes(item.href)) {
        items.push({ icon: item.icon, title: item.label, subtitle: group.label, href: item.href });
      }
    }
  }
  return items;
}
