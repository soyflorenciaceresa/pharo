// Contenido fijo del Sidebar para el módulo Operaciones (Figma: brand
// Isotype/Logotype 442:602/450:659, íconos de nav 450:679–450:694). Fijo
// para TODAS las pantallas de este módulo — no cambia de pantalla a
// pantalla dentro de Operaciones. Cada módulo tiene su propio archivo acá
// (ver config/sidebars/main.js) porque el diseño del Sidebar es siempre el
// mismo componente, pero isotipo/logotipo/items sí cambian por módulo.
export const OPERACIONES_SIDEBAR_PROPS = {
  brandLabel: 'Ports',
  brandIcon: 'icon-gear',
  brandAccent: 'violet',
  homeHref: '/operaciones',
  groups: [
    {
      label: 'Maestros',
      icon: 'icon-maestros',
      items: [
        { label: 'Buque', icon: 'icon-buques', href: '/buques' },
        { label: 'Clientes', icon: 'icon-clientes', href: '/clientes' },
        { label: 'Tipos de turnos', icon: 'icon-tipos-turnos', href: '/tipos-turnos' },
      ],
    },
    {
      label: 'Procesos',
      icon: 'icon-gear',
      items: [
        { label: 'Nueva Operación', icon: 'icon-nueva-operacion', href: '/nueva-operacion' },
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
