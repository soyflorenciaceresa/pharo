import { Icon } from '../../icons/icons.jsx';
import styles from './ChatSuggestionCard.module.css';

export default function ChatSuggestionCard({ icon = 'app-window', accent = 'blue', title, description, onClick }) {
  return (
    <button type="button" className={styles.card} onClick={onClick}>
      <span className={styles.iconBadge} data-accent={accent}>
        <Icon name={icon} size={20} />
      </span>
      <span className={styles.textCol}>
        <span className={styles.title}>{title}</span>
        <span className={styles.description}>{description}</span>
      </span>
    </button>
  );
}
