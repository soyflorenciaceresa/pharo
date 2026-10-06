import { useCallback, useEffect, useRef, useState } from 'react';
import { Icon } from '../../icons/icons.jsx';
import styles from './HorizontalScroller.module.css';

// Fila de ítems de ancho fijo con scroll horizontal (referencia: carrusel de
// categorías de Behance). Si los ítems no entran en el ancho disponible, la
// fila se desplaza con scroll táctil/trackpad/rueda horizontal y aparecen
// botones circulares en los bordes para avanzar/retroceder. Sin overflow no
// se muestra ningún botón y los ítems conservan su ancho fijo (no se estiran).
// Cada hijo directo es un ítem; `itemWidth` (px) fija el ancho de todos.
export default function HorizontalScroller({ itemWidth = 274, 'aria-label': ariaLabel, children }) {
  const trackRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const update = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 1);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return undefined;
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [update, children]);

  function scrollByPage(direction) {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: 'smooth' });
  }

  return (
    <div className={styles.root}>
      {canScrollLeft && (
        <button type="button" className={`${styles.arrow} ${styles.arrowLeft}`} onClick={() => scrollByPage(-1)} aria-label="Desplazar a la izquierda">
          <Icon name="bi-chevron-left" size={16} />
        </button>
      )}
      <div
        ref={trackRef}
        className={styles.track}
        style={{ '--scroller-item-width': `${itemWidth}px` }}
        onScroll={update}
        role="region"
        aria-label={ariaLabel}
        tabIndex={0}
      >
        {children}
      </div>
      {canScrollRight && (
        <button type="button" className={`${styles.arrow} ${styles.arrowRight}`} onClick={() => scrollByPage(1)} aria-label="Desplazar a la derecha">
          <Icon name="bi-chevron-right" size={16} />
        </button>
      )}
    </div>
  );
}
