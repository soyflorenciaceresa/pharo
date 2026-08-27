import { useState } from 'react';
import LayoutBase from '../../../templates/LayoutBase/LayoutBase.jsx';
import CardQuickAccess from '../../../components/CardQuickAccess/CardQuickAccess.jsx';
import CardModule from '../../../components/CardModule/CardModule.jsx';
import ActivityList from '../../../components/ActivityList/ActivityList.jsx';
import Pagination from '../../../components/Pagination/Pagination.jsx';
import { MAIN_SIDEBAR_PROPS } from '../../../config/sidebars/main.js';
import styles from './Home.module.css';

// Ejemplo — reemplazar por los ítems que el usuario haya marcado como favoritos
// (hoy: un ejemplo de cada grupo del sidebar de Main).
const QUICK_ACCESS = [
  { icon: 'icon-usuarios', title: 'Usuarios', subtitle: 'Administración', href: '/admin/usuarios' },
  { icon: 'icon-empresas', title: 'Empresas', subtitle: 'Administración', href: '/admin/empresas' },
  { icon: 'icon-parametros', title: 'Parámetros', subtitle: 'Configuración', href: '/config/parametros' },
  { icon: 'icon-paises', title: 'Países', subtitle: 'Datos maestros', href: '/datos-maestros/paises' },
];

// Catálogo real de módulos (Figma, página *Cards*, sección "Card-Module —
// Color accents", 446:14 — 14 cards). El texto de descripción en Figma
// estaba repetido igual en las 14 ("Gestión de operaciones portuarias",
// placeholder de diseño) salvo en "Ports", donde sí describe al módulo — se
// completó una descripción propia por módulo, mismo criterio que el resto
// del kit. `icon`/`accent` sí son 1:1 con Figma.
const MODULES = [
  { title: 'Ports', description: 'Gestión de operaciones portuarias', icon: 'icon-gear', accent: 'violet', href: '/operaciones' },
  { title: 'Free Zone', description: 'Administración de zonas francas', icon: 'app-window', accent: 'green' },
  { title: 'Human Resources', description: 'Gestión de personal y RR. HH.', icon: 'icon-administracion', accent: 'amber' },
  { title: 'Tax', description: 'Cálculo y liquidación de impuestos', icon: 'app-window', accent: 'red' },
  { title: 'Purchases', description: 'Órdenes de compra y proveedores', icon: 'bi-cart', accent: 'cyan' },
  { title: 'Dashboard', description: 'Indicadores generales de la plataforma', icon: 'app-window', accent: 'pink' },
  { title: 'Truckshift', description: 'Turnos y asignación de camiones', icon: 'icon-truckshift', accent: 'indigo' },
  { title: 'Access Control', description: 'Control de accesos e ingresos', icon: 'icon-truckshift', accent: 'neutral' },
  { title: 'Scales', description: 'Pesaje y control de cargas', icon: 'icon-truckshift', accent: 'violet' },
  { title: 'Billing', description: 'Facturación y cobranzas', icon: 'icon-truckshift', accent: 'green' },
  { title: 'Accounting', description: 'Contabilidad y balances', icon: 'icon-truckshift', accent: 'amber' },
  { title: 'Agro', description: 'Gestión de cargas agroindustriales', icon: 'icon-truckshift', accent: 'red' },
  { title: 'Servicios', description: 'Solicitud y seguimiento de servicios', icon: 'icon-check2circle', accent: 'cyan' },
  { title: 'Stock', description: 'Control de inventario y existencias', icon: 'icon-box', accent: 'neutral' },
];
const MODULES_PER_PAGE = 12;

// Ejemplo — el diseño de Figma repetía la misma fila x6. Reemplazar por el feed real.
const ACTIVITY = [
  { name: 'Carlos M.', time: 'hace 3 min', description: 'Aprobó turno de camión' },
  { name: 'Ana R.', time: 'hace 12 min', description: 'Registró nueva recepción' },
  { name: 'Diego P.', time: 'hace 25 min', description: 'Actualizó stock de artículos' },
  { name: 'Carlos M.', time: 'hace 40 min', description: 'Generó orden de compra' },
  { name: 'Lucía F.', time: 'hace 1 h', description: 'Cargó factura de proveedor' },
  { name: 'Martín G.', time: 'hace 2 h', description: 'Cerró incidencia de depósito' },
];

export default function Home({ onNavigate }) {
  const [modulesPage, setModulesPage] = useState(1);
  const totalModulePages = Math.ceil(MODULES.length / MODULES_PER_PAGE);
  const visibleModules = MODULES.slice(
    (modulesPage - 1) * MODULES_PER_PAGE,
    modulesPage * MODULES_PER_PAGE,
  );

  return (
    <LayoutBase
      sidebarProps={{
        ...MAIN_SIDEBAR_PROPS,
        defaultActiveHref: '/',
        onNavigate: onNavigate ?? ((d) => console.log('navigate', d)),
        onCompanyChange: (c) => console.log('company change', c),
        onLogout: () => console.log('logout'),
        onToggle: (d) => console.log('toggle', d),
      }}
    >
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Acceso rápido</h2>
          <p className={styles.sectionSubtitle}>Tus maestros y procesos favoritos</p>
        </div>
        <div className={styles.quickAccessRow}>
          {QUICK_ACCESS.map((qa) => (
            <div key={qa.title} className={styles.quickAccessSlot}>
              <CardQuickAccess {...qa} />
            </div>
          ))}
        </div>
      </section>

      <div className={styles.bottomRow}>
        <section className={styles.modulesCol}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Módulos</h2>
            <p className={styles.sectionSubtitle}>{MODULES.length} módulos disponibles</p>
          </div>
          <div className={styles.modulesGrid}>
            {visibleModules.map((m) => (
              <CardModule key={m.title} {...m} />
            ))}
          </div>
          {totalModulePages > 1 && (
            <Pagination
              page={modulesPage}
              totalPages={totalModulePages}
              onPrevious={() => setModulesPage((p) => Math.max(1, p - 1))}
              onNext={() => setModulesPage((p) => Math.min(totalModulePages, p + 1))}
            />
          )}
        </section>

        <section className={styles.activityCol}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Actividad reciente</h2>
            <p className={styles.sectionSubtitle}>Últimas acciones del equipo</p>
          </div>
          <ActivityList items={ACTIVITY} />
        </section>
      </div>
    </LayoutBase>
  );
}
