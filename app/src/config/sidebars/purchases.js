// Contenido fijo del Sidebar para el módulo Purchases — generado en bloque
// junto con el resto de los módulos del catálogo (ver config/modules.js),
// siguiendo el mismo patrón que config/sidebars/operaciones.js (módulo
// "Ports", el primero armado a mano). Sin frame de Figma propio todavía
// (icon/accent ya venían de `ALL_MODULES`, ver esa nota) — los ítems del
// sidebar son placeholders de navegación sin pantalla propia en `ROUTES`
// de App.jsx, mismo criterio ya usado en MAIN_SIDEBAR_PROPS para ítems sin
// Figma definido: `icon: 'app-window'` y el href no resuelve a ninguna ruta
// hasta que se construya esa pantalla.
export const PURCHASES_SIDEBAR_PROPS = {
  brandLabel: 'Purchases',
  brandIcon: 'bi-cart',
  brandAccent: 'cyan',
  homeHref: '/purchases',
  groups: [
    {
      label: 'Maestros',
      icon: 'icon-maestros',
      items: [
        { label: 'Proveedores', icon: 'app-window', href: '/purchases/proveedores' },
        { label: 'Artículos', icon: 'app-window', href: '/purchases/articulos' },
      ],
    },
    {
      label: 'Procesos',
      icon: 'icon-gear',
      items: [
        { label: 'Nueva orden de compra', icon: 'app-window', href: '/purchases/nueva-orden' },
      ],
    },
  ],
  companies: [
    { id: 'puerto-norte', name: 'Puerto Norte S.A.' },
    { id: 'del-sur', name: 'Del Sur Logística' },
    { id: 'andina', name: 'Andina Comercial S.A.' },
  ],
  defaultActiveCompanyId: 'puerto-norte',
  user: {
    name: 'Carlos Mendoza',
    email: 'carlos.mendoza@gmail.com',
    role: 'Administrador',
  },
};
