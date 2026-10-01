import { useEffect, useRef, useState } from 'react';
import LayoutBase from '../../../templates/LayoutBase/LayoutBase.jsx';
import CardQuickAccess from '../../../components/CardQuickAccess/CardQuickAccess.jsx';
import CardModule from '../../../components/CardModule/CardModule.jsx';
import ActivityList from '../../../components/ActivityList/ActivityList.jsx';
import Pagination from '../../../components/Pagination/Pagination.jsx';
import PageHeader from '../../../components/PageHeader/PageHeader.jsx';
import TourPopup from '../../../components/TourPopup/TourPopup.jsx';
import { MAIN_SIDEBAR_PROPS } from '../../../config/sidebars/main.js';
import { PRODUCT_TOUR_SLIDES } from '../../../config/productTour.js';
import { ALL_MODULES, DEFAULT_COMPANY_MODULES } from '../../../config/modules.js';
import styles from './Home.module.css';

// Se muestra una única vez, la primera vez que el usuario abre Main — no hay
// backend/auth todavía, así que "primera vez" se resuelve con localStorage
// (persiste entre sesiones en este navegador; envuelto en try/catch porque
// puede tirar en navegación privada o con site data bloqueado). Si algún día
// hay cuenta de usuario real, mover esta marca a esa cuenta en vez de acá.
const PRODUCT_TOUR_SEEN_KEY = 'pharo-product-tour-seen';

// Ejemplo — reemplazar por los ítems que el usuario haya marcado como favoritos
// (hoy: un ejemplo de cada grupo del sidebar de Main).
const QUICK_ACCESS = [
  { icon: 'icon-usuarios', title: 'Usuarios', subtitle: 'Administración', href: '/admin/usuarios' },
  { icon: 'icon-empresas', title: 'Empresas', subtitle: 'Administración', href: '/admin/empresas' },
  { icon: 'icon-parametros', title: 'Parámetros', subtitle: 'Configuración', href: '/config/parametros' },
  { icon: 'icon-paises', title: 'Países', subtitle: 'Datos maestros', href: '/datos-maestros/paises' },
];

// Las cards de módulo tienen ancho fijo (ver Home.module.css) — la cantidad
// de columnas que entran depende del ancho disponible, así que la paginación
// no puede ser un número fijo de cards. Estos dos valores tienen que
// coincidir con `.modulesGrid` (grid-template-columns/gap) en el CSS: se
// usan para replicar a mano el mismo cálculo que ya hace CSS Grid con
// `auto-fill`, y así saber cuántas columnas entran realmente por fila.
const MODULE_CARD_WIDTH = 174;
const MODULE_GRID_GAP = 16;
const MODULE_MAX_ROWS = 3;

// Ejemplo — el diseño de Figma repetía la misma fila x6. Reemplazar por el feed real.
const ACTIVITY = [
  { name: 'Carlos M.', time: 'hace 3 min', description: 'Aprobó turno de camión' },
  { name: 'Ana R.', time: 'hace 12 min', description: 'Registró nueva recepción' },
  { name: 'Diego P.', time: 'hace 25 min', description: 'Actualizó stock de artículos' },
  { name: 'Carlos M.', time: 'hace 40 min', description: 'Generó orden de compra' },
  { name: 'Lucía F.', time: 'hace 1 h', description: 'Cargó factura de proveedor' },
  { name: 'Martín G.', time: 'hace 2 h', description: 'Cerró incidencia de depósito' },
];

export default function Home({ onNavigate, onSearch, activeCompanyId = 'puerto-norte', companyModules, onCompanyChange }) {
  const [modulesPage, setModulesPage] = useState(1);
  const [tourOpen, setTourOpen] = useState(false);
  const [modulesPerPage, setModulesPerPage] = useState(MODULE_MAX_ROWS * 4); // 4 = fallback antes de medir
  const modulesGridRef = useRef(null);

  // Solo los módulos habilitados para la empresa activa (ver selector de
  // empresa del Sidebar y Main/Modulos, donde se editan) — `companyModules`
  // llega por prop desde App.jsx; sin backend real todavía, si no está
  // definido para esa empresa cae al set por default del catálogo.
  const enabledIds = companyModules?.[activeCompanyId] ?? DEFAULT_COMPANY_MODULES[activeCompanyId] ?? [];
  const enabledModules = ALL_MODULES.filter((m) => enabledIds.includes(m.id));

  const totalModulePages = Math.ceil(enabledModules.length / modulesPerPage);
  const visibleModules = enabledModules.slice(
    (modulesPage - 1) * modulesPerPage,
    modulesPage * modulesPerPage,
  );

  useEffect(() => {
    let seen = true;
    try {
      seen = localStorage.getItem(PRODUCT_TOUR_SEEN_KEY) === '1';
    } catch {
      seen = true; // si localStorage no está disponible, no insistir con el tour
    }
    if (!seen) setTourOpen(true);
  }, []);

  // Máximo 3 filas de módulos siempre — el resto se ve en la siguiente
  // página, a pedido. Como las cards tienen ancho fijo (ver nota de
  // MODULE_CARD_WIDTH), cuántas entran por fila depende del ancho real
  // disponible (colapsar el sidebar o agrandar la ventana suma columnas) —
  // se mide con ResizeObserver en vez de asumir un breakpoint fijo, y se
  // replica a mano el mismo cálculo que usa CSS Grid con `auto-fill` para
  // que "cuántas caben por fila" coincida siempre con lo que se ve.
  useEffect(() => {
    const el = modulesGridRef.current;
    if (!el) return;

    function measure() {
      const width = el.clientWidth;
      const columns = Math.max(1, Math.floor((width + MODULE_GRID_GAP) / (MODULE_CARD_WIDTH + MODULE_GRID_GAP)));
      setModulesPerPage(columns * MODULE_MAX_ROWS);
    }

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setModulesPage(1);
  }, [activeCompanyId, modulesPerPage]);

  function handleCloseTour() {
    setTourOpen(false);
    try {
      localStorage.setItem(PRODUCT_TOUR_SEEN_KEY, '1');
    } catch {
      // navegación privada / site data bloqueado — sin persistencia, el tour
      // puede volver a aparecer en la próxima visita, no es crítico.
    }
  }

  return (
    <LayoutBase
      onSearch={onSearch}
      sidebarProps={{
        ...MAIN_SIDEBAR_PROPS,
        defaultActiveHref: '/',
        defaultActiveCompanyId: activeCompanyId,
        onNavigate: onNavigate ?? ((d) => console.log('navigate', d)),
        onCompanyChange: onCompanyChange ?? ((c) => console.log('company change', c)),
        onLogout: () => console.log('logout'),
        onToggle: (d) => console.log('toggle', d),
      }}
    >
      <section className={styles.section}>
        <PageHeader type="home" title="Acceso rápido" subtitle="Tus maestros y procesos favoritos" />
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
          <PageHeader type="home" title="Módulos" subtitle={`${enabledModules.length} módulos disponibles`} />
          <div className={styles.modulesGrid} ref={modulesGridRef}>
            {visibleModules.map((m) => (
              <CardModule key={m.id} {...m} />
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
          <PageHeader type="home" title="Actividad reciente" subtitle="Últimas acciones del equipo" />
          <ActivityList items={ACTIVITY} />
        </section>
      </div>

      <TourPopup open={tourOpen} slides={PRODUCT_TOUR_SLIDES} onClose={handleCloseTour} />
    </LayoutBase>
  );
}
