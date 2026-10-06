import { Icon } from '../../icons/icons.jsx';
import styles from './Message.module.css';

// Card de mensaje de contexto (Figma: página *Message*, component set `Message`,
// 783:22). Basado en `CardQuickAccess` — badge de ícono + título + texto — pero
// NO es interactiva: es un `<div>` sin hover, foco ni click, para dar contexto
// o avisos informativos dentro de una pantalla. Fondo `color/info/subtle`, badge
// blanco y título 14px/600. Sin variante Hover (a pedido, por ahora).
export default function Message({ icon = 'app-window', title, message, className }) {
  return (
    <div className={[styles.card, className].filter(Boolean).join(' ')}>
      <span className={styles.iconBadge}>
        <Icon name={icon} size={16} />
      </span>
      <span className={styles.textCol}>
        <span className={styles.title}>{title}</span>
        {message && <span className={styles.message}>{message}</span>}
      </span>
    </div>
  );
}
