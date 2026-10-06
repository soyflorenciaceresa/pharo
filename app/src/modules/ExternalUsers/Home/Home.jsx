import LayoutHomeModule from '../../../templates/LayoutHomeModule/LayoutHomeModule.jsx';
import { favoriteQuickAccess } from '../../../utils/favorites.js';
import { EXTERNAL_USERS_SIDEBAR_PROPS } from '../../../config/sidebars/external-users.js';

// Ejemplo — reemplazar por los KPIs reales del módulo (mismo criterio que
// modules/Operaciones/Home/Home.jsx, el primer módulo del kit).
const METRICS = [
  { label: 'Usuarios externos activos', value: 58, trendLabel: '+4 vs mes anterior', trendDirection: 'up' },
  { label: 'Invitaciones pendientes', value: 6, trendLabel: '+2 vs ayer', trendDirection: 'up' },
  { label: 'Empresas vinculadas', value: 12, trendLabel: '+1 vs mes anterior', trendDirection: 'up' },
  { label: 'Accesos revocados este mes', value: 2, trendLabel: '+1 vs mes anterior', trendDirection: 'up' },
  { label: 'Alertas abiertas', value: 3, trendLabel: '-1 vs ayer', trendDirection: 'down' },
];

// Ejemplo — reemplazar por el feed real del módulo.
const ACTIVITY = [
  { name: 'Ana R.', time: 'hace 5 min', description: 'Invitó a un nuevo usuario externo' },
  { name: 'Diego P.', time: 'hace 18 min', description: 'Revocó el acceso de un usuario externo' },
  { name: 'Carlos M.', time: 'hace 32 min', description: 'Vinculó una nueva empresa externa' },
  { name: 'Lucía F.', time: 'hace 1 h', description: 'Aprobó el acceso de un usuario externo' },
];

export default function ExternalUsersHome({ onNavigate, onSearch, favoriteHrefs = [] }) {
  return (
    <LayoutHomeModule
      sidebar={EXTERNAL_USERS_SIDEBAR_PROPS}
      activeHref="/external-users"
      onNavigate={onNavigate ?? ((d) => console.log('navigate', d))}
      onSearch={onSearch}
      onCompanyChange={(c) => console.log('company change', c)}
      onLogout={() => console.log('logout')}
      onToggle={(d) => console.log('toggle', d)}
      metrics={METRICS}
      quickAccessSubtitle="Tus maestros y procesos favoritos"
      quickAccess={favoriteQuickAccess(EXTERNAL_USERS_SIDEBAR_PROPS, favoriteHrefs)}
      activitySubtitle="Últimas acciones del equipo"
      activity={ACTIVITY}
    />
  );
}
