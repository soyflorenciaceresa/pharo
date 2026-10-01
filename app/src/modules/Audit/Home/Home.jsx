import LayoutHomeModule from '../../../templates/LayoutHomeModule/LayoutHomeModule.jsx';
import { favoriteQuickAccess } from '../../../utils/favorites.js';
import { AUDIT_SIDEBAR_PROPS } from '../../../config/sidebars/audit.js';

// Ejemplo — reemplazar por los KPIs reales del módulo (mismo criterio que
// modules/Operaciones/Home/Home.jsx, el primer módulo del kit).
const METRICS = [
  { label: 'Auditorías del mes', value: 9, trendLabel: '+2 vs mes anterior', trendDirection: 'up', data: [7, 9, 10, 7, 9, 6, 9] },
  { label: 'Hallazgos abiertos', value: 4, trendLabel: '-1 vs ayer', trendDirection: 'down', data: [2, 4, 6, 3, 5, 3, 4] },
  { label: 'Checklists activos', value: 16, trendLabel: '+1 vs mes anterior', trendDirection: 'up', data: [14, 16, 17, 14, 15, 12, 16] },
  { label: 'Cumplimiento promedio', value: '94%', trendLabel: '+2% vs mes anterior', trendDirection: 'up', data: [92, 91, 90, 85, 84, 78, 94] },
];

// Ejemplo — reemplazar por el feed real del módulo.
const ACTIVITY = [
  { name: 'Ana R.', time: 'hace 5 min', description: 'Cerró un hallazgo de la auditoría #12' },
  { name: 'Diego P.', time: 'hace 18 min', description: 'Inició una nueva auditoría de seguridad' },
  { name: 'Carlos M.', time: 'hace 32 min', description: 'Actualizó el checklist de ingreso de camiones' },
  { name: 'Martín G.', time: 'hace 1 h', description: 'Registró un hallazgo crítico' },
];

export default function AuditHome({ onNavigate, onSearch, favoriteHrefs = [] }) {
  return (
    <LayoutHomeModule
      sidebar={AUDIT_SIDEBAR_PROPS}
      activeHref="/audit"
      onNavigate={onNavigate ?? ((d) => console.log('navigate', d))}
      onSearch={onSearch}
      onCompanyChange={(c) => console.log('company change', c)}
      onLogout={() => console.log('logout')}
      onToggle={(d) => console.log('toggle', d)}
      metrics={METRICS}
      quickAccessSubtitle="Tus maestros y procesos favoritos"
      quickAccess={favoriteQuickAccess(AUDIT_SIDEBAR_PROPS, favoriteHrefs)}
      activitySubtitle="Últimas acciones del equipo"
      activity={ACTIVITY}
    />
  );
}
