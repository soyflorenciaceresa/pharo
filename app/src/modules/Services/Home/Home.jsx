import LayoutHomeModule from '../../../templates/LayoutHomeModule/LayoutHomeModule.jsx';
import { favoriteQuickAccess } from '../../../utils/favorites.js';
import { SERVICES_SIDEBAR_PROPS } from '../../../config/sidebars/services.js';

// Ejemplo — reemplazar por los KPIs reales del módulo (mismo criterio que
// modules/Operaciones/Home/Home.jsx, el primer módulo del kit).
const METRICS = [
  { label: 'Solicitudes del mes', value: 63, trendLabel: '+7 vs mes anterior', trendDirection: 'up' },
  { label: 'Solicitudes en curso', value: 11, trendLabel: '+2 vs ayer', trendDirection: 'up' },
  { label: 'Tiempo promedio de resolución', value: '1.8 días', trendLabel: '-0.2 vs mes anterior', trendDirection: 'down' },
  { label: 'Proveedores activos', value: 17, trendLabel: '+1 vs mes anterior', trendDirection: 'up' },
  { label: 'Alertas abiertas', value: 3, trendLabel: '-1 vs ayer', trendDirection: 'down' },
];

// Ejemplo — reemplazar por el feed real del módulo.
const ACTIVITY = [
  { name: 'Ana R.', time: 'hace 5 min', description: 'Aprobó una solicitud de servicio' },
  { name: 'Diego P.', time: 'hace 18 min', description: 'Asignó un proveedor a la solicitud #204' },
  { name: 'Carlos M.', time: 'hace 32 min', description: 'Cerró una solicitud de mantenimiento' },
  { name: 'Lucía F.', time: 'hace 1 h', description: 'Registró una nueva solicitud' },
];

export default function ServicesHome({ onNavigate, onSearch, favoriteHrefs = [] }) {
  return (
    <LayoutHomeModule
      sidebar={SERVICES_SIDEBAR_PROPS}
      activeHref="/services"
      onNavigate={onNavigate ?? ((d) => console.log('navigate', d))}
      onSearch={onSearch}
      onCompanyChange={(c) => console.log('company change', c)}
      onLogout={() => console.log('logout')}
      onToggle={(d) => console.log('toggle', d)}
      metrics={METRICS}
      quickAccessSubtitle="Tus maestros y procesos favoritos"
      quickAccess={favoriteQuickAccess(SERVICES_SIDEBAR_PROPS, favoriteHrefs)}
      activitySubtitle="Últimas acciones del equipo"
      activity={ACTIVITY}
    />
  );
}
