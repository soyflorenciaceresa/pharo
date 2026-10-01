import { useState } from 'react';
import Button from '../Button/Button.jsx';
import TextField from '../TextField/TextField.jsx';
import { Icon } from '../../icons/icons.jsx';
import styles from './ChatConversationList.module.css';

// `conversations` es una lista plana con `group` (ej. 'Hoy'/'Ayer'/'Última
// semana') — el componente arma los grupos preservando el orden de llegada
// (no ordena por fecha real, la pantalla que lo usa ya manda los datos en el
// orden correcto). El buscador filtra por título (case-insensitive) en
// cliente, mismo criterio que el buscador de DataGrid.
export default function ChatConversationList({ conversations = [], activeId, onSelect, onNewChat, newChatLabel = 'Nuevo chat' }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');

  const filtered = query.trim()
    ? conversations.filter((c) => c.title.toLowerCase().includes(query.trim().toLowerCase()))
    : conversations;

  const groups = [];
  for (const conv of filtered) {
    let group = groups.find((g) => g.label === conv.group);
    if (!group) {
      group = { label: conv.group, items: [] };
      groups.push(group);
    }
    group.items.push(conv);
  }

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <h2 className={styles.title}>Conversaciones</h2>
        <button
          type="button"
          className={styles.searchToggle}
          aria-label="Buscar conversación"
          aria-pressed={searchOpen}
          onClick={() => setSearchOpen((o) => !o)}
        >
          <Icon name="bi-search" size={16} />
        </button>
      </div>

      {searchOpen && (
        <div className={styles.searchField}>
          <TextField
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar conversación..."
            autoFocus
          />
        </div>
      )}

      <div className={styles.newChatSlot}>
        <Button variant="solid" iconStart="icon-plus" onClick={onNewChat} className={styles.newChatBtn}>{newChatLabel}</Button>
      </div>

      <nav className={styles.list}>
        {groups.map((group) => (
          <div key={group.label} className={styles.group}>
            <div className={styles.groupLabel}>{group.label}</div>
            {group.items.map((conv) => (
              <button
                key={conv.id}
                type="button"
                className={styles.item}
                data-active={conv.id === activeId}
                onClick={() => onSelect?.(conv.id)}
                title={conv.title}
              >
                {conv.title}
              </button>
            ))}
          </div>
        ))}
        {groups.length === 0 && <p className={styles.empty}>No se encontraron conversaciones.</p>}
      </nav>
    </div>
  );
}
