import { useState } from 'react';
import { Icon } from '../../icons/icons.jsx';
import styles from './Accordion.module.css';

function cx(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Accordion({
  icon = 'app-window',
  title,
  defaultExpanded = true,
  onToggle,
  children,
  className,
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const toggle = () => {
    const next = !expanded;
    setExpanded(next);
    onToggle?.(next);
  };

  return (
    <div className={cx(styles.accordion, className)}>
      <button
        type="button"
        className={styles.header}
        onClick={toggle}
        aria-expanded={expanded}
      >
        <span className={styles.iconBadge}>
          <Icon name={icon} size={16} />
        </span>
        <span className={styles.title}>{title}</span>
        <span className={cx(styles.chevron, expanded && styles.open)}>
          <Icon name="bi-chevron-right" size={16} />
        </span>
      </button>
      <div className={cx(styles.body, expanded && styles.open)}>
        <div className={styles.bodyInner}>
          <div className={styles.divider} />
          <div className={styles.content}>{children}</div>
        </div>
      </div>
    </div>
  );
}
