import { useEffect, useRef } from 'react';
import Button from '../Button/Button.jsx';
import ActionGroup from '../ActionGroup/ActionGroup.jsx';
import ToggleIcon from '../ToggleIcon/ToggleIcon.jsx';
import { Icon } from '../../icons/icons.jsx';
import styles from './PageHeader.module.css';

// Figma: component set `Page header` (680:39, página Page header) — `Type=Home`
// / `Type=Maestro` / `Type=Form`. Spec: `Page header - Spec` (682:23). Handoff:
// `Page header - Handoff Dev` (687:105). Organismo compuesto por Breadcrumb,
// Toggle Icon (ToggleIcon) y Action Group (ActionGroup).
//
// API con prop `type` explícita (opción B del handoff, Pregunta abierta #1): el
// tipo coincide 1 a 1 con `Type` de Figma y el componente avisa (solo en dev)
// si se pasa una prop que ese tipo no admite. El nivel del título sale del tipo:
// `home` → <h2> (título de sección), `maestro`/`form` → <h1> (título de pantalla).

const TYPES = {
  home: { level: 2, allowed: ['title', 'subtitle'] },
  maestro: { level: 1, allowed: ['title', 'breadcrumb', 'favorite', 'onToggleFavorite', 'actions'] },
  form: { level: 1, allowed: ['title', 'breadcrumb', 'actions'] },
};

const OPTIONAL = ['subtitle', 'breadcrumb', 'favorite', 'onToggleFavorite', 'actions'];

function warn(message) {
  if (import.meta.env.DEV) console.warn(`[PageHeader] ${message}`);
}

function Breadcrumb({ items }) {
  return (
    <nav aria-label="Ruta de navegación">
      <ol className={styles.breadcrumb}>
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={`${item.label}-${i}`} className={styles.breadcrumbItem}>
              {item.href && !isLast ? (
                <a href={item.href} className={styles.breadcrumbLink}>{item.label}</a>
              ) : (
                <span className={isLast ? styles.breadcrumbCurrent : undefined} aria-current={isLast ? 'page' : undefined}>
                  {item.label}
                </span>
              )}
              {!isLast && (
                <span className={styles.breadcrumbChevron} aria-hidden="true">
                  <Icon name="bi-chevron-right" size={16} />
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

// Acciones: primario + al menos un secundario → ActionGroup. Con una sola acción
// (ej. solo "Volver" en modo view, o solo "Nuevo") el grupo no aplica (es de 2 a
// 5 botones) y va un Button suelto, como antes.
function Actions({ actions }) {
  const { label, primary, secondary = [] } = actions;
  if (!primary && secondary.length === 0) return null;
  if (primary && secondary.length > 0) {
    return <ActionGroup aria-label={label} primary={primary} secondary={secondary} />;
  }
  const loose = primary ? [{ ...primary, variant: 'solid' }] : secondary.map((a) => ({ ...a, variant: 'outline' }));
  return (
    <>
      {loose.map(({ label: text, ...buttonProps }, i) => (
        <Button key={i} {...buttonProps}>{text}</Button>
      ))}
    </>
  );
}

export default function PageHeader({
  type,
  title,
  subtitle,
  breadcrumb = [],
  favorite = false,
  onToggleFavorite,
  actions,
  className,
}) {
  const rowRef = useRef(null);
  // Publica el alto del Page header (fijo) como `--page-header-height`, para que
  // otros elementos fijos (ej. SectionIndex) se peguen justo debajo.
  useEffect(() => {
    const el = rowRef.current;
    if (!el) return undefined;
    const publish = () => document.documentElement.style.setProperty('--page-header-height', `${el.getBoundingClientRect().height}px`);
    publish();
    const observer = new ResizeObserver(publish);
    observer.observe(el);
    return () => observer.disconnect();
  });

  const config = TYPES[type];
  if (!config) {
    warn(`\`type\` inválido ("${type}"): usar 'home', 'maestro' o 'form'. No se renderiza nada.`);
    return null;
  }
  if (!title) warn('Falta `title`: el título es obligatorio.');

  const provided = { subtitle, breadcrumb: breadcrumb.length > 0 ? breadcrumb : undefined, favorite: favorite || undefined, onToggleFavorite, actions };
  for (const key of OPTIONAL) {
    if (provided[key] !== undefined && !config.allowed.includes(key)) {
      warn(`\`${key}\` no aplica a type="${type}" y se ignora.`);
    }
  }

  const Heading = `h${config.level}`;
  const hasBreadcrumb = config.allowed.includes('breadcrumb') && breadcrumb.length > 0;
  const hasFavorite = config.allowed.includes('onToggleFavorite') && onToggleFavorite;
  const hasActions = config.allowed.includes('actions') && actions && (actions.primary || (actions.secondary && actions.secondary.length > 0));

  if (type === 'home') {
    return (
      <div className={[styles.home, className].filter(Boolean).join(' ')}>
        <Heading className={styles.title}>{title}</Heading>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>
    );
  }

  return (
    <div ref={rowRef} className={[styles.row, className].filter(Boolean).join(' ')}>
      <div className={styles.titleCol}>
        {hasBreadcrumb && <Breadcrumb items={breadcrumb} />}
        <div className={styles.titleRow}>
          <Heading className={styles.title}>{title}</Heading>
          {hasFavorite && <ToggleIcon favorite={favorite} onToggle={onToggleFavorite} />}
        </div>
      </div>
      {hasActions && (
        <div className={styles.actions}>
          <Actions actions={actions} />
        </div>
      )}
    </div>
  );
}
