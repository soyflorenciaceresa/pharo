// Definición de los formularios de los maestros de Ports (misma estructura que
// config/truckshiftMaestros.js; ver ese archivo para el formato). Clave = último
// segmento de la ruta del maestro. Referencia: el sistema anterior (capturas de
// cada "Crear"). Catálogos de EJEMPLO. Sin entrada acá: el maestro sigue con la
// grilla genérica (Acuerdos comerciales, Clientes, Servicios, Esquema de
// horarios — todavía sin captura). "tipos-de-movimientos" tiene pantalla propia.
const opt = (...labels) => labels.map((label) => ({ value: label, label }));
const code = { key: 'codigo', label: 'Código', required: true };
const denom = { key: 'denominacion', label: 'Denominación', required: true };

const DEPOSITOS = opt('DE-001 · Depósito central', 'DE-002 · Depósito norte', 'DE-003 · Depósito sur');
const UBICACIONES = opt('UB-001 · Playa de camiones', 'UB-002 · Silo 1', 'UB-003 · Muelle norte');
const LOCALIDADES = opt('Rosario', 'San Lorenzo', 'Santa Fe', 'Buenos Aires');

export const PORTS_FORMS = {
  viajes: {
    fields: [
      { key: 'codigo', label: 'ID de viaje', required: true },
      { key: 'buque', label: 'Buque', type: 'select', options: opt('BQ-001 · MV Atlántico', 'BQ-002 · MV Río de la Plata', 'BQ-003 · MV Paraná'), required: true },
      { key: 'viajeAduana', label: 'Número de viaje aduana' },
    ],
    // El original no tiene denominación: la grilla muestra el buque del viaje.
    denominacion: (v) => v.buque?.split(' · ')[1] ?? '',
  },
  'familias-de-productos': { fields: [code, denom] },
  recursos: {
    fields: [
      code, denom,
      { key: 'categoria', label: 'Categoría', type: 'select', options: opt('Equipos', 'Vehículos', 'Personal'), required: true },
      {
        key: 'tipo', label: 'Tipo', type: 'select', dependsOn: 'categoria',
        optionsByParent: { Equipos: opt('Grúa', 'Cinta transportadora', 'Balanza'), Vehículos: opt('Autoelevador', 'Camión'), Personal: opt('Operador', 'Supervisor') },
      },
    ],
  },
  productos: {
    fields: [
      code, denom,
      { key: 'familia', label: 'Familia de producto', type: 'select', options: opt('FP-001 · Cereales', 'FP-002 · Oleaginosas', 'FP-003 · Aceites') },
      { key: 'unidad', label: 'Unidad de medida', type: 'select', options: opt('UM-001 · Tonelada', 'UM-002 · Kilogramo', 'UM-003 · Metro cúbico') },
    ],
    checks: [{ key: 'actualizaStock', label: 'Actualiza stock' }],
  },
  'tipos-turnos': { fields: [code, denom, { key: 'cantidadHoras', label: 'Cantidad de horas', numeric: true, default: '0' }] },
  envases: { fields: [code, denom] },
  'categoria-de-horarios': { fields: [code, denom, { key: 'porcentaje', label: 'Porcentaje (%)', numeric: true, default: '0' }] },
  armadores: { fields: [{ key: 'codigo', label: 'CUIT', required: true, validate: 'cuit' }, denom] }, // el CUIT hace de Código en la grilla
  'agentes-maritimos-aduaneros': { fields: [{ key: 'codigo', label: 'CUIT', required: true, validate: 'cuit' }, { key: 'denominacion', label: 'Razón social', required: true }] },
  'tipos-de-buques': { fields: [code, denom, { key: 'trn', label: 'TRN', numeric: true }] },
  puertos: { fields: [code, denom, { key: 'pais', label: 'País', type: 'select', options: opt('Argentina', 'Uruguay', 'Paraguay', 'Brasil', 'Chile') }] },
  'giros-turnos': { fields: [code, denom, { key: 'lugarOperativo', label: 'Lugar operativo', type: 'select', options: opt('LO-001 · Muelle norte', 'LO-002 · Muelle sur', 'LO-003 · Playa de camiones') }] },
  opb: { fields: [code, denom, { key: 'email', label: 'E-mail', validate: 'email' }, { key: 'telefono', label: 'Teléfono' }] },
  capitanes: {
    fields: [
      { key: 'codigo', label: 'Número de documento', required: true }, // hace de Código en la grilla
      { key: 'denominacion', label: 'Nombre', required: true },
      { key: 'localidad', label: 'Localidad', type: 'select', options: LOCALIDADES },
      { key: 'telefono', label: 'Teléfono' },
    ],
  },
  'unidades-de-medida': { fields: [code, denom] },
  navieras: { fields: [code, denom] },
  'estados-de-carga': {
    fields: [code, denom, { key: 'color', label: 'Color', type: 'select', options: opt('Verde', 'Amarillo', 'Rojo', 'Azul', 'Gris'), required: true }],
    checks: [{ key: 'aptoDespachar', label: 'Apto para despachar' }, { key: 'solicitarFoto', label: 'Solicitar foto en la recepción' }],
  },
  ubicaciones: { fields: [code, denom, { key: 'deposito', label: 'Depósito', type: 'select', options: DEPOSITOS, required: true }] },
  sectores: { fields: [code, denom, { key: 'ubicacion', label: 'Ubicación', type: 'select', options: UBICACIONES, required: true }] },
};
