import LayoutMaestroDataGrid from '../../../templates/LayoutMaestroDataGrid/LayoutMaestroDataGrid.jsx';
import Badge from '../../../components/Badge/Badge.jsx';
import { OPERACIONES_SIDEBAR_PROPS } from '../../../config/sidebars/operaciones.js';

const COLUMNS = [
  { key: 'codigo', label: 'Código', width: 120 },
  { key: 'denominacion', label: 'Denominación' },
  {
    key: 'estado',
    label: 'Estado',
    render: (row) => <Badge type={row.estado.type}>{row.estado.label}</Badge>,
  },
];

// Ejemplo — reemplazar por el catálogo real de buques. Si no se pasa `rows`
// por prop (ej. usando esta pantalla suelta, sin App.jsx), se usa este set.
// `tipo` sigue viviendo en cada fila (lo captura el formulario) aunque la
// grilla no lo muestre como columna.
const DEFAULT_ROWS = [
  { id: 1, codigo: 'BQ-001', denominacion: 'Estrella del Sur', tipo: 'Portacontenedores', estado: { label: 'Activo', type: 'success' } },
  { id: 2, codigo: 'BQ-002', denominacion: 'Puerto Norte I', tipo: 'Carguero', estado: { label: 'Activo', type: 'success' } },
  { id: 3, codigo: 'BQ-003', denominacion: 'Andina Cargo', tipo: 'Carguero', estado: { label: 'Inactivo', type: 'neutral' } },
  { id: 4, codigo: 'BQ-004', denominacion: 'Río de la Plata', tipo: 'Remolcador', estado: { label: 'Activo', type: 'success' } },
  { id: 5, codigo: 'BQ-005', denominacion: 'Cruz del Atlántico', tipo: 'Petrolero', estado: { label: 'Inactivo', type: 'neutral' } },
];

export default function Buque({ onNavigate, onSearch, rows, favoriteHrefs = [], onToggleFavorite }) {
  const navigate = onNavigate ?? ((d) => console.log('navigate', d));

  return (
    <LayoutMaestroDataGrid
      sidebar={OPERACIONES_SIDEBAR_PROPS}
      activeHref="/buques"
      onNavigate={navigate}
      onSearch={onSearch}
      onCompanyChange={(c) => console.log('company change', c)}
      onLogout={() => console.log('logout')}
      onToggle={(d) => console.log('toggle', d)}
      title="Buque"
      favorite={favoriteHrefs.includes('/buques')}
      onToggleFavorite={() => onToggleFavorite?.('/buques')}
      onNew={() => navigate({ href: '/buques/nuevo', label: 'Nuevo' })}
      onReload={() => console.log('recargar buques')}
      onExport={() => console.log('exportar buques')}
      columns={COLUMNS}
      rows={rows ?? DEFAULT_ROWS}
      selectable
      actions={[
        { key: 'view', icon: 'bi-eye', label: 'Visualizar', onClick: (row) => navigate({ href: `/buques/${row.id}/ver`, label: 'Visualizar' }) },
        { key: 'edit', icon: 'icon-edit', label: 'Editar', onClick: (row) => navigate({ href: `/buques/${row.id}/editar`, label: 'Editar' }) },
      ]}
    />
  );
}
