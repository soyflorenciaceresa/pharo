import LayoutMaestroDataGrid from '../../../templates/LayoutMaestroDataGrid/LayoutMaestroDataGrid.jsx';
import Badge from '../../../components/Badge/Badge.jsx';
import { Icon } from '../../../icons/icons.jsx';
import { ACCESS_CONTROL_SIDEBAR_PROPS } from '../../../config/sidebars/access-control.js';
import { GRUPOS_PERSONAS, labelOf } from '../../../config/accessControl.js';

// Sí/No con ícono + texto accesible (no solo ícono): ✓ / ✗.
function YesNo({ value }) {
  return (
    <span title={value ? 'Sí' : 'No'}>
      <Icon name={value ? 'icon-check2' : 'icon-close'} size={16} aria-hidden="true" />
      <span style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>{value ? 'Sí' : 'No'}</span>
    </span>
  );
}

const subgrupoLabel = (row) => labelOf(GRUPOS_PERSONAS.find((g) => g.value === row.grupo)?.subgrupos ?? [], row.subgrupo);

const COLUMNS = [
  { key: 'dni', label: 'Código', width: 110 },
  { key: 'denominacion', label: 'Denominación', minWidth: 200 },
  { key: 'grupoLabel', label: 'Grupo', width: 120, render: (row) => <span>{labelOf(GRUPOS_PERSONAS, row.grupo)}</span> },
  { key: 'subgrupoLabel', label: 'Subgrupo', width: 120, render: (row) => <span>{subgrupoLabel(row)}</span> },
  { key: 'docux', label: 'DocUX', width: 80, render: (row) => <YesNo value={row.docux} /> },
  { key: 'rrhh', label: 'Recursos humanos', width: 140, render: (row) => <YesNo value={row.rrhh} /> },
  { key: 'turnos', label: 'Turnos de camiones', width: 150, render: (row) => <YesNo value={row.turnos} /> },
  {
    key: 'activo',
    label: 'Activo',
    width: 100,
    render: (row) => <Badge type={row.activo ? 'success' : 'neutral'}>{row.activo ? 'Activo' : 'Inactivo'}</Badge>,
  },
];

// Ejemplo — fallback si se usa suelta; normalmente `personas` llega por prop desde App.jsx.
const DEFAULT_ROWS = [];

export default function Personas({ onNavigate, onSearch, personas, favoriteHrefs = [], onToggleFavorite }) {
  const navigate = onNavigate ?? ((d) => console.log('navigate', d));
  const href = '/access-control/personas';

  return (
    <LayoutMaestroDataGrid
      sidebar={ACCESS_CONTROL_SIDEBAR_PROPS}
      activeHref={href}
      onNavigate={navigate}
      onSearch={onSearch}
      onCompanyChange={(c) => console.log('company change', c)}
      onLogout={() => console.log('logout')}
      onToggle={(d) => console.log('toggle', d)}
      title="Personas"
      favorite={favoriteHrefs.includes(href)}
      onToggleFavorite={() => onToggleFavorite?.(href)}
      onNew={() => navigate({ href: `${href}/nuevo`, label: 'Crear' })}
      newLabel="Crear"
      onReload={() => console.log('recargar personas')}
      onImport={() => console.log('importar personas')}
      onExport={() => console.log('exportar personas')}
      columns={COLUMNS}
      rows={personas ?? DEFAULT_ROWS}
      searchPlaceholder="Buscar por DNI o nombre..."
      actions={[
        { key: 'view', icon: 'bi-eye', label: 'Visualizar', onClick: (row) => navigate({ href: `${href}/${row.id}/ver`, label: 'Visualizar' }) },
        { key: 'edit', icon: 'icon-edit', label: 'Editar', onClick: (row) => navigate({ href: `${href}/${row.id}/editar`, label: 'Editar' }) },
      ]}
    />
  );
}
