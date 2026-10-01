import LayoutBase from '../LayoutBase/LayoutBase.jsx';
import DataGrid from '../../components/DataGrid/DataGrid.jsx';
import PageHeader from '../../components/PageHeader/PageHeader.jsx';
import styles from './LayoutMaestroDataGrid.module.css';

export default function LayoutMaestroDataGrid({
  sidebar,
  activeHref,
  onNavigate,
  onCompanyChange,
  onLogout,
  onToggle,
  onSearch,
  breadcrumb = [],
  title,
  favorite,
  onToggleFavorite,
  onNew,
  newLabel = 'Nuevo',
  onReload,
  reloadLabel = 'Recargar',
  onExport,
  exportLabel = 'Exportar',
  columns,
  rows,
  selectable,
  onSelectionChange,
  actions,
  searchPlaceholder,
  emptyMessage,
}) {
  const primary = onNew ? { label: newLabel, iconStart: 'icon-plus', onClick: onNew } : undefined;
  const secondaryActions = [
    onReload && { label: reloadLabel, iconStart: 'icon-refresh', onClick: onReload },
    onExport && { label: exportLabel, iconStart: 'icon-export', onClick: onExport },
  ].filter(Boolean);

  return (
    <LayoutBase onSearch={onSearch} sidebarProps={{ ...sidebar, defaultActiveHref: activeHref, onNavigate, onCompanyChange, onLogout, onToggle }}>
      <div className={styles.root}>
        {/* Page header type="maestro": título + favorito + acciones (Action Group si hay
            "Nuevo" + al menos un secundario; Buttons sueltos en cualquier otro caso). */}
        <PageHeader
          type="maestro"
          title={title}
          breadcrumb={breadcrumb}
          favorite={favorite}
          onToggleFavorite={onToggleFavorite}
          actions={{ label: 'Acciones del listado', primary, secondary: secondaryActions }}
        />

        <DataGrid
          columns={columns}
          rows={rows}
          selectable={selectable}
          onSelectionChange={onSelectionChange}
          actions={actions}
          searchPlaceholder={searchPlaceholder}
          emptyMessage={emptyMessage}
        />
      </div>
    </LayoutBase>
  );
}
