// Maestros del módulo Ports que todavía NO tienen pantalla propia (Buque y
// Depósitos sí, ver modules/Operaciones). Cada uno se abre con la grilla
// estándar de maestro (Código, Denominación, Estado, Acciones — la misma de
// Depósitos), con filas de EJEMPLO adaptadas a cada maestro — reemplazar por los
// catálogos reales. De acá salen tanto los ítems del sidebar de Ports
// (config/sidebars/operaciones.js) como las rutas (App.jsx).
//
// `icon`: solo donde existe un ícono propio en Figma; el resto usa `app-window`.
const slug = (label) => label.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/\s+/g, '-');

const m = (label, prefix, items, extra = {}) => ({ label, href: extra.href ?? `/${slug(label)}`, prefix, items, icon: extra.icon ?? 'app-window' });

export const MAESTROS_PORTS = [
  m('Acuerdos comerciales', 'AC', ['Acuerdo tarifario anual', 'Acuerdo de volumen mínimo', 'Acuerdo con exportadores', 'Convenio de almacenaje', 'Descuento por pronto pago']),
  m('Agentes marítimos aduaneros', 'AG', ['Agencia Marítima Litoral', 'Despachos Paraná S.R.L.', 'Agentes Portuarios del Sur', 'Servicios Aduaneros del Plata', 'Gestión Aduanera Norte']),
  m('Armadores', 'AR', ['Naviera del Plata S.A.', 'Transportes Norte S.A.', 'Andina Marítima S.A.', 'Atlántica Shipping', 'Fluvial Cargo S.A.']),
  m('Capitanes', 'CP', ['Carlos Fernández', 'Juan Martínez', 'Roberto Silva', 'Luis Almeida', 'Diego Rossi']),
  m('Categoría de horarios', 'CH', ['Horario normal', 'Horario extendido', 'Horario nocturno', 'Feriados', 'Fines de semana']),
  m('Clientes', 'CL', ['Agroexport S.A.', 'Cereales del Sur', 'Molinos Andinos', 'Exportadora Litoral', 'Aceitera del Río'], { icon: 'icon-clientes' }),
  m('Envases', 'EN', ['A granel', 'Big bag', 'Bolsa 50 kg', 'Contenedor 20"', 'Contenedor 40"']),
  m('Esquema de horarios', 'EH', ['Lunes a viernes 8–18', 'Lunes a sábado 6–22', '24 horas', 'Turno mañana', 'Turno tarde']),
  m('Estados de carga', 'EC', ['Pendiente', 'En tránsito', 'Recibida', 'Despachada', 'Rechazada']),
  m('Familias de productos', 'FP', ['Cereales', 'Oleaginosas', 'Aceites', 'Subproductos', 'Fertilizantes']),
  // Maestro "Giros" (turnos de giro, con lugar operativo): distinto del proceso Solicitud de giro buque (/giros).
  m('Giros', 'GI', ['Giro de mañana', 'Giro de tarde', 'Giro de noche', 'Giro especial', 'Giro de emergencia'], { href: '/giros-turnos' }),
  m('Navieras', 'NA', ['Maersk Line', 'MSC', 'Hapag-Lloyd', 'CMA CGM', 'Evergreen']),
  m('OPB', 'OP', ['OPB Terminal Norte', 'OPB Terminal Sur', 'OPB Muelle 1', 'OPB Muelle 2', 'OPB Granelero']),
  m('Productos', 'PR', ['Soja', 'Maíz', 'Trigo', 'Girasol', 'Cebada']),
  m('Puertos', 'PU', ['Rosario', 'San Lorenzo', 'Montevideo', 'Santos', 'Rotterdam']),
  m('Recursos', 'RE', ['Grúa móvil 1', 'Grúa móvil 2', 'Cinta transportadora', 'Autoelevador', 'Balanza de camiones']),
  m('Sectores', 'SE', ['Recepción', 'Almacenaje', 'Despacho', 'Administración', 'Mantenimiento']),
  m('Servicios', 'SV', ['Descarga de camiones', 'Carga de buques', 'Almacenaje', 'Pesaje', 'Fumigación']),
  m('Tipos de buques', 'TB', ['Granelero', 'Portacontenedores', 'Petrolero', 'Carguero general', 'Remolcador']),
  m('Tipos de movimientos', 'TM', ['Recepción', 'Despacho', 'Transferencia', 'Ajuste de stock', 'Devolución']),
  m('Tipos de turnos', 'TT', ['Turno camión recepción', 'Turno camión despacho', 'Turno vagón', 'Turno buque', 'Turno programado'], { href: '/tipos-turnos', icon: 'icon-tipos-turnos' }),
  m('Ubicaciones', 'UB', ['Playa de camiones', 'Silo 1', 'Silo 2', 'Muelle norte', 'Zona de inspección']),
  m('Unidades de medida', 'UM', ['Tonelada', 'Kilogramo', 'Metro cúbico', 'Litro', 'Unidad']),
  m('Viajes', 'VI', ['Viaje 2026-001', 'Viaje 2026-002', 'Viaje 2026-003', 'Viaje 2026-004', 'Viaje 2026-005']),
];

// Filas de ejemplo con la forma de la grilla estándar: código, denominación y
// estado (el 4.º de cada maestro queda inactivo, para ver ambos estados).
export function maestroRows(maestro) {
  return maestro.items.map((denominacion, i) => ({
    id: i + 1,
    codigo: `${maestro.prefix}-${String(i + 1).padStart(3, '0')}`,
    denominacion,
    estado: i === 3 ? { label: 'Inactivo', type: 'neutral' } : { label: 'Activo', type: 'success' },
  }));
}
