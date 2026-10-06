import LayoutMaestroDataGrid from '../../../templates/LayoutMaestroDataGrid/LayoutMaestroDataGrid.jsx';
import Badge from '../../../components/Badge/Badge.jsx';
import { OPERACIONES_SIDEBAR_PROPS } from '../../../config/sidebars/operaciones.js';

// Estados de la solicitud. El flujo de aprobación completo (Aprobada, Rechazada…)
// vive en otra pantalla del sistema; acá se muestran solo para dar seguimiento.
const ESTADO_BADGE = {
  Borrador: 'neutral',
  Enviada: 'info',
  Aprobada: 'success',
  Rechazada: 'error',
};

const COLUMNS = [
  { key: 'idViaje', label: 'ID de viaje', width: 140 },
  { key: 'buqueLabel', label: 'Buque' },
  { key: 'zarpada', label: 'Zarpada estimada', width: 200 },
  {
    key: 'estado',
    label: 'Estado',
    width: 140,
    render: (row) => <Badge type={ESTADO_BADGE[row.estado] ?? 'neutral'}>{row.estado}</Badge>,
  },
];

// Ejemplo — fallback si se usa suelta; normalmente `giros` llega por prop desde App.jsx.
const DEFAULT_ROWS = [];

export default function Giros({ onNavigate, onSearch, giros }) {
  const navigate = onNavigate ?? ((d) => console.log('navigate', d));
  return (
    <LayoutMaestroDataGrid
      sidebar={OPERACIONES_SIDEBAR_PROPS}
      activeHref="/giros"
      onNavigate={navigate}
      onSearch={onSearch}
      onCompanyChange={(c) => console.log('company change', c)}
      onLogout={() => console.log('logout')}
      onToggle={(d) => console.log('toggle', d)}
      title="Giros"
      onNew={() => navigate({ href: '/giros/nueva', label: 'Nueva solicitud' })}
      newLabel="Nueva solicitud"
      onReload={() => console.log('recargar giros')}
      columns={COLUMNS}
      rows={giros ?? DEFAULT_ROWS}
      actions={[
        { key: 'view', icon: 'bi-eye', label: 'Visualizar', onClick: (row) => navigate({ href: `/giros/${row.id}/ver`, label: 'Visualizar' }) },
        { key: 'edit', icon: 'icon-edit', label: 'Editar', onClick: (row) => navigate({ href: `/giros/${row.id}/editar`, label: 'Editar' }) },
      ]}
    />
  );
}
