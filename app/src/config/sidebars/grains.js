// Contenido fijo del Sidebar para el módulo Grains — generado en bloque
// junto con el resto de los módulos del catálogo (ver config/modules.js),
// siguiendo el mismo patrón que config/sidebars/operaciones.js (módulo
// "Ports", el primero armado a mano). Sin frame de Figma propio todavía
// (icon/accent ya venían de `ALL_MODULES`, ver esa nota) — los ítems del
// grupo "Procesos" siguen siendo placeholders de navegación sin pantalla
// propia en `ROUTES` de App.jsx, mismo criterio ya usado en
// MAIN_SIDEBAR_PROPS para ítems sin Figma definido: `icon: 'app-window'` y
// el href no resuelve a ninguna ruta hasta que se construya esa pantalla.
// "Contratos" (Maestros) sí es un maestro real — ver modules/Grains/Contratos/.
import { MAESTROS_GRAINS } from '../maestrosModulos.js';

export const GRAINS_SIDEBAR_PROPS = {
  brandLabel: 'Grains',
  brandIcon: 'app-window',
  brandAccent: 'amber',
  homeHref: '/grains',
  groups: [
    {
      label: 'Maestros',
      icon: 'icon-maestros',
      // Contratos y Clientes tienen pantalla propia; el resto sale de config/maestrosModulos.js
      // (grilla estándar con datos de ejemplo). Orden alfabético.
      items: [
        { label: 'Contratos', icon: 'app-window', href: '/grains/contratos' },
        { label: 'Clientes', icon: 'app-window', href: '/grains/clientes' },
        ...MAESTROS_GRAINS.map(({ label, icon, href }) => ({ label, icon, href })),
      ].sort((x, y) => x.label.localeCompare(y.label, 'es')),
    },
    {
      label: 'Procesos',
      icon: 'icon-gear',
      items: [
        { label: 'Facturación', icon: 'app-window', href: '/grains/facturacion' },
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
