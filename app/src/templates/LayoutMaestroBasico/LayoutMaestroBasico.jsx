import LayoutBase from '../LayoutBase/LayoutBase.jsx';
import FormContainer from '../../components/FormContainer/FormContainer.jsx';
import PageHeader from '../../components/PageHeader/PageHeader.jsx';
import styles from './LayoutMaestroBasico.module.css';

function cx(...classes) {
  return classes.filter(Boolean).join(' ');
}

// Dos modos, según si se pasa `formTitle`: con `formTitle` (caso original,
// ej. BuqueFormulario), `children` es el Content de un único FormContainer
// armado acá mismo. Sin `formTitle` (ej. UsuarioFormulario, con más de una
// sección), el template no impone ningún FormContainer — `children` se
// renderiza tal cual, apilado con el mismo gap que ya usa `.root` entre
// header y contenido, y la pantalla arma sus propias secciones
// (FormContainer/Accordion/etc.) como bloques independientes. No rompe el
// caso original: cualquier pantalla que ya pasaba formTitle sigue
// exactamente igual.
export default function LayoutMaestroBasico({
  sidebar,
  activeHref,
  onNavigate,
  onCompanyChange,
  onLogout,
  onToggle,
  onSearch,
  breadcrumb = [],
  title,
  onSave,
  saveLabel = 'Guardar',
  onCancel,
  cancelLabel = 'Cancelar',
  formTitle,
  fullWidth = false,
  children,
}) {
  return (
    <LayoutBase onSearch={onSearch} sidebarProps={{ ...sidebar, defaultActiveHref: activeHref, onNavigate, onCompanyChange, onLogout, onToggle }}>
      <div className={cx(styles.root, fullWidth && styles.rootFullWidth)}>
        {/* Page header type="form": ruta + título + acciones (Guardar primario + Cancelar). */}
        <PageHeader
          type="form"
          title={title}
          breadcrumb={breadcrumb}
          actions={{
            label: 'Acciones del formulario',
            primary: onSave ? { label: saveLabel, iconStart: 'icon-check2', onClick: onSave } : undefined,
            secondary: onCancel ? [{ label: cancelLabel, iconStart: 'icon-close', onClick: onCancel }] : [],
          }}
        />

        {formTitle ? (
          <FormContainer title={formTitle}>
            {children}
          </FormContainer>
        ) : (
          <div className={styles.sections}>{children}</div>
        )}
      </div>
    </LayoutBase>
  );
}
