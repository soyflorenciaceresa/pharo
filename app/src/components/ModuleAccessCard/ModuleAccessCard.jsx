import { Icon } from '../../icons/icons.jsx';
import Checkbox from '../Checkbox/Checkbox.jsx';
import styles from './ModuleAccessCard.module.css';

// Mismo shell visual que CardModule (icon badge con acento + título +
// descripción) pero como contenedor plano, no un <button>/<a> — acá el click
// no navega a ningún lado, la interacción es el Checkbox (reusado tal cual)
// para habilitar/deshabilitar el módulo. Un checkbox dentro de un <button>
// sería inválido/confuso a nivel accesibilidad, por eso no se reusa
// CardModule directo pese a compartir todo el resto del look.
export default function ModuleAccessCard({ icon = 'app-window', accent = 'blue', title, description, checked = false, onChange }) {
  return (
    <div className={styles.card}>
      <div className={styles.top}>
        <span className={styles.iconBadge} data-accent={accent}>
          <Icon name={icon} size={16} />
        </span>
        <Checkbox checked={checked} onChange={onChange} aria-label={`Habilitar ${title}`} />
      </div>
      <span className={styles.textCol}>
        <span className={styles.title}>{title}</span>
        <span className={styles.description}>{description}</span>
      </span>
    </div>
  );
}
