import LayoutHomeModule from '../../../templates/LayoutHomeModule/LayoutHomeModule.jsx';
import { favoriteQuickAccess } from '../../../utils/favorites.js';
import { GRAINS_SIDEBAR_PROPS } from '../../../config/sidebars/grains.js';

// Ejemplo — reemplazar por los KPIs reales del módulo (mismo criterio que
// modules/Operaciones/Home/Home.jsx, el primer módulo del kit).
const METRICS = [
  { label: 'Toneladas ingresadas hoy', value: '3.420', trendLabel: '+410 vs ayer', trendDirection: 'up', data: [3418, 3317, 3217, 3111, 3011, 2905, 3420] },
  { label: 'Silos ocupados', value: 8, trendLabel: '+1 vs ayer', trendDirection: 'up', data: [6, 8, 10, 6, 8, 5, 8] },
  { label: 'Cargas en espera', value: 4, trendLabel: '-2 vs ayer', trendDirection: 'down', data: [2, 4, 6, 3, 5, 3, 4] },
  { label: 'Humedad promedio', value: '13.2%', trendLabel: '-0.4% vs ayer', trendDirection: 'down', data: [11, 13, 16, 13, 16, 13, 13] },
];

// Ejemplo — reemplazar por el feed real del módulo.
const ACTIVITY = [
  { name: 'Diego P.', time: 'hace 5 min', description: 'Registró el ingreso de una carga de soja' },
  { name: 'Ana R.', time: 'hace 18 min', description: 'Actualizó el nivel de ocupación del silo 3' },
  { name: 'Carlos M.', time: 'hace 32 min', description: 'Cerró la recepción de la carga #77' },
  { name: 'Martín G.', time: 'hace 1 h', description: 'Registró un control de humedad' },
];

export default function GrainsHome({ onNavigate, onSearch, favoriteHrefs = [] }) {
  return (
    <LayoutHomeModule
      sidebar={GRAINS_SIDEBAR_PROPS}
      activeHref="/grains"
      onNavigate={onNavigate ?? ((d) => console.log('navigate', d))}
      onSearch={onSearch}
      onCompanyChange={(c) => console.log('company change', c)}
      onLogout={() => console.log('logout')}
      onToggle={(d) => console.log('toggle', d)}
      metrics={METRICS}
      quickAccessSubtitle="Tus maestros y procesos favoritos"
      quickAccess={favoriteQuickAccess(GRAINS_SIDEBAR_PROPS, favoriteHrefs)}
      activitySubtitle="Últimas acciones del equipo"
      activity={ACTIVITY}
    />
  );
}
