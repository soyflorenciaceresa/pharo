import styles from './ActivityItem.module.css';

const AVATAR_COLORS = [
  'var(--color-avatar-1)',
  'var(--color-avatar-2)',
  'var(--color-avatar-3)',
  'var(--color-avatar-4)',
  'var(--color-avatar-5)',
  'var(--color-avatar-6)',
];

function initialsOf(name) {
  return (name || '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');
}

function avatarColorOf(name) {
  let hash = 0;
  for (const char of name || '') {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  }
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

export default function ActivityItem({ name, time, description, initials }) {
  return (
    <div className={styles.item}>
      <span className={styles.avatar} style={{ '--avatar-bg': avatarColorOf(name) }}>
        {initials || initialsOf(name)}
      </span>
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
