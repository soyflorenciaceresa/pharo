import LayoutMaestroDataGrid from '../../../templates/LayoutMaestroDataGrid/LayoutMaestroDataGrid.jsx';
import Badge from '../../../components/Badge/Badge.jsx';
import { GRAINS_SIDEBAR_PROPS } from '../../../config/sidebars/grains.js';
import { ROLES, labelOf } from '../../../config/grainsClientes.js';

const HREF = '/grains/clientes';

const formatCuit = (c) => (c.length === 11 ? `${c.slice(0, 2)}-${c.slice(2, 10)}-${c.slice(10)}` : c);

const COLUMNS = [
  { key: 'id', label: '#', width: 70 },
  { key: 'cuit', label: 'Identificador fiscal (CUIT)', width: 220, render: (row) => <span>{formatCuit(row.cuit)}</span> },
  { key: 'razonSocial', label: 'Razón social', minWidth: 200 },
  { key: 'nombreExtendido', label: 'Nombre extendido', minWidth: 160 },
  { key: 'rol', label: 'Rol', width: 160, render: (row) => <span>{labelOf(ROLES, row.rol)}</span> },
  { key: 'activo', label: 'Activo', width: 110, render: (row) => <Badge type={row.activo ? 'success' : 'neutral'}>{row.activo ? 'Activo' : 'Inactivo'}</Badge> },
];

export default function Clientes({ onNavigate, onSearch, clientes = [], favoriteHrefs = [], onToggleFavorite }) {
  const navigate = onNavigate ?? ((d) => console.log('navigate', d));
  return (
    <LayoutMaestroDataGrid
      sidebar={GRAINS_SIDEBAR_PROPS}
      activeHref={HREF}
      onNavigate={navigate}
      onSearch={onSearch}
      onCompanyChange={(c) => console.log('company change', c)}
      onLogout={() => console.log('logout')}
      onToggle={(d) => console.log('toggle', d)}
      title="Clientes"
      favorite={favoriteHrefs.includes(HREF)}
      onToggleFavorite={() => onToggleFavorite?.(HREF)}
      onNew={() => navigate({ href: `${HREF}/nuevo`, label: 'Crear' })}
      newLabel="Crear"
      onReload={() => console.log('recargar clientes')}
      onImport={() => console.log('importar clientes')}
      onExport={() => console.log('exportar clientes')}
      columns={COLUMNS}
      rows={clientes}
      searchPlaceholder="Buscar por CUIT o razón social..."
      actions={[
        { key: 'view', icon: 'bi-eye', label: 'Visualizar', onClick: (row) => navigate({ href: `${HREF}/${row.id}/ver`, label: 'Visualizar' }) },
        { key: 'edit', icon: 'icon-edit', label: 'Editar', onClick: (row) => navigate({ href: `${HREF}/${row.id}/editar`, label: 'Editar' }) },
      ]}
    />
  );
}
