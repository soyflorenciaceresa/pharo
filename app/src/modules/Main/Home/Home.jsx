import { useState } from 'react';
import LayoutBase from '../../../templates/LayoutBase/LayoutBase.jsx';
import CardQuickAccess from '../../../components/CardQuickAccess/CardQuickAccess.jsx';
import CardModule from '../../../components/CardModule/CardModule.jsx';
import ActivityList from '../../../components/ActivityList/ActivityList.jsx';
import Pagination from '../../../components/Pagination/Pagination.jsx';
import styles from './Home.module.css';

const GROUPS = [
  {
    label: 'Maestros',
    icon: 'bi-archive-fill',
    items: [
      { label: 'Proveedores', icon: 'bi-building', href: '/proveedores' },
      { label: 'Artículos', icon: 'bi-box-seam', href: '/articulos' },
      { label: 'Depósitos', icon: 'bi-house-door', href: '/depositos' },
    ],
  },
  {
    label: 'Procesos',
    icon: 'bi-grid-1x2-fill',
    items: [
      { label: 'Órdenes de compra', icon: 'bi-receipt', href: '/ordenes-compra' },
      { label: 'Recepciones', icon: 'bi-inbox', href: '/recepciones' },
      { label: 'Facturas', icon: 'bi-file-earmark-text', href: '/facturas' },
    ],
  },
];

const COMPANIES = [
  { id: 'puerto-norte', name: 'Puerto Norte S.A.' },
  { id: 'del-sur', name: 'Del Sur Logística' },
  { id: 'andina', name: 'Andina Comercial S.A.' },
];

const USER = {
  name: 'Carlos Mendoza',
  email: 'carlos.mendoza@gmail.com',
  role: 'Administrador',
};

// Ejemplo — reemplazar por los maestros/procesos que el usuario haya marcado como favoritos.
const QUICK_ACCESS = [
  { icon: 'bi-building', title: 'Proveedores', subtitle: 'Maestros', href: '/proveedores' },
  { icon: 'bi-box-seam', title: 'Artículos', subtitle: 'Maestros', href: '/articulos' },
  { icon: 'bi-house-door', title: 'Depósitos', subtitle: 'Maestros', href: '/depositos' },
  { icon: 'bi-receipt', title: 'Órdenes de compra', subtitle: 'Procesos', href: '/ordenes-compra' },
  { icon: 'bi-inbox', title: 'Recepciones', subtitle: 'Procesos', href: '/recepciones' },
  { icon: 'bi-file-earmark-text', title: 'Facturas', subtitle: 'Procesos', href: '/facturas' },
];

// Ejemplo — el diseño de Figma repetía "Ports" x14; se completó con nombres de
// módulo de ejemplo. Reemplazar por el catálogo real de módulos disponibles.
const MODULES = [
  { title: 'Ports', description: 'Gestión de operaciones portuarias' },
  { title: 'Almacenes', description: 'Gestión de depósitos y stock' },
  { title: 'Compras', description: 'Órdenes de compra y proveedores' },
  { title: 'Facturación', description: 'Emisión y control de facturas' },
  { title: 'Flota', description: 'Seguimiento de camiones y choferes' },
  { title: 'Aduanas', description: 'Trámites y documentación aduanera' },
  { title: 'Recepciones', description: 'Control de ingreso de mercadería' },
  { title: 'Embarques', description: 'Planificación de despachos' },
  { title: 'Inventario', description: 'Control de artículos y existencias' },
  { title: 'Reportes', description: 'Indicadores y analítica operativa' },
  { title: 'Usuarios', description: 'Administración de accesos y roles' },
  { title: 'Notificaciones', description: 'Alertas y avisos del sistema' },
  { title: 'Configuración', description: 'Ajustes generales de la plataforma' },
  { title: 'Soporte', description: 'Centro de ayuda y tickets' },
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

export default function Home() {
  const [modulesPage, setModulesPage] = useState(1);
  const totalModulePages = Math.ceil(MODULES.length / MODULES_PER_PAGE);
  const visibleModules = MODULES.slice(
    (modulesPage - 1) * MODULES_PER_PAGE,
    modulesPage * MODULES_PER_PAGE,
  );

  return (
    <LayoutBase
      sidebarProps={{
        brandLabel: 'PHARO°',
        brandIcon: 'bi-cart',
        homeHref: '/',
        groups: GROUPS,
        companies: COMPANIES,
        defaultActiveCompanyId: 'puerto-norte',
        user: USER,
        onNavigate: (d) => console.log('navigate', d),
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
