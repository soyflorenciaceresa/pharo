import Button from '../Button/Button.jsx';
import styles from './ActionGroup.module.css';

// Figma: component set `Action Group` (669:189, página Action Group) —
// `Buttons=2..5`. Spec: `Action Group - Spec` (672:16). Handoff: `Action Group -
// Handoff Dev` (676:50). Molécula compuesta por `Button`.
//
// Regla básica: SIEMPRE un solo botón primario (`Solid`) a la izquierda, y de 1
// a 4 secundarios (`Outline`) — de 2 a 5 botones en total. La API (opción A del
// handoff, Pregunta abierta #1) hace imposible romperla: el primario es una prop
// aparte (`primary`) y los secundarios una lista (`secondary`). El `variant` de
// cada botón lo fija la posición, nunca se pasa desde afuera.
//
// Cada acción acepta las mismas props que `Button` (onClick, disabled, type,
// href, iconStart, iconEnd, aria-*…) salvo `variant`; `label` va como children.

const MAX_SECONDARY = 4;

function warn(message) {
  if (import.meta.env.DEV) console.warn(`[ActionGroup] ${message}`);
}

function ActionButton({ action, variant }) {
  // eslint-disable-next-line no-unused-vars
  const { label, variant: _ignored, ...buttonProps } = action;
  return (
    <Button variant={variant} {...buttonProps}>
      {label}
    </Button>
  );
}

export default function ActionGroup({ primary, secondary = [], className, ...rest }) {
  if (!primary) {
    warn('Falta `primary`: el grupo siempre lleva un botón primario. No se renderiza nada.');
    return null;
  }

  if (secondary.length === 0) {
    warn('`secondary` está vacío: con una sola acción usar `Button` suelto (el grupo es de 2 a 5 botones).');
  } else if (secondary.length > MAX_SECONDARY) {
    warn(`\`secondary\` tiene ${secondary.length} acciones; el máximo es ${MAX_SECONDARY}. Se muestran las primeras ${MAX_SECONDARY}.`);
  }

  const visibleSecondary = secondary.slice(0, MAX_SECONDARY);

  return (
    <div role="group" className={[styles.root, className].filter(Boolean).join(' ')} {...rest}>
      <ActionButton action={primary} variant="solid" />
      {visibleSecondary.map((action, i) => (
        <ActionButton key={i} action={action} variant="outline" />
      ))}
    </div>
  );
}
