import { useEffect, useState } from 'react';
import Home from './modules/Main/Home/Home.jsx';
import OperacionesHome from './modules/Operaciones/Home/Home.jsx';
import Buque from './modules/Operaciones/Buque/Buque.jsx';
import BuqueFormulario from './modules/Operaciones/Buque/BuqueFormulario.jsx';
import Equipos from './modules/Main/Equipos/Equipos.jsx';
import EquipoFormulario from './modules/Main/Equipos/EquipoFormulario.jsx';
import NuevaOperacion from './modules/Operaciones/NuevaOperacion/NuevaOperacion.jsx';
import MaestroPorts from './modules/Operaciones/Maestros/MaestroPorts.jsx';
import { MAESTROS_PORTS } from './config/maestrosPorts.js';
import { OPERACIONES_SIDEBAR_PROPS } from './config/sidebars/operaciones.js';
import MaestroTruckshift from './modules/Truckshift/Maestros/MaestroTruckshift.jsx';
import TipoMovimientoFormulario from './modules/Operaciones/Maestros/TipoMovimientoFormulario.jsx';
import AcuerdoComercialFormulario from './modules/Operaciones/Maestros/AcuerdoComercialFormulario.jsx';
import EsquemaHorarioFormulario from './modules/Operaciones/Maestros/EsquemaHorarioFormulario.jsx';
import { PORTS_FORMS } from './config/portsMaestros.js';
import RetencionIibbFormulario from './modules/Purchases/Maestros/RetencionIibbFormulario.jsx';
import { PURCHASES_FORMS } from './config/purchasesMaestros.js';
import GrupoBalanzaFormulario from './modules/Scales/Maestros/GrupoBalanzaFormulario.jsx';
import { SCALES_FORMS } from './config/scalesMaestros.js';
import ChoferFormulario from './modules/Truckshift/Maestros/ChoferFormulario.jsx';
import MaestroTruckshiftFormulario from './modules/Truckshift/Maestros/MaestroTruckshiftFormulario.jsx';
import { MAESTROS_BILLING, MAESTROS_GRAINS, MAESTROS_ACCESS_CONTROL, MAESTROS_TRUCKSHIFT, MAESTROS_SCALES, MAESTROS_PURCHASES, MAESTROS_HUMAN_RESOURCES, MAESTROS_FREE_ZONE, MAESTROS_ACCOUNTING, maestroRows } from './config/maestrosModulos.js';
import { BILLING_SIDEBAR_PROPS } from './config/sidebars/billing.js';
import { HUMAN_RESOURCES_SIDEBAR_PROPS } from './config/sidebars/human-resources.js';
import CartaPorteFormulario from './modules/Grains/CartasPorte/CartaPorteFormulario.jsx';
import { GRAINS_FORMS } from './config/grainsMaestros.js';
import CondicionVentaFormulario from './modules/Billing/Maestros/CondicionVentaFormulario.jsx';
import { BILLING_FORMS, CLIENTES_OPT } from './config/billingMaestros.js';
import { ACCOUNTING_SIDEBAR_PROPS } from './config/sidebars/accounting.js';
import { ACCOUNTING_FORMS } from './config/accountingMaestros.js';
import { FZ_FORMS } from './config/freeZoneMaestros.js';
import { FREE_ZONE_SIDEBAR_PROPS } from './config/sidebars/free-zone.js';
import { HR_FORMS } from './config/hrMaestros.js';
import ConvenioFormulario from './modules/HumanResources/Maestros/ConvenioFormulario.jsx';
import PersonalFormulario from './modules/HumanResources/Maestros/PersonalFormulario.jsx';
import GrupoFormulario from './modules/HumanResources/Maestros/GrupoFormulario.jsx';
import { PURCHASES_SIDEBAR_PROPS } from './config/sidebars/purchases.js';
import { SCALES_SIDEBAR_PROPS } from './config/sidebars/scales.js';
import { TRUCKSHIFT_SIDEBAR_PROPS } from './config/sidebars/truckshift.js';
import { GRAINS_SIDEBAR_PROPS } from './config/sidebars/grains.js';
import { ACCESS_CONTROL_SIDEBAR_PROPS } from './config/sidebars/access-control.js';
import Giros from './modules/Operaciones/GiroBuque/Giros.jsx';
import SolicitudGiro from './modules/Operaciones/GiroBuque/SolicitudGiro.jsx';
import Deposito from './modules/Operaciones/Deposito/Deposito.jsx';
import DepositoFormulario from './modules/Operaciones/Deposito/DepositoFormulario.jsx';
import Clientes from './modules/Grains/Clientes/Clientes.jsx';
import ClienteFormulario from './modules/Grains/Clientes/ClienteFormulario.jsx';
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
import CondicionesImpositivas from './modules/Billing/CondicionesImpositivas/CondicionesImpositivas.jsx';
import CondicionImpositivaFormulario from './modules/Billing/CondicionesImpositivas/CondicionImpositivaFormulario.jsx';
import Servicios from './modules/Billing/Servicios/Servicios.jsx';
import ServicioFormulario from './modules/Billing/Servicios/ServicioFormulario.jsx';
import ClientesBilling from './modules/Billing/Clientes/Clientes.jsx';
import ClienteBillingFormulario from './modules/Billing/Clientes/ClienteFormulario.jsx';
import Personas from './modules/AccessControl/Personas/Personas.jsx';
import PersonaFormulario from './modules/AccessControl/Personas/PersonaFormulario.jsx';
import AccessControlHome from './modules/AccessControl/Home/Home.jsx';
import ScalesHome from './modules/Scales/Home/Home.jsx';
import Proveedores from './modules/Purchases/Proveedores/Proveedores.jsx';
import ProveedorFormulario from './modules/Purchases/Proveedores/ProveedorFormulario.jsx';
import HabilitacionesFondosFijos from './modules/Purchases/HabilitacionFondosFijos/HabilitacionesFondosFijos.jsx';
import HabilitacionFormulario from './modules/Purchases/HabilitacionFondosFijos/HabilitacionFormulario.jsx';
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
// Choferes tiene formulario propio (M-04a, con grilla de transportistas); el resto usa el genérico M-01.
const truckshiftForm = (maestro) => (maestro.href === '/truckshift/choferes' ? ChoferFormulario : MaestroTruckshiftFormulario);

const ROUTES = [
  { pattern: '/', Component: Home },
  { pattern: '/operaciones', Component: OperacionesHome },
  { pattern: '/buques', Component: Buque },
  { pattern: '/buques/nuevo', Component: BuqueFormulario, props: { mode: 'create' } },
  { pattern: '/buques/:id/ver', Component: BuqueFormulario, props: { mode: 'view' } },
  { pattern: '/buques/:id/editar', Component: BuqueFormulario, props: { mode: 'edit' } },
  { pattern: '/nueva-operacion', Component: NuevaOperacion },
  // Maestros de Ports sin pantalla propia: grilla estándar con datos de ejemplo.
  // Los que ya tienen formulario (config/portsMaestros.js, Tipos de movimientos y Acuerdos comerciales con pantalla propia): listado + crear / ver / editar.
  ...MAESTROS_PORTS.flatMap((maestro) => {
    const key = maestro.href.split('/').pop();
    const Special = { 'tipos-de-movimientos': TipoMovimientoFormulario, 'acuerdos-comerciales': AcuerdoComercialFormulario, 'esquema-de-horarios': EsquemaHorarioFormulario }[key];
    if (!PORTS_FORMS[key] && !Special) return [{ pattern: maestro.href, Component: MaestroPorts, props: { maestro } }];
    const Form = Special ?? MaestroTruckshiftFormulario;
    const shared = { maestro, sidebar: OPERACIONES_SIDEBAR_PROPS, forms: PORTS_FORMS };
    return [
      { pattern: maestro.href, Component: MaestroTruckshift, props: shared },
      { pattern: `${maestro.href}/nuevo`, Component: Form, props: { ...shared, mode: 'create' } },
      { pattern: `${maestro.href}/:id/ver`, Component: Form, props: { ...shared, mode: 'view' } },
      { pattern: `${maestro.href}/:id/editar`, Component: Form, props: { ...shared, mode: 'edit' } },
    ];
  }),
  // Ídem para los maestros sin pantalla de Billing, Grains y Access Control (con el sidebar de su módulo).
  // Maestros de Billing (los 3 con pantalla propia no están en MAESTROS_BILLING): listado + formulario, ver config/billingMaestros.js.
  ...MAESTROS_BILLING.flatMap((maestro) => {
    const key = maestro.href.split('/').pop();
    const Form = { 'condiciones-de-venta': CondicionVentaFormulario, percepciones: RetencionIibbFormulario }[key] ?? MaestroTruckshiftFormulario;
    const shared = { maestro, sidebar: BILLING_SIDEBAR_PROPS, forms: BILLING_FORMS, ...(key === 'percepciones' ? { party: { label: 'Cliente', options: CLIENTES_OPT }, zonasHref: '/billing/zonas-de-entrega', categoriasHref: '/billing/categorias-de-percepciones' } : {}) };
    return [
      { pattern: maestro.href, Component: MaestroTruckshift, props: shared },
      { pattern: `${maestro.href}/nuevo`, Component: Form, props: { ...shared, mode: 'create' } },
      { pattern: `${maestro.href}/:id/ver`, Component: Form, props: { ...shared, mode: 'view' } },
      { pattern: `${maestro.href}/:id/editar`, Component: Form, props: { ...shared, mode: 'edit' } },
    ];
  }),
  // Maestros de Grains (salvo Clientes y Contratos, con pantalla propia): listado + formulario, ver config/grainsMaestros.js (Cartas de porte M-04c).
  ...MAESTROS_GRAINS.flatMap((maestro) => {
    const Form = maestro.href === '/grains/cartas-de-porte' ? CartaPorteFormulario : MaestroTruckshiftFormulario;
    const shared = { maestro, sidebar: GRAINS_SIDEBAR_PROPS, forms: GRAINS_FORMS };
    return [
      { pattern: maestro.href, Component: MaestroTruckshift, props: shared },
      { pattern: `${maestro.href}/nuevo`, Component: Form, props: { ...shared, mode: 'create' } },
      { pattern: `${maestro.href}/:id/ver`, Component: Form, props: { ...shared, mode: 'view' } },
      { pattern: `${maestro.href}/:id/editar`, Component: Form, props: { ...shared, mode: 'edit' } },
    ];
  }),
  // Maestros de Truckshift: listado estándar + formulario M-01 (crear / ver / editar), definidos en config/truckshiftMaestros.js.
  ...MAESTROS_TRUCKSHIFT.flatMap((maestro) => [
    { pattern: maestro.href, Component: MaestroTruckshift, props: { maestro } },
    { pattern: `${maestro.href}/nuevo`, Component: truckshiftForm(maestro), props: { maestro, mode: 'create' } },
    { pattern: `${maestro.href}/:id/ver`, Component: truckshiftForm(maestro), props: { maestro, mode: 'view' } },
    { pattern: `${maestro.href}/:id/editar`, Component: truckshiftForm(maestro), props: { maestro, mode: 'edit' } },
  ]),
  // Maestros de Scales: listado estándar + formulario (Balanzas M-02, Unidades de medida M-01, Grupos de balanzas M-04a), ver config/scalesMaestros.js.
  ...MAESTROS_SCALES.flatMap((maestro) => {
    const Form = maestro.href === '/scales/grupos-de-balanzas' ? GrupoBalanzaFormulario : MaestroTruckshiftFormulario;
    const shared = { maestro, sidebar: SCALES_SIDEBAR_PROPS, forms: SCALES_FORMS };
    return [
      { pattern: maestro.href, Component: MaestroTruckshift, props: shared },
      { pattern: `${maestro.href}/nuevo`, Component: Form, props: { ...shared, mode: 'create' } },
      { pattern: `${maestro.href}/:id/ver`, Component: Form, props: { ...shared, mode: 'view' } },
      { pattern: `${maestro.href}/:id/editar`, Component: Form, props: { ...shared, mode: 'edit' } },
    ];
  }),
  // Maestros de Purchases: listado estándar + formulario, ver config/purchasesMaestros.js.
  ...MAESTROS_PURCHASES.flatMap((maestro) => {
    const Form = maestro.href === '/purchases/retenciones-de-iibb' ? RetencionIibbFormulario : MaestroTruckshiftFormulario;
    const shared = { maestro, sidebar: PURCHASES_SIDEBAR_PROPS, forms: PURCHASES_FORMS };
    return [
      { pattern: maestro.href, Component: MaestroTruckshift, props: shared },
      { pattern: `${maestro.href}/nuevo`, Component: Form, props: { ...shared, mode: 'create' } },
      { pattern: `${maestro.href}/:id/ver`, Component: Form, props: { ...shared, mode: 'view' } },
      { pattern: `${maestro.href}/:id/editar`, Component: Form, props: { ...shared, mode: 'edit' } },
    ];
  }),
  // Maestros de Human Resources: listado estándar + formulario (Convenios y Personal M-04c, Grupos M-04a, el resto M-01/M-02), ver config/hrMaestros.js.
  ...MAESTROS_HUMAN_RESOURCES.flatMap((maestro) => {
    const key = maestro.href.split('/').pop();
    const Form = { convenios: ConvenioFormulario, personal: PersonalFormulario, grupos: GrupoFormulario, 'obras-sociales': GrupoFormulario }[key] ?? MaestroTruckshiftFormulario;
    const shared = { maestro, sidebar: HUMAN_RESOURCES_SIDEBAR_PROPS, forms: HR_FORMS, ...(key === 'obras-sociales' ? { child: { key: 'planes', title: 'Planes de cobertura', noun: 'plan de cobertura' } } : {}) };
    return [
      { pattern: maestro.href, Component: MaestroTruckshift, props: shared },
      { pattern: `${maestro.href}/nuevo`, Component: Form, props: { ...shared, mode: 'create' } },
      { pattern: `${maestro.href}/:id/ver`, Component: Form, props: { ...shared, mode: 'view' } },
      { pattern: `${maestro.href}/:id/editar`, Component: Form, props: { ...shared, mode: 'edit' } },
    ];
  }),
  // Maestros de Free Zone: listado estándar + formulario (M-01 / M-02), ver config/freeZoneMaestros.js.
  ...MAESTROS_FREE_ZONE.flatMap((maestro) => {
    const shared = { maestro, sidebar: FREE_ZONE_SIDEBAR_PROPS, forms: FZ_FORMS };
    return [
      { pattern: maestro.href, Component: MaestroTruckshift, props: shared },
      { pattern: `${maestro.href}/nuevo`, Component: MaestroTruckshiftFormulario, props: { ...shared, mode: 'create' } },
      { pattern: `${maestro.href}/:id/ver`, Component: MaestroTruckshiftFormulario, props: { ...shared, mode: 'view' } },
      { pattern: `${maestro.href}/:id/editar`, Component: MaestroTruckshiftFormulario, props: { ...shared, mode: 'edit' } },
    ];
  }),
  // Maestros de Accounting con formulario (config/accountingMaestros.js; Centros de costo M-04a con subcentros); Plan de cuentas y Esquemas de cuentas detalles solo listado.
  ...MAESTROS_ACCOUNTING.flatMap((maestro) => {
    const key = maestro.href.split('/').pop();
    if (!ACCOUNTING_FORMS[key] && key !== 'centros-de-costo') return [{ pattern: maestro.href, Component: MaestroPorts, props: { maestro, sidebar: ACCOUNTING_SIDEBAR_PROPS } }];
    const Form = key === 'centros-de-costo' ? GrupoFormulario : MaestroTruckshiftFormulario;
    const shared = { maestro, sidebar: ACCOUNTING_SIDEBAR_PROPS, forms: ACCOUNTING_FORMS, ...(key === 'centros-de-costo' ? { child: { key: 'subcentros', title: 'Subcentros de costos', noun: 'subcentro de costos' } } : {}) };
    return [
      { pattern: maestro.href, Component: MaestroTruckshift, props: shared },
      { pattern: `${maestro.href}/nuevo`, Component: Form, props: { ...shared, mode: 'create' } },
      { pattern: `${maestro.href}/:id/ver`, Component: Form, props: { ...shared, mode: 'view' } },
      { pattern: `${maestro.href}/:id/editar`, Component: Form, props: { ...shared, mode: 'edit' } },
    ];
  }),
  ...MAESTROS_ACCESS_CONTROL.map((maestro) => ({ pattern: maestro.href, Component: MaestroPorts, props: { maestro, sidebar: ACCESS_CONTROL_SIDEBAR_PROPS } })),
  { pattern: '/giros', Component: Giros },
  { pattern: '/giros/nueva', Component: SolicitudGiro, props: { mode: 'create' } },
  { pattern: '/giros/:id/ver', Component: SolicitudGiro, props: { mode: 'view' } },
  { pattern: '/giros/:id/editar', Component: SolicitudGiro, props: { mode: 'edit' } },
  { pattern: '/depositos', Component: Deposito },
  { pattern: '/depositos/nuevo', Component: DepositoFormulario, props: { mode: 'create' } },
  { pattern: '/depositos/:id/ver', Component: DepositoFormulario, props: { mode: 'view' } },
  { pattern: '/depositos/:id/editar', Component: DepositoFormulario, props: { mode: 'edit' } },
  { pattern: '/grains/clientes', Component: Clientes },
  { pattern: '/grains/clientes/nuevo', Component: ClienteFormulario, props: { mode: 'create' } },
  { pattern: '/grains/clientes/:id/ver', Component: ClienteFormulario, props: { mode: 'view' } },
  { pattern: '/grains/clientes/:id/editar', Component: ClienteFormulario, props: { mode: 'edit' } },
  { pattern: '/grains/contratos', Component: Contratos },
  { pattern: '/grains/contratos/nuevo', Component: ContratoFormulario, props: { mode: 'create' } },
  { pattern: '/grains/contratos/:id/ver', Component: ContratoFormulario, props: { mode: 'view' } },
  { pattern: '/grains/contratos/:id/editar', Component: ContratoFormulario, props: { mode: 'edit' } },
  { pattern: '/asistente-ia', Component: AsistenteIA },
  { pattern: '/admin/modulos', Component: Modulos },
  { pattern: '/admin/equipos', Component: Equipos },
  { pattern: '/admin/equipos/nuevo', Component: EquipoFormulario, props: { mode: 'create' } },
  { pattern: '/admin/equipos/:id/ver', Component: EquipoFormulario, props: { mode: 'view' } },
  { pattern: '/admin/equipos/:id/editar', Component: EquipoFormulario, props: { mode: 'edit' } },
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
  { pattern: '/billing/condiciones-impositivas', Component: CondicionesImpositivas },
  { pattern: '/billing/condiciones-impositivas/nuevo', Component: CondicionImpositivaFormulario, props: { mode: 'create' } },
  { pattern: '/billing/condiciones-impositivas/:id/ver', Component: CondicionImpositivaFormulario, props: { mode: 'view' } },
  { pattern: '/billing/condiciones-impositivas/:id/editar', Component: CondicionImpositivaFormulario, props: { mode: 'edit' } },
  { pattern: '/billing/clientes', Component: ClientesBilling },
  { pattern: '/billing/clientes/nuevo', Component: ClienteBillingFormulario, props: { mode: 'create' } },
  { pattern: '/billing/clientes/:id/ver', Component: ClienteBillingFormulario, props: { mode: 'view' } },
  { pattern: '/billing/clientes/:id/editar', Component: ClienteBillingFormulario, props: { mode: 'edit' } },
  { pattern: '/billing/servicios', Component: Servicios },
  { pattern: '/billing/servicios/nuevo', Component: ServicioFormulario, props: { mode: 'create' } },
  { pattern: '/billing/servicios/:id/ver', Component: ServicioFormulario, props: { mode: 'view' } },
  { pattern: '/billing/servicios/:id/editar', Component: ServicioFormulario, props: { mode: 'edit' } },
  { pattern: '/access-control/personas', Component: Personas },
  { pattern: '/access-control/personas/nuevo', Component: PersonaFormulario, props: { mode: 'create' } },
  { pattern: '/access-control/personas/:id/ver', Component: PersonaFormulario, props: { mode: 'view' } },
  { pattern: '/access-control/personas/:id/editar', Component: PersonaFormulario, props: { mode: 'edit' } },
  { pattern: '/scales', Component: ScalesHome },
  { pattern: '/purchases/proveedores', Component: Proveedores },
  { pattern: '/purchases/proveedores/nuevo', Component: ProveedorFormulario, props: { mode: 'create' } },
  { pattern: '/purchases/proveedores/:id/ver', Component: ProveedorFormulario, props: { mode: 'view' } },
  { pattern: '/purchases/proveedores/:id/editar', Component: ProveedorFormulario, props: { mode: 'edit' } },
  { pattern: '/purchases/habilitacion-de-fondos-fijos', Component: HabilitacionesFondosFijos },
  { pattern: '/purchases/habilitacion-de-fondos-fijos/nuevo', Component: HabilitacionFormulario, props: { mode: 'create' } },
  { pattern: '/purchases/habilitacion-de-fondos-fijos/:id/ver', Component: HabilitacionFormulario, props: { mode: 'view' } },
  { pattern: '/purchases/habilitacion-de-fondos-fijos/:id/editar', Component: HabilitacionFormulario, props: { mode: 'edit' } },
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
  { id: 1, codigo: 'BQ-001', imo: '9321483', denominacion: 'Estrella del Sur', tipo: 'Portacontenedores', estado: { label: 'Activo', type: 'success' } },
  { id: 2, codigo: 'BQ-002', imo: '9454436', denominacion: 'Puerto Norte I', tipo: 'Carguero', estado: { label: 'Activo', type: 'success' } },
  { id: 3, codigo: 'BQ-003', imo: '9632179', denominacion: 'Andina Cargo', tipo: 'Carguero', estado: { label: 'Inactivo', type: 'neutral' } },
  { id: 4, codigo: 'BQ-004', imo: '9704386', denominacion: 'Río de la Plata', tipo: 'Remolcador', estado: { label: 'Activo', type: 'success' } },
  { id: 5, codigo: 'BQ-005', imo: '9811000', denominacion: 'Cruz del Atlántico', tipo: 'Petrolero', estado: { label: 'Inactivo', type: 'neutral' } },
];

// Ejemplo — reemplazar por el catálogo real de depósitos (mismo criterio que
// INITIAL_BUQUES: la grilla y el alta/edición comparten el set, sin backend).
const INITIAL_DEPOSITOS = [
  { id: 1, codigo: 'DEP-001', denominacion: 'Depósito Central', codigoLot: 'LOT-100', actualizaStock: true, depositoFiscal: false, trabajaSectorizacion: true, estado: { label: 'Activo', type: 'success' } },
  { id: 2, codigo: 'DEP-002', denominacion: 'Depósito Fiscal Norte', codigoLot: 'LOT-200', actualizaStock: true, depositoFiscal: true, trabajaSectorizacion: false, estado: { label: 'Activo', type: 'success' } },
  { id: 3, codigo: 'DEP-003', denominacion: 'Depósito Zona Franca', codigoLot: 'LOT-300', actualizaStock: false, depositoFiscal: true, trabajaSectorizacion: false, estado: { label: 'Inactivo', type: 'neutral' } },
  { id: 4, codigo: 'DEP-004', denominacion: 'Depósito Contenedores', codigoLot: 'LOT-400', actualizaStock: true, depositoFiscal: false, trabajaSectorizacion: true, estado: { label: 'Activo', type: 'success' } },
  { id: 5, codigo: 'DEP-005', denominacion: 'Depósito Graneles', codigoLot: 'LOT-500', actualizaStock: false, depositoFiscal: false, trabajaSectorizacion: false, estado: { label: 'Inactivo', type: 'neutral' } },
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

// Ejemplo — reemplazar por el catálogo real de equipos. Vive acá por el mismo
// motivo que INITIAL_USUARIOS (grilla + alta/edición comparten el set).
// `empresaId` guarda el id de config/sidebars/main.js companies, nunca el nombre.
const INITIAL_EQUIPOS = [
  { id: 1, empresaId: 'puerto-norte', ip: '192.168.1.10', denominacion: 'Balanza acceso norte', seguro: true, activo: true },
  { id: 2, empresaId: 'puerto-norte', ip: '192.168.1.11', denominacion: 'Terminal de ingreso', seguro: true, activo: true },
  { id: 3, empresaId: 'del-sur', ip: '192.168.2.20', denominacion: 'Servidor de reportes', seguro: false, activo: false },
];

// Ejemplo — reemplazar por el catálogo real de personas de Access Control (mismo
// motivo que INITIAL_USUARIOS: grilla + alta/edición comparten el set).
const INITIAL_PERSONAS = [
  { id: 1, dni: '43336729', denominacion: 'CERESA, Florencia', grupo: 'personal', subgrupo: 'unico', docux: false, rrhh: false, turnos: false, activo: true, razones: [], values: { dni: '43336729', nombre: 'Florencia', apellido: 'Ceresa', direccion: '', ciudad: 'rosario', grupo: 'personal', subgrupo: 'unico', tarjetaRfid: '000123', imagen: '', docux: false, rrhh: false, turnos: false, inactivo: false, suspInicio: '', suspFin: '', observaciones: '' } },
  { id: 2, dni: '28968732', denominacion: 'RAMIREZ, Daniel', grupo: 'personal', subgrupo: 'unico', docux: false, rrhh: false, turnos: false, activo: true, razones: [], values: { dni: '28968732', nombre: 'Daniel', apellido: 'Ramirez', direccion: '', ciudad: '', grupo: 'personal', subgrupo: 'unico', tarjetaRfid: '000124', imagen: '', docux: false, rrhh: false, turnos: false, inactivo: false, suspInicio: '', suspFin: '', observaciones: '' } },
  { id: 3, dni: '38621056', denominacion: 'CASTILLO, Micaela Belen', grupo: 'transportistas', subgrupo: 'externos', docux: true, rrhh: false, turnos: false, activo: true, razones: [{ id: 1, razon: 'Transportes del Litoral S.R.L.', cuit: '30712345678', activo: true }], values: { dni: '38621056', nombre: 'Micaela Belen', apellido: 'Castillo', direccion: '', ciudad: 'san-lorenzo', grupo: 'transportistas', subgrupo: 'externos', tarjetaRfid: '000125', imagen: '', docux: true, rrhh: false, turnos: false, inactivo: false, suspInicio: '', suspFin: '', observaciones: '' } },
  { id: 4, dni: '39859522', denominacion: 'BIASIOLLI, Lucas', grupo: 'visitas', subgrupo: 'proveedores', docux: false, rrhh: true, turnos: false, activo: false, razones: [], values: { dni: '39859522', nombre: 'Lucas', apellido: 'Biasiolli', direccion: '', ciudad: '', grupo: 'visitas', subgrupo: 'proveedores', tarjetaRfid: '000126', imagen: '', docux: false, rrhh: true, turnos: false, inactivo: true, suspInicio: '', suspFin: '', observaciones: '' } },
  { id: 5, dni: '95389409', denominacion: 'ARPA OVANDO, Marina', grupo: 'personal', subgrupo: 'contratado', docux: true, rrhh: false, turnos: true, activo: true, razones: [], values: { dni: '95389409', nombre: 'Marina', apellido: 'Arpa Ovando', direccion: '', ciudad: '', grupo: 'personal', subgrupo: 'contratado', tarjetaRfid: '000127', imagen: '', docux: true, rrhh: false, turnos: true, inactivo: false, suspInicio: '', suspFin: '', observaciones: '' } },
];

// Ejemplo — reemplazar por el catálogo real de clientes de Grains (mismo motivo
// que INITIAL_USUARIOS). El CUIT se guarda sin guiones.
const INITIAL_CLIENTES_GRAINS = [
  { id: 1, cuit: '30711234566', razonSocial: 'Agroexport S.A.', nombreExtendido: 'Agroexport', rol: 'cliente', activo: true, telefonos: [], correos: [], sisa: [], values: { rol: 'cliente', cuit: '30711234566', razonSocial: 'Agroexport S.A.', nombreExtendido: 'Agroexport', actividad: 'exportacion', calle: 'Av. Pellegrini', numero: '1200', piso: '', depto: '', tipoDomicilio: 'fiscal', localidad: 'rosario', nacionalidad: 'Argentina', paisAfip: '200', catIva: 'ri', catGanancias: 'inscripto', alicuotaIibb: '3.5', condicion: 'general', fechaAlta: '2024-03-15', fechaBaja: '', observaciones: '', inactivo: false, web: '', webUsuario: '', webClave: '' } },
];

// Ejemplo — reemplazar por el catálogo real de clientes de Billing (el CUIT se guarda sin guiones).
const INITIAL_CLIENTES_BILLING = [
  { id: 1, cuit: '30711234566', codigo: 'CL-001', denominacion: 'Agroexport S.A.', estado: { label: 'Activo', type: 'success' }, values: { razonSocial: 'Agroexport S.A.', nombreFantasia: 'Agroexport', idFiscal: '30711234566', condicionImpositiva: 'ri', direccion: 'Av. Pellegrini 1200', ciudad: 'rosario', iibb: '901-234567-8', observaciones: '', inactivo: false, cuenta: '1.1.03.01', clienteGrande: true, contactoNombre: 'María Gómez', contactoTelefono: '+54 341 555-0101', contactoEmail: 'maria.gomez@agroexport.com', condicionVenta: 'cc30', emailGeneral: 'info@agroexport.com', emailFacturacion: 'facturacion@agroexport.com', emailCobranzas: 'cobranzas@agroexport.com' } },
  { id: 2, cuit: '20123456786', codigo: 'CL-002', denominacion: 'Cereales del Sur', estado: { label: 'Activo', type: 'success' }, values: { razonSocial: 'Cereales del Sur', nombreFantasia: '', idFiscal: '20123456786', condicionImpositiva: 'mono', direccion: '', ciudad: 'san-lorenzo', iibb: '', observaciones: '', inactivo: false, cuenta: '1.1.03.01', clienteGrande: false, contactoNombre: '', contactoTelefono: '', contactoEmail: '', condicionVenta: 'contado', emailGeneral: '', emailFacturacion: '', emailCobranzas: '' } },
];

// Ejemplo — reemplazar por el catálogo real de proveedores (Purchases; el CUIT se guarda sin guiones).
const INITIAL_PROVEEDORES = [
  { id: 1, cuit: '30711234566', codigo: 'PR-001', denominacion: 'Insumos del Litoral S.R.L.', estado: { label: 'Activo', type: 'success' }, values: { nombre: 'Insumos del Litoral', observaciones: '', inactivo: false, cuit: '30711234566', condicionImpositiva: 'ri', iibb: '901-234567-8', convenioMultilateral: true, cuentaContable: '2.1.01.01', conceptoCompra: 'CC-01', domicilio: 'Av. Pellegrini 1200', localidad: 'rosario', contactoNombre: 'Laura Pérez', celular: '+54 341 555-0102', correo: 'laura@insumoslitoral.com', emailGeneral: 'info@insumoslitoral.com', emailFacturacion: 'facturacion@insumoslitoral.com', emailCobranza: '' } },
  { id: 2, cuit: '20123456786', codigo: 'PR-002', denominacion: 'Mantenimiento Industrial', estado: { label: 'Activo', type: 'success' }, values: { nombre: '', observaciones: '', inactivo: false, cuit: '20123456786', condicionImpositiva: 'mono', iibb: '', convenioMultilateral: false, cuentaContable: '2.1.01.03', conceptoCompra: 'CC-03', domicilio: '', localidad: 'san-lorenzo', contactoNombre: '', celular: '', correo: '', emailGeneral: '', emailFacturacion: '', emailCobranza: '' } },
];

// Ejemplo — reemplazar por el catálogo real de habilitaciones de fondos fijos (Purchases).
const INITIAL_HABILITACIONES = [
  { id: 1, usuario: 'U-001', autoriza: 'U-002', codigo: 'U-001', denominacion: 'Carlos Mendoza', gastoPropio: true, gastoOtro: false, estado: { label: 'Activo', type: 'success' }, subcentros: [{ id: 11, valor: 'SC-01' }, { id: 12, valor: 'SC-04' }], legajos: [{ id: 21, valor: 'L-100' }] },
  { id: 2, usuario: 'U-003', autoriza: 'U-001', codigo: 'U-003', denominacion: 'Martín Gómez', gastoPropio: true, gastoOtro: true, estado: { label: 'Activo', type: 'success' }, subcentros: [], legajos: [] },
];

// Ejemplo — reemplazar por el catálogo real de servicios (Billing).
const INITIAL_SERVICIOS = [
  { id: 1, codigo: 'SV-001', denominacion: 'Descarga de camiones', estado: { label: 'Activo', type: 'success' }, values: { codigo: 'SV-001', denominacion: 'Descarga de camiones', moneda: 'ARS', precio: '1500', unidad: 'tn', impuesto: 'iva-21', cuenta: '4.1.01', inactivo: false } },
  { id: 2, codigo: 'SV-002', denominacion: 'Carga de buques', estado: { label: 'Activo', type: 'success' }, values: { codigo: 'SV-002', denominacion: 'Carga de buques', moneda: 'USD', precio: '4.5', unidad: 'tn', impuesto: 'iva-21', cuenta: '4.1.01', inactivo: false } },
  { id: 3, codigo: 'SV-003', denominacion: 'Almacenaje', estado: { label: 'Activo', type: 'success' }, values: { codigo: 'SV-003', denominacion: 'Almacenaje', moneda: 'ARS', precio: '320', unidad: 'tn', impuesto: 'iva-21', cuenta: '4.1.02', inactivo: false } },
  { id: 4, codigo: 'SV-004', denominacion: 'Fumigación', estado: { label: 'Inactivo', type: 'neutral' }, values: { codigo: 'SV-004', denominacion: 'Fumigación', moneda: 'ARS', precio: '90', unidad: 'tn', impuesto: 'iva-105', cuenta: '4.1.03', inactivo: true } },
];

// Ejemplo — reemplazar por el catálogo real de condiciones impositivas (Billing).
const INITIAL_CONDICIONES = [
  { id: 1, codigo: 'CI-001', denominacion: 'Responsable inscripto', estado: { label: 'Activo', type: 'success' }, values: { codigo: 'CI-001', denominacion: 'Responsable inscripto', impuesto: 'iva-21', codigoFiscal: '1', factura: 'FA', facturaMipyme: 'FCEA', notaCredito: 'NCA', notaCreditoMipyme: 'NCCEA', notaDebito: 'NDA', notaDebitoMipyme: 'NDCEA', inactivo: false } },
  { id: 2, codigo: 'CI-002', denominacion: 'Monotributo', estado: { label: 'Activo', type: 'success' }, values: { codigo: 'CI-002', denominacion: 'Monotributo', impuesto: '', codigoFiscal: '6', factura: 'FB', facturaMipyme: '', notaCredito: 'NCB', notaCreditoMipyme: '', notaDebito: 'NDB', notaDebitoMipyme: '', inactivo: false } },
  { id: 3, codigo: 'CI-003', denominacion: 'Exento', estado: { label: 'Activo', type: 'success' }, values: { codigo: 'CI-003', denominacion: 'Exento', impuesto: '', codigoFiscal: '4', factura: 'FB', facturaMipyme: '', notaCredito: 'NCB', notaCreditoMipyme: '', notaDebito: 'NDB', notaDebitoMipyme: '', inactivo: false } },
  { id: 4, codigo: 'CI-004', denominacion: 'Consumidor final', estado: { label: 'Inactivo', type: 'neutral' }, values: { codigo: 'CI-004', denominacion: 'Consumidor final', impuesto: '', codigoFiscal: '5', factura: 'FB', facturaMipyme: '', notaCredito: 'NCB', notaCreditoMipyme: '', notaDebito: 'NDB', notaDebitoMipyme: '', inactivo: true } },
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
  const [depositos, setDepositos] = useState(INITIAL_DEPOSITOS);
  const [contratos, setContratos] = useState(INITIAL_CONTRATOS);
  const [usuarios, setUsuarios] = useState(INITIAL_USUARIOS);
  const [equipos, setEquipos] = useState(INITIAL_EQUIPOS);
  const [giros, setGiros] = useState([]);
  const [personas, setPersonas] = useState(INITIAL_PERSONAS);
  const [condiciones, setCondiciones] = useState(INITIAL_CONDICIONES);
  const [servicios, setServicios] = useState(INITIAL_SERVICIOS);
  const [clientesBilling, setClientesBilling] = useState(INITIAL_CLIENTES_BILLING);
  const [proveedores, setProveedores] = useState(INITIAL_PROVEEDORES);
  // Filas de los maestros de Truckshift, por href (ejemplo — sin backend).
  const [truckshiftRows, setTruckshiftRows] = useState(() => ({
    ...Object.fromEntries([...MAESTROS_TRUCKSHIFT, ...MAESTROS_SCALES, ...MAESTROS_PURCHASES, ...MAESTROS_PORTS, ...MAESTROS_HUMAN_RESOURCES, ...MAESTROS_GRAINS, ...MAESTROS_FREE_ZONE, ...MAESTROS_BILLING, ...MAESTROS_ACCOUNTING].map((m) => [m.href, maestroRows(m)])),
    // Purchases: Retenciones de IIBB / Ganancias / IVA son por proveedor (código = proveedor o autogenerado).
    '/purchases/retenciones-de-iibb': [
      { id: 1, codigo: 'PR-001', denominacion: 'Insumos del Litoral S.R.L.', estado: { label: 'Activo', type: 'success' }, proveedor: 'PR-001 · Insumos del Litoral S.R.L.', values: { proveedor: 'PR-001 · Insumos del Litoral S.R.L.' }, zonas: [{ id: 11, zonaId: 1, principal: true, activo: true, categoriaIds: [1, 3] }, { id: 12, zonaId: 2, principal: false, activo: true, categoriaIds: [3] }] },
      { id: 2, codigo: 'PR-002', denominacion: 'Mantenimiento Industrial', estado: { label: 'Activo', type: 'success' }, proveedor: 'PR-002 · Mantenimiento Industrial', values: { proveedor: 'PR-002 · Mantenimiento Industrial' }, zonas: [] },
    ],
    '/purchases/retenciones-de-ganancias': [
      { id: 1, codigo: 'RG-001', denominacion: 'Insumos del Litoral S.R.L. · Honorarios', estado: { label: 'Activo', type: 'success' }, values: { proveedor: 'PR-001 · Insumos del Litoral S.R.L.', concepto: 'Honorarios', fechaExencion: '' } },
      { id: 2, codigo: 'RG-002', denominacion: 'Fletes del Sur · Locaciones de servicio', estado: { label: 'Inactivo', type: 'neutral' }, values: { proveedor: 'PR-003 · Fletes del Sur', concepto: 'Locaciones de servicio', fechaExencion: '2026-12-31' } },
    ],
    '/purchases/retenciones-iva': [
      { id: 1, codigo: 'RI-001', denominacion: 'Mantenimiento Industrial · Retención IVA 21%', estado: { label: 'Activo', type: 'success' }, values: { proveedor: 'PR-002 · Mantenimiento Industrial', concepto: 'Retención IVA 21%', fechaExencion: '' } },
    ],
    // Billing: Percepciones es por cliente (código = cliente), con sus zonas de entrega.
    '/billing/percepciones': [
      { id: 1, codigo: 'CL-001', denominacion: 'Agroexport S.A.', estado: { label: 'Activo', type: 'success' }, proveedor: 'CL-001 · Agroexport S.A.', values: { proveedor: 'CL-001 · Agroexport S.A.' }, zonas: [{ id: 11, zonaId: 1, principal: true, activo: true, categoriaIds: [1, 2] }] },
      { id: 2, codigo: 'CL-002', denominacion: 'Cereales del Sur', estado: { label: 'Activo', type: 'success' }, proveedor: 'CL-002 · Cereales del Sur', values: { proveedor: 'CL-002 · Cereales del Sur' }, zonas: [] },
    ],
    // Choferes: código = DNI, denominación = "APELLIDO, Nombre", y transportistas asignados (ids de las filas de Transportistas).
    '/truckshift/choferes': [
      { id: 1, codigo: '30123456', denominacion: 'PÉREZ, Juan', estado: { label: 'Activo', type: 'success' }, values: { dni: '30123456', nombre: 'Juan', apellido: 'Pérez', telefono: '+54 341 555-0111' }, transportistaIds: [1, 2] },
      { id: 2, codigo: '28456789', denominacion: 'GÓMEZ, María', estado: { label: 'Activo', type: 'success' }, values: { dni: '28456789', nombre: 'María', apellido: 'Gómez', telefono: '' }, transportistaIds: [3] },
      { id: 3, codigo: '33789012', denominacion: 'LÓPEZ, Carlos', estado: { label: 'Inactivo', type: 'neutral' }, values: { dni: '33789012', nombre: 'Carlos', apellido: 'López', telefono: '' }, transportistaIds: [] },
    ],
  }));
  const [habilitaciones, setHabilitaciones] = useState(INITIAL_HABILITACIONES);
  const [clientesGrains, setClientesGrains] = useState(INITIAL_CLIENTES_GRAINS);
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

  function addDeposito(deposito) {
    setDepositos((prev) => [...prev, deposito]);
    navigate('/depositos');
  }

  function updateDeposito(deposito) {
    setDepositos((prev) => prev.map((d) => (d.id === deposito.id ? deposito : d)));
    navigate('/depositos');
  }

  function addContrato(contrato) {
    setContratos((prev) => [...prev, contrato]);
    navigate('/grains/contratos');
  }

  function updateContrato(contrato) {
    setContratos((prev) => prev.map((c) => (c.id === contrato.id ? contrato : c)));
    navigate('/grains/contratos');
  }

  function addClienteGrains(cliente) {
    setClientesGrains((prev) => [...prev, cliente]);
    navigate('/grains/clientes');
  }

  function updateClienteGrains(cliente) {
    setClientesGrains((prev) => prev.map((c) => (c.id === cliente.id ? cliente : c)));
    navigate('/grains/clientes');
  }

  function addHabilitacion(h) {
    setHabilitaciones((prev) => [...prev, h]);
    navigate('/purchases/habilitacion-de-fondos-fijos');
  }

  function updateHabilitacion(h) {
    setHabilitaciones((prev) => prev.map((x) => (x.id === h.id ? h : x)));
    navigate('/purchases/habilitacion-de-fondos-fijos');
  }

  function saveTruckshift(href, row, isEdit) {
    setTruckshiftRows((prev) => ({
      ...prev,
      [href]: isEdit ? prev[href].map((r) => (r.id === row.id ? row : r)) : [...prev[href], row],
    }));
    navigate(href);
  }

  function addProveedor(proveedor) {
    setProveedores((prev) => [...prev, proveedor]);
    navigate('/purchases/proveedores');
  }

  function updateProveedor(proveedor) {
    setProveedores((prev) => prev.map((p) => (p.id === proveedor.id ? proveedor : p)));
    navigate('/purchases/proveedores');
  }

  function addClienteBilling(cliente) {
    setClientesBilling((prev) => [...prev, cliente]);
    navigate('/billing/clientes');
  }

  function updateClienteBilling(cliente) {
    setClientesBilling((prev) => prev.map((c) => (c.id === cliente.id ? cliente : c)));
    navigate('/billing/clientes');
  }

  function addServicio(servicio) {
    setServicios((prev) => [...prev, servicio]);
    navigate('/billing/servicios');
  }

  function updateServicio(servicio) {
    setServicios((prev) => prev.map((s) => (s.id === servicio.id ? servicio : s)));
    navigate('/billing/servicios');
  }

  function addCondicion(condicion) {
    setCondiciones((prev) => [...prev, condicion]);
    navigate('/billing/condiciones-impositivas');
  }

  function updateCondicion(condicion) {
    setCondiciones((prev) => prev.map((c) => (c.id === condicion.id ? condicion : c)));
    navigate('/billing/condiciones-impositivas');
  }

  function addPersona(persona) {
    setPersonas((prev) => [...prev, persona]);
    navigate('/access-control/personas');
  }

  function updatePersona(persona) {
    setPersonas((prev) => prev.map((p) => (p.id === persona.id ? persona : p)));
    navigate('/access-control/personas');
  }

  function addGiro(giro) {
    setGiros((prev) => [...prev, giro]);
    navigate('/giros');
  }

  function updateGiro(giro) {
    setGiros((prev) => prev.map((g) => (g.id === giro.id ? giro : g)));
    navigate('/giros');
  }

  function addEquipo(equipo) {
    setEquipos((prev) => [...prev, equipo]);
    navigate('/admin/equipos');
  }

  function updateEquipo(equipo) {
    setEquipos((prev) => prev.map((e) => (e.id === equipo.id ? equipo : e)));
    navigate('/admin/equipos');
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
        depositos={depositos}
        onCreateDeposito={addDeposito}
        onUpdateDeposito={updateDeposito}
        contratos={contratos}
        onCreateContrato={addContrato}
        onUpdateContrato={updateContrato}
        clientes={clientesGrains}
        onCreateCliente={addClienteGrains}
        onUpdateCliente={updateClienteGrains}
        habilitaciones={habilitaciones}
        onCreateHabilitacion={addHabilitacion}
        onUpdateHabilitacion={updateHabilitacion}
        truckshiftRows={truckshiftRows}
        onSaveTruckshift={saveTruckshift}
        proveedores={proveedores}
        onCreateProveedor={addProveedor}
        onUpdateProveedor={updateProveedor}
        clientesBilling={clientesBilling}
        onCreateClienteBilling={addClienteBilling}
        onUpdateClienteBilling={updateClienteBilling}
        servicios={servicios}
        onCreateServicio={addServicio}
        onUpdateServicio={updateServicio}
        condiciones={condiciones}
        onCreateCondicion={addCondicion}
        onUpdateCondicion={updateCondicion}
        personas={personas}
        onCreatePersona={addPersona}
        onUpdatePersona={updatePersona}
        giros={giros}
        onCreateGiro={addGiro}
        onUpdateGiro={updateGiro}
        equipos={equipos}
        onCreateEquipo={addEquipo}
        onUpdateEquipo={updateEquipo}
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
