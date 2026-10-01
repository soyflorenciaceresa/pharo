// Contenido fijo del Sidebar para el módulo Custom PY — generado en bloque
// junto con el resto de los módulos del catálogo (ver config/modules.js),
// siguiendo el mismo patrón que config/sidebars/operaciones.js (módulo
// "Ports", el primero armado a mano). Sin frame de Figma propio todavía
// (icon/accent ya venían de `ALL_MODULES`, ver esa nota) — los ítems del
// sidebar son placeholders de navegación sin pantalla propia en `ROUTES`
// de App.jsx, mismo criterio ya usado en MAIN_SIDEBAR_PROPS para ítems sin
// Figma definido: `icon: 'app-window'` y el href no resuelve a ninguna ruta
// hasta que se construya esa pantalla.
export const CUSTOM_PY_SIDEBAR_PROPS = {
  brandLabel: 'Custom PY',
  brandIcon: 'app-window',
  brandAccent: 'blue',
  homeHref: '/custom-py',
  groups: [
    {
      label: 'Maestros',
      icon: 'icon-maestros',
      items: [
        { label: 'Declaraciones', icon: 'app-window', href: '/custom-py/declaraciones' },
        { label: 'Despachantes', icon: 'app-window', href: '/custom-py/despachantes' },
      ],
    },
    {
      label: 'Procesos',
      icon: 'icon-gear',
      items: [
        { label: 'Nuevo despacho aduanero', icon: 'app-window', href: '/custom-py/nuevo-despacho' },
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
