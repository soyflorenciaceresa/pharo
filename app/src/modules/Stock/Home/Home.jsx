import LayoutHomeModule from '../../../templates/LayoutHomeModule/LayoutHomeModule.jsx';
import { favoriteQuickAccess } from '../../../utils/favorites.js';
import { STOCK_SIDEBAR_PROPS } from '../../../config/sidebars/stock.js';

// Ejemplo — reemplazar por los KPIs reales del módulo (mismo criterio que
// modules/Operaciones/Home/Home.jsx, el primer módulo del kit).
const METRICS = [
  { label: 'Artículos en stock', value: '1.842', trendLabel: '+36 vs ayer', trendDirection: 'up', data: [1840, 1787, 1733, 1675, 1622, 1564, 1842] },
  { label: 'Depósitos activos', value: 4, trendLabel: '+1 vs mes anterior', trendDirection: 'up', data: [2, 4, 6, 3, 5, 1, 4] },
  { label: 'Artículos con stock bajo', value: 9, trendLabel: '-2 vs ayer', trendDirection: 'down', data: [7, 9, 12, 9, 11, 8, 9] },
  { label: 'Movimientos del mes', value: 214, trendLabel: '+18 vs mes anterior', trendDirection: 'up', data: [212, 208, 203, 194, 189, 180, 214] },
];

// Ejemplo — reemplazar por el feed real del módulo.
const ACTIVITY = [
  { name: 'Carlos M.', time: 'hace 5 min', description: 'Registró un ajuste de inventario' },
  { name: 'Ana R.', time: 'hace 18 min', description: 'Actualizó el stock mínimo de un artículo' },
  { name: 'Diego P.', time: 'hace 32 min', description: 'Recibió mercadería en el depósito 1' },
  { name: 'Martín G.', time: 'hace 1 h', description: 'Detectó un artículo con stock bajo' },
];

export default function StockHome({ onNavigate, onSearch, favoriteHrefs = [] }) {
  return (
    <LayoutHomeModule
      sidebar={STOCK_SIDEBAR_PROPS}
      activeHref="/stock"
      onNavigate={onNavigate ?? ((d) => console.log('navigate', d))}
      onSearch={onSearch}
      onCompanyChange={(c) => console.log('company change', c)}
      onLogout={() => console.log('logout')}
      onToggle={(d) => console.log('toggle', d)}
      metrics={METRICS}
      quickAccessSubtitle="Tus maestros y procesos favoritos"
      quickAccess={favoriteQuickAccess(STOCK_SIDEBAR_PROPS, favoriteHrefs)}
      activitySubtitle="Últimas acciones del equipo"
      activity={ACTIVITY}
    />
  );
}
