import LayoutBase from '../LayoutBase/LayoutBase.jsx';
import FormContainer from '../../components/FormContainer/FormContainer.jsx';
import ButtonPrimary from '../../components/ButtonPrimary/ButtonPrimary.jsx';
import ButtonSecondary from '../../components/ButtonSecondary/ButtonSecondary.jsx';
import { Icon } from '../../icons/icons.jsx';
import styles from './LayoutMaestroBasico.module.css';

export default function LayoutMaestroBasico({
  sidebar,
  activeHref,
  onNavigate,
  onCompanyChange,
  onLogout,
  onToggle,
  breadcrumb = [],
  title,
  onSave,
  saveLabel = 'Guardar',
  onCancel,
  cancelLabel = 'Cancelar',
  formIcon,
  formTitle,
  children,
}) {
  return (
    <LayoutBase sidebarProps={{ ...sidebar, defaultActiveHref: activeHref, onNavigate, onCompanyChange, onLogout, onToggle }}>
      <div className={styles.root}>
        <div className={styles.header}>
          <div className={styles.titleCol}>
            {breadcrumb.length > 0 && (
              <div className={styles.breadcrumb}>
                {breadcrumb.map((item, i) => (
                  <span key={item.label} className={styles.breadcrumbItem}>
                    {i > 0 && (
                      <span className={styles.breadcrumbChevron}>
                        <Icon name="bi-chevron-right" size={16} />
                      </span>
                    )}
                    {item.label}
                  </span>
                ))}
              </div>
            )}
            <h1 className={styles.title}>{title}</h1>
          </div>
          <div className={styles.actionsRow}>
            {onSave && <ButtonPrimary label={saveLabel} icon="leading" iconName="icon-check2" onClick={onSave} />}
            {onCancel && <ButtonSecondary label={cancelLabel} icon="leading" iconName="icon-close" onClick={onCancel} />}
          </div>
        </div>

        <FormContainer icon={formIcon} title={formTitle}>
          {children}
        </FormContainer>
      </div>
    </LayoutBase>
  );
}
