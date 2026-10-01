import { useEffect, useState } from 'react';
import { Icon } from '../../icons/icons.jsx';
import Button from '../Button/Button.jsx';
import styles from './TourPopup.module.css';

// Popup genérico de "tour"/anuncio multi-slide — no sabe nada de Pharo, de
// buscadores ni de ningún feature puntual, así que sirve para cualquier
// anuncio de novedades en cualquier módulo (no solo el Product Tour de Main).
// `slides` es un array libre de { title, description, icon, accent } — el
// contenido real (títulos/descripciones/qué feature ilustra cada slide) lo
// decide quien lo usa (ver config/productTour.js).
export default function TourPopup({
  open,
  slides = [],
  onClose,
  nextLabel = 'Siguiente',
  finishLabel = 'Comenzar',
  previousLabel = 'Anterior',
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (open) setIndex(0);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e) {
      if (e.key === 'Escape') onClose?.();
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open || slides.length === 0) return null;

  const isFirst = index === 0;
  const isLast = index === slides.length - 1;
  const slide = slides[index];

  function handleNext() {
    if (isLast) {
      onClose?.();
    } else {
      setIndex((i) => Math.min(i + 1, slides.length - 1));
    }
  }

  function handlePrevious() {
    setIndex((i) => Math.max(i - 1, 0));
  }

  function handleOverlayClick(e) {
    if (e.target === e.currentTarget) onClose?.();
  }

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.card} role="dialog" aria-modal="true" aria-label={slide.title}>
        <button type="button" className={styles.closeBtn} onClick={() => onClose?.()} aria-label="Cerrar">
          <Icon name="icon-close" size={16} />
        </button>

        <div className={styles.header}>
          <h2 className={styles.title}>{slide.title}</h2>
          {slide.description && <p className={styles.description}>{slide.description}</p>}
        </div>

        <div className={styles.media}>
          <span className={styles.mediaBadge} data-accent={slide.accent ?? 'blue'}>
            <Icon name={slide.icon ?? 'app-window'} size={36} />
          </span>
        </div>

        <div className={styles.dots}>
          {slides.map((s, i) => (
            <button
              key={s.title}
              type="button"
              className={styles.dot}
              data-active={i === index}
              aria-label={`Ir al paso ${i + 1}`}
              aria-current={i === index}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>

        <div className={styles.divider} />

        <div className={styles.footer}>
          <Button key={`prev-${index}`} variant="outline" onClick={handlePrevious} disabled={isFirst}>{previousLabel}</Button>
          <Button key={`next-${index}`} variant="solid" onClick={handleNext}>{isLast ? finishLabel : nextLabel}</Button>
        </div>
      </div>
    </div>
  );
}
