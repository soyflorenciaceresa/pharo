// Empresas sin acciones asignadas todavía: en el Sidebar no se habilita ningún
// ítem de navegación y se muestra el mensaje "Sin acciones disponibles" (ver
// `Sidebar` → `noAccessCompanyIds`). "Del Sur Logística" es la empresa en
// estado inicial (ver Main/Home). Ids de `config/sidebars/*.js`.
export const NO_ACCESS_COMPANY_IDS = ['del-sur'];

// Empresas en estado inicial (el usuario recién empieza y no configuró nada):
// los Home muestran mensajes de bienvenida en vez de datos (ver Main/Home y
// `LayoutHomeModule` → `initialState`).
export const INITIAL_STATE_COMPANY_IDS = ['del-sur'];

// Copy del estado inicial del Acceso rápido (mismo `Message` en Main y en los módulos).
export const QUICK_ACCESS_INITIAL_MESSAGE = {
  icon: 'bi-star',
  title: 'Empezá a crear tus accesos rápidos',
  message: 'Marcá como favorito los maestros y procesos que más usás para tenerlos siempre a mano.',
};
