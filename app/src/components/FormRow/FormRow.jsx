import styles from './FormRow.module.css';

// Fila de campos de una Form Section (Figma: "Fields row"): los hijos se
// reparten el ancho en partes iguales, con 16px entre sí. Una fila típica
// son 3 campos; si hay menos, cada uno mantiene el ancho de 1/3 para que las
// columnas queden alineadas entre filas (`columns`, default 3).
export default function FormRow({ columns = 3, children }) {
  return (
    <div className={styles.row} style={{ '--form-row-columns': columns }}>
      {children}
    </div>
  );
}
