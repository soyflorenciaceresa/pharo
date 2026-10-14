// Contenido fijo del Sidebar para el módulo Access Control — generado en bloque
// junto con el resto de los módulos del catálogo (ver config/modules.js),
// siguiendo el mismo patrón que config/sidebars/operaciones.js (módulo
// "Ports", el primero armado a mano). Sin frame de Figma propio todavía
// (icon/accent ya venían de `ALL_MODULES`, ver esa nota) — los ítems del
// sidebar son placeholders de navegación sin pantalla propia en `ROUTES`
// de App.jsx, mismo criterio ya usado en MAIN_SIDEBAR_PROPS para ítems sin
// Figma definido: `icon: 'app-window'` y el href no resuelve a ninguna ruta
// hasta que se construya esa pantalla.
import { MAESTROS_ACCESS_CONTROL } from '../maestrosModulos.js';

export const ACCESS_CONTROL_SIDEBAR_PROPS = {
  brandLabel: 'Access Control',
  brandIcon: 'icon-truckshift',
  brandAccent: 'neutral',
  homeHref: '/access-control',
  groups: [
    {
      label: 'Maestros',
      icon: 'icon-maestros',
      // Personas tiene pantalla propia; el resto sale de config/maestrosModulos.js (grilla
      // estándar con datos de ejemplo). Orden alfabético.
      items: [
        { label: 'Personas', icon: 'app-window', href: '/access-control/personas' },
        ...MAESTROS_ACCESS_CONTROL.map(({ label, icon, href }) => ({ label, icon, href })),
      ].sort((x, y) => x.label.localeCompare(y.label, 'es')),
    },
    {
      label: 'Procesos',
      icon: 'icon-gear',
      items: [
        { label: 'Registrar ingreso', icon: 'app-window', href: '/access-control/registrar-ingreso' },
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
