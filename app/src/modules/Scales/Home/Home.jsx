import LayoutHomeModule from '../../../templates/LayoutHomeModule/LayoutHomeModule.jsx';
import { favoriteQuickAccess } from '../../../utils/favorites.js';
import { SCALES_SIDEBAR_PROPS } from '../../../config/sidebars/scales.js';

// Ejemplo — reemplazar por los KPIs reales del módulo (mismo criterio que
// modules/Operaciones/Home/Home.jsx, el primer módulo del kit).
const METRICS = [
  { label: 'Pesajes hoy', value: 96, trendLabel: '+11 vs ayer', trendDirection: 'up', data: [94, 93, 92, 86, 85, 80, 96] },
  { label: 'Peso total movido', value: '1.240 tn', trendLabel: '+85 tn vs ayer', trendDirection: 'up', data: [1238, 1203, 1168, 1127, 1092, 1052, 1240] },
  { label: 'Tickets pendientes de validación', value: 7, trendLabel: '-2 vs ayer', trendDirection: 'down', data: [5, 7, 9, 7, 9, 6, 7] },
  { label: 'Básculas activas', value: 4, trendLabel: '+1 vs mes anterior', trendDirection: 'up', data: [2, 4, 6, 3, 5, 1, 4] },
];

// Ejemplo — reemplazar por el feed real del módulo.
const ACTIVITY = [
  { name: 'Diego P.', time: 'hace 5 min', description: 'Registró el pesaje del camión TR-234' },
  { name: 'Ana R.', time: 'hace 18 min', description: 'Validó un ticket de pesaje' },
  { name: 'Carlos M.', time: 'hace 32 min', description: 'Calibró la báscula 2' },
  { name: 'Lucía F.', time: 'hace 1 h', description: 'Cerró el reporte diario de pesaje' },
];

export default function ScalesHome({ onNavigate, onSearch, favoriteHrefs = [] }) {
  return (
    <LayoutHomeModule
      sidebar={SCALES_SIDEBAR_PROPS}
      activeHref="/scales"
      onNavigate={onNavigate ?? ((d) => console.log('navigate', d))}
      onSearch={onSearch}
      onCompanyChange={(c) => console.log('company change', c)}
      onLogout={() => console.log('logout')}
      onToggle={(d) => console.log('toggle', d)}
      metrics={METRICS}
      quickAccessSubtitle="Tus maestros y procesos favoritos"
      quickAccess={favoriteQuickAccess(SCALES_SIDEBAR_PROPS, favoriteHrefs)}
      activitySubtitle="Últimas acciones del equipo"
      activity={ACTIVITY}
    />
  );
}
