import LayoutBase from '../LayoutBase/LayoutBase.jsx';
import DataGrid from '../../components/DataGrid/DataGrid.jsx';
import ButtonPrimary from '../../components/ButtonPrimary/ButtonPrimary.jsx';
import ButtonSecondary from '../../components/ButtonSecondary/ButtonSecondary.jsx';
import { Icon } from '../../icons/icons.jsx';
import styles from './LayoutMaestroDataGrid.module.css';

export default function LayoutMaestroDataGrid({
  sidebar,
  activeHref,
  onNavigate,
  onCompanyChange,
  onLogout,
  onToggle,
  breadcrumb = [],
  title,
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
  return (
    <LayoutBase sidebarProps={{ ...sidebar, defaultActiveHref: activeHref, onNavigate, onCompanyChange, onLogout, onToggle }}>
      <div className={styles.root}>
        <div className={styles.header}>
          <div className={styles.titleCol}>
            {breadcrumb.length > 0 && (
              <div className={styles.breadcrumb}>
                {breadcrumb.map((item, i) => (
                  <span key={item.label} className={styles.breadcrumbItem}>
                    {i > 0 && (
                      <span className={styles.breadcrumbChevron}>
                        <Icon name="bi-chevron-right" size={16} />
                      </span>
                    )}
                    {item.label}
                  </span>
                ))}
              </div>
            )}
            <h1 className={styles.title}>{title}</h1>
          </div>
          <div className={styles.actionsRow}>
            {onNew && <ButtonPrimary label={newLabel} icon="leading" iconName="icon-plus" onClick={onNew} />}
            {onReload && <ButtonSecondary label={reloadLabel} icon="leading" iconName="icon-refresh" onClick={onReload} />}
            {onExport && <ButtonSecondary label={exportLabel} icon="leading" iconName="icon-export" onClick={onExport} />}
          </div>
        </div>

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
