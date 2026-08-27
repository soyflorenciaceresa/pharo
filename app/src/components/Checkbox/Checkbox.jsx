import { useId } from 'react';
import styles from './Checkbox.module.css';

function cx(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Checkbox({ label, checked = false, onChange, disabled = false, id, className, ...rest }) {
  const generatedId = useId();
  const inputId = id || generatedId;

  return (
    <label htmlFor={inputId} className={cx(styles.wrap, disabled && styles.disabled, className)}>
      <span className={styles.box}>
        <input
          id={inputId}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          {...rest}
        />
        <span className={cx(styles.boxVisual, checked && styles.checked, disabled && styles.boxDisabled)}>
          {checked && (
            <svg viewBox="0 0 13 13" width="13" height="13" fill="none">
              <path d="M10.8333 3.25L4.875 9.20833L2.16667 6.5" stroke="white" strokeWidth="1.89583" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </span>
      </span>
      {label && <span className={styles.label}>{label}</span>}
    </label>
  );
}
