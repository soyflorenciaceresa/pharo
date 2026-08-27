import { Icon } from '../../icons/icons.jsx';
import styles from './FormContainer.module.css';

function cx(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function FormContainer({ icon = 'app-window', title, children, className }) {
  return (
    <div className={cx(styles.container, className)}>
      <div className={styles.header}>
        <span className={styles.iconBadge}>
          <Icon name={icon} size={16} />
        </span>
        <span className={styles.title}>{title}</span>
      </div>
      <div className={styles.divider} />
      <div className={styles.content}>{children}</div>
    </div>
  );
}
