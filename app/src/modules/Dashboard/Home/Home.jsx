import LayoutHomeModule from '../../../templates/LayoutHomeModule/LayoutHomeModule.jsx';
import { favoriteQuickAccess } from '../../../utils/favorites.js';
import { DASHBOARD_SIDEBAR_PROPS } from '../../../config/sidebars/dashboard.js';

// Ejemplo — reemplazar por los KPIs reales del módulo (mismo criterio que
// modules/Operaciones/Home/Home.jsx, el primer módulo del kit).
const METRICS = [
  { label: 'Reportes generados', value: 34, trendLabel: '+5 vs mes anterior', trendDirection: 'up', data: [32, 33, 34, 30, 31, 27, 34] },
  { label: 'Usuarios activos', value: 112, trendLabel: '+9 vs mes anterior', trendDirection: 'up', data: [110, 109, 107, 101, 100, 93, 112] },
  { label: 'Indicadores configurados', value: 21, trendLabel: '+2 vs mes anterior', trendDirection: 'up', data: [19, 20, 22, 18, 19, 16, 21] },
  { label: 'Exportaciones del mes', value: 15, trendLabel: '+3 vs mes anterior', trendDirection: 'up', data: [13, 15, 16, 13, 14, 11, 15] },
];

// Ejemplo — reemplazar por el feed real del módulo.
const ACTIVITY = [
  { name: 'Ana R.', time: 'hace 5 min', description: 'Generó el reporte mensual de operaciones' },
  { name: 'Diego P.', time: 'hace 18 min', description: 'Configuró un nuevo indicador' },
  { name: 'Carlos M.', time: 'hace 32 min', description: 'Exportó el dashboard de facturación' },
  { name: 'Martín G.', time: 'hace 1 h', description: 'Compartió un reporte con el equipo' },
];

export default function DashboardHome({ onNavigate, onSearch, favoriteHrefs = [] }) {
  return (
    <LayoutHomeModule
      sidebar={DASHBOARD_SIDEBAR_PROPS}
      activeHref="/dashboard"
      onNavigate={onNavigate ?? ((d) => console.log('navigate', d))}
      onSearch={onSearch}
      onCompanyChange={(c) => console.log('company change', c)}
      onLogout={() => console.log('logout')}
      onToggle={(d) => console.log('toggle', d)}
      metrics={METRICS}
      quickAccessSubtitle="Tus maestros y procesos favoritos"
      quickAccess={favoriteQuickAccess(DASHBOARD_SIDEBAR_PROPS, favoriteHrefs)}
      activitySubtitle="Últimas acciones del equipo"
      activity={ACTIVITY}
    />
  );
}
