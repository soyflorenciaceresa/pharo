import LayoutHomeModule from '../../../templates/LayoutHomeModule/LayoutHomeModule.jsx';
import { favoriteQuickAccess } from '../../../utils/favorites.js';
import { ACCOUNTING_SIDEBAR_PROPS } from '../../../config/sidebars/accounting.js';

// Ejemplo — reemplazar por los KPIs reales del módulo (mismo criterio que
// modules/Operaciones/Home/Home.jsx, el primer módulo del kit).
const METRICS = [
  { label: 'Asientos del mes', value: 340, trendLabel: '+28 vs mes anterior', trendDirection: 'up' },
  { label: 'Balance del mes', value: '$ 2.1M', trendLabel: '+4% vs mes anterior', trendDirection: 'up' },
  { label: 'Cuentas activas', value: 186, trendLabel: '+3 vs mes anterior', trendDirection: 'up' },
  { label: 'Cierres pendientes', value: 2, trendLabel: '-1 vs mes anterior', trendDirection: 'down' },
  { label: 'Alertas abiertas', value: 3, trendLabel: '-1 vs ayer', trendDirection: 'down' },
];

// Ejemplo — reemplazar por el feed real del módulo.
const ACTIVITY = [
  { name: 'Diego P.', time: 'hace 5 min', description: 'Registró un nuevo asiento contable' },
  { name: 'Ana R.', time: 'hace 18 min', description: 'Concilió la cuenta bancaria principal' },
  { name: 'Carlos M.', time: 'hace 32 min', description: 'Cerró el centro de costo de logística' },
  { name: 'Lucía F.', time: 'hace 1 h', description: 'Actualizó el plan de cuentas' },
];

export default function AccountingHome({ onNavigate, onSearch, favoriteHrefs = [] }) {
  return (
    <LayoutHomeModule
      sidebar={ACCOUNTING_SIDEBAR_PROPS}
      activeHref="/accounting"
      onNavigate={onNavigate ?? ((d) => console.log('navigate', d))}
      onSearch={onSearch}
      onCompanyChange={(c) => console.log('company change', c)}
      onLogout={() => console.log('logout')}
      onToggle={(d) => console.log('toggle', d)}
      metrics={METRICS}
      quickAccessSubtitle="Tus maestros y procesos favoritos"
      quickAccess={favoriteQuickAccess(ACCOUNTING_SIDEBAR_PROPS, favoriteHrefs)}
      activitySubtitle="Últimas acciones del equipo"
      activity={ACTIVITY}
    />
  );
}
