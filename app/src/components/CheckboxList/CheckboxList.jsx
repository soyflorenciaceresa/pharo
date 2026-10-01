import { useMemo, useState } from 'react';
import TextField from '../TextField/TextField.jsx';
import Checkbox from '../Checkbox/Checkbox.jsx';
import styles from './CheckboxList.module.css';

// Sin frame de Figma — no existía un checklist de selección múltiple en el
// kit todavía (ModuleAccessCard es una grilla de cards con ícono/acento,
// pensada para catálogos con identidad visual propia como los módulos; acá
// el catálogo es una lista simple de nombres — empresas, perfiles, roles —
// sin ícono/acento por ítem, así que una lista liviana encaja mejor que
// forzar cards).
//
// A pedido, cada ítem es un `Checkbox` liso — mismo formato que "Inactivo"/
// "Bloqueado" en el bloque de Credenciales (sin borde de fila, sin hover, sin
// look de grilla/tabla). Solo buscador arriba — sin "seleccionar todo" ni
// contador de seleccionados (se sacaron a pedido, ver nota en CLAUDE.md). El
// resto es una lista simple, `display:flex; flex-direction: column; gap`
// apilando Checkbox.
//
// Controlado (`selectedIds`/`onChange`) a diferencia de la selección de
// DataGrid (que es semi-controlada/transitoria) — acá el formulario que lo
// usa necesita persistir la selección al guardar, así que no puede vivir
// solo como estado interno. El buscador sí es interno: filtra la vista, no
// afecta la selección — ítems ocultos por el filtro se preservan seleccionados.
export default function CheckboxList({
  items = [],
  selectedIds = [],
  onChange,
  searchPlaceholder = 'Buscar...',
  emptyMessage = 'No se encontraron resultados.',
  disabled = false,
  columns = 1,
}) {
  const [search, setSearch] = useState('');
  const selected = useMemo(() => new Set(selectedIds), [selectedIds]);

  const filteredItems = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (item) => item.label.toLowerCase().includes(q) || item.description?.toLowerCase().includes(q)
    );
  }, [items, search]);

  function toggleItem(id) {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    onChange?.([...next]);
  }

  return (
    <div className={styles.root}>
      <TextField
        className={styles.search}
        type="search"
        placeholder={searchPlaceholder}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        aria-label={searchPlaceholder}
        disabled={disabled}
      />

      {filteredItems.length === 0 && <p className={styles.empty}>{emptyMessage}</p>}

      <div className={columns === 2 ? styles.itemsTwoCol : styles.items}>
        {filteredItems.map((item) => (
          <Checkbox
            key={item.id}
            checked={selected.has(item.id)}
            onChange={() => toggleItem(item.id)}
            disabled={disabled}
            label={
              item.description ? (
                <span className={styles.rowText}>
                  <span className={styles.rowLabel}>{item.label}</span>
                  <span className={styles.rowDescription}>{item.description}</span>
                </span>
              ) : (
                item.label
              )
            }
          />
        ))}
      </div>
    </div>
  );
}
