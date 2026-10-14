// Catálogos de EJEMPLO para Billing → Condiciones impositivas — reemplazar por los reales.
export const IMPUESTOS = [
  { value: 'iva-21', label: 'IVA 21%' }, { value: 'iva-105', label: 'IVA 10,5%' }, { value: 'iva-27', label: 'IVA 27%' },
  { value: 'iibb', label: 'Ingresos brutos' }, { value: 'ganancias', label: 'Impuesto a las ganancias' },
];

const c = (value, label) => ({ value, label: `${value} · ${label}` });
// Cada campo de comprobante ofrece solo los tipos que le corresponden.
export const COMPROBANTES = {
  factura: [c('FA', 'Factura A'), c('FB', 'Factura B'), c('FC', 'Factura C')],
  facturaMipyme: [c('FCEA', 'Factura de crédito electrónica MiPyme A'), c('FCEB', 'Factura de crédito electrónica MiPyme B'), c('FCEC', 'Factura de crédito electrónica MiPyme C')],
  notaCredito: [c('NCA', 'Nota de crédito A'), c('NCB', 'Nota de crédito B'), c('NCC', 'Nota de crédito C')],
  notaCreditoMipyme: [c('NCCEA', 'Nota de crédito electrónica MiPyme A'), c('NCCEB', 'Nota de crédito electrónica MiPyme B'), c('NCCEC', 'Nota de crédito electrónica MiPyme C')],
  notaDebito: [c('NDA', 'Nota de débito A'), c('NDB', 'Nota de débito B'), c('NDC', 'Nota de débito C')],
  notaDebitoMipyme: [c('NDCEA', 'Nota de débito electrónica MiPyme A'), c('NDCEB', 'Nota de débito electrónica MiPyme B'), c('NDCEC', 'Nota de débito electrónica MiPyme C')],
};
