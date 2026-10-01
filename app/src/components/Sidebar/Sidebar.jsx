import { Fragment, useEffect, useRef, useState } from 'react';
import { Icon } from '../../icons/icons.jsx';
import styles from './Sidebar.module.css';

function initialsOf(name) {
  return (name || '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');
}

function cx(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Sidebar({
  brandLabel = '',
  brandIcon = 'bi-cart',
  brandAccent = 'blue',
  homeHref = '/',
  groups = [],
  companies = [],
  defaultActiveCompanyId,
  onCompanyChange,
  user = {},
  defaultActiveHref,
  onNavigate,
  onLogout,
  onToggle,
  defaultPinned = false,
}) {
  const [expanded, setExpanded] = useState(defaultPinned);
  const [pinned, setPinned] = useState(defaultPinned);
  const [openGroup, setOpenGroup] = useState(0);
  const [companyOpen, setCompanyOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [activeCompanyId, setActiveCompanyId] = useState(defaultActiveCompanyId ?? companies[0]?.id ?? null);
  const [activeHref, setActiveHref] = useState(defaultActiveHref ?? null);

  const companyRef = useRef(null);
  const userRef = useRef(null);

  useEffect(() => {
    function onDocClick(e) {
      if (companyOpen && companyRef.current && !companyRef.current.contains(e.target)) setCompanyOpen(false);
      if (userOpen && userRef.current && !userRef.current.contains(e.target)) setUserOpen(false);
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [companyOpen, userOpen]);

  const activeCompany = companies.find((c) => c.id === activeCompanyId) || companies[0];
  const userInitials = initialsOf(user.name);

  const expand = () => setExpanded(true);
  const collapse = () => {
    if (!pinned) setExpanded(false);
  };

  const togglePin = () => {
    const next = !pinned;
    setPinned(next);
    const nextExpanded = next ? true : expanded;
    setExpanded(nextExpanded);
    onToggle?.({ expanded: nextExpanded, pinned: next });
  };

  const openCompany = () => {
    setUserOpen(false);
    setCompanyOpen(true);
  };
  const openUser = () => {
    setCompanyOpen(false);
    setUserOpen(true);
  };

  const selectCompany = (company) => {
    setActiveCompanyId(company.id);
    setCompanyOpen(false);
    onCompanyChange?.(company);
  };

  // No actualiza `activeHref` acá de forma optimista — a propósito, para no
  // marcar como "activo" un ítem que todavía no tiene pantalla propia (la
  // mayoría de los ítems de cada sidebar, ver notas en config/sidebars/*.js)
  // cuando `onNavigate` termina siendo un no-op (App.jsx corta la navegación
  // si el href no matchea ninguna ruta real). Si la navegación sí ocurre,
  // cada cambio de ruta remonta la pantalla completa (ver Sidebar/App.jsx en
  // CLAUDE.md) y el `defaultActiveHref` que le pasa la pantalla nueva ya
  // resiembra este estado correctamente — no hace falta adelantarlo acá.
  const selectItem = (item) => {
    onNavigate?.({ href: item.href, label: item.label });
  };

  return (
    <div
      className={cx(styles.sidebar, expanded && styles.expanded, pinned && styles.pinned)}
      onMouseEnter={expand}
      onMouseLeave={collapse}
    >
      <div className={styles.header}>
        <button
          type="button"
          className={styles.brand}
          aria-label="Ir al inicio"
          onClick={() => onNavigate?.({ href: homeHref, label: 'home' })}
        >
          <span className={styles.brandIconBox} data-accent={brandAccent}>
            <Icon name={brandIcon} size={16} />
          </span>
          <span className={styles.brandLabel}>{brandLabel}</span>
        </button>
        <button
          type="button"
          className={styles.pin}
          aria-label="Fijar menú expandido"
          aria-pressed={pinned}
          onClick={togglePin}
        >
          <span className={styles.pinOutline}>
            <Icon name="bi-pin-angle" size={16} />
          </span>
          <span className={styles.pinFilled}>
            <Icon name="bi-pin-fill" size={16} />
          </span>
        </button>
      </div>

      <div className={styles.divider} />

      <div className={cx(styles.companyWrap, companyOpen && styles.open)} ref={companyRef}>
        <button
          type="button"
          className={styles.companyBtn}
          aria-haspopup="true"
          aria-expanded={companyOpen}
          onClick={() => (companyOpen ? setCompanyOpen(false) : openCompany())}
        >
          <span className={styles.companyAvatar}>{activeCompany ? initialsOf(activeCompany.name) : ''}</span>
          <span className={styles.companyLabel}>{activeCompany ? activeCompany.name : ''}</span>
          <span className={styles.companyChevron}>
            <Icon name="bi-chevron-right" size={11} />
          </span>
        </button>
        {companyOpen && (
          <div className={styles.dropdown} role="menu">
            {companies.map((c) => (
              <button
                key={c.id}
                type="button"
                className={styles.dropdownRow}
                role="menuitemradio"
                aria-current={c.id === activeCompany?.id}
                onClick={() => selectCompany(c)}
              >
                {c.name}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className={styles.divider} />

      <div className={styles.scroll}>
        <nav className={styles.nav}>
          {groups.map((group, gi) => (
            <Fragment key={group.label ?? gi}>
              <div className={cx(styles.group, openGroup === gi && styles.open)}>
                <button
                  type="button"
                  className={styles.groupHeader}
                  aria-expanded={openGroup === gi}
                  title={group.label || ''}
                  onClick={() => setOpenGroup(openGroup === gi ? -1 : gi)}
                >
                  <span className={styles.icon}>
                    <Icon name={group.icon || 'bi-archive-fill'} size={16} />
                  </span>
                  <span className={styles.label}>{group.label || ''}</span>
                  <span className={styles.chevron}>
                    <Icon name="bi-chevron-right" size={11} />
                  </span>
                </button>
                <div className={styles.groupBody}>
                  <div>
                    {(group.items || []).map((item) => (
                      <a
                        key={item.href}
                        href={item.href || '#'}
                        className={styles.item}
                        aria-current={item.href === activeHref}
                        title={item.label || ''}
                        onClick={(e) => {
                          e.preventDefault();
                          selectItem(item);
                        }}
                      >
                        <span className={styles.icon}>
                          <Icon name={item.icon || 'bi-box-seam'} size={16} />
                        </span>
                        <span className={styles.label}>{item.label || ''}</span>
                        <span className={styles.ext}>
                          <Icon name="bi-box-arrow-up-right" size={12} />
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
              {gi < groups.length - 1 && <div className={styles.groupDivider} />}
            </Fragment>
          ))}
        </nav>
      </div>

      <div className={styles.divider} />

      <div className={cx(styles.userWrap, userOpen && styles.open)} ref={userRef}>
        {userOpen && (
          <div className={styles.userDropdown} role="menu">
            <div className={styles.userInfoRow}>
              <span className={styles.userInfoAvatar}>{userInitials}</span>
              <span className={styles.userInfoCol}>
                <span className={styles.userInfoName}>{user.name || ''}</span>
                <span className={styles.userInfoEmail}>{user.email || ''}</span>
              </span>
            </div>
            <div className={styles.divider} />
            <div className={styles.userRow}>
              <span className={styles.icon}>
                <Icon name="bi-person-badge" size={14} />
              </span>
              {user.role || ''}
            </div>
            <div className={styles.divider} />
            <button
              type="button"
              className={cx(styles.userRow, styles.isAction, styles.danger)}
              onClick={() => {
                setUserOpen(false);
                onLogout?.();
              }}
            >
              <span className={styles.icon}>
                <Icon name="bi-box-arrow-right" size={14} />
              </span>
              Cerrar sesión
            </button>
          </div>
        )}
        <button
          type="button"
          className={styles.userBtn}
          aria-haspopup="true"
          aria-expanded={userOpen}
          onClick={() => (userOpen ? setUserOpen(false) : openUser())}
        >
          <span className={styles.userAvatar}>{userInitials}</span>
          <span className={styles.userTextcol}>
            <span className={styles.userName}>{user.name || ''}</span>
            <span className={styles.userRole}>{user.role || ''}</span>
          </span>
          <span className={styles.userChevron}>
            <Icon name="bi-chevron-right" size={11} />
          </span>
        </button>
      </div>
    </div>
  );
}
