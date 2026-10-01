// Contenido fijo del Sidebar para el módulo Treasury — generado en bloque
// junto con el resto de los módulos del catálogo (ver config/modules.js),
// siguiendo el mismo patrón que config/sidebars/operaciones.js (módulo
// "Ports", el primero armado a mano). Sin frame de Figma propio todavía
// (icon/accent ya venían de `ALL_MODULES`, ver esa nota) — los ítems del
// sidebar son placeholders de navegación sin pantalla propia en `ROUTES`
// de App.jsx, mismo criterio ya usado en MAIN_SIDEBAR_PROPS para ítems sin
// Figma definido: `icon: 'app-window'` y el href no resuelve a ninguna ruta
// hasta que se construya esa pantalla.
export const TREASURY_SIDEBAR_PROPS = {
  brandLabel: 'Treasury',
  brandIcon: 'app-window',
  brandAccent: 'green',
  homeHref: '/treasury',
  groups: [
    {
      label: 'Maestros',
      icon: 'icon-maestros',
      items: [
        { label: 'Cuentas bancarias', icon: 'app-window', href: '/treasury/cuentas-bancarias' },
        { label: 'Medios de pago', icon: 'app-window', href: '/treasury/medios-pago' },
      ],
    },
    {
      label: 'Procesos',
      icon: 'icon-gear',
      items: [
        { label: 'Nuevo movimiento', icon: 'app-window', href: '/treasury/nuevo-movimiento' },
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
