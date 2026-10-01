import { useState } from 'react';
import Buscador from '../Buscador/Buscador.jsx';
import LanguageSelector from '../LanguageSelector/LanguageSelector.jsx';
import styles from './TopBar.module.css';

const LANGUAGES = [
  { code: 'ES', label: 'Español' },
  { code: 'EN', label: 'English' },
  { code: 'PT', label: 'Português' },
];

export default function TopBar({ onSearch, searchPlaceholder }) {
  const [language, setLanguage] = useState('ES');

  return (
    <header className={styles.root}>
      <Buscador onSearch={onSearch} placeholder={searchPlaceholder} />
      <LanguageSelector languages={LANGUAGES} value={language} onChange={setLanguage} />
    </header>
  );
}
