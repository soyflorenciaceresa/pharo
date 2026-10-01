import { useEffect } from 'react';
import { Icon } from '../../icons/icons.jsx';
import styles from './Modal.module.css';

// Sin frame de Figma — no existía un popup genérico en el kit (`TourPopup` es
// específico de anuncios multi-slide, con alto fijo y dots). Este es un
// diálogo simple, de una sola pantalla, para acciones puntuales dentro de un
// formulario (ej. "Agregar concesionario" en PerfilFormulario) — mismo
// mecanismo de overlay/cierre que `TourPopup` (click afuera, Escape, botón
// X), pero sin slides: `children` es el contenido, sin restricciones (mismo
// criterio que `FormContainer`), y `footer` son los botones de acción.
export default function Modal({ open, title, onClose, children, footer }) {
  useEffect(() => {
    if (!open) return;
    function onKeyDown(e) {
      if (e.key === 'Escape') onClose?.();
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  function handleOverlayClick(e) {
    if (e.target === e.currentTarget) onClose?.();
  }

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.card} role="dialog" aria-modal="true" aria-label={title}>
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          <button type="button" className={styles.closeBtn} onClick={() => onClose?.()} aria-label="Cerrar">
            <Icon name="icon-close" size={16} />
          </button>
        </div>
        <div className={styles.divider} />
        <div className={styles.content}>{children}</div>
        {footer && (
          <>
            <div className={styles.divider} />
            <div className={styles.footer}>{footer}</div>
          </>
        )}
      </div>
    </div>
  );
}
