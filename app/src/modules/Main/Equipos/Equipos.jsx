import LayoutMaestroDataGrid from '../../../templates/LayoutMaestroDataGrid/LayoutMaestroDataGrid.jsx';
import Badge from '../../../components/Badge/Badge.jsx';
import { MAIN_SIDEBAR_PROPS } from '../../../config/sidebars/main.js';

const COLUMNS = [
  { key: 'ip', label: 'IP', width: 160 },
  { key: 'denominacion', label: 'Denominación' },
  {
    key: 'activo',
    label: 'Activo',
    render: (row) => <Badge type={row.activo ? 'success' : 'neutral'}>{row.activo ? 'Activo' : 'Inactivo'}</Badge>,
  },
];

// Ejemplo — fallback si la pantalla se usa suelta sin App.jsx; normalmente
// `equipos` llega por prop (estado compartido con EquipoFormulario).
const DEFAULT_ROWS = [
  { id: 1, ip: '192.168.1.10', denominacion: 'Balanza acceso norte', activo: true },
  { id: 2, ip: '192.168.1.11', denominacion: 'Terminal de ingreso', activo: true },
  { id: 3, ip: '192.168.2.20', denominacion: 'Servidor de reportes', activo: false },
];

export default function Equipos({ onNavigate, onSearch, equipos }) {
  const navigate = onNavigate ?? ((d) => console.log('navigate', d));

  return (
    <LayoutMaestroDataGrid
      sidebar={MAIN_SIDEBAR_PROPS}
      activeHref="/admin/equipos"
      onNavigate={navigate}
      onSearch={onSearch}
      onCompanyChange={(c) => console.log('company change', c)}
      onLogout={() => console.log('logout')}
      onToggle={(d) => console.log('toggle', d)}
      title="Equipos"
      onNew={() => navigate({ href: '/admin/equipos/nuevo', label: 'Crear' })}
      newLabel="Crear"
      onReload={() => console.log('recargar equipos')}
      columns={COLUMNS}
      rows={equipos ?? DEFAULT_ROWS}
      actions={[
        { key: 'view', icon: 'bi-eye', label: 'Visualizar', onClick: (row) => navigate({ href: `/admin/equipos/${row.id}/ver`, label: 'Visualizar' }) },
        { key: 'edit', icon: 'icon-edit', label: 'Editar', onClick: (row) => navigate({ href: `/admin/equipos/${row.id}/editar`, label: 'Editar' }) },
      ]}
    />
  );
}
