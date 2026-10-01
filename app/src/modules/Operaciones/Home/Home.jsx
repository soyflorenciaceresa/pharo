import LayoutHomeModule from '../../../templates/LayoutHomeModule/LayoutHomeModule.jsx';
import { OPERACIONES_SIDEBAR_PROPS } from '../../../config/sidebars/operaciones.js';
import { favoriteQuickAccess } from '../../../utils/favorites.js';

// Ejemplo — reemplazar por los KPIs reales del módulo.
const METRICS = [
  { label: 'Operaciones activas', value: 18, trendLabel: '+3 vs ayer', trendDirection: 'up', data: [10, 12, 11, 14, 13, 16, 18] },
  { label: 'Turnos asignados hoy', value: 32, trendLabel: '+6 vs ayer', trendDirection: 'up', data: [22, 24, 23, 27, 26, 30, 32] },
  { label: 'Camiones en tránsito', value: 9, trendLabel: '-2 vs ayer', trendDirection: 'down', data: [14, 13, 12, 11, 10, 9, 9] },
  { label: 'Depósitos con alerta', value: 2, trendLabel: '+1 vs ayer', trendDirection: 'up', data: [0, 0, 1, 1, 1, 2, 2] },
];

// Ejemplo — reemplazar por el feed real del módulo.
const ACTIVITY = [
  { name: 'Carlos M.', time: 'hace 5 min', description: 'Asignó chofer a la operación #245' },
  { name: 'Ana R.', time: 'hace 18 min', description: 'Cerró operación de descarga #241' },
  { name: 'Diego P.', time: 'hace 32 min', description: 'Actualizó horario de turno mañana' },
  { name: 'Lucía F.', time: 'hace 1 h', description: 'Registró ingreso de vehículo' },
  { name: 'Martín G.', time: 'hace 2 h', description: 'Marcó depósito con alerta de capacidad' },
];

export default function OperacionesHome({ onNavigate, onSearch, favoriteHrefs = [] }) {
  return (
    <LayoutHomeModule
      sidebar={OPERACIONES_SIDEBAR_PROPS}
      activeHref="/operaciones"
      onNavigate={onNavigate ?? ((d) => console.log('navigate', d))}
      onSearch={onSearch}
      onCompanyChange={(c) => console.log('company change', c)}
      onLogout={() => console.log('logout')}
      onToggle={(d) => console.log('toggle', d)}
      metrics={METRICS}
      quickAccessSubtitle="Tus maestros y procesos favoritos"
      quickAccess={favoriteQuickAccess(OPERACIONES_SIDEBAR_PROPS, favoriteHrefs)}
      activitySubtitle="Últimas acciones del equipo"
      activity={ACTIVITY}
    />
  );
}
