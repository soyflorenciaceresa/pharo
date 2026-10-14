// Definición de los formularios de los maestros de Grains que NO son Clientes ni
// Contratos (esos tienen pantalla propia desde antes). Misma estructura que
// config/truckshiftMaestros.js. Referencia: el sistema anterior (capturas de cada
// "Crear"). Cartas de porte tiene pantalla propia (M-04c). Catálogos de EJEMPLO.
const code = { key: 'codigo', label: 'Código', required: true };
const denom = { key: 'denominacion', label: 'Denominación', required: true };

export const GRAINS_FORMS = {
  actividades: { fields: [code, denom] },
  categorias: { fields: [code, denom] },
  cosechas: { fields: [code, denom] },
  mercados: { fields: [code, denom] },
  plantas: { fields: [code, denom] },
  productos: { fields: [code, denom] },
  'tipos-de-contrato': { fields: [code, denom] },
  transportes: { fields: [code, denom, { key: 'chofer', label: 'Chofer', required: true }, { key: 'patente', label: 'Patente', required: true }] },
  'unidades-de-medida': { fields: [code, denom] },
};
