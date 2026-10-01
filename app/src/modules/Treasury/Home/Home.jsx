import LayoutHomeModule from '../../../templates/LayoutHomeModule/LayoutHomeModule.jsx';
import { favoriteQuickAccess } from '../../../utils/favorites.js';
import { TREASURY_SIDEBAR_PROPS } from '../../../config/sidebars/treasury.js';

// Ejemplo — reemplazar por los KPIs reales del módulo (mismo criterio que
// modules/Operaciones/Home/Home.jsx, el primer módulo del kit).
const METRICS = [
  { label: 'Saldo consolidado', value: '$ 12.6M', trendLabel: '+3% vs mes anterior', trendDirection: 'up', data: [124, 122, 120, 114, 112, 105, 126] },
  { label: 'Movimientos del mes', value: 96, trendLabel: '+12 vs mes anterior', trendDirection: 'up', data: [94, 93, 92, 86, 85, 80, 96] },
  { label: 'Pagos pendientes', value: 14, trendLabel: '-3 vs ayer', trendDirection: 'down', data: [12, 14, 17, 14, 17, 14, 14] },
  { label: 'Cuentas activas', value: 5, trendLabel: '+1 vs mes anterior', trendDirection: 'up', data: [3, 5, 7, 4, 5, 2, 5] },
];

// Ejemplo — reemplazar por el feed real del módulo.
const ACTIVITY = [
  { name: 'Ana R.', time: 'hace 5 min', description: 'Registró un movimiento de tesorería' },
  { name: 'Carlos M.', time: 'hace 18 min', description: 'Aprobó un pago a proveedor' },
  { name: 'Diego P.', time: 'hace 32 min', description: 'Concilió una cuenta bancaria' },
  { name: 'Lucía F.', time: 'hace 1 h', description: 'Actualizó un medio de pago' },
];

export default function TreasuryHome({ onNavigate, onSearch, favoriteHrefs = [] }) {
  return (
    <LayoutHomeModule
      sidebar={TREASURY_SIDEBAR_PROPS}
      activeHref="/treasury"
      onNavigate={onNavigate ?? ((d) => console.log('navigate', d))}
      onSearch={onSearch}
      onCompanyChange={(c) => console.log('company change', c)}
      onLogout={() => console.log('logout')}
      onToggle={(d) => console.log('toggle', d)}
      metrics={METRICS}
      quickAccessSubtitle="Tus maestros y procesos favoritos"
      quickAccess={favoriteQuickAccess(TREASURY_SIDEBAR_PROPS, favoriteHrefs)}
      activitySubtitle="Últimas acciones del equipo"
      activity={ACTIVITY}
    />
  );
}
