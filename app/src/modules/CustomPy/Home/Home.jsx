import LayoutHomeModule from '../../../templates/LayoutHomeModule/LayoutHomeModule.jsx';
import { favoriteQuickAccess } from '../../../utils/favorites.js';
import { CUSTOM_PY_SIDEBAR_PROPS } from '../../../config/sidebars/custom-py.js';

// Ejemplo — reemplazar por los KPIs reales del módulo (mismo criterio que
// modules/Operaciones/Home/Home.jsx, el primer módulo del kit).
const METRICS = [
  { label: 'Despachos del mes', value: 27, trendLabel: '+3 vs mes anterior', trendDirection: 'up', data: [25, 26, 27, 24, 25, 21, 27] },
  { label: 'Declaraciones pendientes', value: 5, trendLabel: '-2 vs ayer', trendDirection: 'down', data: [3, 5, 7, 4, 7, 4, 5] },
  { label: 'Despachantes activos', value: 9, trendLabel: '+1 vs mes anterior', trendDirection: 'up', data: [7, 9, 10, 7, 9, 6, 9] },
  { label: 'Tiempo promedio de despacho', value: '3.2 días', trendLabel: '-0.4 vs mes anterior', trendDirection: 'down', data: [1, 3, 5, 2, 4, 1, 3] },
];

// Ejemplo — reemplazar por el feed real del módulo.
const ACTIVITY = [
  { name: 'Carlos M.', time: 'hace 5 min', description: 'Inició un nuevo despacho aduanero' },
  { name: 'Ana R.', time: 'hace 18 min', description: 'Cargó la declaración de importación #118' },
  { name: 'Diego P.', time: 'hace 32 min', description: 'Asignó un despachante a la operación #94' },
  { name: 'Lucía F.', time: 'hace 1 h', description: 'Cerró el despacho #112' },
];

export default function CustomPyHome({ onNavigate, onSearch, favoriteHrefs = [] }) {
  return (
    <LayoutHomeModule
      sidebar={CUSTOM_PY_SIDEBAR_PROPS}
      activeHref="/custom-py"
      onNavigate={onNavigate ?? ((d) => console.log('navigate', d))}
      onSearch={onSearch}
      onCompanyChange={(c) => console.log('company change', c)}
      onLogout={() => console.log('logout')}
      onToggle={(d) => console.log('toggle', d)}
      metrics={METRICS}
      quickAccessSubtitle="Tus maestros y procesos favoritos"
      quickAccess={favoriteQuickAccess(CUSTOM_PY_SIDEBAR_PROPS, favoriteHrefs)}
      activitySubtitle="Últimas acciones del equipo"
      activity={ACTIVITY}
    />
  );
}
