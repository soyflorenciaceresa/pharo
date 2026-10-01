import { useId, useRef, useState } from 'react';
import { Icon } from '../../icons/icons.jsx';
import styles from './Buscador.module.css';

function cx(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Buscador({
  placeholder = '¿Qué necesitás hacer?',
  onSearch,
  className,
}) {
  const [value, setValue] = useState('');
  const inputRef = useRef(null);
  const inputId = useId();

  function handleSubmit(e) {
    e.preventDefault();
    const query = value.trim();
    if (!query) return;
    if (onSearch) onSearch(query);
    else console.log('Buscador: abrir chat de IA con la consulta', query);
  }

  return (
    <form
      role="search"
      className={cx(styles.root, className)}
      onSubmit={handleSubmit}
      onClick={() => inputRef.current?.focus()}
    >
      <Icon name="bi-search" size={16} className={styles.icon} />
      <input
        id={inputId}
        ref={inputRef}
        type="text"
        className={styles.input}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
      />
    </form>
  );
}
