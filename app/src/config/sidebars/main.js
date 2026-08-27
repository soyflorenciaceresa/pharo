// Contenido fijo del Sidebar para el módulo Main (Figma: Isotipo 496:4632,
// Logotipo 496:4630, ítems/subítems 438:3087–497:4644). Fijo para TODAS las
// pantallas de Main — no cambia de pantalla a pantalla. Mismo criterio que
// config/sidebars/operaciones.js: mismo componente Sidebar, contenido propio
// por módulo.
export const MAIN_SIDEBAR_PROPS = {
  brandLabel: 'Pharo',
  brandIcon: 'app-window',
  brandAccent: 'indigo',
  homeHref: '/',
  groups: [
    {
      label: 'Administración',
      icon: 'icon-administracion',
      items: [
        { label: 'Usuarios', icon: 'icon-usuarios', href: '/admin/usuarios' },
        { label: 'Roles y perfiles', icon: 'icon-roles-perfiles', href: '/admin/roles-y-perfiles' },
        { label: 'Empresas', icon: 'icon-empresas', href: '/admin/empresas' },
        { label: 'Módulos', icon: 'icon-modulos', href: '/admin/modulos' },
      ],
    },
    {
      label: 'Configuración',
      icon: 'icon-gear',
      items: [
        { label: 'Parámetros', icon: 'icon-parametros', href: '/config/parametros' },
        { label: 'Email', icon: 'icon-email', href: '/config/email' },
      ],
    },
    {
      label: 'Datos maestros',
      icon: 'icon-datos-maestros',
      items: [
        { label: 'Países', icon: 'icon-paises', href: '/datos-maestros/paises' },
        { label: 'Monedas', icon: 'icon-monedas', href: '/datos-maestros/monedas' },
      ],
    },
    {
      label: 'Integraciones',
      icon: 'icon-integraciones',
      items: [
        { label: 'Importar novedades', icon: 'icon-importar-novedades', href: '/integraciones/importar-novedades' },
        { label: 'Tokens de acceso', icon: 'icon-tokens-acceso', href: '/integraciones/tokens-acceso' },
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
