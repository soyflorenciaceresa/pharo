import { useEffect, useRef } from 'react';
import LayoutBase from '../LayoutBase/LayoutBase.jsx';
import ChatConversationList from '../../components/ChatConversationList/ChatConversationList.jsx';
import ChatMessage from '../../components/ChatMessage/ChatMessage.jsx';
import ChatSuggestionCard from '../../components/ChatSuggestionCard/ChatSuggestionCard.jsx';
import ChatInput from '../../components/ChatInput/ChatInput.jsx';
import { Icon } from '../../icons/icons.jsx';
import styles from './LayoutChat.module.css';

// Template genérico del chatbot de IA — cualquier módulo lo arma con su
// propio `sidebar`, sus propias `conversations`/`messages` (mock o reales) y
// su propio `onSendMessage`. No conoce nada de negocio (ni "clientes" ni
// "pedidos"): eso vive en la pantalla que lo usa (ver AsistenteIA), mismo
// criterio que LayoutHomeModule/LayoutMaestroDataGrid/LayoutMaestroBasico.
export default function LayoutChat({
  sidebar,
  activeHref,
  onNavigate,
  onCompanyChange,
  onLogout,
  onToggle,
  onSearch,
  assistantName = 'Pharo IA',
  assistantTag = 'Beta',
  conversations = [],
  activeConversationId,
  onSelectConversation,
  onNewChat,
  messages = [],
  onSendMessage,
  isResponding = false,
  suggestions = [],
  emptyTitle = '¿En qué puedo ayudarte?',
  emptySubtitle = 'Consultá clientes, obtené documentos y ejecutá acciones utilizando lenguaje natural.',
  disclaimer = 'Pharo IA puede cometer errores. Verificá la información importante.',
}) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isResponding]);

  return (
    <LayoutBase
      fullBleed
      onSearch={onSearch}
      sidebarProps={{ ...sidebar, defaultActiveHref: activeHref, onNavigate, onCompanyChange, onLogout, onToggle }}
    >
      <div className={styles.root}>
        <ChatConversationList
          conversations={conversations}
          activeId={activeConversationId}
          onSelect={onSelectConversation}
          onNewChat={onNewChat}
        />

        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <span className={styles.headerIcon}>
              <Icon name="bi-chat" size={16} />
            </span>
            <h1 className={styles.headerTitle}>{assistantName}</h1>
            {assistantTag && <span className={styles.tag}>{assistantTag}</span>}
          </div>

          <div className={styles.body} ref={scrollRef}>
            {messages.length === 0 ? (
              <div className={styles.emptyState}>
                <span className={styles.emptyIcon}>
                  <Icon name="bi-chat" size={28} />
                </span>
                <h2 className={styles.emptyTitle}>{emptyTitle}</h2>
                <p className={styles.emptySubtitle}>{emptySubtitle}</p>
                {suggestions.length > 0 && (
                  <div className={styles.suggestions}>
                    {suggestions.map((s) => (
                      <ChatSuggestionCard key={s.title} {...s} />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className={styles.messages}>
                {messages.map((m) => (
                  <ChatMessage key={m.id} role={m.role} text={m.text} time={m.time} assistantName={assistantName}>
                    {m.content}
                  </ChatMessage>
                ))}
                {isResponding && <ChatMessage role="assistant" text="Escribiendo…" assistantName={assistantName} />}
              </div>
            )}
          </div>

          <div className={styles.footer}>
            <div className={styles.footerInner}>
              <ChatInput onSend={onSendMessage} disabled={isResponding} />
              <p className={styles.disclaimer}>{disclaimer}</p>
            </div>
          </div>
        </div>
      </div>
    </LayoutBase>
  );
}
