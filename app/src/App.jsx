import { useEffect, useState } from 'react';
import Home from './modules/Main/Home/Home.jsx';
import OperacionesHome from './modules/Operaciones/Home/Home.jsx';
import Buque from './modules/Operaciones/Buque/Buque.jsx';
import BuqueFormulario from './modules/Operaciones/Buque/BuqueFormulario.jsx';
import Contratos from './modules/Grains/Contratos/Contratos.jsx';
import ContratoFormulario from './modules/Grains/Contratos/ContratoFormulario.jsx';
import AsistenteIA from './modules/AsistenteIA/AsistenteIA.jsx';
import Modulos from './modules/Main/Modulos/Modulos.jsx';
import Usuarios from './modules/Main/Usuarios/Usuarios.jsx';
import UsuarioFormulario from './modules/Main/Usuarios/UsuarioFormulario.jsx';
import Perfiles from './modules/Main/RolesYPerfiles/Perfiles.jsx';
import PerfilFormulario from './modules/Main/RolesYPerfiles/PerfilFormulario.jsx';
import Empresas from './modules/Main/Empresas/Empresas.jsx';
import EmpresaFormulario from './modules/Main/Empresas/EmpresaFormulario.jsx';
import { SidebarPinnedProvider } from './context/SidebarPinnedContext.jsx';
import { DEFAULT_COMPANY_MODULES } from './config/modules.js';
// Home de cada uno de los 22 módulos restantes del catálogo (ver
// config/modules.js) — generados en bloque a partir del mismo patrón que
// OperacionesHome ("Ports", arriba), ver nota en ROUTES más abajo.
import FreeZoneHome from './modules/FreeZone/Home/Home.jsx';
import TaxHome from './modules/Tax/Home/Home.jsx';
import TruckshiftHome from './modules/Truckshift/Home/Home.jsx';
import CustomPyHome from './modules/CustomPy/Home/Home.jsx';
import DashboardHome from './modules/Dashboard/Home/Home.jsx';
import TosHome from './modules/Tos/Home/Home.jsx';
import AuditHome from './modules/Audit/Home/Home.jsx';
import HumanResourcesHome from './modules/HumanResources/Home/Home.jsx';
import AccessControlHome from './modules/AccessControl/Home/Home.jsx';
import ScalesHome from './modules/Scales/Home/Home.jsx';
import BillingHome from './modules/Billing/Home/Home.jsx';
import AccountingHome from './modules/Accounting/Home/Home.jsx';
import PurchasesHome from './modules/Purchases/Home/Home.jsx';
import ContainersHome from './modules/Containers/Home/Home.jsx';
import AfipHome from './modules/Afip/Home/Home.jsx';
import IaHome from './modules/Ia/Home/Home.jsx';
import DevopsHome from './modules/Devops/Home/Home.jsx';
import TreasuryHome from './modules/Treasury/Home/Home.jsx';
import GrainsHome from './modules/Grains/Home/Home.jsx';
import ServicesHome from './modules/Services/Home/Home.jsx';
import StockHome from './modules/Stock/Home/Home.jsx';
import ExternalUsersHome from './modules/ExternalUsers/Home/Home.jsx';

// Router mínimo basado en estado — el kit no tiene react-router. Cada pantalla
// ruteada recibe `onNavigate` y decide sola su propio `activeHref` (ver
// LayoutHomeModule/LayoutMaestroDataGrid/LayoutMaestroBasico). Usa la History
// API real (pushState/popstate) para que la URL del navegador quede
// sincronizada y funcione tanto la navegación por sidebar como una carga
// directa de la URL.
//
// `pattern` soporta segmentos dinámicos `:id` (ver matchRoute) — necesario
// para /buques/:id/ver y /buques/:id/editar, que reusan la misma pantalla
// (BuqueFormulario) con distinto `mode`. `props` son props fijas propias de
// esa ruta (acá, el modo del formulario) que se le suman a las comunes.
//
// '/operaciones' es la home del módulo Operaciones — la pantalla que se
// muestra al "abrir" el módulo (distinta de sus maestros, ej. '/buques').
// '/buques/nuevo', '/buques/:id/ver' y '/buques/:id/editar' no tienen ítem
// propio en el sidebar — se llega a ellas desde botones/acciones de /buques.
//
// '/asistente-ia' es el chatbot de IA — cross-módulo (como '/', no pertenece
// a Operaciones ni a ningún otro módulo de negocio), se llega ahí escribiendo
// en el Buscador de CUALQUIER TopBar (ver onSearch más abajo).
//
// '/admin/modulos' es la pantalla de habilitar/deshabilitar módulos por
// empresa (ítem "Módulos" del sidebar de Main, grupo Administración) — ver
// nota de `companyModules` más abajo.
const ROUTES = [
  { pattern: '/', Component: Home },
  { pattern: '/operaciones', Component: OperacionesHome },
  { pattern: '/buques', Component: Buque },
  { pattern: '/buques/nuevo', Component: BuqueFormulario, props: { mode: 'create' } },
  { pattern: '/buques/:id/ver', Component: BuqueFormulario, props: { mode: 'view' } },
  { pattern: '/buques/:id/editar', Component: BuqueFormulario, props: { mode: 'edit' } },
  { pattern: '/grains/contratos', Component: Contratos },
  { pattern: '/grains/contratos/nuevo', Component: ContratoFormulario, props: { mode: 'create' } },
  { pattern: '/grains/contratos/:id/ver', Component: ContratoFormulario, props: { mode: 'view' } },
  { pattern: '/grains/contratos/:id/editar', Component: ContratoFormulario, props: { mode: 'edit' } },
  { pattern: '/asistente-ia', Component: AsistenteIA },
  { pattern: '/admin/modulos', Component: Modulos },
  { pattern: '/admin/usuarios', Component: Usuarios },
  { pattern: '/admin/usuarios/nuevo', Component: UsuarioFormulario, props: { mode: 'create' } },
  { pattern: '/admin/usuarios/:id/ver', Component: UsuarioFormulario, props: { mode: 'view' } },
  { pattern: '/admin/usuarios/:id/editar', Component: UsuarioFormulario, props: { mode: 'edit' } },
  { pattern: '/admin/roles-y-perfiles', Component: Perfiles },
  { pattern: '/admin/roles-y-perfiles/nuevo', Component: PerfilFormulario, props: { mode: 'create' } },
  { pattern: '/admin/roles-y-perfiles/:id/ver', Component: PerfilFormulario, props: { mode: 'view' } },
  { pattern: '/admin/roles-y-perfiles/:id/editar', Component: PerfilFormulario, props: { mode: 'edit' } },
  { pattern: '/admin/empresas', Component: Empresas },
  { pattern: '/admin/empresas/nuevo', Component: EmpresaFormulario, props: { mode: 'create' } },
  { pattern: '/admin/empresas/:id/ver', Component: EmpresaFormulario, props: { mode: 'view' } },
  { pattern: '/admin/empresas/:id/editar', Component: EmpresaFormulario, props: { mode: 'edit' } },

  // Home de cada uno de los otros 22 módulos del catálogo (ver
  // config/modules.js, ALL_MODULES) — mismo criterio que '/operaciones'
  // arriba: es la pantalla que se muestra al "abrir" el módulo desde una
  // card de Main/Home. Cada una es un shell (sidebar propio + Home con
  // datos de ejemplo, ver modules/<Modulo>/Home/Home.jsx) sin maestros
  // propios todavía — mismo estado inicial que tuvo Operaciones antes de
  // construirse Buque. Los ítems de cada sidebar son placeholders de
  // navegación sin ruta propia (mismo criterio ya usado en
  // MAIN_SIDEBAR_PROPS para ítems sin pantalla).
  { pattern: '/free-zone', Component: FreeZoneHome },
  { pattern: '/tax', Component: TaxHome },
  { pattern: '/truckshift', Component: TruckshiftHome },
  { pattern: '/custom-py', Component: CustomPyHome },
  { pattern: '/dashboard', Component: DashboardHome },
  { pattern: '/tos', Component: TosHome },
  { pattern: '/audit', Component: AuditHome },
  { pattern: '/human-resources', Component: HumanResourcesHome },
  { pattern: '/access-control', Component: AccessControlHome },
  { pattern: '/scales', Component: ScalesHome },
  { pattern: '/billing', Component: BillingHome },
  { pattern: '/accounting', Component: AccountingHome },
  { pattern: '/purchases', Component: PurchasesHome },
  { pattern: '/containers', Component: ContainersHome },
  { pattern: '/afip', Component: AfipHome },
  { pattern: '/ia', Component: IaHome },
  { pattern: '/devops', Component: DevopsHome },
  { pattern: '/treasury', Component: TreasuryHome },
  { pattern: '/grains', Component: GrainsHome },
  { pattern: '/services', Component: ServicesHome },
  { pattern: '/stock', Component: StockHome },
  { pattern: '/external-users', Component: ExternalUsersHome },
];

// Ejemplo — reemplazar por el catálogo real de buques. Vive acá (no en
// Buque.jsx) porque tanto la grilla (/buques) como el alta/edición
// (/buques/nuevo, /buques/:id/editar) necesitan leer/escribir el mismo set —
// no hay backend todavía.
const INITIAL_BUQUES = [
  { id: 1, codigo: 'BQ-001', denominacion: 'Estrella del Sur', tipo: 'Portacontenedores', estado: { label: 'Activo', type: 'success' } },
  { id: 2, codigo: 'BQ-002', denominacion: 'Puerto Norte I', tipo: 'Carguero', estado: { label: 'Activo', type: 'success' } },
  { id: 3, codigo: 'BQ-003', denominacion: 'Andina Cargo', tipo: 'Carguero', estado: { label: 'Inactivo', type: 'neutral' } },
  { id: 4, codigo: 'BQ-004', denominacion: 'Río de la Plata', tipo: 'Remolcador', estado: { label: 'Activo', type: 'success' } },
  { id: 5, codigo: 'BQ-005', denominacion: 'Cruz del Atlántico', tipo: 'Petrolero', estado: { label: 'Inactivo', type: 'neutral' } },
];

// Ejemplo — reemplazar por el catálogo real de contratos. Vive acá (no en
// Contratos.jsx) por el mismo motivo que INITIAL_BUQUES: tanto la grilla
// (/grains/contratos) como el alta/edición necesitan leer/escribir el
// mismo set — no hay backend todavía.
const INITIAL_CONTRATOS = [
  { id: 1, codigoContrato: 'CT-001', codigoReferencia: 'REF-2024-001', fechaConcertacion: '2024-03-15', fechaNegocio: '2024-03-18', tipoContrato: 'Compraventa', tipoMercado: 'Disponible' },
  { id: 2, codigoContrato: 'CT-002', codigoReferencia: 'REF-2024-002', fechaConcertacion: '2024-04-02', fechaNegocio: '2024-04-05', tipoContrato: 'Compraventa', tipoMercado: 'Futuro' },
  { id: 3, codigoContrato: 'CT-003', codigoReferencia: 'REF-2024-003', fechaConcertacion: '2024-05-10', fechaNegocio: '2024-05-12', tipoContrato: 'Canje', tipoMercado: 'Disponible' },
];

// Ejemplo — reemplazar por el catálogo real de usuarios. Vive acá (no en
// Usuarios.jsx) por el mismo motivo que INITIAL_BUQUES: tanto la grilla
// (/admin/usuarios) como el alta/edición (/admin/usuarios/nuevo,
// /admin/usuarios/:id/editar) necesitan leer/escribir el mismo set — no hay
// backend todavía. `empresaIds`/`perfilIds`/`rolIds` guardan ids (de
// config/sidebars/main.js companies, config/perfiles.js, config/roles.js
// respectivamente), nunca labels.
const INITIAL_USUARIOS = [
  { id: 1, nombreApellido: 'Carlos Mendoza', correo: 'carlos.mendoza@gmail.com', telefono: '+54 9 11 1234-5678', usuario: 'cmendoza', tipoAutenticacion: 'local', activo: true, bloqueado: false, empresaIds: ['puerto-norte'], perfilIds: ['administrador'], rolIds: ['gestor-usuarios'] },
  { id: 2, nombreApellido: 'Ana Torres', correo: 'ana.torres@gmail.com', telefono: '+54 9 11 2345-6789', usuario: 'atorres', tipoAutenticacion: 'ldap', activo: true, bloqueado: false, empresaIds: ['puerto-norte', 'del-sur'], perfilIds: ['supervisor'], rolIds: ['gestor-operaciones'] },
  { id: 3, nombreApellido: 'Diego Fernández', correo: 'diego.fernandez@gmail.com', telefono: '+54 9 11 3456-7890', usuario: 'dfernandez', tipoAutenticacion: 'local', activo: false, bloqueado: true, empresaIds: ['del-sur'], perfilIds: ['operador'], rolIds: ['gestor-buques'] },
  { id: 4, nombreApellido: 'Lucía Pérez', correo: 'lucia.perez@gmail.com', telefono: '+54 9 11 4567-8901', usuario: 'lperez', tipoAutenticacion: 'sso', activo: true, bloqueado: false, empresaIds: ['andina'], perfilIds: ['operador'], rolIds: ['solo-lectura'] },
  { id: 5, nombreApellido: 'Martín Gómez', correo: 'martin.gomez@gmail.com', telefono: '+54 9 11 5678-9012', usuario: 'mgomez', tipoAutenticacion: 'local', activo: false, bloqueado: false, empresaIds: [], perfilIds: ['invitado'], rolIds: [] },
];

// Ejemplo — reemplazar por el catálogo real de perfiles. Vive acá (no en
// Perfiles.jsx) por el mismo motivo que INITIAL_USUARIOS: tanto la grilla
// (/admin/roles-y-perfiles) como el alta/edición necesitan leer/escribir el
// mismo set — no hay backend todavía. `moduloIds` guarda ids de
// config/modules.js (ALL_MODULES), `concesionarioIds` ids de
// config/concesionarios.js — nunca labels.
const INITIAL_PERFILES = [
  { id: 1, codigo: 'PRF-001', denominacion: 'Administrador', activo: true, moduloIds: ['ports', 'human-resources', 'dashboard'], concesionarioIds: ['terminal-norte', 'terminal-sur'] },
  { id: 2, codigo: 'PRF-002', denominacion: 'Supervisor', activo: true, moduloIds: ['ports', 'truckshift'], concesionarioIds: ['terminal-norte'] },
  { id: 3, codigo: 'PRF-003', denominacion: 'Operador', activo: true, moduloIds: ['ports'], concesionarioIds: [] },
  { id: 4, codigo: 'PRF-004', denominacion: 'Invitado', activo: false, moduloIds: [], concesionarioIds: [] },
];

// Ejemplo — reemplazar por el catálogo real de empresas. Vive acá (no en
// Empresas.jsx) por el mismo motivo que INITIAL_PERFILES: tanto la grilla
// (/admin/empresas) como el alta/edición necesitan leer/escribir el mismo
// set — no hay backend todavía. Los archivos (`logoFileName`/
// `certificadoAfipFileName`) son solo nombres de ejemplo — el kit no tiene
// backend de subida de archivos, ver nota de `FileUpload` en Componentes.
const INITIAL_EMPRESAS = [
  { id: 1, codigo: 'EMP-001', nombreLegal: 'Puerto Norte S.A.', nombreComercial: 'Puerto Norte', activo: true, identificacionFiscal: '30-71234567-8', ingresosBrutos: '901-123456-7', fechaInicioActividad: '2010-03-15', pais: 'AR', cp: '1000', localidad: 'Buenos Aires', domicilio: 'Av. Puerto 123', zonaHoraria: 'america-argentina-buenos_aires', telefono: '+54 11 4321-0000', email: 'contacto@puertonorte.com', logoFileName: 'logo-puerto-norte.png', certificadoAfipFileName: 'certificado-afip.pfx', tieneClaveCertificado: true, claveCertificado: '••••••••' },
  { id: 2, codigo: 'EMP-002', nombreLegal: 'Del Sur Logística S.R.L.', nombreComercial: 'Del Sur Logística', activo: true, identificacionFiscal: '30-70987654-3', ingresosBrutos: '901-765432-1', fechaInicioActividad: '2015-07-01', pais: 'AR', cp: '8000', localidad: 'Bahía Blanca', domicilio: 'Ruta 3 Km 12', zonaHoraria: 'america-argentina-buenos_aires', telefono: '+54 291 455-0000', email: 'contacto@delsurlogistica.com', logoFileName: '', certificadoAfipFileName: '', tieneClaveCertificado: false, claveCertificado: '' },
  { id: 3, codigo: 'EMP-003', nombreLegal: 'Andina Comercial S.A.', nombreComercial: 'Andina', activo: false, identificacionFiscal: '30-69876543-2', ingresosBrutos: '', fechaInicioActividad: '2008-11-20', pais: 'CL', cp: '8320000', localidad: 'Santiago', domicilio: 'Av. Providencia 1234', zonaHoraria: 'america-santiago', telefono: '+56 2 2345 0000', email: 'contacto@andinacomercial.cl', logoFileName: '', certificadoAfipFileName: '', tieneClaveCertificado: false, claveCertificado: '' },
];

// Matchea `path` contra un `pattern` con segmentos fijos o `:param`. Devuelve
// el objeto de params si matchea (vacío si el pattern no tiene ninguno), o
// null si no matchea — misma cantidad de segmentos y cada segmento fijo debe
// coincidir exacto.
function matchRoute(pattern, path) {
  const patternParts = pattern.split('/').filter(Boolean);
  const pathParts = path.split('/').filter(Boolean);
  if (patternParts.length !== pathParts.length) return null;

  const params = {};
  for (let i = 0; i < patternParts.length; i++) {
    const part = patternParts[i];
    if (part.startsWith(':')) {
      params[part.slice(1)] = decodeURIComponent(pathParts[i]);
    } else if (part !== pathParts[i]) {
      return null;
    }
  }
  return params;
}

function resolveRoute(path) {
  for (const route of ROUTES) {
    const params = matchRoute(route.pattern, path);
    if (params) return { Component: route.Component, params, extraProps: route.props ?? {} };
  }
  return { Component: Home, params: {}, extraProps: {} };
}

// A diferencia de `resolveRoute` (que sí tiene fallback a Home — para una
// URL cargada directa en el navegador, mostrar el Home de Main es mejor que
// una pantalla en blanco), la navegación DENTRO de la app (clicks de
// Sidebar/CardQuickAccess/acciones de pantalla, todo pasa por `onNavigate`)
// no debe caer a ese fallback: la mayoría de los ítems de cada sidebar son
// placeholders sin pantalla propia todavía (ver notas en
// config/sidebars/*.js) y clickearlos no debe redirigir a Main — debe no
// hacer nada, quedarse en la pantalla actual.
function routeExists(path) {
  return ROUTES.some((route) => matchRoute(route.pattern, path) !== null);
}

function useRoute() {
  const [path, setPath] = useState(() => window.location.pathname || '/');

  useEffect(() => {
    const onPopState = () => setPath(window.location.pathname || '/');
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  function navigate(href) {
    if (href !== window.location.pathname) {
      window.history.pushState({}, '', href);
    }
    setPath(href);
  }

  return [path, navigate];
}

export default function App() {
  const [path, navigate] = useRoute();
  const [buques, setBuques] = useState(INITIAL_BUQUES);
  const [contratos, setContratos] = useState(INITIAL_CONTRATOS);
  const [usuarios, setUsuarios] = useState(INITIAL_USUARIOS);
  const [perfiles, setPerfiles] = useState(INITIAL_PERFILES);
  const [empresas, setEmpresas] = useState(INITIAL_EMPRESAS);
  const [pendingQuery, setPendingQuery] = useState(null);
  // Empresa activa (selector del Sidebar) y qué módulos tiene habilitados
  // cada una (ver Main/Modulos y config/modules.js) — vive acá porque tanto
  // Main/Home (filtra qué CardModule mostrar) como Main/Modulos (edita el
  // set) necesitan leer/escribir el mismo estado, sin backend todavía. Solo
  // se hila hacia esas dos pantallas (ver sus props) — el resto del kit no
  // lo necesita hoy, mismo criterio que cualquier otro estado compartido
  // puntual de este archivo.
  const [activeCompanyId, setActiveCompanyId] = useState('puerto-norte');
  const [companyModules, setCompanyModules] = useState(DEFAULT_COMPANY_MODULES);
  // Favoritos: un solo array plano de hrefs (ej. '/buques'), sin namespacing
  // por módulo — como los hrefs ya son únicos en toda la app (mismo criterio
  // que ALL_MODULES), alcanza con esto. Se pasa a TODAS las pantallas (mismo
  // criterio que rows/activeCompanyId) — cada Home lo filtra a los ítems de
  // SU propio sidebar (ver utils/favorites.js), y cada pantalla principal de
  // un maestro/proceso que tenga `ToggleIcon` (ver LayoutMaestroDataGrid)
  // lee/escribe su propio href acá.
  const [favoriteHrefs, setFavoriteHrefs] = useState([]);
  const { Component: Screen, params, extraProps } = resolveRoute(path);

  function addBuque(buque) {
    setBuques((prev) => [...prev, buque]);
    navigate('/buques');
  }

  function updateBuque(buque) {
    setBuques((prev) => prev.map((b) => (b.id === buque.id ? buque : b)));
    navigate('/buques');
  }

  function addContrato(contrato) {
    setContratos((prev) => [...prev, contrato]);
    navigate('/grains/contratos');
  }

  function updateContrato(contrato) {
    setContratos((prev) => prev.map((c) => (c.id === contrato.id ? contrato : c)));
    navigate('/grains/contratos');
  }

  function addUsuario(usuario) {
    setUsuarios((prev) => [...prev, usuario]);
    navigate('/admin/usuarios');
  }

  function updateUsuario(usuario) {
    setUsuarios((prev) => prev.map((u) => (u.id === usuario.id ? usuario : u)));
    navigate('/admin/usuarios');
  }

  function addPerfil(perfil) {
    setPerfiles((prev) => [...prev, perfil]);
    navigate('/admin/roles-y-perfiles');
  }

  function updatePerfil(perfil) {
    setPerfiles((prev) => prev.map((p) => (p.id === perfil.id ? perfil : p)));
    navigate('/admin/roles-y-perfiles');
  }

  function addEmpresa(empresa) {
    setEmpresas((prev) => [...prev, empresa]);
    navigate('/admin/empresas');
  }

  function updateEmpresa(empresa) {
    setEmpresas((prev) => prev.map((e) => (e.id === empresa.id ? empresa : e)));
    navigate('/admin/empresas');
  }

  // Buscador de la TopBar (cualquier módulo) → guarda la consulta y navega al
  // chatbot de IA, que la consume al montar (ver AsistenteIA). Se pasa a
  // TODAS las pantallas por igual (mismo criterio que rows/onCreate/onUpdate)
  // — las que no lo usan simplemente no lo destructuran.
  function handleSearch(query) {
    setPendingQuery(query);
    navigate('/asistente-ia');
  }

  function saveCompanyModules(companyId, enabledIds) {
    setCompanyModules((prev) => ({ ...prev, [companyId]: enabledIds }));
  }

  function toggleFavorite(href) {
    setFavoriteHrefs((prev) => (prev.includes(href) ? prev.filter((h) => h !== href) : [...prev, href]));
  }

  return (
    <SidebarPinnedProvider>
      <Screen
        onNavigate={({ href }) => { if (routeExists(href)) navigate(href); }}
        onSearch={handleSearch}
        rows={buques}
        onCreate={addBuque}
        onUpdate={updateBuque}
        contratos={contratos}
        onCreateContrato={addContrato}
        onUpdateContrato={updateContrato}
        usuarios={usuarios}
        onCreateUsuario={addUsuario}
        onUpdateUsuario={updateUsuario}
        perfiles={perfiles}
        onCreatePerfil={addPerfil}
        onUpdatePerfil={updatePerfil}
        empresas={empresas}
        onCreateEmpresa={addEmpresa}
        onUpdateEmpresa={updateEmpresa}
        params={params}
        pendingQuery={pendingQuery}
        onConsumePendingQuery={() => setPendingQuery(null)}
        activeCompanyId={activeCompanyId}
        onCompanyChange={(c) => setActiveCompanyId(c.id)}
        companyModules={companyModules}
        onSaveCompanyModules={saveCompanyModules}
        favoriteHrefs={favoriteHrefs}
        onToggleFavorite={toggleFavorite}
        {...extraProps}
      />
    </SidebarPinnedProvider>
  );
}
