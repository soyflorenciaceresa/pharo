import LayoutHomeModule from '../../../templates/LayoutHomeModule/LayoutHomeModule.jsx';
import { favoriteQuickAccess } from '../../../utils/favorites.js';
import { BILLING_SIDEBAR_PROPS } from '../../../config/sidebars/billing.js';

// Ejemplo — reemplazar por los KPIs reales del módulo (mismo criterio que
// modules/Operaciones/Home/Home.jsx, el primer módulo del kit).
const METRICS = [
  { label: 'Facturas del mes', value: 128, trendLabel: '+14 vs mes anterior', trendDirection: 'up' },
  { label: 'Monto facturado', value: '$ 18.4M', trendLabel: '+9% vs mes anterior', trendDirection: 'up' },
  { label: 'Facturas pendientes de cobro', value: 22, trendLabel: '-3 vs ayer', trendDirection: 'down' },
  { label: 'Clientes activos', value: 64, trendLabel: '+2 vs mes anterior', trendDirection: 'up' },
  { label: 'Alertas abiertas', value: 3, trendLabel: '-1 vs ayer', trendDirection: 'down' },
];

// Ejemplo — reemplazar por el feed real del módulo.
const ACTIVITY = [
  { name: 'Ana R.', time: 'hace 5 min', description: 'Emitió la factura #2245' },
  { name: 'Carlos M.', time: 'hace 18 min', description: 'Registró el cobro de la factura #2198' },
  { name: 'Diego P.', time: 'hace 32 min', description: 'Actualizó la tarifa de un cliente' },
  { name: 'Martín G.', time: 'hace 1 h', description: 'Envió un recordatorio de pago' },
];

export default function BillingHome({ onNavigate, onSearch, favoriteHrefs = [] }) {
  return (
    <LayoutHomeModule
      sidebar={BILLING_SIDEBAR_PROPS}
      activeHref="/billing"
      onNavigate={onNavigate ?? ((d) => console.log('navigate', d))}
      onSearch={onSearch}
      onCompanyChange={(c) => console.log('company change', c)}
      onLogout={() => console.log('logout')}
      onToggle={(d) => console.log('toggle', d)}
      metrics={METRICS}
      quickAccessSubtitle="Tus maestros y procesos favoritos"
      quickAccess={favoriteQuickAccess(BILLING_SIDEBAR_PROPS, favoriteHrefs)}
      activitySubtitle="Últimas acciones del equipo"
      activity={ACTIVITY}
    />
  );
}
