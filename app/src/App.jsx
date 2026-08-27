import { useEffect, useState } from 'react';
import Home from './modules/Main/Home/Home.jsx';
import OperacionesHome from './modules/Operaciones/Home/Home.jsx';
import Buque from './modules/Operaciones/Buque/Buque.jsx';

// Router mínimo basado en estado — el kit no tiene react-router. Cada pantalla
// ruteada recibe `onNavigate` y decide sola su propio `activeHref` (ver
// LayoutHomeModule/LayoutMaestroDataGrid). Usa la History API real
// (pushState/popstate) para que la URL del navegador quede sincronizada y
// funcione tanto la navegación por sidebar como una carga directa de la URL.
//
// '/operaciones' es la home del módulo Operaciones — la pantalla que se
// muestra al "abrir" el módulo (distinta de sus maestros, ej. '/buques').
const ROUTES = {
  '/': Home,
  '/operaciones': OperacionesHome,
  '/buques': Buque,
};

function useRoute() {
  const [path, setPath] = useState(() => window.location.pathname || '/');

  useEffect(() => {
    const onPopState = () => setPath(window.location.pathname || '/');
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  function navigate(href) {
    if (href !== window.location.pathname) {
      window.history.pushState({}, '', href);
    }
    setPath(href);
  }

  return [path, navigate];
}

export default function App() {
  const [path, navigate] = useRoute();
  const Screen = ROUTES[path] ?? Home;

  return <Screen onNavigate={({ href }) => navigate(href)} />;
}
