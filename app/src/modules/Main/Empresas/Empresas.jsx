import LayoutMaestroDataGrid from '../../../templates/LayoutMaestroDataGrid/LayoutMaestroDataGrid.jsx';
import Badge from '../../../components/Badge/Badge.jsx';
import { MAIN_SIDEBAR_PROPS } from '../../../config/sidebars/main.js';

const COLUMNS = [
  { key: 'codigo', label: 'Código', width: 120 },
  { key: 'nombreLegal', label: 'Nombre legal' },
  {
    key: 'activo',
    label: 'Activo',
    render: (row) => <Badge type={row.activo ? 'success' : 'neutral'}>{row.activo ? 'Activo' : 'Inactivo'}</Badge>,
  },
];

// Ejemplo — reemplazar por el catálogo real de empresas. Se usa solo como
// fallback si la pantalla se usa suelta sin App.jsx (mismo criterio que
// DEFAULT_ROWS de Usuarios/Perfiles/Buque) — normalmente `empresas` llega
// por prop desde App.jsx, que es quien mantiene el estado compartido con
// EmpresaFormulario (alta/edición).
const DEFAULT_ROWS = [
  { id: 1, codigo: 'EMP-001', nombreLegal: 'Puerto Norte S.A.', activo: true },
  { id: 2, codigo: 'EMP-002', nombreLegal: 'Del Sur Logística S.R.L.', activo: true },
  { id: 3, codigo: 'EMP-003', nombreLegal: 'Andina Comercial S.A.', activo: false },
];

export default function Empresas({ onNavigate, onSearch, empresas }) {
  const navigate = onNavigate ?? ((d) => console.log('navigate', d));

  return (
    <LayoutMaestroDataGrid
      sidebar={MAIN_SIDEBAR_PROPS}
      activeHref="/admin/empresas"
      onNavigate={navigate}
      onSearch={onSearch}
      onCompanyChange={(c) => console.log('company change', c)}
      onLogout={() => console.log('logout')}
      onToggle={(d) => console.log('toggle', d)}
      title="Empresas"
      onNew={() => navigate({ href: '/admin/empresas/nuevo', label: 'Crear' })}
      newLabel="Crear"
      onReload={() => console.log('recargar empresas')}
      columns={COLUMNS}
      rows={empresas ?? DEFAULT_ROWS}
      selectable
      actions={[
        { key: 'view', icon: 'bi-eye', label: 'Visualizar', onClick: (row) => navigate({ href: `/admin/empresas/${row.id}/ver`, label: 'Visualizar' }) },
        { key: 'edit', icon: 'icon-edit', label: 'Editar', onClick: (row) => navigate({ href: `/admin/empresas/${row.id}/editar`, label: 'Editar' }) },
      ]}
    />
  );
}
