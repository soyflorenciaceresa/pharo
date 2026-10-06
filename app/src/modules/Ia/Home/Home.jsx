import LayoutHomeModule from '../../../templates/LayoutHomeModule/LayoutHomeModule.jsx';
import { favoriteQuickAccess } from '../../../utils/favorites.js';
import { IA_SIDEBAR_PROPS } from '../../../config/sidebars/ia.js';

// Ejemplo — reemplazar por los KPIs reales del módulo (mismo criterio que
// modules/Operaciones/Home/Home.jsx, el primer módulo del kit).
const METRICS = [
  { label: 'Consultas del mes', value: '1.204', trendLabel: '+180 vs mes anterior', trendDirection: 'up' },
  { label: 'Modelos activos', value: 5, trendLabel: '+1 vs mes anterior', trendDirection: 'up' },
  { label: 'Precisión promedio', value: '91%', trendLabel: '+2% vs mes anterior', trendDirection: 'up' },
  { label: 'Casos de uso en producción', value: 8, trendLabel: '+1 vs mes anterior', trendDirection: 'up' },
  { label: 'Alertas abiertas', value: 3, trendLabel: '-1 vs ayer', trendDirection: 'down' },
];

// Ejemplo — reemplazar por el feed real del módulo.
const ACTIVITY = [
  { name: 'Ana R.', time: 'hace 5 min', description: 'Entrenó una nueva versión del modelo de demanda' },
  { name: 'Diego P.', time: 'hace 18 min', description: 'Publicó un caso de uso en producción' },
  { name: 'Carlos M.', time: 'hace 32 min', description: 'Revisó la precisión del modelo de rutas' },
  { name: 'Lucía F.', time: 'hace 1 h', description: 'Configuró una nueva consulta asistida' },
];

export default function IaHome({ onNavigate, onSearch, favoriteHrefs = [] }) {
  return (
    <LayoutHomeModule
      sidebar={IA_SIDEBAR_PROPS}
      activeHref="/ia"
      onNavigate={onNavigate ?? ((d) => console.log('navigate', d))}
      onSearch={onSearch}
      onCompanyChange={(c) => console.log('company change', c)}
      onLogout={() => console.log('logout')}
      onToggle={(d) => console.log('toggle', d)}
      metrics={METRICS}
      quickAccessSubtitle="Tus maestros y procesos favoritos"
      quickAccess={favoriteQuickAccess(IA_SIDEBAR_PROPS, favoriteHrefs)}
      activitySubtitle="Últimas acciones del equipo"
      activity={ACTIVITY}
    />
  );
}
