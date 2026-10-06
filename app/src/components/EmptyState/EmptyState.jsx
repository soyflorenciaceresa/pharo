import { Icon } from '../../icons/icons.jsx';
import styles from './EmptyState.module.css';

// Estado vacío (Figma: página *Empty State*, componente `Empty State`, 788:7):
// se muestra EN LUGAR del contenido de una sección que todavía no tiene datos
// (ej. "Actividad reciente" en una empresa nueva). Card centrada con badge de
// ícono (fondo `color/info/subtle`, trazo índigo), título y texto de apoyo. Para avisos de contexto que conviven
// con el contenido existente, usar `Message`.
export default function EmptyState({
  icon = 'icon-history',
  title = 'Todavía no hay actividad',
  description = 'Cuando empieces a trabajar en Pharo, vas a encontrar acá un resumen de tus últimas acciones.',
  className,
}) {
  return (
    <div className={[styles.card, className].filter(Boolean).join(' ')}>
      <span className={styles.iconBadge}>
        <Icon name={icon} size={20} aria-hidden="true" />
      </span>
      <div className={styles.text}>
        <p className={styles.title}>{title}</p>
        <p className={styles.description}>{description}</p>
      </div>
    </div>
  );
}
