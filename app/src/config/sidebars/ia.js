// Contenido fijo del Sidebar para el módulo IA — generado en bloque
// junto con el resto de los módulos del catálogo (ver config/modules.js),
// siguiendo el mismo patrón que config/sidebars/operaciones.js (módulo
// "Ports", el primero armado a mano). Sin frame de Figma propio todavía
// (icon/accent ya venían de `ALL_MODULES`, ver esa nota) — los ítems del
// sidebar son placeholders de navegación sin pantalla propia en `ROUTES`
// de App.jsx, mismo criterio ya usado en MAIN_SIDEBAR_PROPS para ítems sin
// Figma definido: `icon: 'app-window'` y el href no resuelve a ninguna ruta
// hasta que se construya esa pantalla.
export const IA_SIDEBAR_PROPS = {
  brandLabel: 'IA',
  brandIcon: 'app-window',
  brandAccent: 'violet',
  homeHref: '/ia',
  groups: [
    {
      label: 'Maestros',
      icon: 'icon-maestros',
      items: [
        { label: 'Modelos', icon: 'app-window', href: '/ia/modelos' },
        { label: 'Casos de uso', icon: 'app-window', href: '/ia/casos-de-uso' },
      ],
    },
    {
      label: 'Procesos',
      icon: 'icon-gear',
      items: [
        { label: 'Entrenar modelo', icon: 'app-window', href: '/ia/entrenar-modelo' },
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
