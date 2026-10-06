import { useMemo, useRef, useEffect, useState } from 'react';
import { Icon } from '../../icons/icons.jsx';
import TextField from '../TextField/TextField.jsx';
import styles from './DataGrid.module.css';

function cx(...classes) {
  return classes.filter(Boolean).join(' ');
}

function cellText(row, key) {
  const value = row[key];
  return value && typeof value === 'object' ? value.label : value;
}

function RowCheckbox({ checked, indeterminate = false, onChange, ariaLabel }) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate;
  }, [indeterminate]);

  return (
    <label className={styles.checkbox}>
      <input
        ref={ref}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        aria-label={ariaLabel}
      />
      <span className={cx(styles.checkboxBox, (checked || indeterminate) && styles.checkboxChecked)}>
        {checked && !indeterminate && (
          <svg viewBox="0 0 13 13" width="13" height="13" fill="none">
            <path d="M10.8333 3.25L4.875 9.20833L2.16667 6.5" stroke="white" strokeWidth="1.89583" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
        {indeterminate && <span className={styles.checkboxDash} />}
      </span>
    </label>
  );
}

function ActionButton({ icon, label, onClick }) {
  return (
    <button type="button" className={styles.actionButton} onClick={onClick} aria-label={label} title={label}>
      <Icon name={icon} size={16} />
    </button>
  );
}

export default function DataGrid({
  columns,
  rows,
  selectable = false,
  onSelectionChange,
  actions,
  searchPlaceholder = 'Buscar...',
  searchable = true,
  bordered = true,
  emptyMessage = 'No se encontraron resultados.',
}) {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(() => new Set());

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((row) => columns.some((col) => String(cellText(row, col.key) ?? '').toLowerCase().includes(q)));
  }, [rows, columns, search]);

  const allSelected = filteredRows.length > 0 && filteredRows.every((row) => selected.has(row.id));
  const someSelected = !allSelected && filteredRows.some((row) => selected.has(row.id));

  function updateSelection(next) {
    setSelected(next);
    onSelectionChange?.([...next]);
  }

  function toggleRow(id) {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    updateSelection(next);
  }

  function toggleAll() {
    const next = new Set(selected);
    if (allSelected) {
      filteredRows.forEach((row) => next.delete(row.id));
    } else {
      filteredRows.forEach((row) => next.add(row.id));
    }
    updateSelection(next);
  }

  const hasActions = Array.isArray(actions) && actions.length > 0;

  return (
    <div className={styles.root}>
      <div className={cx(styles.grid, !bordered && styles.gridBorderless)}>
        {searchable && (
          <div className={styles.toolbar}>
            <TextField
              className={styles.search}
              type="search"
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label={searchPlaceholder}
            />
          </div>
        )}

        <div className={styles.headerRow}>
          {selectable && (
            <div className={cx(styles.cell, styles.checkboxCell)}>
              <RowCheckbox checked={allSelected} indeterminate={someSelected} onChange={toggleAll} ariaLabel="Seleccionar todo" />
            </div>
          )}
          {columns.map((col) => (
            <div
              key={col.key}
              className={cx(styles.cell, styles.headerCell, !col.width && styles.cellFlex)}
              style={col.width ? { width: col.width, flexShrink: 0 } : undefined}
            >
              {col.label}
            </div>
          ))}
          {hasActions && (
            <div className={cx(styles.cell, styles.headerCell, styles.actionsCell)}>Acciones</div>
          )}
        </div>

        {filteredRows.length === 0 && <div className={styles.empty}>{emptyMessage}</div>}

        {filteredRows.map((row) => {
          const isSelected = selected.has(row.id);
          return (
            <div key={row.id} className={cx(styles.row, isSelected && styles.rowSelected)}>
              {selectable && (
                <div className={cx(styles.cell, styles.checkboxCell)}>
                  <RowCheckbox checked={isSelected} onChange={() => toggleRow(row.id)} ariaLabel={`Seleccionar fila ${row.id}`} />
                </div>
              )}
              {columns.map((col) => (
                <div
                  key={col.key}
                  className={cx(styles.cell, !col.width && styles.cellFlex)}
                  style={col.width ? { width: col.width, flexShrink: 0 } : undefined}
                >
                  {col.render ? col.render(row) : <span className={styles.cellText}>{row[col.key]}</span>}
                </div>
              ))}
              {hasActions && (
                <div className={cx(styles.cell, styles.actionsCell)}>
                  <div className={styles.actionsGroup}>
                    {actions.map((action) => (
                      <ActionButton
                        key={action.key ?? action.label}
                        icon={action.icon}
                        label={action.label}
                        onClick={() => action.onClick(row)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
