// Catálogo completo de los 23 módulos que ofrece la aplicación — fuente
// única compartida por `Main/Home` (que solo muestra los habilitados para la
// empresa activa) y `Main/Modulos` (que permite habilitar/deshabilitar cada
// uno por empresa). `id` es estable y es lo que se guarda en
// `companyModules` (ver App.jsx) — nunca usar `title` como identificador.
//
// Los primeros 13 (Ports…Stock) ya existían en el kit (Figma, página *Cards*,
// sección "Card-Module — Color accents", 446:14) y conservan su `icon`/
// `accent`/`description` original — `Servicios` se renombró a `Services` a
// pedido (mismo concepto, catálogo en inglés) y `Agro` se reemplazó por
// `Grains`. Los 10 restantes son módulos nuevos sin ícono definido en
// Figma todavía — llevan `app-window` (Figma "App", 431:2474, mismo trazo
// que ya usa el isotipo de Main) como placeholder a pedido, con `accent`
// variado para que la grilla no se vea monocroma. Reemplazar `icon` por el
// trazo real de cada uno cuando esté definido en el archivo de Figma.
//
// `href` — los 23 módulos ya apuntan a su propio Home (ver
// modules/<Modulo>/Home/Home.jsx, config/sidebars/<slug>.js): a partir de
// "Ports" (el primero armado a mano, hoy `Operaciones`), se generó en
// bloque un shell igual de completo para los otros 22 — sidebar propio +
// Home con KPIs/accesos rápidos/actividad de ejemplo — así cualquier card
// de `Main/Home` abre a un módulo real, no a un placeholder inerte.
export const ALL_MODULES = [
  { id: 'ports', title: 'Ports', description: 'Gestión de operaciones portuarias', icon: 'icon-gear', accent: 'violet', href: '/operaciones' },
  { id: 'free-zone', title: 'Free Zone', description: 'Administración de zonas francas', icon: 'app-window', accent: 'green', href: '/free-zone' },
  { id: 'tax', title: 'Tax', description: 'Cálculo y liquidación de impuestos', icon: 'app-window', accent: 'red', href: '/tax' },
  { id: 'truckshift', title: 'Truckshift', description: 'Turnos y asignación de camiones', icon: 'icon-truckshift', accent: 'indigo', href: '/truckshift' },
  { id: 'custom-py', title: 'Custom PY', description: 'Gestión de operaciones aduaneras en Paraguay', icon: 'app-window', accent: 'blue', href: '/custom-py' },
  { id: 'dashboard', title: 'Dashboard', description: 'Indicadores generales de la plataforma', icon: 'app-window', accent: 'pink', href: '/dashboard' },
  { id: 'tos', title: 'TOS', description: 'Sistema de gestión de terminal portuaria', icon: 'app-window', accent: 'cyan', href: '/tos' },
  { id: 'audit', title: 'Audit', description: 'Auditoría y trazabilidad de operaciones', icon: 'app-window', accent: 'amber', href: '/audit' },
  { id: 'human-resources', title: 'Human Resources', description: 'Gestión de personal y RR. HH.', icon: 'icon-administracion', accent: 'amber', href: '/human-resources' },
  { id: 'access-control', title: 'Access Control', description: 'Control de accesos e ingresos', icon: 'icon-truckshift', accent: 'neutral', href: '/access-control' },
  { id: 'scales', title: 'Scales', description: 'Pesaje y control de cargas', icon: 'icon-truckshift', accent: 'violet', href: '/scales' },
  { id: 'billing', title: 'Billing', description: 'Facturación y cobranzas', icon: 'icon-truckshift', accent: 'green', href: '/billing' },
  { id: 'accounting', title: 'Accounting', description: 'Contabilidad y balances', icon: 'icon-truckshift', accent: 'amber', href: '/accounting' },
  { id: 'purchases', title: 'Purchases', description: 'Órdenes de compra y proveedores', icon: 'bi-cart', accent: 'cyan', href: '/purchases' },
  { id: 'containers', title: 'Containers', description: 'Seguimiento y control de contenedores', icon: 'app-window', accent: 'indigo', href: '/containers' },
  { id: 'afip', title: 'AFIP', description: 'Integración con AFIP y trámites fiscales', icon: 'app-window', accent: 'red', href: '/afip' },
  { id: 'ia', title: 'IA', description: 'Asistente e inteligencia artificial integrada', icon: 'app-window', accent: 'violet', href: '/ia' },
  { id: 'devops', title: 'DevOps', description: 'Herramientas de despliegue e infraestructura', icon: 'app-window', accent: 'neutral', href: '/devops' },
  { id: 'treasury', title: 'Treasury', description: 'Gestión de tesorería y flujo de caja', icon: 'app-window', accent: 'green', href: '/treasury' },
  { id: 'grains', title: 'Grains', description: 'Gestión de cargas de granos y agroindustria', icon: 'app-window', accent: 'amber', href: '/grains' },
  { id: 'services', title: 'Services', description: 'Solicitud y seguimiento de servicios', icon: 'icon-check2circle', accent: 'cyan', href: '/services' },
  { id: 'stock', title: 'Stock', description: 'Control de inventario y existencias', icon: 'icon-box', accent: 'neutral', href: '/stock' },
  { id: 'external-users', title: 'External Users', description: 'Acceso y gestión de usuarios externos', icon: 'app-window', accent: 'pink', href: '/external-users' },
];

// Set inicial habilitado para cada empresa — a falta de backend, las 3
// empresas de `config/sidebars/main.js` arrancan con el mismo subconjunto
// (los 13 módulos que ya se mostraban en Main/Home antes de este catálogo
// ampliado), así el home no cambia visualmente hasta que alguien edite
// `Main/Modulos` para una empresa puntual. Ids, no títulos.
const DEFAULT_ENABLED_IDS = [
  'ports', 'free-zone', 'tax', 'truckshift', 'dashboard', 'human-resources',
  'access-control', 'scales', 'billing', 'accounting', 'purchases', 'services', 'stock',
];

export const DEFAULT_COMPANY_MODULES = {
  'puerto-norte': DEFAULT_ENABLED_IDS,
  // Del Sur Logística arranca sin nada configurado (estado inicial de Main/Home):
  // el usuario elige sus módulos ahí mismo o en Main/Modulos.
  'del-sur': [],
  andina: DEFAULT_ENABLED_IDS,
};
