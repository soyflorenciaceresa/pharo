// Definición de los formularios de los maestros de Truckshift (todos M-01 ·
// Formulario simple: un solo grupo de pocos campos). Cada maestro declara sus
// `fields` (en una FormRow), sus `checks` (checkboxes, siempre en vertical; el
// "Inactivo" lo agrega la pantalla al final) y, si no tiene Código /
// Denominación propios, cómo se derivan para la grilla estándar. Referencia: el
// sistema anterior (capturas de cada "Crear"). Catálogos de EJEMPLO.
//   field: { key, label, type: 'text' | 'select' | 'readonly', options?, required?, default? }
const opt = (...labels) => labels.map((label) => ({ value: label, label }));

const DEPOSITOS = opt('DE-001 · Depósito central', 'DE-002 · Depósito norte', 'DE-003 · Depósito sur');
const code = { key: 'codigo', label: 'Código', required: true };
const denom = { key: 'denominacion', label: 'Denominación', required: true };

export const TRUCKSHIFT_FORMS = {
  'puertas-de-ingreso': { fields: [code, denom, { key: 'deposito', label: 'Depósito', type: 'select', options: DEPOSITOS }] },
  'lineas-de-carga': { fields: [code, denom, { key: 'deposito', label: 'Depósito', type: 'select', options: DEPOSITOS }] },
  depositos: {
    fields: [code, denom],
    checks: [{ key: 'zonaFranca', label: 'Zona Franca' }, { key: 'deposito', label: 'Depósito' }, { key: 'operaciones', label: 'Operaciones' }],
  },
  vehiculos: {
    fields: [
      code,
      { key: 'tipoCamion', label: 'Tipo de camión', type: 'select', options: opt('Camión', 'Camión con acoplado', 'Bitren', 'Utilitario') },
      { key: 'clasificacion', label: 'Clasificación de camión', type: 'select', options: opt('CC-001 · Comisión estándar', 'CC-002 · Comisión preferencial', 'CC-003 · Comisión por volumen') },
    ],
    // El original no tiene denominación: la grilla muestra el tipo de camión.
    denominacion: (v) => v.tipoCamion || v.codigo,
  },
  // choferes: tiene pantalla propia (modules/Truckshift/Maestros/ChoferFormulario.jsx, M-04a).
  'motivos-de-rechazo': { fields: [code, denom], checks: [{ key: 'requiereFoto', label: 'Requiere foto' }] },
  transportistas: {
    fields: [
      { key: 'codigo', label: 'Número de identificación fiscal', required: true }, // hace de Código en la grilla
      denom,
      { key: 'domicilio', label: 'Domicilio' },
      { key: 'codigoPostal', label: 'Código postal' },
      { key: 'ciudad', label: 'Ciudad' },
    ],
  },
  'playas-de-camiones': {
    fields: [code, denom, { key: 'tipoUbicacion', label: 'Tipo de ubicación', type: 'select', options: opt('Interna', 'Externa'), default: 'Interna' }],
  },
  'clasificacion-de-comisiones': { fields: [code, denom, { key: 'carga', label: 'Carga' }] },
  'motivos-de-permisos-de-ingreso': { fields: [code, denom], checks: [{ key: 'controlPrecinto', label: 'Requiere control de precinto' }] },
  'cupos-diarios-de-camiones': {
    fields: [
      { key: 'modulo', label: 'Módulo', type: 'readonly', default: 'Operaciones' },
      { key: 'planta', label: 'Planta', type: 'select', options: opt('Planta Rosario', 'Planta San Lorenzo', 'Planta Timbúes'), required: true },
      { key: 'cliente', label: 'Cliente', type: 'select', options: opt('Agroexport S.A.', 'Cereales del Sur', 'Insumos del Litoral S.R.L.'), required: true },
      { key: 'cantidad', label: 'Cantidad de cupos', required: true, numeric: true },
    ],
    // El original no tiene Código ni Denominación: se genera el código y la denominación es Cliente · Planta.
    autoCode: 'CU',
    denominacion: (v) => [v.cliente, v.planta].filter(Boolean).join(' · '),
  },
};
