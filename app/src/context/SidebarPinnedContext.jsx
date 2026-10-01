import { createContext, useContext, useState } from 'react';

// El `Sidebar` maneja `pinned`/`expanded` con estado interno propio
// (semi-controlado, mismo criterio que el resto del kit) — pero el router
// casero de `App.jsx` remonta la pantalla completa (incluido el `Sidebar`,
// vía `LayoutBase`) en cada navegación, así que ese estado interno se
// perdía siempre al cambiar de página. Este Context vive en `App.jsx`, que
// nunca se remonta, y `LayoutBase` lo consume para sembrar `defaultPinned`
// en cada `Sidebar` nuevo y guardar el valor apenas cambia — así ninguna
// pantalla necesita saber que esto existe ni pasar props extra.
const SidebarPinnedContext = createContext({ pinned: false, setPinned: () => {} });

export function SidebarPinnedProvider({ children }) {
  const [pinned, setPinned] = useState(false);
  return <SidebarPinnedContext.Provider value={{ pinned, setPinned }}>{children}</SidebarPinnedContext.Provider>;
}

export function useSidebarPinned() {
  return useContext(SidebarPinnedContext);
}
