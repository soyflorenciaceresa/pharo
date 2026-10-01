import LayoutHomeModule from '../../../templates/LayoutHomeModule/LayoutHomeModule.jsx';
import { favoriteQuickAccess } from '../../../utils/favorites.js';
import { HUMAN_RESOURCES_SIDEBAR_PROPS } from '../../../config/sidebars/human-resources.js';

// Ejemplo — reemplazar por los KPIs reales del módulo (mismo criterio que
// modules/Operaciones/Home/Home.jsx, el primer módulo del kit).
const METRICS = [
  { label: 'Empleados activos', value: 214, trendLabel: '+4 vs mes anterior', trendDirection: 'up', data: [212, 208, 203, 194, 189, 180, 214] },
  { label: 'Licencias en curso', value: 6, trendLabel: '+1 vs ayer', trendDirection: 'up', data: [4, 6, 8, 4, 6, 3, 6] },
  { label: 'Vacantes abiertas', value: 3, trendLabel: '-1 vs mes anterior', trendDirection: 'down', data: [1, 3, 5, 2, 4, 1, 3] },
  { label: 'Ausentismo del mes', value: '2.1%', trendLabel: '-0.3% vs mes anterior', trendDirection: 'down', data: [0, 2, 4, 1, 3, 0, 2] },
];

// Ejemplo — reemplazar por el feed real del módulo.
const ACTIVITY = [
  { name: 'Lucía F.', time: 'hace 5 min', description: 'Dio de alta a un nuevo empleado' },
  { name: 'Ana R.', time: 'hace 18 min', description: 'Aprobó una licencia médica' },
  { name: 'Diego P.', time: 'hace 32 min', description: 'Actualizó el legajo de un empleado' },
  { name: 'Carlos M.', time: 'hace 1 h', description: 'Cerró una búsqueda laboral' },
];

export default function HumanResourcesHome({ onNavigate, onSearch, favoriteHrefs = [] }) {
  return (
    <LayoutHomeModule
      sidebar={HUMAN_RESOURCES_SIDEBAR_PROPS}
      activeHref="/human-resources"
      onNavigate={onNavigate ?? ((d) => console.log('navigate', d))}
      onSearch={onSearch}
      onCompanyChange={(c) => console.log('company change', c)}
      onLogout={() => console.log('logout')}
      onToggle={(d) => console.log('toggle', d)}
      metrics={METRICS}
      quickAccessSubtitle="Tus maestros y procesos favoritos"
      quickAccess={favoriteQuickAccess(HUMAN_RESOURCES_SIDEBAR_PROPS, favoriteHrefs)}
      activitySubtitle="Últimas acciones del equipo"
      activity={ACTIVITY}
    />
  );
}
