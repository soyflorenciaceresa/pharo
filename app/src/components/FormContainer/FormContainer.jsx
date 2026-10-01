import styles from './FormContainer.module.css';

function cx(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function FormContainer({ title, children, className }) {
  return (
    <div className={cx(styles.container, className)}>
      <div className={styles.header}>
        <span className={styles.title}>{title}</span>
      </div>
      <div className={styles.divider} />
      <div className={styles.content}>{children}</div>
    </div>
  );
}
