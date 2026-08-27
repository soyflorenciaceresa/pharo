import styles from './Tabs.module.css';

function cx(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Tabs({ items = [], value, onChange, className }) {
  return (
    <div className={cx(styles.tabs, className)}>
      <div className={styles.row} role="tablist">
        {items.map((item) => {
          const active = item.id === value;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={active}
              className={cx(styles.tab, active && styles.active)}
              onClick={() => onChange?.(item.id)}
            >
              <span className={styles.label}>{item.label}</span>
              <span className={styles.indicator} />
            </button>
          );
        })}
      </div>
      <div className={styles.border} />
    </div>
  );
}
