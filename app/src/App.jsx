import { useEffect, useState } from 'react';
import Home from './modules/Main/Home/Home.jsx';
import OperacionesHome from './modules/Operaciones/Home/Home.jsx';
import Buque from './modules/Operaciones/Buque/Buque.jsx';
import BuqueFormulario from './modules/Operaciones/Buque/BuqueFormulario.jsx';

// Router mínimo basado en estado — el kit no tiene react-router. Cada pantalla
// ruteada recibe `onNavigate` y decide sola su propio `activeHref` (ver
// LayoutHomeModule/LayoutMaestroDataGrid/LayoutMaestroBasico). Usa la History
// API real (pushState/popstate) para que la URL del navegador quede
// sincronizada y funcione tanto la navegación por sidebar como una carga
// directa de la URL.
//
// `pattern` soporta segmentos dinámicos `:id` (ver matchRoute) — necesario
// para /buques/:id/ver y /buques/:id/editar, que reusan la misma pantalla
// (BuqueFormulario) con distinto `mode`. `props` son props fijas propias de
// esa ruta (acá, el modo del formulario) que se le suman a las comunes.
//
// '/operaciones' es la home del módulo Operaciones — la pantalla que se
// muestra al "abrir" el módulo (distinta de sus maestros, ej. '/buques').
// '/buques/nuevo', '/buques/:id/ver' y '/buques/:id/editar' no tienen ítem
// propio en el sidebar — se llega a ellas desde botones/acciones de /buques.
const ROUTES = [
  { pattern: '/', Component: Home },
  { pattern: '/operaciones', Component: OperacionesHome },
  { pattern: '/buques', Component: Buque },
  { pattern: '/buques/nuevo', Component: BuqueFormulario, props: { mode: 'create' } },
  { pattern: '/buques/:id/ver', Component: BuqueFormulario, props: { mode: 'view' } },
  { pattern: '/buques/:id/editar', Component: BuqueFormulario, props: { mode: 'edit' } },
];

// Ejemplo — reemplazar por el catálogo real de buques. Vive acá (no en
// Buque.jsx) porque tanto la grilla (/buques) como el alta/edición
// (/buques/nuevo, /buques/:id/editar) necesitan leer/escribir el mismo set —
// no hay backend todavía.
const INITIAL_BUQUES = [
  { id: 1, codigo: 'BQ-001', denominacion: 'Estrella del Sur', tipo: 'Portacontenedores', estado: { label: 'Activo', tone: 'success' } },
  { id: 2, codigo: 'BQ-002', denominacion: 'Puerto Norte I', tipo: 'Carguero', estado: { label: 'Activo', tone: 'success' } },
  { id: 3, codigo: 'BQ-003', denominacion: 'Andina Cargo', tipo: 'Carguero', estado: { label: 'Inactivo', tone: 'neutral' } },
  { id: 4, codigo: 'BQ-004', denominacion: 'Río de la Plata', tipo: 'Remolcador', estado: { label: 'Activo', tone: 'success' } },
  { id: 5, codigo: 'BQ-005', denominacion: 'Cruz del Atlántico', tipo: 'Petrolero', estado: { label: 'Inactivo', tone: 'neutral' } },
];

// Matchea `path` contra un `pattern` con segmentos fijos o `:param`. Devuelve
// el objeto de params si matchea (vacío si el pattern no tiene ninguno), o
// null si no matchea — misma cantidad de segmentos y cada segmento fijo debe
// coincidir exacto.
function matchRoute(pattern, path) {
  const patternParts = pattern.split('/').filter(Boolean);
  const pathParts = path.split('/').filter(Boolean);
  if (patternParts.length !== pathParts.length) return null;

  const params = {};
  for (let i = 0; i < patternParts.length; i++) {
    const part = patternParts[i];
    if (part.startsWith(':')) {
      params[part.slice(1)] = decodeURIComponent(pathParts[i]);
    } else if (part !== pathParts[i]) {
      return null;
    }
  }
  return params;
}

function resolveRoute(path) {
  for (const route of ROUTES) {
    const params = matchRoute(route.pattern, path);
    if (params) return { Component: route.Component, params, extraProps: route.props ?? {} };
  }
  return { Component: Home, params: {}, extraProps: {} };
}

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
  const [buques, setBuques] = useState(INITIAL_BUQUES);
  const { Component: Screen, params, extraProps } = resolveRoute(path);

  function addBuque(buque) {
    setBuques((prev) => [...prev, buque]);
    navigate('/buques');
  }

  function updateBuque(buque) {
    setBuques((prev) => prev.map((b) => (b.id === buque.id ? buque : b)));
    navigate('/buques');
  }

  return (
    <Screen
      onNavigate={({ href }) => navigate(href)}
      rows={buques}
      onCreate={addBuque}
      onUpdate={updateBuque}
      params={params}
      {...extraProps}
    />
  );
}
