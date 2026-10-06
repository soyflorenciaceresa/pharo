import { useEffect } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar.jsx';
import TopBar from '../../components/TopBar/TopBar.jsx';
import { NO_ACCESS_COMPANY_IDS } from '../../config/companyAccess.js';
import { useSidebarPinned } from '../../context/SidebarPinnedContext.jsx';
import { buildModuleFaviconHref } from '../../utils/moduleFavicon.js';
import styles from './LayoutBase.module.css';

// `LayoutBase` es el único punto por el que pasa CUALQUIER pantalla del kit
// para renderizar el `Sidebar` — por eso la persistencia del pin (ver
// SidebarPinnedContext) y el favicon por módulo (ver moduleFavicon.js)
// viven acá en vez de en cada pantalla: ninguna de las ~12 pantallas
// necesita cambiar nada para heredar ninguno de los dos comportamientos.
export default function LayoutBase({ sidebarProps, onSearch, searchPlaceholder, fullBleed = false, children }) {
  const { pinned, setPinned } = useSidebarPinned();

  function handleSidebarToggle(state) {
    setPinned(state.pinned);
    sidebarProps?.onToggle?.(state);
  }

  // El favicon de la pestaña es el isotipo del módulo actual (mismo
  // ícono+accent que el badge de marca del Sidebar) — cobra sentido ahora
  // que cada módulo abre en su propia pestaña nueva desde Main (ver
  // `CardModule`), así cada una se distingue en la barra de pestañas.
  useEffect(() => {
    const link = document.getElementById('app-favicon');
    if (link) link.href = buildModuleFaviconHref(sidebarProps?.brandIcon, sidebarProps?.brandAccent);
  }, [sidebarProps?.brandIcon, sidebarProps?.brandAccent]);

  // Mismo criterio que el favicon: el título de la pestaña es el nombre del
  // módulo actual (`brandLabel`, el mismo texto del logotipo del Sidebar —
  // "Pharo" en Main, "Ports" en Operaciones, etc.), no el nombre fijo del
  // proyecto — así cada pestaña se distingue también por su título, no solo
  // por el ícono. `index.html` mantiene "Pharo Prototyping Kit" como
  // fallback estático (se ve un instante antes de que React monte).
  useEffect(() => {
    if (sidebarProps?.brandLabel) document.title = sidebarProps.brandLabel;
  }, [sidebarProps?.brandLabel]);

  return (
    <div className={styles.root}>
      <Sidebar {...sidebarProps} noAccessCompanyIds={NO_ACCESS_COMPANY_IDS} defaultPinned={pinned} onToggle={handleSidebarToggle} />
      <div className={styles.main}>
        <TopBar onSearch={onSearch} searchPlaceholder={searchPlaceholder} />
        <div className={fullBleed ? styles.contentFullBleed : styles.content}>{children}</div>
      </div>
    </div>
  );
}
