import { useEffect, useState } from 'react';
import LayoutBase from '../../../templates/LayoutBase/LayoutBase.jsx';
import ModuleAccessCard from '../../../components/ModuleAccessCard/ModuleAccessCard.jsx';
import Button from '../../../components/Button/Button.jsx';
import { Icon } from '../../../icons/icons.jsx';
import { MAIN_SIDEBAR_PROPS } from '../../../config/sidebars/main.js';
import { ALL_MODULES, DEFAULT_COMPANY_MODULES } from '../../../config/modules.js';
import styles from './Modulos.module.css';

// Pantalla de administración de módulos por empresa — accesible desde el
// sidebar de Main (Administración → Módulos, /admin/modulos). Qué empresa se
// está editando lo decide el selector de empresa del propio Sidebar (mismo
// componente/estado que ya existe, no se agregó un selector nuevo acá) —
// `activeCompanyId` le llega por prop desde App.jsx (mismo estado compartido
// que usa Main/Home para filtrar los módulos habilitados de esa empresa).
export default function Modulos({
  onNavigate,
  onSearch,
  activeCompanyId = 'puerto-norte',
  companyModules,
  onCompanyChange,
  onSaveCompanyModules,
}) {
  const savedEnabled = companyModules?.[activeCompanyId] ?? DEFAULT_COMPANY_MODULES[activeCompanyId] ?? [];
  const [draftEnabled, setDraftEnabled] = useState(() => new Set(savedEnabled));

  // Cambiar de empresa (selector del Sidebar) descarta la edición en curso y
  // arranca de nuevo desde lo guardado para esa empresa — no hay backend que
  // trackee "cambios sin guardar" todavía, mismo criterio simple del resto
  // del kit.
  useEffect(() => {
    setDraftEnabled(new Set(companyModules?.[activeCompanyId] ?? DEFAULT_COMPANY_MODULES[activeCompanyId] ?? []));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCompanyId]);

  function toggleModule(id) {
    setDraftEnabled((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleSave() {
    onSaveCompanyModules?.(activeCompanyId, Array.from(draftEnabled));
  }

  return (
    <LayoutBase
      onSearch={onSearch}
      sidebarProps={{
        ...MAIN_SIDEBAR_PROPS,
        defaultActiveHref: '/admin/modulos',
        defaultActiveCompanyId: activeCompanyId,
        onNavigate: onNavigate ?? ((d) => console.log('navigate', d)),
        onCompanyChange: onCompanyChange ?? ((c) => console.log('company change', c)),
        onLogout: () => console.log('logout'),
        onToggle: (d) => console.log('toggle', d),
      }}
    >
      <div className={styles.root}>
        <div className={styles.header}>
          <div className={styles.titleCol}>
            <div className={styles.breadcrumb}>
              <span>Administración</span>
              <span className={styles.breadcrumbChevron}>
                <Icon name="bi-chevron-right" size={16} />
              </span>
              <span>Módulos</span>
            </div>
            <h1 className={styles.title}>Módulos</h1>
            <p className={styles.subtitle}>Elegí qué módulos están habilitados para la empresa activa — solo estos van a aparecer en el home.</p>
          </div>
          <Button variant="solid" onClick={handleSave}>Guardar</Button>
        </div>

        <div className={styles.grid}>
          {ALL_MODULES.map((m) => (
            <ModuleAccessCard
              key={m.id}
              icon={m.icon}
              accent={m.accent}
              title={m.title}
              description={m.description}
              checked={draftEnabled.has(m.id)}
              onChange={() => toggleModule(m.id)}
            />
          ))}
        </div>
      </div>
    </LayoutBase>
  );
}
