import LayoutHomeModule from '../../../templates/LayoutHomeModule/LayoutHomeModule.jsx';
import { favoriteQuickAccess } from '../../../utils/favorites.js';
import { CONTAINERS_SIDEBAR_PROPS } from '../../../config/sidebars/containers.js';

// Ejemplo — reemplazar por los KPIs reales del módulo (mismo criterio que
// modules/Operaciones/Home/Home.jsx, el primer módulo del kit).
const METRICS = [
  { label: 'Contenedores en depósito', value: 512, trendLabel: '+24 vs ayer', trendDirection: 'up', data: [510, 497, 483, 465, 452, 433, 512] },
  { label: 'Movimientos hoy', value: 76, trendLabel: '+9 vs ayer', trendDirection: 'up', data: [74, 74, 73, 68, 68, 63, 76] },
  { label: 'Contenedores vacíos', value: 88, trendLabel: '-6 vs ayer', trendDirection: 'down', data: [86, 91, 95, 95, 100, 99, 88] },
  { label: 'Contenedores con alerta', value: 3, trendLabel: '+1 vs ayer', trendDirection: 'up', data: [1, 3, 5, 2, 4, 1, 3] },
];

// Ejemplo — reemplazar por el feed real del módulo.
const ACTIVITY = [
  { name: 'Lucía F.', time: 'hace 5 min', description: 'Registró el ingreso de un contenedor' },
  { name: 'Ana R.', time: 'hace 18 min', description: 'Actualizó la ubicación de un contenedor' },
  { name: 'Diego P.', time: 'hace 32 min', description: 'Despachó un contenedor a planta' },
  { name: 'Carlos M.', time: 'hace 1 h', description: 'Marcó un contenedor con alerta de daño' },
];

export default function ContainersHome({ onNavigate, onSearch, favoriteHrefs = [] }) {
  return (
    <LayoutHomeModule
      sidebar={CONTAINERS_SIDEBAR_PROPS}
      activeHref="/containers"
      onNavigate={onNavigate ?? ((d) => console.log('navigate', d))}
      onSearch={onSearch}
      onCompanyChange={(c) => console.log('company change', c)}
      onLogout={() => console.log('logout')}
      onToggle={(d) => console.log('toggle', d)}
      metrics={METRICS}
      quickAccessSubtitle="Tus maestros y procesos favoritos"
      quickAccess={favoriteQuickAccess(CONTAINERS_SIDEBAR_PROPS, favoriteHrefs)}
      activitySubtitle="Últimas acciones del equipo"
      activity={ACTIVITY}
    />
  );
}
