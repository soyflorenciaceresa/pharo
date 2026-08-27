import { Icon } from '../../icons/icons.jsx';
import styles from './ButtonSecondary.module.css';

function cx(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function ButtonSecondary({
  label = 'Button',
  size = 'md',
  icon = 'none',
  iconName,
  loading = false,
  disabled = false,
  type = 'button',
  className,
  ...rest
}) {
  const position = loading ? (icon === 'trailing' ? 'trailing' : icon === 'only' ? 'only' : 'leading') : icon;
  const showLabel = position !== 'only';
  const iconSize = size === 'lg' ? 20 : 16;

  const iconEl = loading ? (
    <span className={cx(styles.icon, size === 'lg' ? styles.iconLg : styles.iconMd, styles.spin)}>
      <Icon name="icon-spinner" size={iconSize} />
    </span>
  ) : iconName ? (
    <span className={cx(styles.icon, size === 'lg' ? styles.iconLg : styles.iconMd)}>
      <Icon name={iconName} size={iconSize} />
    </span>
  ) : null;

  return (
    <button
      type={type}
      className={cx(styles.btn, size === 'lg' && styles.lg, position === 'only' && styles.iconOnly, className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      aria-label={position === 'only' ? label : undefined}
      {...rest}
    >
      {(position === 'leading' || position === 'only') && iconEl}
      {showLabel && <span className={styles.label}>{label}</span>}
      {position === 'trailing' && iconEl}
    </button>
  );
}
