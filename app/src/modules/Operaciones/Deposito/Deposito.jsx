import LayoutMaestroDataGrid from '../../../templates/LayoutMaestroDataGrid/LayoutMaestroDataGrid.jsx';
import Badge from '../../../components/Badge/Badge.jsx';
import { OPERACIONES_SIDEBAR_PROPS } from '../../../config/sidebars/operaciones.js';

// Mismas columnas que la grilla de Buque (Código, Denominación, Estado).
const COLUMNS = [
  { key: 'codigo', label: 'Código', width: 120 },
  { key: 'denominacion', label: 'Denominación' },
  {
    key: 'estado',
    label: 'Estado',
    render: (row) => <Badge type={row.estado.type}>{row.estado.label}</Badge>,
  },
];

// Ejemplo — reemplazar por el catálogo real de depósitos. Si no se pasa
// `rows` por prop (pantalla suelta, sin App.jsx), se usa este set. Los
// campos que no son columna (codigoLot y los 3 booleanos) viven igual en
// cada fila: los captura/edita DepositoFormulario.
const DEFAULT_ROWS = [
  { id: 1, codigo: 'DEP-001', denominacion: 'Depósito Central', codigoLot: 'LOT-100', actualizaStock: true, depositoFiscal: false, trabajaSectorizacion: true, estado: { label: 'Activo', type: 'success' } },
  { id: 2, codigo: 'DEP-002', denominacion: 'Depósito Fiscal Norte', codigoLot: 'LOT-200', actualizaStock: true, depositoFiscal: true, trabajaSectorizacion: false, estado: { label: 'Activo', type: 'success' } },
  { id: 3, codigo: 'DEP-003', denominacion: 'Depósito Zona Franca', codigoLot: 'LOT-300', actualizaStock: false, depositoFiscal: true, trabajaSectorizacion: false, estado: { label: 'Inactivo', type: 'neutral' } },
  { id: 4, codigo: 'DEP-004', denominacion: 'Depósito Contenedores', codigoLot: 'LOT-400', actualizaStock: true, depositoFiscal: false, trabajaSectorizacion: true, estado: { label: 'Activo', type: 'success' } },
  { id: 5, codigo: 'DEP-005', denominacion: 'Depósito Graneles', codigoLot: 'LOT-500', actualizaStock: false, depositoFiscal: false, trabajaSectorizacion: false, estado: { label: 'Inactivo', type: 'neutral' } },
];

export default function Deposito({ onNavigate, onSearch, depositos, favoriteHrefs = [], onToggleFavorite }) {
  const navigate = onNavigate ?? ((d) => console.log('navigate', d));

  return (
    <LayoutMaestroDataGrid
      sidebar={OPERACIONES_SIDEBAR_PROPS}
      activeHref="/depositos"
      onNavigate={navigate}
      onSearch={onSearch}
      onCompanyChange={(c) => console.log('company change', c)}
      onLogout={() => console.log('logout')}
      onToggle={(d) => console.log('toggle', d)}
      title="Depósitos"
      favorite={favoriteHrefs.includes('/depositos')}
      onToggleFavorite={() => onToggleFavorite?.('/depositos')}
      onNew={() => navigate({ href: '/depositos/nuevo', label: 'Nuevo' })}
      onReload={() => console.log('recargar depositos')}
      onExport={() => console.log('exportar depositos')}
      columns={COLUMNS}
      rows={depositos ?? DEFAULT_ROWS}
      actions={[
        { key: 'view', icon: 'bi-eye', label: 'Visualizar', onClick: (row) => navigate({ href: `/depositos/${row.id}/ver`, label: 'Visualizar' }) },
        { key: 'edit', icon: 'icon-edit', label: 'Editar', onClick: (row) => navigate({ href: `/depositos/${row.id}/editar`, label: 'Editar' }) },
      ]}
    />
  );
}
