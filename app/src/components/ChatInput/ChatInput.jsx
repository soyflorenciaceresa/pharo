import { useRef, useState } from 'react';
import { Icon } from '../../icons/icons.jsx';
import styles from './ChatInput.module.css';

const MAX_TEXTAREA_HEIGHT = 160;

// `onSend(text, attachments)` se dispara con Enter (sin Shift) o el botón de
// enviar — `attachments` son los File reales elegidos por el picker nativo
// (input file oculto), no un mock. El mic es un toggle visual sin
// transcripción real (no hay integración de voz todavía) — ver nota en
// CLAUDE.md.
export default function ChatInput({ onSend, disabled = false, placeholder = 'Escribí tu consulta... (Enter para enviar, Shift+Enter para nueva línea)' }) {
  const [value, setValue] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [recording, setRecording] = useState(false);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  function resize(el) {
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, MAX_TEXTAREA_HEIGHT)}px`;
  }

  function handleChange(e) {
    setValue(e.target.value);
    resize(e.target);
  }

  function handleSend() {
    const text = value.trim();
    if (!text && attachments.length === 0) return;
    if (disabled) return;
    onSend?.(text, attachments);
    setValue('');
    setAttachments([]);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleFileChange(e) {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) setAttachments((prev) => [...prev, ...files]);
    e.target.value = '';
  }

  function removeAttachment(name) {
    setAttachments((prev) => prev.filter((f) => f.name !== name));
  }

  const canSend = !disabled && (value.trim().length > 0 || attachments.length > 0);

  return (
    <div className={styles.root}>
      {attachments.length > 0 && (
        <div className={styles.attachments}>
          {attachments.map((file) => (
            <span key={file.name} className={styles.chip}>
              <Icon name="bi-paperclip" size={12} />
              {file.name}
              <button
                type="button"
                className={styles.chipRemove}
                onClick={() => removeAttachment(file.name)}
                aria-label={`Quitar ${file.name}`}
              >
                <Icon name="icon-close" size={10} />
              </button>
            </span>
          ))}
        </div>
      )}

      <textarea
        ref={textareaRef}
        className={styles.textarea}
        rows={1}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
      />

      <div className={styles.toolbar}>
        <div className={styles.toolbarLeft}>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            hidden
            onChange={handleFileChange}
          />
          <button
            type="button"
            className={styles.iconBtn}
            onClick={() => fileInputRef.current?.click()}
            aria-label="Adjuntar archivo"
            disabled={disabled}
          >
            <Icon name="bi-paperclip" size={16} />
          </button>
          <button
            type="button"
            className={cx(styles.iconBtn, recording && styles.iconBtnActive)}
            onClick={() => setRecording((r) => !r)}
            aria-pressed={recording}
            aria-label={recording ? 'Detener grabación' : 'Grabar audio'}
            disabled={disabled}
          >
            <Icon name="bi-mic" size={16} />
          </button>
          {recording && <span className={styles.recordingHint}>Escuchando…</span>}
        </div>

        <div className={styles.toolbarRight}>
          <span className={styles.hint}>Shift+Enter para nueva línea</span>
          <button
            type="button"
            className={styles.sendBtn}
            onClick={handleSend}
            disabled={!canSend}
            aria-label="Enviar"
          >
            <Icon name="bi-send" size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

function cx(...classes) {
  return classes.filter(Boolean).join(' ');
}
