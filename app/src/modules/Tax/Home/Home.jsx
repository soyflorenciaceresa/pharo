import LayoutHomeModule from '../../../templates/LayoutHomeModule/LayoutHomeModule.jsx';
import { favoriteQuickAccess } from '../../../utils/favorites.js';
import { TAX_SIDEBAR_PROPS } from '../../../config/sidebars/tax.js';

// Ejemplo — reemplazar por los KPIs reales del módulo (mismo criterio que
// modules/Operaciones/Home/Home.jsx, el primer módulo del kit).
const METRICS = [
  { label: 'Liquidaciones del mes', value: 58, trendLabel: '+6 vs mes anterior', trendDirection: 'up', data: [56, 56, 57, 52, 52, 47, 58] },
  { label: 'Monto liquidado', value: '$ 4.2M', trendLabel: '+8% vs mes anterior', trendDirection: 'up', data: [40, 41, 41, 37, 38, 34, 42] },
  { label: 'Impuestos vencidos', value: 2, trendLabel: '-1 vs ayer', trendDirection: 'down', data: [0, 2, 4, 1, 3, 0, 2] },
  { label: 'Contribuyentes activos', value: 342, trendLabel: '+5 vs mes anterior', trendDirection: 'up', data: [340, 332, 323, 310, 302, 289, 342] },
];

// Ejemplo — reemplazar por el feed real del módulo.
const ACTIVITY = [
  { name: 'Ana R.', time: 'hace 5 min', description: 'Generó la liquidación mensual de IVA' },
  { name: 'Diego P.', time: 'hace 18 min', description: 'Actualizó la alícuota de exportación' },
  { name: 'Carlos M.', time: 'hace 32 min', description: 'Cerró la liquidación de Ingresos Brutos' },
  { name: 'Martín G.', time: 'hace 1 h', description: 'Registró el vencimiento de un impuesto' },
];

export default function TaxHome({ onNavigate, onSearch, favoriteHrefs = [] }) {
  return (
    <LayoutHomeModule
      sidebar={TAX_SIDEBAR_PROPS}
      activeHref="/tax"
      onNavigate={onNavigate ?? ((d) => console.log('navigate', d))}
      onSearch={onSearch}
      onCompanyChange={(c) => console.log('company change', c)}
      onLogout={() => console.log('logout')}
      onToggle={(d) => console.log('toggle', d)}
      metrics={METRICS}
      quickAccessSubtitle="Tus maestros y procesos favoritos"
      quickAccess={favoriteQuickAccess(TAX_SIDEBAR_PROPS, favoriteHrefs)}
      activitySubtitle="Últimas acciones del equipo"
      activity={ACTIVITY}
    />
  );
}
