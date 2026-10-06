import LayoutHomeModule from '../../../templates/LayoutHomeModule/LayoutHomeModule.jsx';
import { favoriteQuickAccess } from '../../../utils/favorites.js';
import { DEVOPS_SIDEBAR_PROPS } from '../../../config/sidebars/devops.js';

// Ejemplo — reemplazar por los KPIs reales del módulo (mismo criterio que
// modules/Operaciones/Home/Home.jsx, el primer módulo del kit).
const METRICS = [
  { label: 'Despliegues del mes', value: 47, trendLabel: '+6 vs mes anterior', trendDirection: 'up' },
  { label: 'Incidentes abiertos', value: 1, trendLabel: '-1 vs ayer', trendDirection: 'down' },
  { label: 'Uptime del mes', value: '99.95%', trendLabel: '+0.1% vs mes anterior', trendDirection: 'up' },
  { label: 'Ambientes activos', value: 6, trendLabel: '+1 vs mes anterior', trendDirection: 'up' },
  { label: 'Alertas abiertas', value: 3, trendLabel: '-1 vs ayer', trendDirection: 'down' },
];

// Ejemplo — reemplazar por el feed real del módulo.
const ACTIVITY = [
  { name: 'Diego P.', time: 'hace 5 min', description: 'Desplegó una nueva versión a producción' },
  { name: 'Ana R.', time: 'hace 18 min', description: 'Resolvió un incidente en el ambiente de staging' },
  { name: 'Carlos M.', time: 'hace 32 min', description: 'Escaló los recursos de un servidor' },
  { name: 'Martín G.', time: 'hace 1 h', description: 'Configuró un nuevo ambiente de pruebas' },
];

export default function DevopsHome({ onNavigate, onSearch, favoriteHrefs = [] }) {
  return (
    <LayoutHomeModule
      sidebar={DEVOPS_SIDEBAR_PROPS}
      activeHref="/devops"
      onNavigate={onNavigate ?? ((d) => console.log('navigate', d))}
      onSearch={onSearch}
      onCompanyChange={(c) => console.log('company change', c)}
      onLogout={() => console.log('logout')}
      onToggle={(d) => console.log('toggle', d)}
      metrics={METRICS}
      quickAccessSubtitle="Tus maestros y procesos favoritos"
      quickAccess={favoriteQuickAccess(DEVOPS_SIDEBAR_PROPS, favoriteHrefs)}
      activitySubtitle="Últimas acciones del equipo"
      activity={ACTIVITY}
    />
  );
}
