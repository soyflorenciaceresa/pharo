import { Icon } from '../../icons/icons.jsx';
import styles from './Button.module.css';

function cx(...classes) {
  return classes.filter(Boolean).join(' ');
}

// Un slot de ícono acepta un nombre de icons.jsx (string) o cualquier nodo.
// Siempre decorativo: el nombre accesible sale del label/aria-label.
function IconSlot({ icon }) {
  if (!icon) return null;
  return (
    <span className={styles.icon} aria-hidden="true">
      {typeof icon === 'string' ? <Icon name={icon} size={16} /> : icon}
    </span>
  );
}

export default function Button({
  variant = 'solid',
  iconStart,
  iconEnd,
  iconOnly = false,
  children,
  disabled = false,
  type = 'button',
  href,
  className,
  ...rest
}) {
  const classes = cx(styles.btn, styles[variant], iconOnly && styles.iconOnly, className);

  const content = iconOnly ? (
    <IconSlot icon={iconStart ?? iconEnd} />
  ) : (
    <>
      <IconSlot icon={iconStart} />
      <span className={styles.label}>{children}</span>
      <IconSlot icon={iconEnd} />
    </>
  );

  // Si navega a otra URL, <a> con los mismos estilos (handoff 605:91, "Como link").
  if (href && !disabled) {
    return (
      <a href={href} className={classes} {...rest}>
        {content}
      </a>
    );
  }

  return (
    <button type={type} className={classes} disabled={disabled} {...rest}>
      {content}
    </button>
  );
}
