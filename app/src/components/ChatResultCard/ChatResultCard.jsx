import { Icon } from '../../icons/icons.jsx';
import styles from './ChatResultCard.module.css';

// Card de resultado estructurado que un mensaje del asistente puede incrustar
// (children de ChatMessage) — ej. datos de un cliente, un resumen de cuenta,
// una lista de pedidos. `rows` es un array libre de { label, value }, no está
// atado a ningún dominio puntual, así cualquier módulo puede armar su propia
// respuesta mock con esta misma card.
export default function ChatResultCard({ title, rows = [], actions = [] }) {
  return (
    <div className={styles.card}>
      {title && <div className={styles.title}>{title}</div>}
      {rows.length > 0 && (
        <dl className={styles.rows}>
          {rows.map((row) => (
            <div key={row.label} className={styles.row}>
              <dt className={styles.label}>{row.label}</dt>
              <dd className={styles.value}>{row.value}</dd>
            </div>
          ))}
        </dl>
      )}
      {actions.length > 0 && (
        <div className={styles.actions}>
          {actions.map((action) => (
            <button key={action.label} type="button" className={styles.actionBtn} onClick={action.onClick}>
              {action.icon && <Icon name={action.icon} size={14} />}
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
