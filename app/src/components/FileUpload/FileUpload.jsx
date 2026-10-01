import { useId } from 'react';
import { Icon } from '../../icons/icons.jsx';
import styles from './FileUpload.module.css';

function cx(...classes) {
  return classes.filter(Boolean).join(' ');
}

// Sin frame de Figma — no existía un campo de carga de archivos en el kit
// (surgió al armar EmpresaFormulario: logo + certificado AFIP). `<input
// type="file">` real, visualmente oculto (mismo patrón de accesibilidad que
// Checkbox/RowCheckbox: input real posicionado fuera de vista, la caja
// visual es un <label htmlFor> que lo activa) detrás de un botón con el
// mismo box que TextField/Select, para que los tres convivan en una fila sin
// desentonar.
//
// `value` es el **nombre del archivo** (string), no el `File` — el kit no
// tiene backend, así que no hay nada real que subir; se guarda solo el
// nombre para mostrarlo (mismo criterio que el resto de los datos de
// ejemplo del kit). El componente no valida tamaño/tipo — `accept` solo
// filtra qué ofrece el selector nativo del navegador.
export default function FileUpload({ label, value, onChange, accept, disabled = false, id, className }) {
  const generatedId = useId();
  const inputId = id || generatedId;

  return (
    <div className={cx(styles.field, className)}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
      )}
      <div className={styles.control}>
        <input
          id={inputId}
          type="file"
          accept={accept}
          className={styles.input}
          onChange={onChange}
          disabled={disabled}
        />
        <label htmlFor={inputId} className={cx(styles.button, disabled && styles.buttonDisabled)}>
          <Icon name="bi-upload" size={16} />
          <span>Elegir archivo</span>
        </label>
        <span className={styles.fileName}>{value || 'Ningún archivo seleccionado'}</span>
      </div>
    </div>
  );
}
