// Catálogo de concesionarios disponibles para asignar a un perfil (pantalla
// Roles y perfiles > Crear/Editar, bloque "Concesionarios") — ejemplo,
// reemplazar por el catálogo real cuando exista un maestro propio de
// Concesionarios. `id` es estable, es lo que se guarda en
// `perfil.concesionarioIds` (ver App.jsx) — nunca usar `label` como
// identificador.
export const CONCESIONARIOS = [
  { id: 'terminal-norte', label: 'Terminal Norte S.A.' },
  { id: 'terminal-sur', label: 'Terminal Sur S.A.' },
  { id: 'operadora-plata', label: 'Operadora Portuaria del Plata' },
  { id: 'concesion-atlantica', label: 'Concesión Atlántica' },
  { id: 'puerto-libre', label: 'Puerto Libre Concesiones' },
];
