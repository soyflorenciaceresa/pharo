import { useId } from 'react';
import { Icon } from '../../icons/icons.jsx';
import styles from './Select.module.css';

function cx(...classes) {
  return classes.filter(Boolean).join(' ');
}

// Sin frame de Figma — no existía un dropdown en el kit todavía. Armado como
// un <select> nativo estilizado (no un listbox custom como LanguageSelector)
// a propósito: es un campo de formulario más entre TextField/Checkbox, así
// que prioriza teclado/accesibilidad/mobile nativos por sobre un look 100%
// custom. Mismo box que TextField (mismo border/radius/padding/estados) para
// que ambos convivan en una misma fila sin desentonar.
export default function Select({
  label,
  value,
  onChange,
  options = [],
  placeholder = 'Seleccionar...',
  helperText,
  error = false,
  disabled = false,
  id,
  className,
  ...rest
}) {
  const generatedId = useId();
  const selectId = id || generatedId;
  const helperId = `${selectId}-helper`;

  return (
    <div className={cx(styles.field, className)}>
      {label && (
        <label htmlFor={selectId} className={styles.label}>
          {label}
        </label>
      )}
      <div className={styles.control}>
        <select
          id={selectId}
          className={cx(styles.select, !value && styles.placeholder, error && styles.error)}
          value={value ?? ''}
          onChange={onChange}
          disabled={disabled}
          aria-invalid={error || undefined}
          aria-describedby={error && helperText ? helperId : undefined}
          {...rest}
        >
          <option value="" disabled hidden>
            {placeholder}
          </option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <span className={styles.chevron}>
          <Icon name="bi-chevron-down" size={16} />
        </span>
      </div>
      {error && helperText && (
        <p id={helperId} className={styles.helperText}>
          {helperText}
        </p>
      )}
    </div>
  );
}
