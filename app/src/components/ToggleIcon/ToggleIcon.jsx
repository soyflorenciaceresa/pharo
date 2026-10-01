import { Icon } from '../../icons/icons.jsx';
import styles from './ToggleIcon.module.css';

// Figma: component set `Toggle Icon` (657:39, página Toggle Icon) — State=Inactive
// / State=Active. Spec: `Toggle Icon - Spec` (660:2). Handoff: `Toggle Icon -
// Handoff Dev` (663:5). Antes se llamaba FavoriteButton; se renombró para
// coincidir con Figma (Pregunta abierta #1 del handoff).
//
// Controlado (`favorite`/`onToggle`, no semi-controlado): quién marca/desmarca
// favorito vive en App.jsx (la Home de cada módulo necesita leer el mismo estado
// para armar su "Acceso rápido", ver utils/favorites.js), así que este
// componente no puede ser dueño de su propio estado interno.
//
// Accesibilidad (handoff, sección 06): patrón APG "toggle button" — el estado
// lo comunica `aria-pressed`, así que la etiqueta es FIJA ("Favorito"), no cambia
// entre "Agregar"/"Quitar" (combinar ambas hacía que el lector anunciara una
// acción y un estado a la vez). Se puede pisar con la prop `aria-label`.
// ⚠️ Decisión pendiente de validar con el equipo (Pregunta abierta #4).
export default function ToggleIcon({ favorite = false, onToggle, ...rest }) {
  return (
    <button
      type="button"
      aria-label="Favorito"
      {...rest}
      className={styles.button}
      onClick={onToggle}
      aria-pressed={favorite}
    >
      <Icon name={favorite ? 'bi-star-fill' : 'bi-star'} size={20} aria-hidden="true" />
    </button>
  );
}
