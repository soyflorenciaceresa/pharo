import { Icon } from '../../icons/icons.jsx';
import styles from './CardModule.module.css';

export default function CardModule({ icon = 'app-window', accent = 'blue', title, description, onClick, href }) {
  const Tag = href ? 'a' : 'button';
  return (
    <Tag
      className={styles.card}
      href={href}
      type={href ? undefined : 'button'}
      onClick={onClick}
    >
      <span className={styles.iconBadge} data-accent={accent}>
        <Icon name={icon} size={16} />
      </span>
      <span className={styles.textCol}>
        <span className={styles.title}>{title}</span>
        <span className={styles.description}>{description}</span>
      </span>
    </Tag>
  );
}
