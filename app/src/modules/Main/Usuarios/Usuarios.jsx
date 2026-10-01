import LayoutMaestroDataGrid from '../../../templates/LayoutMaestroDataGrid/LayoutMaestroDataGrid.jsx';
import Badge from '../../../components/Badge/Badge.jsx';
import { MAIN_SIDEBAR_PROPS } from '../../../config/sidebars/main.js';

const COLUMNS = [
  { key: 'nombreApellido', label: 'Nombre' },
  { key: 'correo', label: 'Correo Electrónico' },
  {
    key: 'activo',
    label: 'Activo',
    render: (row) => <Badge type={row.activo ? 'success' : 'neutral'}>{row.activo ? 'Activo' : 'Inactivo'}</Badge>,
  },
];

// Ejemplo — reemplazar por el catálogo real de usuarios. Se usa solo como
// fallback si la pantalla se usa suelta sin App.jsx (mismo criterio que
// DEFAULT_ROWS de Buque) — normalmente `usuarios` llega por prop desde
// App.jsx, que es quien mantiene el estado compartido con
// UsuarioFormulario (alta/edición).
const DEFAULT_ROWS = [
  { id: 1, nombreApellido: 'Carlos Mendoza', correo: 'carlos.mendoza@gmail.com', activo: true },
  { id: 2, nombreApellido: 'Ana Torres', correo: 'ana.torres@gmail.com', activo: true },
  { id: 3, nombreApellido: 'Diego Fernández', correo: 'diego.fernandez@gmail.com', activo: false },
  { id: 4, nombreApellido: 'Lucía Pérez', correo: 'lucia.perez@gmail.com', activo: true },
  { id: 5, nombreApellido: 'Martín Gómez', correo: 'martin.gomez@gmail.com', activo: false },
];

export default function Usuarios({ onNavigate, onSearch, usuarios }) {
  const navigate = onNavigate ?? ((d) => console.log('navigate', d));

  return (
    <LayoutMaestroDataGrid
      sidebar={MAIN_SIDEBAR_PROPS}
      activeHref="/admin/usuarios"
      onNavigate={navigate}
      onSearch={onSearch}
      onCompanyChange={(c) => console.log('company change', c)}
      onLogout={() => console.log('logout')}
      onToggle={(d) => console.log('toggle', d)}
      title="Usuarios"
      onNew={() => navigate({ href: '/admin/usuarios/nuevo', label: 'Crear' })}
      newLabel="Crear"
      onReload={() => console.log('recargar usuarios')}
      columns={COLUMNS}
      rows={usuarios ?? DEFAULT_ROWS}
      actions={[
        { key: 'view', icon: 'bi-eye', label: 'Visualizar', onClick: (row) => navigate({ href: `/admin/usuarios/${row.id}/ver`, label: 'Visualizar' }) },
        { key: 'edit', icon: 'icon-edit', label: 'Editar', onClick: (row) => navigate({ href: `/admin/usuarios/${row.id}/editar`, label: 'Editar' }) },
      ]}
    />
  );
}
