import { Icon } from '../../icons/icons.jsx';
import styles from './CardQuickAccess.module.css';

export default function CardQuickAccess({ icon = 'app-window', title, subtitle, onClick, href }) {
  const Tag = href ? 'a' : 'button';
  return (
    <Tag
      className={styles.card}
      href={href}
      type={href ? undefined : 'button'}
      onClick={onClick}
    >
      <span className={styles.iconBadge}>
        <Icon name={icon} size={16} />
      </span>
      <span className={styles.textCol}>
        <span className={styles.title}>{title}</span>
        <span className={styles.subtitle}>{subtitle}</span>
      </span>
    </Tag>
  );
}
