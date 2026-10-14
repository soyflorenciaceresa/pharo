import LayoutMaestroDataGrid from '../../../templates/LayoutMaestroDataGrid/LayoutMaestroDataGrid.jsx';
import Badge from '../../../components/Badge/Badge.jsx';
import { PURCHASES_SIDEBAR_PROPS } from '../../../config/sidebars/purchases.js';

const HREF = '/purchases/proveedores';

// Grilla estándar de maestro (Código, Denominación, Estado, Acciones).
const COLUMNS = [
  { key: 'codigo', label: 'Código', width: 120 },
  { key: 'denominacion', label: 'Denominación' },
  { key: 'estado', label: 'Estado', render: (row) => <Badge type={row.estado.type}>{row.estado.label}</Badge> },
];

export default function Proveedores({ onNavigate, onSearch, proveedores = [], favoriteHrefs = [], onToggleFavorite }) {
  const navigate = onNavigate ?? ((d) => console.log('navigate', d));
  return (
    <LayoutMaestroDataGrid
      sidebar={PURCHASES_SIDEBAR_PROPS}
      activeHref={HREF}
      onNavigate={navigate}
      onSearch={onSearch}
      onCompanyChange={(c) => console.log('company change', c)}
      onLogout={() => console.log('logout')}
      onToggle={(d) => console.log('toggle', d)}
      title="Proveedores"
      favorite={favoriteHrefs.includes(HREF)}
      onToggleFavorite={() => onToggleFavorite?.(HREF)}
      onNew={() => navigate({ href: `${HREF}/nuevo`, label: 'Nuevo' })}
      onReload={() => console.log('recargar proveedores')}
      onExport={() => console.log('exportar proveedores')}
      columns={COLUMNS}
      rows={proveedores}
      actions={[
        { key: 'view', icon: 'bi-eye', label: 'Visualizar', onClick: (row) => navigate({ href: `${HREF}/${row.id}/ver`, label: 'Visualizar' }) },
        { key: 'edit', icon: 'icon-edit', label: 'Editar', onClick: (row) => navigate({ href: `${HREF}/${row.id}/editar`, label: 'Editar' }) },
      ]}
    />
  );
}
