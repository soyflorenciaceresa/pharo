// Contenido fijo del Sidebar para el módulo Truckshift — generado en bloque
// junto con el resto de los módulos del catálogo (ver config/modules.js),
// siguiendo el mismo patrón que config/sidebars/operaciones.js (módulo
// "Ports", el primero armado a mano). Sin frame de Figma propio todavía
// (icon/accent ya venían de `ALL_MODULES`, ver esa nota) — los ítems del
// sidebar son placeholders de navegación sin pantalla propia en `ROUTES`
// de App.jsx, mismo criterio ya usado en MAIN_SIDEBAR_PROPS para ítems sin
// Figma definido: `icon: 'app-window'` y el href no resuelve a ninguna ruta
// hasta que se construya esa pantalla.
import { MAESTROS_TRUCKSHIFT } from '../maestrosModulos.js';

export const TRUCKSHIFT_SIDEBAR_PROPS = {
  brandLabel: 'Truckshift',
  brandIcon: 'icon-truckshift',
  brandAccent: 'indigo',
  homeHref: '/truckshift',
  groups: [
    {
      label: 'Maestros',
      icon: 'icon-maestros',
      // Todos los maestros salen de config/maestrosModulos.js (grilla estándar con datos de ejemplo). Orden alfabético.
      items: MAESTROS_TRUCKSHIFT.map(({ label, icon, href }) => ({ label, icon, href })).sort((x, y) => x.label.localeCompare(y.label, 'es')),
    },
    {
      label: 'Procesos',
      icon: 'icon-gear',
      items: [
        { label: 'Asignación de turnos', icon: 'app-window', href: '/truckshift/asignacion-turnos' },
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
