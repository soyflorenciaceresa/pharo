import Select from '../Select/Select.jsx';
import TextField from '../TextField/TextField.jsx';
import styles from './SelectWithOther.module.css';

export const OTHER_VALUE = '__otro__';

// Sin frame de Figma. Desplegable (`Select`) de un maestro + opción "Otro": un
// valor distinto al del maestro. Al elegir "Otro" aparece un `TextField` para
// escribir el valor a mano; al elegir cualquier opción del maestro vuelve a
// ocultarse. Reemplaza el patrón anterior de dos cajas (código + denominación) +
// check "Otro". Es la versión con `Select` nativo — pendiente: un selector con
// búsqueda (código o nombre) para catálogos largos.
//
// `value` es el valor del maestro elegido, `OTHER_VALUE` si eligió "Otro", o ''.
// `otherValue` es el texto escrito en "Otro" — se guarda aparte para distinguir
// valores del maestro (con código) de valores escritos a mano (sin código).
export default function SelectWithOther({
  label,
  helperText,
  value,
  onChange,
  otherValue = '',
  onOtherChange,
  options = [],
  otherLabel = 'Otro (escribir manualmente)',
  placeholder,
  error = false,
  disabled = false,
  ...rest
}) {
  const isOther = value === OTHER_VALUE;
  return (
    <div className={styles.root}>
      <Select
        label={label}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        options={[...options, { value: OTHER_VALUE, label: otherLabel }]}
        placeholder={placeholder}
        error={error && !isOther}
        helperText={!isOther ? helperText : undefined}
        disabled={disabled}
        {...rest}
      />
      {isOther && (
        <TextField
          aria-label={`${typeof label === 'string' ? label : 'Valor'} — otro`}
          value={otherValue}
          onChange={(e) => onOtherChange?.(e.target.value)}
          placeholder="Escribí el valor"
          error={error}
          helperText={helperText}
          disabled={disabled}
        />
      )}
    </div>
  );
}
