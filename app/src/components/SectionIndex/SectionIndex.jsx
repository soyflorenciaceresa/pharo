import { Icon } from '../../icons/icons.jsx';
import styles from './SectionIndex.module.css';

// Sin frame de Figma. Índice de secciones de un formulario largo: una fila fija
// (queda pegada debajo del Page header) con un botón por sección que salta a ella
// y muestra su estado — `complete` (check), `pending` (círculo vacío) o `error`.
// Da orientación y progreso sin esconder secciones (alternativa liviana al
// wizard). Cada sección debe tener un elemento con `id` igual al de `sections`.
export default function SectionIndex({ sections = [], 'aria-label': ariaLabel = 'Secciones del formulario' }) {
  function go(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  const done = sections.filter((s) => s.status === 'complete').length;

  return (
    <nav className={styles.root} aria-label={ariaLabel}>
      <ul className={styles.list}>
        {sections.map((s) => (
          <li key={s.id}>
            <button type="button" className={styles.item} data-status={s.status} onClick={() => go(s.id)}>
              <span className={styles.status} aria-hidden="true">
                {s.status === 'complete' && <Icon name="icon-check2" size={12} />}
              </span>
              <span>{s.label}</span>
              <span className={styles.srOnly}>
                {s.status === 'complete' ? ' (completa)' : s.status === 'error' ? ' (con errores)' : ' (pendiente)'}
              </span>
            </button>
          </li>
        ))}
      </ul>
      <span className={styles.count}>{done} de {sections.length} completas</span>
    </nav>
  );
}
