// Catálogo de roles disponibles para asignar a un usuario (pantalla Usuarios
// > Crear/Editar, bloque "Accesos y permisos" > tab Roles) — ejemplo,
// reemplazar por el catálogo real cuando exista un maestro propio de Roles.
// `id` es estable, es lo que se guarda en `usuario.rolIds` (ver App.jsx) —
// nunca usar `label` como identificador.
export const ROLES = [
  { id: 'gestor-buques', label: 'Gestor de Buques', description: 'Alta, edición y baja de buques' },
  { id: 'gestor-operaciones', label: 'Gestor de Operaciones', description: 'Planificación y seguimiento de operaciones portuarias' },
  { id: 'gestor-usuarios', label: 'Gestor de Usuarios', description: 'Administración de usuarios, perfiles y roles' },
  { id: 'auditor', label: 'Auditor', description: 'Consulta de registros y trazabilidad, sin edición' },
  { id: 'soporte-tecnico', label: 'Soporte Técnico', description: 'Acceso a herramientas de diagnóstico y configuración técnica' },
  { id: 'solo-lectura', label: 'Solo lectura', description: 'Consulta general sin permisos de edición' },
];
