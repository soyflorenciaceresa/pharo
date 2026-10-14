// Definición de los formularios de los maestros de Purchases (misma estructura
// que config/truckshiftMaestros.js; ver ese archivo para el formato). Referencia:
// el sistema anterior (capturas de cada "Crear"). Catálogos de EJEMPLO.
// ⚠️ El kit no tiene un componente de radio: los campos "Tipo de cálculo" /
// "Método de cálculo" (2 opciones) se resuelven con `Select` hasta que exista.
const opt = (...labels) => labels.map((label) => ({ value: label, label }));
const code = { key: 'codigo', label: 'Código', required: true };
const denom = { key: 'denominacion', label: 'Denominación', required: true };

export const PROVEEDORES_OPT = opt('PR-001 · Insumos del Litoral S.R.L.', 'PR-002 · Mantenimiento Industrial', 'PR-003 · Fletes del Sur');
const CUENTAS = opt('2.1.01.01 · Proveedores', '2.1.01.02 · Proveedores del exterior', '2.1.01.03 · Acreedores varios');
const PROVINCIAS = opt('Santa Fe', 'Buenos Aires', 'Córdoba', 'Entre Ríos', 'CABA');

export const PURCHASES_FORMS = {
  'condiciones-impositivas': { fields: [code, denom, { key: 'impuestos', label: 'Impuestos', type: 'select', options: opt('IVA 21%', 'IVA 10,5%', 'IVA 27%', 'Exento'), required: true }] },
  'tipos-de-comprobantes': {
    fields: [
      code, denom,
      { key: 'codigoFiscal', label: 'Código fiscal' },
      { key: 'letra', label: 'Letra' },
      { key: 'tipo', label: 'Tipo', type: 'select', options: opt('Factura', 'Nota de crédito', 'Nota de débito', 'Recibo'), required: true },
      { key: 'tipoGestionPortuaria', label: 'Tipo de comprobante Gestión Portuaria', type: 'select', options: opt('GP-01 · Factura', 'GP-02 · Nota de crédito', 'GP-03 · Nota de débito') },
    ],
    checks: [{ key: 'fiscal', label: 'Fiscal' }],
  },
  'unidades-de-medida': { fields: [code, denom] },
  areas: { fields: [code, denom], checksTitle: 'Perfiles', checks: [{ key: 'perfilAdministrador', label: 'Administrador' }, { key: 'perfilPersonal', label: 'Personal' }] },
  'conceptos-de-compra': {
    fields: [
      code, denom,
      { key: 'cuentaContable', label: 'Cuenta contable', type: 'select', options: CUENTAS },
      { key: 'articulo', label: 'Artículo', type: 'select', options: opt('AT-001 · Aceite lubricante', 'AT-002 · Guantes de seguridad', 'AT-003 · Resma de papel A4') },
      { key: 'concepto', label: 'Concepto', type: 'select', options: opt('CC-01 · Insumos', 'CC-02 · Servicios', 'CC-03 · Mantenimiento') },
    ],
  },
  'condiciones-de-compra': { fields: [code, denom, { key: 'tipo', label: 'Tipo', type: 'select', options: opt('Contado', 'Cuenta corriente', 'Cheque'), required: true }] },
  // M-02: datos de la zona + parámetros de retención de IIBB (mismo contexto, dos grupos).
  'zonas-de-entrega-retiro': {
    sections: [
      { title: 'Datos de la zona', fields: [code, denom, { key: 'provincia', label: 'Estado / Provincia', type: 'select', options: PROVINCIAS, required: true }] },
      {
        title: 'Retención de IIBB',
        fields: [
          { key: 'importeMinimo', label: 'Importe mínimo', numeric: true },
          { key: 'categoriaIibb', label: 'Categoría de retención de IIBB', type: 'select', options: opt('CR-001 · Ganancias', 'CR-002 · IVA', 'CR-003 · Ingresos brutos') },
          { key: 'articuloInciso', label: 'Código artículo inciso' },
          { key: 'codigoJurisdiccion', label: 'Código de jurisdicción' },
          { key: 'tipoRegimen', label: 'Tipo de régimen de retención' },
        ],
        checks: [{ key: 'agentePercepcion', label: 'Es agente de percepción de IIBB' }, { key: 'convenioMultilateral', label: 'Aplica convenio multilateral' }],
      },
    ],
  },
  impuestos: {
    fields: [
      code, denom,
      { key: 'cuentaContable', label: 'Cuenta contable', type: 'select', options: CUENTAS, required: true },
      { key: 'tipoCalculo', label: 'Tipo de cálculo', type: 'select', options: opt('Alícuota', 'Importe'), required: true },
    ],
  },
  'metodos-de-pago': {
    fields: [code, denom, { key: 'cuentaContable', label: 'Cuenta contable', type: 'select', options: CUENTAS, required: true }],
    checks: [{ key: 'totalizaFondoFijo', label: 'Totaliza fondo fijo' }],
  },
  'categorias-de-retenciones': {
    fields: [
      code, denom,
      { key: 'porcentaje', label: 'Porcentaje (%)', numeric: true, required: true },
      { key: 'zona', label: 'Zona de entrega/retiro', type: 'select', options: opt('ZE-001 · Depósito central', 'ZE-002 · Planta Rosario', 'ZE-003 · Planta San Lorenzo'), required: true },
      { key: 'metodoCalculo', label: 'Método de cálculo', type: 'select', options: opt('Sobre el neto', 'Sobre el total', 'Escala'), required: true },
    ],
  },
  // 'retenciones-de-iibb': pantalla propia (modules/Purchases/Maestros/RetencionIibbFormulario.jsx, M-04a).
  'conceptos-de-retenciones': {
    fields: [
      code, denom,
      { key: 'minimoNoImponible', label: 'Mínimo no imponible', numeric: true, required: true, default: '0' },
      { key: 'minimoRetener', label: 'Mínimo a retener', numeric: true, default: '0' },
      { key: 'codigoSicore', label: 'Código de Sicore' },
      { key: 'metodoCalculo', label: 'Método de cálculo', type: 'select', options: opt('Fijo', 'Variable'), required: true },
    ],
  },
  'retenciones-de-ganancias': {
    fields: [
      { key: 'proveedor', label: 'Proveedor', type: 'select', options: PROVEEDORES_OPT, required: true },
      { key: 'concepto', label: 'Concepto de retención de Ganancias', type: 'select', options: opt('Locaciones de obra', 'Locaciones de servicio', 'Honorarios', 'Alquileres') },
      { key: 'fechaExencion', label: 'Fecha de exención', type: 'date' },
    ],
    autoCode: 'RG',
    denominacion: (v) => [v.proveedor?.split(' · ')[1], v.concepto].filter(Boolean).join(' · '),
  },
  'conceptos-de-retencion-iva': {
    fields: [code, denom, { key: 'codigoSicore', label: 'Código de Sicore', required: true }, { key: 'porcentaje', label: 'Porcentaje (%)', numeric: true }],
  },
  'retenciones-iva': {
    fields: [
      { key: 'proveedor', label: 'Proveedor', type: 'select', options: PROVEEDORES_OPT, required: true },
      { key: 'concepto', label: 'Concepto de retención IVA', type: 'select', options: opt('Retención IVA 10,5%', 'Retención IVA 21%', 'Retención IVA 50%') },
      { key: 'fechaExencion', label: 'Fecha de exención', type: 'date' },
    ],
    autoCode: 'RI',
    denominacion: (v) => [v.proveedor?.split(' · ')[1], v.concepto].filter(Boolean).join(' · '),
  },
};
