import LayoutHomeModule from '../../../templates/LayoutHomeModule/LayoutHomeModule.jsx';
import { favoriteQuickAccess } from '../../../utils/favorites.js';
import { TRUCKSHIFT_SIDEBAR_PROPS } from '../../../config/sidebars/truckshift.js';

// Ejemplo — reemplazar por los KPIs reales del módulo (mismo criterio que
// modules/Operaciones/Home/Home.jsx, el primer módulo del kit).
const METRICS = [
  { label: 'Turnos asignados hoy', value: 45, trendLabel: '+8 vs ayer', trendDirection: 'up' },
  { label: 'Choferes activos', value: 28, trendLabel: '+2 vs ayer', trendDirection: 'up' },
  { label: 'Vehículos en ruta', value: 19, trendLabel: '-3 vs ayer', trendDirection: 'down' },
  { label: 'Turnos pendientes', value: 6, trendLabel: '+1 vs ayer', trendDirection: 'up' },
  { label: 'Alertas abiertas', value: 3, trendLabel: '-1 vs ayer', trendDirection: 'down' },
];

// Ejemplo — reemplazar por el feed real del módulo.
const ACTIVITY = [
  { name: 'Diego P.', time: 'hace 5 min', description: 'Asignó un turno al chofer Carlos Ruiz' },
  { name: 'Lucía F.', time: 'hace 18 min', description: 'Dio de alta un nuevo vehículo' },
  { name: 'Ana R.', time: 'hace 32 min', description: 'Reprogramó el turno de la tarde' },
  { name: 'Martín G.', time: 'hace 1 h', description: 'Cerró el turno nocturno' },
];

export default function TruckshiftHome({ onNavigate, onSearch, favoriteHrefs = [] }) {
  return (
    <LayoutHomeModule
      sidebar={TRUCKSHIFT_SIDEBAR_PROPS}
      activeHref="/truckshift"
      onNavigate={onNavigate ?? ((d) => console.log('navigate', d))}
      onSearch={onSearch}
      onCompanyChange={(c) => console.log('company change', c)}
      onLogout={() => console.log('logout')}
      onToggle={(d) => console.log('toggle', d)}
      metrics={METRICS}
      quickAccessSubtitle="Tus maestros y procesos favoritos"
      quickAccess={favoriteQuickAccess(TRUCKSHIFT_SIDEBAR_PROPS, favoriteHrefs)}
      activitySubtitle="Últimas acciones del equipo"
      activity={ACTIVITY}
    />
  );
}
