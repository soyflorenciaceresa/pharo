import styles from './Badge.module.css';

function cx(...classes) {
  return classes.filter(Boolean).join(' ');
}

const TYPES = ['success', 'warning', 'error', 'info', 'neutral'];

// Etiqueta estática, no interactiva (Figma: component set Badge 619:47,
// handoff 630:44). No recibe foco ni emite eventos — el nombre accesible es
// el texto de `children`; el Dot es decorativo.
export default function Badge({ type = 'neutral', showDot = true, children, className, ...rest }) {
  // Un Badge sin texto no es válido (handoff, Edge cases).
  if (children == null || children === '') return null;

  let resolvedType = type;
  if (!TYPES.includes(type)) {
    if (import.meta.env.DEV) console.warn(`Badge: type inválido "${type}", se usa "neutral".`);
    resolvedType = 'neutral';
  }

  return (
    <span className={cx(styles.badge, className)} data-type={resolvedType} {...rest}>
      {showDot && <span className={styles.dot} aria-hidden="true" />}
      <span className={styles.label} title={typeof children === 'string' ? children : undefined}>
        {children}
      </span>
    </span>
  );
}
