import LayoutHomeModule from '../../../templates/LayoutHomeModule/LayoutHomeModule.jsx';
import { favoriteQuickAccess } from '../../../utils/favorites.js';
import { ACCESS_CONTROL_SIDEBAR_PROPS } from '../../../config/sidebars/access-control.js';

// Ejemplo — reemplazar por los KPIs reales del módulo (mismo criterio que
// modules/Operaciones/Home/Home.jsx, el primer módulo del kit).
const METRICS = [
  { label: 'Ingresos hoy', value: 312, trendLabel: '+18 vs ayer', trendDirection: 'up', data: [310, 303, 295, 283, 276, 263, 312] },
  { label: 'Personas en planta', value: 87, trendLabel: '+6 vs ayer', trendDirection: 'up', data: [85, 84, 84, 78, 78, 72, 87] },
  { label: 'Accesos denegados', value: 2, trendLabel: '+1 vs ayer', trendDirection: 'up', data: [0, 2, 4, 1, 3, 0, 2] },
  { label: 'Puntos de acceso activos', value: 6, trendLabel: '+1 vs mes anterior', trendDirection: 'up', data: [4, 6, 8, 4, 6, 3, 6] },
];

// Ejemplo — reemplazar por el feed real del módulo.
const ACTIVITY = [
  { name: 'Carlos M.', time: 'hace 5 min', description: 'Registró el ingreso de un proveedor' },
  { name: 'Ana R.', time: 'hace 18 min', description: 'Habilitó el acceso a un nuevo empleado' },
  { name: 'Diego P.', time: 'hace 32 min', description: 'Denegó el ingreso de un vehículo no autorizado' },
  { name: 'Martín G.', time: 'hace 1 h', description: 'Actualizó los puntos de acceso de la planta 2' },
];

export default function AccessControlHome({ onNavigate, onSearch, favoriteHrefs = [] }) {
  return (
    <LayoutHomeModule
      sidebar={ACCESS_CONTROL_SIDEBAR_PROPS}
      activeHref="/access-control"
      onNavigate={onNavigate ?? ((d) => console.log('navigate', d))}
      onSearch={onSearch}
      onCompanyChange={(c) => console.log('company change', c)}
      onLogout={() => console.log('logout')}
      onToggle={(d) => console.log('toggle', d)}
      metrics={METRICS}
      quickAccessSubtitle="Tus maestros y procesos favoritos"
      quickAccess={favoriteQuickAccess(ACCESS_CONTROL_SIDEBAR_PROPS, favoriteHrefs)}
      activitySubtitle="Últimas acciones del equipo"
      activity={ACTIVITY}
    />
  );
}
