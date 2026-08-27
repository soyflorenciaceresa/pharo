import LayoutMaestroDataGrid from '../../../templates/LayoutMaestroDataGrid/LayoutMaestroDataGrid.jsx';
import { StatusChip } from '../../../components/DataGrid/DataGrid.jsx';
import { OPERACIONES_SIDEBAR_PROPS } from '../../../config/sidebars/operaciones.js';

const COLUMNS = [
  { key: 'codigo', label: 'Código', width: 120 },
  { key: 'denominacion', label: 'Denominación' },
  {
    key: 'estado',
    label: 'Estado',
    render: (row) => <StatusChip label={row.estado.label} tone={row.estado.tone} />,
  },
];

// Ejemplo — reemplazar por el catálogo real de buques.
const ROWS = [
  { id: 1, codigo: 'BQ-001', denominacion: 'Estrella del Sur', estado: { label: 'Activo', tone: 'success' } },
  { id: 2, codigo: 'BQ-002', denominacion: 'Puerto Norte I', estado: { label: 'Activo', tone: 'success' } },
  { id: 3, codigo: 'BQ-003', denominacion: 'Andina Cargo', estado: { label: 'Inactivo', tone: 'neutral' } },
  { id: 4, codigo: 'BQ-004', denominacion: 'Río de la Plata', estado: { label: 'Activo', tone: 'success' } },
  { id: 5, codigo: 'BQ-005', denominacion: 'Cruz del Atlántico', estado: { label: 'Inactivo', tone: 'neutral' } },
];

export default function Buque({ onNavigate }) {
  return (
    <LayoutMaestroDataGrid
      sidebar={OPERACIONES_SIDEBAR_PROPS}
      activeHref="/buques"
      onNavigate={onNavigate ?? ((d) => console.log('navigate', d))}
      onCompanyChange={(c) => console.log('company change', c)}
      onLogout={() => console.log('logout')}
      onToggle={(d) => console.log('toggle', d)}
      breadcrumb={[{ label: 'Maestros' }, { label: 'Buque' }]}
      title="Buque"
      onNew={() => console.log('nuevo buque')}
      onReload={() => console.log('recargar buques')}
      onExport={() => console.log('exportar buques')}
      columns={COLUMNS}
      rows={ROWS}
      selectable
      actions={[
        { key: 'view', icon: 'bi-eye', label: 'Visualizar', onClick: (row) => console.log('visualizar', row) },
        { key: 'edit', icon: 'icon-edit', label: 'Editar', onClick: (row) => console.log('editar', row) },
      ]}
    />
  );
}
