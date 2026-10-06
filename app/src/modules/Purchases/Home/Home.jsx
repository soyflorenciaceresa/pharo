import LayoutHomeModule from '../../../templates/LayoutHomeModule/LayoutHomeModule.jsx';
import { favoriteQuickAccess } from '../../../utils/favorites.js';
import { PURCHASES_SIDEBAR_PROPS } from '../../../config/sidebars/purchases.js';

// Ejemplo — reemplazar por los KPIs reales del módulo (mismo criterio que
// modules/Operaciones/Home/Home.jsx, el primer módulo del kit).
const METRICS = [
  { label: 'Órdenes del mes', value: 41, trendLabel: '+5 vs mes anterior', trendDirection: 'up' },
  { label: 'Monto comprado', value: '$ 6.8M', trendLabel: '+11% vs mes anterior', trendDirection: 'up' },
  { label: 'Órdenes pendientes de aprobación', value: 7, trendLabel: '+2 vs ayer', trendDirection: 'up' },
  { label: 'Proveedores activos', value: 38, trendLabel: '+1 vs mes anterior', trendDirection: 'up' },
  { label: 'Alertas abiertas', value: 3, trendLabel: '-1 vs ayer', trendDirection: 'down' },
];

// Ejemplo — reemplazar por el feed real del módulo.
const ACTIVITY = [
  { name: 'Carlos M.', time: 'hace 5 min', description: 'Generó la orden de compra #310' },
  { name: 'Ana R.', time: 'hace 18 min', description: 'Aprobó una orden de compra' },
  { name: 'Diego P.', time: 'hace 32 min', description: 'Dio de alta un nuevo proveedor' },
  { name: 'Martín G.', time: 'hace 1 h', description: 'Actualizó el precio de un artículo' },
];

export default function PurchasesHome({ onNavigate, onSearch, favoriteHrefs = [] }) {
  return (
    <LayoutHomeModule
      sidebar={PURCHASES_SIDEBAR_PROPS}
      activeHref="/purchases"
      onNavigate={onNavigate ?? ((d) => console.log('navigate', d))}
      onSearch={onSearch}
      onCompanyChange={(c) => console.log('company change', c)}
      onLogout={() => console.log('logout')}
      onToggle={(d) => console.log('toggle', d)}
      metrics={METRICS}
      quickAccessSubtitle="Tus maestros y procesos favoritos"
      quickAccess={favoriteQuickAccess(PURCHASES_SIDEBAR_PROPS, favoriteHrefs)}
      activitySubtitle="Últimas acciones del equipo"
      activity={ACTIVITY}
    />
  );
}
