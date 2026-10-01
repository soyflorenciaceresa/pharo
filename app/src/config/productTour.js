// Contenido del Product Tour que se muestra la primera vez que el usuario
// abre Main (ver modules/Main/Home/Home.jsx) — textos e íconos de relleno
// ("al azar") a pedido, para probar el componente TourPopup antes de tener
// el contenido real de cada feature. `description` es lorem ipsum a
// propósito, recortado para entrar en 2 líneas (TourPopup además lo clampea
// por CSS, así que un texto más largo tampoco rompe el alto fijo del popup).
// Reemplazar título/descripción/icon/accent de cada slide cuando estén
// definidos los features reales a anunciar.
export const PRODUCT_TOUR_SLIDES = [
  {
    title: 'Chatbot con IA integrada',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.',
    icon: 'bi-chat',
    accent: 'indigo',
  },
  {
    title: 'Nuevo menú lateral',
    description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo.',
    icon: 'bi-grid-1x2-fill',
    accent: 'violet',
  },
  {
    title: 'Nuevo diseño de módulos',
    description: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    icon: 'icon-modulos',
    accent: 'green',
  },
  {
    title: 'Accesos directos',
    description: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est.',
    icon: 'bi-box-arrow-up-right',
    accent: 'amber',
  },
];
