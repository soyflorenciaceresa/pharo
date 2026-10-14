import Button from '../Button/Button.jsx';
import DataGrid from '../DataGrid/DataGrid.jsx';
import styles from './ChildGridSection.module.css';

// Bloque de composición de M-04 (Figma: `Child Grid Section`, 733:198): card
// con título + botón "Agregar" (outline) y, debajo del divisor, una grilla de
// filas hijas. Misma piel que `FormContainer` (Form Section). Las filas se
// editan en un Drawer/Modal que resuelve la pantalla desde `actions`/`onAdd`,
// nunca inline.
export default function ChildGridSection({
  title,
  addLabel = 'Agregar',
  onAdd,
  columns,
  rows = [],
  actions,
  searchable = false,
  emptyMessage,
  // Botones outline extra a la izquierda de "Agregar" (ej. "Actualizar"): [{ label, onClick, iconStart? }]
  extraActions = [],
}) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.title}>{title}</span>
        {extraActions.map((a) => (
          <Button key={a.label} variant="outline" iconStart={a.iconStart} onClick={a.onClick}>
            {a.label}
          </Button>
        ))}
        {onAdd && (
          <Button variant="outline" onClick={onAdd}>
            {addLabel}
          </Button>
        )}
      </div>
      <div className={styles.divider} />
      <div className={styles.content}>
        <DataGrid
          columns={columns}
          rows={rows}
          actions={actions}
          searchable={searchable}
          bordered={false}
          emptyMessage={emptyMessage}
        />
      </div>
    </div>
  );
}
