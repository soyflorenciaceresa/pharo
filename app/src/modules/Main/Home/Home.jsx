import { useEffect, useRef, useState } from 'react';
import LayoutBase from '../../../templates/LayoutBase/LayoutBase.jsx';
import CardQuickAccess from '../../../components/CardQuickAccess/CardQuickAccess.jsx';
import ModuleAccessCard from '../../../components/ModuleAccessCard/ModuleAccessCard.jsx';
import CardModule from '../../../components/CardModule/CardModule.jsx';
import ActivityList from '../../../components/ActivityList/ActivityList.jsx';
import Button from '../../../components/Button/Button.jsx';
import Pagination from '../../../components/Pagination/Pagination.jsx';
import PageHeader from '../../../components/PageHeader/PageHeader.jsx';
import EmptyState from '../../../components/EmptyState/EmptyState.jsx';
import { INITIAL_STATE_COMPANY_IDS, QUICK_ACCESS_INITIAL_MESSAGE } from '../../../config/companyAccess.js';
import Message from '../../../components/Message/Message.jsx';
import HorizontalScroller from '../../../components/HorizontalScroller/HorizontalScroller.jsx';
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

// Favoritos del usuario, en este orden (pedido). El `accent` es el color
// identificatorio del módulo (el mismo de `ALL_MODULES` en config/modules.js).
// `href`: la pantalla real cuando existe; si no, el Home del módulo (los ítems
// de sidebar que todavía no tienen ruta caen a Main). Ver notas por ítem.
// Reemplazar por los favoritos reales cuando haya persistencia.
const QUICK_ACCESS = [
  { icon: 'app-window', accent: 'violet', title: 'Depósitos', subtitle: 'Ports', href: '/depositos' },
  { icon: 'icon-usuarios', accent: 'neutral', title: 'Personas', subtitle: 'Access Control', href: '/access-control' },
  { icon: 'bi-cart', accent: 'cyan', title: 'Compras', subtitle: 'Purchases', href: '/purchases' },
  { icon: 'icon-buques', accent: 'violet', title: 'Buques', subtitle: 'Ports', href: '/buques' },
  // Free Zone no tiene "Nueva Operación" (es un proceso de Ports): lleva al Home de Free Zone.
  { icon: 'icon-nueva-operacion', accent: 'green', title: 'Nueva Operación', subtitle: 'Free Zone', href: '/free-zone' },
  { icon: 'app-window', accent: 'amber', title: 'Contratos', subtitle: 'Grains', href: '/grains/contratos' },
  // Billing no tiene "Método de pago" ni "Productos" en su sidebar: llevan al Home de Billing.
  { icon: 'icon-monedas', accent: 'green', title: 'Método de pago', subtitle: 'Billing', href: '/billing' },
  { icon: 'app-window', accent: 'green', title: 'Productos', subtitle: 'Billing', href: '/billing' },
  // "Balanzas" ≈ "Básculas" (sidebar de Scales, sin pantalla todavía): Home de Scales.
  { icon: 'app-window', accent: 'violet', title: 'Balanzas', subtitle: 'Scales', href: '/scales' },
  // "Clientes" se sacó del sidebar de Ports (sin pantalla): Home de Ports.
  { icon: 'icon-clientes', accent: 'violet', title: 'Clientes', subtitle: 'Ports', href: '/operaciones' },
  // No existe un módulo "Agro": se usó Grains (agroindustria, color amber). Sin pantalla de Liquidaciones todavía.
  { icon: 'icon-monedas', accent: 'amber', title: 'Liquidaciones', subtitle: 'Grains', href: '/grains' },
];

// Favoritos por empresa. Una empresa sin entrada usa `QUICK_ACCESS`. "Del Sur
// Logística" está en estado inicial (usuario recién empezando, sin nada
// configurado): sin favoritos, así que el Acceso rápido muestra el `Message`
// de bienvenida en vez de cards.
const QUICK_ACCESS_BY_COMPANY = {
  'del-sur': [],
};

// Empresas en estado inicial (el usuario recién empieza y no configuró nada):
// además de no tener favoritos, la sección Módulos muestra un `Message` de
// bienvenida y los módulos con checkbox para elegir cuáles forman parte de su
// trabajo (mismas `ModuleAccessCard` que `Main/Modulos`).
const INITIAL_STATE_COMPANIES = INITIAL_STATE_COMPANY_IDS;

// Las cards de módulo tienen ancho fijo (ver Home.module.css) — la cantidad
// de columnas que entran depende del ancho disponible, así que la paginación
// no puede ser un número fijo de cards. Estos dos valores tienen que
// coincidir con `.modulesGrid` (grid-template-columns/gap) en el CSS: se
// usan para replicar a mano el mismo cálculo que ya hace CSS Grid con
// `auto-fill`, y así saber cuántas columnas entran realmente por fila.
const MODULE_CARD_WIDTH = 174; // ancho mínimo de card (minmax(174px, 1fr) en .modulesGrid)
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

export default function Home({ onNavigate, onSearch, activeCompanyId = 'puerto-norte', companyModules, onCompanyChange, onSaveCompanyModules }) {
  const [modulesPage, setModulesPage] = useState(1);
  const [tourOpen, setTourOpen] = useState(false);
  // Selección de módulos del estado inicial: local, arranca vacía (nada configurado todavía).
  const [selectedModuleIds, setSelectedModuleIds] = useState(() => new Set());
  const [modulesPerPage, setModulesPerPage] = useState(MODULE_MAX_ROWS * 4); // 4 = fallback antes de medir
  const modulesGridRef = useRef(null);

  // Solo los módulos habilitados para la empresa activa (ver selector de
  // empresa del Sidebar y Main/Modulos, donde se editan) — `companyModules`
  // llega por prop desde App.jsx; sin backend real todavía, si no está
  // definido para esa empresa cae al set por default del catálogo.
  const quickAccess = QUICK_ACCESS_BY_COMPANY[activeCompanyId] ?? QUICK_ACCESS;
  const enabledIds = companyModules?.[activeCompanyId] ?? DEFAULT_COMPANY_MODULES[activeCompanyId] ?? [];
  const enabledModules = ALL_MODULES.filter((m) => enabledIds.includes(m.id));

  const isInitialState = INITIAL_STATE_COMPANIES.includes(activeCompanyId);
  // La sección Módulos sale del estado inicial recién cuando se guarda al menos
  // un módulo (queda en `companyModules`, así sobrevive a cambiar de pantalla).
  const isModulesInitial = isInitialState && enabledIds.length === 0;
  // En estado inicial se listan TODOS los módulos del catálogo para elegir; si no, solo los habilitados.
  const listedModules = isModulesInitial ? ALL_MODULES : enabledModules;
  const totalModulePages = Math.ceil(listedModules.length / modulesPerPage);
  const visibleModules = listedModules.slice(
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

  function toggleModule(id) {
    setSelectedModuleIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function saveSelectedModules() {
    onSaveCompanyModules?.(activeCompanyId, Array.from(selectedModuleIds));
    setSelectedModuleIds(new Set());
    setModulesPage(1);
  }

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
      <div className={styles.root}>
      <section className={styles.section}>
        <PageHeader type="home" title="Acceso rápido" subtitle="Tus maestros y procesos favoritos" />
        {quickAccess.length === 0 ? (
          <Message {...QUICK_ACCESS_INITIAL_MESSAGE} />
        ) : (
          <HorizontalScroller aria-label="Accesos rápidos">
            {quickAccess.map((qa) => (
              <CardQuickAccess key={qa.title} {...qa} />
            ))}
          </HorizontalScroller>
        )}
      </section>

      <div className={styles.bottomRow}>
        <section className={styles.modulesCol}>
          <PageHeader type="home" title="Módulos" subtitle={`${isModulesInitial ? ALL_MODULES.length : enabledModules.length} módulos disponibles`} />
          {isModulesInitial && (
            <Message
              icon="icon-modulos"
              title="Personalizá tu espacio"
              message="Seleccioná los módulos que forman parte de tu trabajo."
            />
          )}
          <div className={styles.modulesGrid} ref={modulesGridRef}>
            {visibleModules.map((m) =>
              isModulesInitial ? (
                <ModuleAccessCard
                  key={m.id}
                  icon={m.icon}
                  accent={m.accent}
                  title={m.title}
                  description={m.description}
                  checked={selectedModuleIds.has(m.id)}
                  onChange={() => toggleModule(m.id)}
                />
              ) : (
                <CardModule key={m.id} {...m} />
              ),
            )}
          </div>
          {(totalModulePages > 1 || (isModulesInitial && selectedModuleIds.size > 0)) && (
            <div className={styles.modulesFooter}>
              {totalModulePages > 1 ? (
                <Pagination
                  page={modulesPage}
                  totalPages={totalModulePages}
                  onPrevious={() => setModulesPage((p) => Math.max(1, p - 1))}
                  onNext={() => setModulesPage((p) => Math.min(totalModulePages, p + 1))}
                />
              ) : (
                <span />
              )}
              {isModulesInitial && selectedModuleIds.size > 0 && (
                <Button onClick={saveSelectedModules}>Guardar</Button>
              )}
            </div>
          )}
        </section>

        <section className={styles.activityCol}>
          <PageHeader type="home" title="Actividad reciente" subtitle="Últimas acciones del equipo" />
          {isInitialState ? <EmptyState /> : <ActivityList items={ACTIVITY} />}
        </section>
      </div>
      </div>

      <TourPopup open={tourOpen} slides={PRODUCT_TOUR_SLIDES} onClose={handleCloseTour} />
    </LayoutBase>
  );
}
