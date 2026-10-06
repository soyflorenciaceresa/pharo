import LayoutHomeModule from '../../../templates/LayoutHomeModule/LayoutHomeModule.jsx';
import { OPERACIONES_SIDEBAR_PROPS } from '../../../config/sidebars/operaciones.js';
import { INITIAL_STATE_COMPANY_IDS } from '../../../config/companyAccess.js';
import { favoriteQuickAccess } from '../../../utils/favorites.js';

// Ejemplo — reemplazar por los KPIs reales del módulo.
const METRICS = [
  { label: 'Operaciones activas', value: 18, trendLabel: '+3 vs ayer', trendDirection: 'up' },
  { label: 'Turnos asignados hoy', value: 32, trendLabel: '+6 vs ayer', trendDirection: 'up' },
  { label: 'Camiones en tránsito', value: 9, trendLabel: '-2 vs ayer', trendDirection: 'down' },
  { label: 'Depósitos con alerta', value: 2, trendLabel: '+1 vs ayer', trendDirection: 'up' },
  { label: 'Alertas abiertas', value: 3, trendLabel: '-1 vs ayer', trendDirection: 'down' },
];

// Ejemplo — reemplazar por el feed real del módulo.
const ACTIVITY = [
  { name: 'Carlos M.', time: 'hace 5 min', description: 'Asignó chofer a la operación #245' },
  { name: 'Ana R.', time: 'hace 18 min', description: 'Cerró operación de descarga #241' },
  { name: 'Diego P.', time: 'hace 32 min', description: 'Actualizó horario de turno mañana' },
  { name: 'Lucía F.', time: 'hace 1 h', description: 'Registró ingreso de vehículo' },
  { name: 'Martín G.', time: 'hace 2 h', description: 'Marcó depósito con alerta de capacidad' },
];

// Ejemplo — 7 accesos para ver el comportamiento responsive del Acceso rápido
// (cuántas cards entran por fila según el ancho). Los favoritos reales
// (`favoriteHrefs`) van primero; estos completan sin repetir href. Los que no
// tienen pantalla todavía llevan al Home del módulo. Reemplazar por los favoritos
// reales cuando haya persistencia.
const EXAMPLE_QUICK_ACCESS = [
  { icon: 'icon-buques', title: 'Buque', subtitle: 'Maestros', href: '/buques' },
  { icon: 'app-window', title: 'Depósitos', subtitle: 'Maestros', href: '/depositos' },
  { icon: 'icon-nueva-operacion', title: 'Nueva Operación', subtitle: 'Procesos', href: '/operaciones' },
  { icon: 'app-window', title: 'Muelles', subtitle: 'Maestros', href: '/operaciones' },
  { icon: 'app-window', title: 'Remolcadores', subtitle: 'Maestros', href: '/operaciones' },
  { icon: 'app-window', title: 'Agentes marítimos', subtitle: 'Maestros', href: '/operaciones' },
  { icon: 'app-window', title: 'Turnos de camiones', subtitle: 'Procesos', href: '/operaciones' },
];

export default function OperacionesHome({ onNavigate, onSearch, favoriteHrefs = [], activeCompanyId, onCompanyChange }) {
  const favorites = favoriteQuickAccess(OPERACIONES_SIDEBAR_PROPS, favoriteHrefs);
  const favoriteHrefSet = new Set(favorites.map((f) => f.href));
  const quickAccess = [...favorites, ...EXAMPLE_QUICK_ACCESS.filter((e) => !favoriteHrefSet.has(e.href) || e.href === '/operaciones')];

  return (
    <LayoutHomeModule
      sidebar={OPERACIONES_SIDEBAR_PROPS}
      activeHref="/operaciones"
      onNavigate={onNavigate ?? ((d) => console.log('navigate', d))}
      onSearch={onSearch}
      activeCompanyId={activeCompanyId}
      initialState={INITIAL_STATE_COMPANY_IDS.includes(activeCompanyId)}
      onCompanyChange={onCompanyChange ?? ((c) => console.log('company change', c))}
      onLogout={() => console.log('logout')}
      onToggle={(d) => console.log('toggle', d)}
      metrics={METRICS}
      quickAccessSubtitle="Tus maestros y procesos favoritos"
      quickAccess={quickAccess}
      activitySubtitle="Últimas acciones del equipo"
      activity={ACTIVITY}
    />
  );
}
