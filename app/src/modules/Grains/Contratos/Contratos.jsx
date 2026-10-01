import LayoutMaestroDataGrid from '../../../templates/LayoutMaestroDataGrid/LayoutMaestroDataGrid.jsx';
import { GRAINS_SIDEBAR_PROPS } from '../../../config/sidebars/grains.js';

const COLUMNS = [
  { key: 'codigoContrato', label: 'Código de contrato' },
  { key: 'codigoReferencia', label: 'Código de referencia' },
  { key: 'fechaConcertacion', label: 'Fecha de concertación' },
  { key: 'fechaNegocio', label: 'Fecha del negocio' },
  { key: 'tipoContrato', label: 'Tipo de contrato' },
  { key: 'tipoMercado', label: 'Tipo de mercado' },
];

// Ejemplo — reemplazar por el catálogo real de contratos. Si no se pasa
// `rows` por prop (ej. usando esta pantalla suelta, sin App.jsx), se usa
// este set.
const DEFAULT_ROWS = [
  { id: 1, codigoContrato: 'CT-001', codigoReferencia: 'REF-2024-001', fechaConcertacion: '2024-03-15', fechaNegocio: '2024-03-18', tipoContrato: 'Compraventa', tipoMercado: 'Disponible' },
  { id: 2, codigoContrato: 'CT-002', codigoReferencia: 'REF-2024-002', fechaConcertacion: '2024-04-02', fechaNegocio: '2024-04-05', tipoContrato: 'Compraventa', tipoMercado: 'Futuro' },
  { id: 3, codigoContrato: 'CT-003', codigoReferencia: 'REF-2024-003', fechaConcertacion: '2024-05-10', fechaNegocio: '2024-05-12', tipoContrato: 'Canje', tipoMercado: 'Disponible' },
];

export default function Contratos({ onNavigate, onSearch, contratos, favoriteHrefs = [], onToggleFavorite }) {
  const navigate = onNavigate ?? ((d) => console.log('navigate', d));

  return (
    <LayoutMaestroDataGrid
      sidebar={GRAINS_SIDEBAR_PROPS}
      activeHref="/grains/contratos"
      onNavigate={navigate}
      onSearch={onSearch}
      onCompanyChange={(c) => console.log('company change', c)}
      onLogout={() => console.log('logout')}
      onToggle={(d) => console.log('toggle', d)}
      title="Contratos"
      favorite={favoriteHrefs.includes('/grains/contratos')}
      onToggleFavorite={() => onToggleFavorite?.('/grains/contratos')}
      onNew={() => navigate({ href: '/grains/contratos/nuevo', label: 'Nuevo' })}
      onReload={() => console.log('recargar contratos')}
      onExport={() => console.log('exportar contratos')}
      columns={COLUMNS}
      rows={contratos ?? DEFAULT_ROWS}
      actions={[
        { key: 'view', icon: 'bi-eye', label: 'Visualizar', onClick: (row) => navigate({ href: `/grains/contratos/${row.id}/ver`, label: 'Visualizar' }) },
        { key: 'edit', icon: 'icon-edit', label: 'Editar', onClick: (row) => navigate({ href: `/grains/contratos/${row.id}/editar`, label: 'Editar' }) },
      ]}
    />
  );
}
