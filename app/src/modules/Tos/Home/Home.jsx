import LayoutHomeModule from '../../../templates/LayoutHomeModule/LayoutHomeModule.jsx';
import { favoriteQuickAccess } from '../../../utils/favorites.js';
import { TOS_SIDEBAR_PROPS } from '../../../config/sidebars/tos.js';

// Ejemplo — reemplazar por los KPIs reales del módulo (mismo criterio que
// modules/Operaciones/Home/Home.jsx, el primer módulo del kit).
const METRICS = [
  { label: 'Buques en operación', value: 5, trendLabel: '+1 vs ayer', trendDirection: 'up', data: [3, 5, 7, 4, 5, 2, 5] },
  { label: 'Contenedores movidos hoy', value: 842, trendLabel: '+64 vs ayer', trendDirection: 'up', data: [840, 817, 793, 765, 742, 714, 842] },
  { label: 'Muelles ocupados', value: 3, trendLabel: '+1 vs ayer', trendDirection: 'up', data: [1, 3, 5, 2, 4, 1, 3] },
  { label: 'Grúas activas', value: 7, trendLabel: '-1 vs ayer', trendDirection: 'down', data: [5, 7, 9, 7, 9, 6, 7] },
];

// Ejemplo — reemplazar por el feed real del módulo.
const ACTIVITY = [
  { name: 'Carlos M.', time: 'hace 5 min', description: 'Planificó el atraque del buque Estrella del Sur' },
  { name: 'Ana R.', time: 'hace 18 min', description: 'Asignó una grúa a la operación #58' },
  { name: 'Diego P.', time: 'hace 32 min', description: 'Liberó el muelle 2' },
  { name: 'Lucía F.', time: 'hace 1 h', description: 'Actualizó el estado de la grúa 4' },
];

export default function TosHome({ onNavigate, onSearch, favoriteHrefs = [] }) {
  return (
    <LayoutHomeModule
      sidebar={TOS_SIDEBAR_PROPS}
      activeHref="/tos"
      onNavigate={onNavigate ?? ((d) => console.log('navigate', d))}
      onSearch={onSearch}
      onCompanyChange={(c) => console.log('company change', c)}
      onLogout={() => console.log('logout')}
      onToggle={(d) => console.log('toggle', d)}
      metrics={METRICS}
      quickAccessSubtitle="Tus maestros y procesos favoritos"
      quickAccess={favoriteQuickAccess(TOS_SIDEBAR_PROPS, favoriteHrefs)}
      activitySubtitle="Últimas acciones del equipo"
      activity={ACTIVITY}
    />
  );
}
