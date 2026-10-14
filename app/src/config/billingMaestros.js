// Definición de los formularios de los maestros de Billing que no son Clientes,
// Servicios ni Condiciones impositivas (esos tienen pantalla propia). Misma
// estructura que config/truckshiftMaestros.js. Referencia: el sistema anterior
// (capturas de cada "Crear"). Condiciones de venta (M-04a) y Percepciones (M-04a,
// reusa RetencionIibbFormulario) tienen pantalla propia. Catálogos de EJEMPLO.
// ⚠️ Sin componente de radio/selector con búsqueda: ver notas en CLAUDE.md.
const opt = (...labels) => labels.map((label) => ({ value: label, label }));
const code = { key: 'codigo', label: 'Código', required: true };
const denom = { key: 'denominacion', label: 'Denominación', required: true };
const CUENTAS = opt('4.1.01.01 · Ventas de servicios', '4.1.01.02 · Ventas de mercaderías', '2.1.05.01 · IVA débito fiscal', '1.1.04.01 · Caja y bancos');

export const CLIENTES_OPT = opt('CL-001 · Agroexport S.A.', 'CL-002 · Cereales del Sur', 'CL-003 · Molinos Andinos');

export const BILLING_FORMS = {
  'categorias-de-percepciones': {
    fields: [
      code, denom,
      { key: 'porcentaje', label: 'Porcentaje (%)', numeric: true, default: '0' },
      { key: 'zonaEntrega', label: 'Zona de entrega', type: 'select', options: opt('ZE-001 · Zona norte', 'ZE-002 · Zona sur', 'ZE-003 · Zona centro') },
      { key: 'metodoCalculo', label: 'Método de cálculo', type: 'select', options: opt('Sobre el neto', 'Sobre el total', 'Escala') },
    ],
  },
  impuestos: { fields: [code, denom, { key: 'porcentaje', label: 'Porcentaje (%)', numeric: true, default: '0' }, { key: 'cuenta', label: 'Cuenta', type: 'select', options: CUENTAS }] },
  'metodos-de-pago': { fields: [code, denom, { key: 'cuenta', label: 'Cuenta', type: 'select', options: CUENTAS }] },
  productos: { fields: [code, denom] },
  'puntos-de-venta': { fields: [code, denom], checks: [{ key: 'facturaElectronica', label: 'Es factura electrónica' }] },
  'tipos-de-comprobantes': {
    fields: [code, denom, { key: 'codigoFiscal', label: 'Código fiscal' }, { key: 'tipo', label: 'Tipo', type: 'select', options: opt('Factura', 'Nota de crédito', 'Nota de débito', 'Recibo') }],
    checks: [{ key: 'fiscal', label: 'Fiscal' }],
  },
  'unidades-de-medida': { fields: [code, denom] },
  'zonas-de-entrega': {
    fields: [
      code, denom,
      { key: 'provincia', label: 'Estado / Provincia', type: 'select', options: opt('Santa Fe', 'Buenos Aires', 'Córdoba', 'Entre Ríos', 'CABA') },
      { key: 'importeMinimo', label: 'Importe mínimo', numeric: true },
      { key: 'articuloInciso', label: 'Código artículo inciso' },
    ],
    checks: [{ key: 'agentePercepcion', label: 'Es agente de percepción de IIBB' }],
  },
};
