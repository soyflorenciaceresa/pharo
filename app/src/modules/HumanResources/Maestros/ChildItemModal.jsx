import { useState } from 'react';
import Modal from '../../../components/Modal/Modal.jsx';
import ActionGroup from '../../../components/ActionGroup/ActionGroup.jsx';
import TextField from '../../../components/TextField/TextField.jsx';
import Select from '../../../components/Select/Select.jsx';
import Checkbox from '../../../components/Checkbox/Checkbox.jsx';
import styles from './ChildItemModal.module.css';

// Modal genérico para agregar / editar una fila de una Child Grid Section. El
// llamador (la pantalla) define los `fields` ({ key, label, type: 'text' |
// 'select' | 'date' | 'number' | 'check', options?, required? }) y la
// validación cruzada en `onSubmit(values)` (devuelve un mensaje de error o
// null). Se monta con `key` distinto por fila para reiniciar su estado.
export default function ChildItemModal({ title, fields, initial, onClose, onSubmit }) {
  const [values, setValues] = useState(() => Object.fromEntries(fields.map((f) => [f.key, initial?.[f.key] ?? (f.type === 'check' ? Boolean(f.default) : f.default ?? '')])));
  const [error, setError] = useState('');
  const editing = Boolean(initial?.id);
  const set = (key, value) => { setValues((prev) => ({ ...prev, [key]: value })); setError(''); };

  function submit() {
    for (const f of fields) {
      const v = values[f.key];
      if (f.required && f.type !== 'check' && !String(v).trim()) return setError(`Completá "${f.label}"`);
      if (f.type === 'number' && String(v).trim() !== '' && !(Number(v) >= 0)) return setError(`"${f.label}" debe ser un número válido`);
    }
    const message = onSubmit(values);
    if (message) setError(message);
  }

  return (
    <Modal
      open
      title={`${editing ? 'Editar' : 'Agregar'} ${title}`}
      onClose={onClose}
      footer={<ActionGroup aria-label="Acciones del diálogo" primary={{ label: editing ? 'Guardar' : 'Agregar', onClick: submit }} secondary={[{ label: 'Cancelar', onClick: onClose }]} />}
    >
      <div className={styles.fields}>
        {fields.map((f) => {
          const label = f.required ? `${f.label} *` : f.label;
          if (f.type === 'check') return <Checkbox key={f.key} label={f.label} checked={values[f.key]} onChange={(e) => set(f.key, e.target.checked)} />;
          if (f.type === 'select') return <Select key={f.key} label={label} value={values[f.key]} onChange={(e) => set(f.key, e.target.value)} options={f.options} placeholder="Seleccionar..." />;
          return <TextField key={f.key} label={label} type={f.type === 'date' ? 'date' : undefined} inputMode={f.type === 'number' ? 'decimal' : undefined} value={values[f.key]} onChange={(e) => set(f.key, e.target.value)} />;
        })}
        {error && <span className={styles.error}>{error}</span>}
      </div>
    </Modal>
  );
}
