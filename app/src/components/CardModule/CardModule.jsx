import { Icon } from '../../icons/icons.jsx';
import styles from './CardModule.module.css';

export default function CardModule({ icon = 'app-window', accent = 'blue', title, description, onClick, href }) {
  const Tag = href ? 'a' : 'button';
  return (
    <Tag
      className={styles.card}
      href={href}
      type={href ? undefined : 'button'}
      // Abrir un módulo desde Main siempre en una ventana/pestaña nueva —
      // a pedido. Cada módulo tiene su propio Sidebar (ver
      // config/sidebars/*.js) y ahora también su propio favicon (ver
      // LayoutBase/utils/moduleFavicon.js), así que tiene sentido que viva
      // en su propia pestaña en vez de reemplazar la de Main. `rel`
      // corta el acceso de la pestaña nueva a `window.opener` — buena
      // práctica de seguridad estándar al usar `target="_blank"`.
      target={href ? '_blank' : undefined}
      rel={href ? 'noopener noreferrer' : undefined}
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
