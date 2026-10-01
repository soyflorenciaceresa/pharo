import LayoutMaestroDataGrid from '../../../templates/LayoutMaestroDataGrid/LayoutMaestroDataGrid.jsx';
import Badge from '../../../components/Badge/Badge.jsx';
import { MAIN_SIDEBAR_PROPS } from '../../../config/sidebars/main.js';

const COLUMNS = [
  { key: 'codigo', label: 'Código', width: 120 },
  { key: 'denominacion', label: 'Denominación' },
  {
    key: 'activo',
    label: 'Activo',
    render: (row) => <Badge type={row.activo ? 'success' : 'neutral'}>{row.activo ? 'Activo' : 'Inactivo'}</Badge>,
  },
];

// Ejemplo — reemplazar por el catálogo real de perfiles. Se usa solo como
// fallback si la pantalla se usa suelta sin App.jsx (mismo criterio que
// DEFAULT_ROWS de Usuarios/Buque) — normalmente `perfiles` llega por prop
// desde App.jsx, que es quien mantiene el estado compartido con
// PerfilFormulario (alta/edición).
const DEFAULT_ROWS = [
  { id: 1, codigo: 'PRF-001', denominacion: 'Administrador', activo: true },
  { id: 2, codigo: 'PRF-002', denominacion: 'Supervisor', activo: true },
  { id: 3, codigo: 'PRF-003', denominacion: 'Operador', activo: true },
  { id: 4, codigo: 'PRF-004', denominacion: 'Invitado', activo: false },
];

export default function Perfiles({ onNavigate, onSearch, perfiles }) {
  const navigate = onNavigate ?? ((d) => console.log('navigate', d));

  return (
    <LayoutMaestroDataGrid
      sidebar={MAIN_SIDEBAR_PROPS}
      activeHref="/admin/roles-y-perfiles"
      onNavigate={navigate}
      onSearch={onSearch}
      onCompanyChange={(c) => console.log('company change', c)}
      onLogout={() => console.log('logout')}
      onToggle={(d) => console.log('toggle', d)}
      title="Roles y perfiles"
      onNew={() => navigate({ href: '/admin/roles-y-perfiles/nuevo', label: 'Crear' })}
      newLabel="Crear"
      onReload={() => console.log('recargar perfiles')}
      columns={COLUMNS}
      rows={perfiles ?? DEFAULT_ROWS}
      selectable
      actions={[
        { key: 'view', icon: 'bi-eye', label: 'Visualizar', onClick: (row) => navigate({ href: `/admin/roles-y-perfiles/${row.id}/ver`, label: 'Visualizar' }) },
        { key: 'edit', icon: 'icon-edit', label: 'Editar', onClick: (row) => navigate({ href: `/admin/roles-y-perfiles/${row.id}/editar`, label: 'Editar' }) },
      ]}
    />
  );
}
