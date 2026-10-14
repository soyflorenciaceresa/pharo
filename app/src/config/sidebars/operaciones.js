// Contenido fijo del Sidebar para el módulo Operaciones (Figma: brand
// Isotype/Logotype 442:602/450:659, íconos de nav 450:679–450:694). Fijo
// para TODAS las pantallas de este módulo — no cambia de pantalla a
// pantalla dentro de Operaciones. Cada módulo tiene su propio archivo acá
// (ver config/sidebars/main.js) porque el diseño del Sidebar es siempre el
// mismo componente, pero isotipo/logotipo/items sí cambian por módulo.
import { MAESTROS_PORTS } from '../maestrosPorts.js';

export const OPERACIONES_SIDEBAR_PROPS = {
  brandLabel: 'Ports',
  brandIcon: 'icon-gear',
  brandAccent: 'violet',
  homeHref: '/operaciones',
  groups: [
    {
      label: 'Maestros',
      icon: 'icon-maestros',
      // Orden alfabético (se ordena acá, no a mano, para que un ítem nuevo caiga en su
      // lugar). Buque y Depósitos tienen pantalla propia; el resto sale de
      // config/maestrosPorts.js (grilla estándar con datos de ejemplo). "Giros" de acá es el maestro
      // /giros-turnos; el proceso Solicitud de giro buque (/giros) está en el grupo Giro buque.
      items: [
        { label: 'Buque', icon: 'icon-buques', href: '/buques' },
        { label: 'Depósitos', icon: 'app-window', href: '/depositos' },
        ...MAESTROS_PORTS.map(({ label, icon, href }) => ({ label, icon, href })),
      ].sort((x, y) => x.label.localeCompare(y.label, 'es')),
    },
    {
      label: 'Procesos',
      icon: 'icon-gear',
      items: [
        { label: 'Nueva Operación', icon: 'icon-nueva-operacion', href: '/nueva-operacion' },
      ],
    },
    // Grupos nuevos, sin frame de Figma ni pantallas todavía: ícono `app-window` como
    // placeholder y un único ítem del mismo nombre (un grupo sin ítems no se puede
    // abrir). Reemplazar por los ítems reales de cada grupo cuando se definan.
    {
      label: 'Embarques',
      icon: 'app-window',
      items: [{ label: 'Embarques', icon: 'app-window', href: '/embarques' }],
    },
    {
      label: 'Giro buque',
      icon: 'app-window',
      items: [{ label: 'Giros', icon: 'app-window', href: '/giros' }],
    },
    {
      label: 'Trazabilidad de stock',
      icon: 'app-window',
      items: [{ label: 'Trazabilidad de stock', icon: 'app-window', href: '/trazabilidad-stock' }],
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
