import styles from './FormRow.module.css';

// Fila de campos de una Form Section (Figma: "Fields row"): los hijos se
// reparten el ancho en partes iguales, con 16px entre sí. Una fila típica
// son 3 campos; si hay menos, cada uno mantiene el ancho de 1/3 para que las
// columnas queden alineadas entre filas (`columns`, default 3).
// Responsive por ancho del PROPIO contenedor (no de la ventana, que no sabe si
// el sidebar está expandido): 3 columnas ≥720px, 2 entre 480 y 720px, 1 debajo.
export default function FormRow({ columns = 3, children }) {
  return (
    <div className={styles.wrap}>
      <div
        className={styles.row}
        style={{ '--form-row-columns': columns, '--form-row-columns-mid': Math.min(columns, 2) }}
      >
        {children}
      </div>
    </div>
  );
}
