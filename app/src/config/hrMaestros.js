// Definición de los formularios de los maestros de Human Resources (misma
// estructura que config/truckshiftMaestros.js; además, un check puede llevar
// `groupTitle` para agrupar checkboxes bajo un rótulo). Referencia: el sistema
// anterior (capturas de cada "Crear"). Catálogos de EJEMPLO. Con pantalla
// propia: Convenios (M-04c), Personal (M-04c) y Grupos (M-04a).
const opt = (...labels) => labels.map((label) => ({ value: label, label }));
const code = { key: 'codigo', label: 'Código', required: true };
const denom = { key: 'denominacion', label: 'Denominación', required: true };

export const HR_FORMS = {
  actividades: { fields: [code, denom] },
  adicionales: { fields: [code, denom] },
  bancos: { fields: [code, denom] },
  // M-02: identificación del concepto + liquidación (tipos de liquidación y opciones).
  conceptos: {
    sections: [
      {
        title: 'Datos del concepto',
        fields: [
          { key: 'codigo', label: 'Código' }, { key: 'denominacion', label: 'Denominación', required: true },
          { key: 'categoria', label: 'Categoría', type: 'select', options: opt('CC-001 · Remunerativos', 'CC-002 · No remunerativos', 'CC-003 · Descuentos', 'CC-004 · Aportes') },
          { key: 'columna', label: 'Columna', type: 'select', options: opt('Haberes con aportes', 'Haberes sin aportes', 'Descuentos', 'Aportes patronales') },
          { key: 'unidad', label: 'Unidad', type: 'select', options: opt('Importe', 'Porcentaje', 'Horas', 'Días') },
          { key: 'codigoAfip', label: 'Código AFIP', type: 'select', options: opt('011000 · Sueldo', '012000 · Horas extras', '013000 · SAC', '014000 · Vacaciones') },
        ],
      },
      {
        title: 'Liquidación',
        fields: [],
        checks: [
          { key: 'liqSueldo', label: 'Sueldo mensual', groupTitle: 'Tipo de liquidación' },
          { key: 'liqVacaciones', label: 'Vacaciones', groupTitle: 'Tipo de liquidación' },
          { key: 'liqSac', label: 'SAC', groupTitle: 'Tipo de liquidación' },
          { key: 'liqFinal', label: 'Liquidación final', groupTitle: 'Tipo de liquidación' },
          { key: 'liqHorasExtras', label: 'Liquidación de horas extras', groupTitle: 'Tipo de liquidación' },
          { key: 'tomaNovedad', label: 'Toma valor de una novedad', groupTitle: 'Opciones' },
          { key: 'maxMin', label: 'Utiliza máximos y mínimos', groupTitle: 'Opciones' },
        ],
      },
    ],
  },
  'categorias-de-conceptos': { fields: [code, denom] },
  condiciones: { fields: [code, denom] },
  'estados-diarios': {
    fields: [{ key: 'codigo', label: 'Código' }, { key: 'denominacion', label: 'Denominación', required: true }, { key: 'tipo', label: 'Tipo' }, { key: 'codigoReducido', label: 'Código reducido' }],
    checks: [{ key: 'remunerativo', label: 'Remunerativo' }, { key: 'porTurno', label: 'Por turno' }],
  },
  'modalidades-de-contratacion': { fields: [code, denom] },
  'zonas-geograficas': { fields: [code, denom] },
  'formas-de-pago': { fields: [code, denom] },
  'tipos-de-pagos': { fields: [code, denom] },
  regimenes: { fields: [code, denom] },
  situaciones: { fields: [code, denom] },
  'codigos-de-siniestrados': { fields: [code, denom] },
  'lugares-operativos': { fields: [code, denom] },
  turnos: { fields: [code, denom, { key: 'horaInicio', label: 'Hora inicio', type: 'time' }, { key: 'horaFin', label: 'Hora fin', type: 'time' }, { key: 'categoria', label: 'Categoría', type: 'select', options: opt('Diurno', 'Nocturno', 'Mixto') }] },
  // obras-sociales: usa GrupoFormulario con la colección Planes de cobertura (M-04a).
  'codigos-afip': { fields: [{ key: 'codigo', label: 'Código' }, { key: 'denominacion', label: 'Denominación', required: true }] },
};
