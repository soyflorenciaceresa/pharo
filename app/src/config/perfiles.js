// Catálogo de perfiles disponibles para asignar a un usuario (pantalla
// Usuarios > Crear/Editar, bloque "Accesos y permisos" > tab Perfiles) —
// ejemplo, reemplazar por el catálogo real cuando exista un maestro propio
// de Perfiles. `id` es estable, es lo que se guarda en `usuario.perfilIds`
// (ver App.jsx) — nunca usar `label` como identificador.
export const PERFILES = [
  { id: 'administrador', label: 'Administrador', description: 'Acceso total a la configuración del sistema' },
  { id: 'supervisor', label: 'Supervisor', description: 'Gestión operativa sin acceso a configuración' },
  { id: 'operador', label: 'Operador', description: 'Carga y consulta de operaciones diarias' },
  { id: 'invitado', label: 'Invitado', description: 'Acceso de solo lectura' },
];
