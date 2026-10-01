import { Icon } from '../../icons/icons.jsx';
import styles from './ChatMessage.module.css';

function cx(...classes) {
  return classes.filter(Boolean).join(' ');
}

// `children` es el slot de contenido estructurado (ej. ChatResultCard) que un
// mensaje del asistente puede incrustar debajo del texto — sin restricción,
// mismo criterio que FormContainer/Accordion.
export default function ChatMessage({ role = 'assistant', text, time, assistantName = 'Pharo IA', children }) {
  const isUser = role === 'user';

  if (isUser) {
    return (
      <div className={styles.rowUser}>
        <div className={styles.bubbleUser}>
          <p className={styles.textUser}>{text}</p>
        </div>
        {time && <span className={styles.timeUser}>{time}</span>}
      </div>
    );
  }

  return (
    <div className={styles.rowAssistant}>
      <span className={styles.avatar}>
        <Icon name="bi-chat" size={14} />
      </span>
      <div className={styles.assistantCol}>
        <div className={cx(styles.bubbleAssistant, children && styles.bubbleAssistantWithContent)}>
          {text && <p className={styles.textAssistant}>{text}</p>}
          {children}
        </div>
        {time && (
          <span className={styles.timeAssistant}>
            {assistantName} · {time}
          </span>
        )}
      </div>
    </div>
  );
}
