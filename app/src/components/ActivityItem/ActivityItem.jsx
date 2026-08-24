import styles from './ActivityItem.module.css';

function initialsOf(name) {
  return (name || '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');
}

export default function ActivityItem({ name, time, description, initials }) {
  return (
    <div className={styles.item}>
      <span className={styles.avatar}>{initials || initialsOf(name)}</span>
      <span className={styles.body}>
        <span className={styles.row}>
          <span className={styles.name}>{name}</span>
          <span className={styles.time}>{time}</span>
        </span>
        <p className={styles.description}>{description}</p>
      </span>
    </div>
  );
}
