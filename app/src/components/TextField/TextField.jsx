import { useId } from 'react';
import styles from './TextField.module.css';

function cx(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function TextField({
  label,
  value,
  onChange,
  placeholder = 'Placeholder text',
  helperText,
  error = false,
  disabled = false,
  id,
  className,
  ...rest
}) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const helperId = `${inputId}-helper`;

  return (
    <div className={cx(styles.field, className)}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cx(styles.input, error && styles.error)}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        aria-invalid={error || undefined}
        aria-describedby={error && helperText ? helperId : undefined}
        {...rest}
      />
      {error && helperText && (
        <p id={helperId} className={styles.helperText}>
          {helperText}
        </p>
      )}
    </div>
  );
}
