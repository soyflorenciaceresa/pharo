import LayoutHomeModule from '../../../templates/LayoutHomeModule/LayoutHomeModule.jsx';
import { favoriteQuickAccess } from '../../../utils/favorites.js';
import { FREE_ZONE_SIDEBAR_PROPS } from '../../../config/sidebars/free-zone.js';

// Ejemplo — reemplazar por los KPIs reales del módulo (mismo criterio que
// modules/Operaciones/Home/Home.jsx, el primer módulo del kit).
const METRICS = [
  { label: 'Depósitos activos', value: 12, trendLabel: '+1 vs ayer', trendDirection: 'up' },
  { label: 'Ingresos del mes', value: 184, trendLabel: '+22 vs mes anterior', trendDirection: 'up' },
  { label: 'Mercadería en tránsito', value: 37, trendLabel: '-4 vs ayer', trendDirection: 'down' },
  { label: 'Alertas de vencimiento', value: 3, trendLabel: '+1 vs ayer', trendDirection: 'up' },
  { label: 'Alertas abiertas', value: 3, trendLabel: '-1 vs ayer', trendDirection: 'down' },
];

// Ejemplo — reemplazar por el feed real del módulo.
const ACTIVITY = [
  { name: 'Carlos M.', time: 'hace 5 min', description: 'Registró ingreso de mercadería al depósito 4' },
  { name: 'Ana R.', time: 'hace 18 min', description: 'Habilitó un nuevo operador autorizado' },
  { name: 'Diego P.', time: 'hace 32 min', description: 'Cerró el conteo físico del depósito 2' },
  { name: 'Lucía F.', time: 'hace 1 h', description: 'Actualizó el vencimiento de un lote' },
];

export default function FreeZoneHome({ onNavigate, onSearch, favoriteHrefs = [] }) {
  return (
    <LayoutHomeModule
      sidebar={FREE_ZONE_SIDEBAR_PROPS}
      activeHref="/free-zone"
      onNavigate={onNavigate ?? ((d) => console.log('navigate', d))}
      onSearch={onSearch}
      onCompanyChange={(c) => console.log('company change', c)}
      onLogout={() => console.log('logout')}
      onToggle={(d) => console.log('toggle', d)}
      metrics={METRICS}
      quickAccessSubtitle="Tus maestros y procesos favoritos"
      quickAccess={favoriteQuickAccess(FREE_ZONE_SIDEBAR_PROPS, favoriteHrefs)}
      activitySubtitle="Últimas acciones del equipo"
      activity={ACTIVITY}
    />
  );
}
