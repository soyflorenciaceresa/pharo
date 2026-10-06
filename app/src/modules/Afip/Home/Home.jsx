import LayoutHomeModule from '../../../templates/LayoutHomeModule/LayoutHomeModule.jsx';
import { favoriteQuickAccess } from '../../../utils/favorites.js';
import { AFIP_SIDEBAR_PROPS } from '../../../config/sidebars/afip.js';

// Ejemplo — reemplazar por los KPIs reales del módulo (mismo criterio que
// modules/Operaciones/Home/Home.jsx, el primer módulo del kit).
const METRICS = [
  { label: 'Comprobantes sincronizados hoy', value: 214, trendLabel: '+19 vs ayer', trendDirection: 'up' },
  { label: 'Errores de sincronización', value: 1, trendLabel: '-2 vs ayer', trendDirection: 'down' },
  { label: 'Padrones actualizados', value: 3, trendLabel: '+1 vs mes anterior', trendDirection: 'up' },
  { label: 'Comprobantes pendientes', value: 5, trendLabel: '-1 vs ayer', trendDirection: 'down' },
  { label: 'Alertas abiertas', value: 3, trendLabel: '-1 vs ayer', trendDirection: 'down' },
];

// Ejemplo — reemplazar por el feed real del módulo.
const ACTIVITY = [
  { name: 'Diego P.', time: 'hace 5 min', description: 'Sincronizó los comprobantes del día' },
  { name: 'Ana R.', time: 'hace 18 min', description: 'Corrigió un error de sincronización' },
  { name: 'Carlos M.', time: 'hace 32 min', description: 'Actualizó el padrón de contribuyentes' },
  { name: 'Martín G.', time: 'hace 1 h', description: 'Generó un comprobante electrónico' },
];

export default function AfipHome({ onNavigate, onSearch, favoriteHrefs = [] }) {
  return (
    <LayoutHomeModule
      sidebar={AFIP_SIDEBAR_PROPS}
      activeHref="/afip"
      onNavigate={onNavigate ?? ((d) => console.log('navigate', d))}
      onSearch={onSearch}
      onCompanyChange={(c) => console.log('company change', c)}
      onLogout={() => console.log('logout')}
      onToggle={(d) => console.log('toggle', d)}
      metrics={METRICS}
      quickAccessSubtitle="Tus maestros y procesos favoritos"
      quickAccess={favoriteQuickAccess(AFIP_SIDEBAR_PROPS, favoriteHrefs)}
      activitySubtitle="Últimas acciones del equipo"
      activity={ACTIVITY}
    />
  );
}
