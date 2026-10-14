import LayoutMaestroDataGrid from '../../../templates/LayoutMaestroDataGrid/LayoutMaestroDataGrid.jsx';
import Badge from '../../../components/Badge/Badge.jsx';
import { TRUCKSHIFT_SIDEBAR_PROPS } from '../../../config/sidebars/truckshift.js';

// Pantalla principal de un maestro con formulario propio (Truckshift y Scales): grilla estándar (Código,
// Denominación, Estado, Acciones). Las filas viven en App.jsx (`truckshiftRows`).
const COLUMNS = [
  { key: 'codigo', label: 'Código', width: 120 },
  { key: 'denominacion', label: 'Denominación' },
  { key: 'estado', label: 'Estado', render: (row) => <Badge type={row.estado.type}>{row.estado.label}</Badge> },
];

export default function MaestroTruckshift({ maestro, sidebar = TRUCKSHIFT_SIDEBAR_PROPS, truckshiftRows = {}, onNavigate, onSearch, favoriteHrefs = [], onToggleFavorite }) {
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
      rows={truckshiftRows[maestro.href] ?? []}
      actions={[
        { key: 'view', icon: 'bi-eye', label: 'Visualizar', onClick: (row) => navigate({ href: `${maestro.href}/${row.id}/ver`, label: 'Visualizar' }) },
        { key: 'edit', icon: 'icon-edit', label: 'Editar', onClick: (row) => navigate({ href: `${maestro.href}/${row.id}/editar`, label: 'Editar' }) },
      ]}
    />
  );
}
