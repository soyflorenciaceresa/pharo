import LayoutMaestroDataGrid from '../../../templates/LayoutMaestroDataGrid/LayoutMaestroDataGrid.jsx';
import Badge from '../../../components/Badge/Badge.jsx';
import { OPERACIONES_SIDEBAR_PROPS } from '../../../config/sidebars/operaciones.js';
import { maestroRows } from '../../../config/maestrosPorts.js';

// Pantalla principal GENÉRICA de un maestro de Ports que todavía no tiene
// pantalla propia: la misma grilla que Depósitos (Código, Denominación, Estado,
// Acciones), con filas de ejemplo según el maestro (config/maestrosPorts.js).
// Un maestro real se reemplaza armando su propia pantalla (como Buque/Depósitos).
// Nuevo/Visualizar/Editar apuntan a rutas que todavía no existen (no hacen nada).
const COLUMNS = [
  { key: 'codigo', label: 'Código', width: 120 },
  { key: 'denominacion', label: 'Denominación' },
  {
    key: 'estado',
    label: 'Estado',
    render: (row) => <Badge type={row.estado.type}>{row.estado.label}</Badge>,
  },
];

export default function MaestroPorts({ maestro, sidebar = OPERACIONES_SIDEBAR_PROPS, onNavigate, onSearch, favoriteHrefs = [], onToggleFavorite }) {
  const navigate = onNavigate ?? ((d) => console.log('navigate', d));

  return (
    <LayoutMaestroDataGrid
      sidebar={sidebar}
      activeHref={maestro.href}
      onNavigate={navigate}
      onSearch={onSearch}
      onCompanyChange={(c) => console.log('company change', c)}
      onLogout={() => console.log('logout')}
      onToggle={(d) => console.log('toggle', d)}
      title={maestro.label}
      favorite={favoriteHrefs.includes(maestro.href)}
      onToggleFavorite={() => onToggleFavorite?.(maestro.href)}
      onNew={() => navigate({ href: `${maestro.href}/nuevo`, label: 'Nuevo' })}
      onReload={() => console.log(`recargar ${maestro.label}`)}
      onExport={() => console.log(`exportar ${maestro.label}`)}
      columns={COLUMNS}
      rows={maestroRows(maestro)}
      actions={[
        { key: 'view', icon: 'bi-eye', label: 'Visualizar', onClick: (row) => navigate({ href: `${maestro.href}/${row.id}/ver`, label: 'Visualizar' }) },
        { key: 'edit', icon: 'icon-edit', label: 'Editar', onClick: (row) => navigate({ href: `${maestro.href}/${row.id}/editar`, label: 'Editar' }) },
      ]}
    />
  );
}
