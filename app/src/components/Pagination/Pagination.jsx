import { Icon } from '../../icons/icons.jsx';
import styles from './Pagination.module.css';

export default function Pagination({ page, totalPages, onPrevious, onNext }) {
  return (
    <div className={styles.pagination}>
      <button
        type="button"
        className={styles.chevron}
        onClick={onPrevious}
        disabled={page <= 1}
        aria-label="Página anterior"
      >
        <Icon name="bi-chevron-left" size={16} />
      </button>
      <span className={styles.label}>{page} de {totalPages}</span>
      <button
        type="button"
        className={styles.chevron}
        onClick={onNext}
        disabled={page >= totalPages}
        aria-label="Página siguiente"
      >
        <Icon name="bi-chevron-right" size={16} />
      </button>
    </div>
  );
}
