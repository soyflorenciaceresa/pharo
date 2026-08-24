import { useEffect, useRef, useState } from 'react';
import styles from './LanguageSelector.module.css';

const GlobeIcon = () => (
  <svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.3">
    <circle cx="8" cy="8" r="6.5" />
    <ellipse cx="8" cy="8" rx="2.7" ry="6.5" />
    <path d="M1.7 8h12.6M2.6 4.8h10.8M2.6 11.2h10.8" />
  </svg>
);

export default function LanguageSelector({ languages, value, onChange }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    function onDocClick(e) {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  const current = languages.find((l) => l.code === value) || languages[0];

  return (
    <div ref={rootRef} className={styles.root} data-open={open}>
      <button
        type="button"
        className={styles.pill}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <GlobeIcon />
        <span>{current.code}</span>
      </button>

      {open && (
        <ul className={styles.panel} role="listbox">
          {languages.map((lang) => (
            <li key={lang.code}>
              <button
                type="button"
                role="option"
                aria-selected={lang.code === value}
                className={styles.item}
                data-selected={lang.code === value}
                onClick={() => {
                  onChange(lang.code);
                  setOpen(false);
                }}
              >
                {lang.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
