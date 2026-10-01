// Contenido fijo del Sidebar para el módulo Main (Figma: Isotipo 496:4632,
// Logotipo 496:4630, ítems/subítems 438:3087–497:4644). Fijo para TODAS las
// pantallas de Main — no cambia de pantalla a pantalla. Mismo criterio que
// config/sidebars/operaciones.js: mismo componente Sidebar, contenido propio
// por módulo.
//
// Ítems agregados a pedido (Administración → Equipos, Configuración →
// Desencadenantes, Datos maestros → Provincias/Ciudades, grupo nuevo Sistema
// con sus 3 subítems): todavía no tienen pantalla propia (no están en
// `ROUTES` de App.jsx, mismo estado que la mayoría de los ítems de este
// sidebar hoy) ni ícono dedicado en Figma — se les asignó `app-window`
// (Figma "App", 431:2474, mismo trazo exacto que ya usaba el isotipo de Main)
// como placeholder porque así se pidió explícitamente. Reemplazar por el
// ícono real de cada uno cuando estén definidos en el archivo de Figma.
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
        { label: 'Equipos', icon: 'app-window', href: '/admin/equipos' },
      ],
    },
    {
      label: 'Configuración',
      icon: 'icon-gear',
      items: [
        { label: 'Parámetros', icon: 'icon-parametros', href: '/config/parametros' },
        { label: 'Email', icon: 'icon-email', href: '/config/email' },
        { label: 'Desencadenantes', icon: 'app-window', href: '/config/desencadenantes' },
      ],
    },
    {
      label: 'Datos maestros',
      icon: 'icon-datos-maestros',
      items: [
        { label: 'Países', icon: 'icon-paises', href: '/datos-maestros/paises' },
        { label: 'Provincias', icon: 'app-window', href: '/datos-maestros/provincias' },
        { label: 'Ciudades', icon: 'app-window', href: '/datos-maestros/ciudades' },
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
    {
      label: 'Sistema',
      icon: 'app-window',
      items: [
        { label: 'Registro de sesiones', icon: 'app-window', href: '/sistema/registro-de-sesiones' },
        { label: 'Tareas programadas', icon: 'app-window', href: '/sistema/tareas-programadas' },
        { label: 'Información de versión', icon: 'app-window', href: '/sistema/informacion-de-version' },
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
