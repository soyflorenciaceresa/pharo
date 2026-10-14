// Definición de los formularios de los maestros de Accounting (misma estructura
// que config/truckshiftMaestros.js). Referencia: el sistema anterior (capturas de
// cada "Crear"). Centros de costo tiene una colección hija (Subcentros de costos,
// M-04a vía GrupoFormulario). Sin captura todavía: Plan de cuentas y Esquemas de
// cuentas detalles (siguen con la grilla). Supuesto: Código y Denominación/Nombre
// obligatorios (las capturas no marcaban ninguno).
const opt = (...labels) => labels.map((label) => ({ value: label, label }));
const code = { key: 'codigo', label: 'Código', required: true };
const denom = { key: 'denominacion', label: 'Denominación', required: true };

export const ACCOUNTING_FORMS = {
  // 'centros-de-costo': pantalla propia (GrupoFormulario con child Subcentros de costos).
  'ejercicios-contables': {
    fields: [
      code, denom,
      { key: 'estado', label: 'Estado', type: 'select', options: opt('Activo', 'Cerrado'), default: 'Activo' },
      { key: 'fechaDesde', label: 'Fecha desde', type: 'date', default: '2026-01-01', required: true },
      { key: 'fechaHasta', label: 'Fecha hasta', type: 'date', default: '2026-12-31', required: true, after: 'fechaDesde' },
    ],
  },
  legajos: { fields: [code, denom] },
  'esquemas-de-cuentas': { fields: [code, { key: 'denominacion', label: 'Nombre', required: true }] },
};
