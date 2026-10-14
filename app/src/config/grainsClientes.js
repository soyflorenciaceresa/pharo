// Catálogos de EJEMPLO para Grains → Clientes — reemplazar por los reales.
export const ROLES = [{ value: 'cliente', label: 'Cliente' }, { value: 'proveedor', label: 'Proveedor' }, { value: 'cliente-proveedor', label: 'Cliente y proveedor' }];
export const ACTIVIDADES = [{ value: 'acopio', label: 'Acopio de cereales' }, { value: 'exportacion', label: 'Exportación' }, { value: 'industria', label: 'Industria aceitera' }, { value: 'produccion', label: 'Producción agropecuaria' }];
export const TIPOS_DOMICILIO = [{ value: 'fiscal', label: 'Fiscal' }, { value: 'legal', label: 'Legal' }, { value: 'comercial', label: 'Comercial' }];
export const LOCALIDADES = [{ value: 'rosario', label: 'Rosario' }, { value: 'san-lorenzo', label: 'San Lorenzo' }, { value: 'santa-fe', label: 'Santa Fe' }, { value: 'buenos-aires', label: 'Buenos Aires' }];
export const PAISES_AFIP = [{ value: '200', label: '200 · Argentina' }, { value: '203', label: '203 · Bolivia' }, { value: '208', label: '208 · Paraguay' }, { value: '225', label: '225 · Uruguay' }];
export const CATEGORIAS_IVA = [{ value: 'ri', label: 'Responsable inscripto' }, { value: 'mono', label: 'Monotributo' }, { value: 'exento', label: 'Exento' }, { value: 'cf', label: 'Consumidor final' }];
export const CATEGORIAS_GANANCIAS = [{ value: 'inscripto', label: 'Inscripto' }, { value: 'no-inscripto', label: 'No inscripto' }, { value: 'exento', label: 'Exento' }];
export const CONDICIONES_IMPOSITIVAS = [{ value: 'general', label: 'Régimen general' }, { value: 'simplificado', label: 'Régimen simplificado' }, { value: 'no-alcanzado', label: 'No alcanzado' }];
export const TIPOS_EMAIL = [{ value: 'laboral', label: 'Laboral' }, { value: 'personal', label: 'Personal' }, { value: 'facturacion', label: 'Facturación' }];
export const CATEGORIAS_SISA = [{ value: 'productor', label: 'Productor' }, { value: 'acopiador', label: 'Acopiador' }, { value: 'exportador', label: 'Exportador' }, { value: 'industria', label: 'Industria' }];

export const labelOf = (options, value) => options.find((o) => o.value === value)?.label ?? '';

// CUIT/CUIL argentino: 11 dígitos con dígito verificador (módulo 11).
export function isValidCuit(raw) {
  const cuit = String(raw).replace(/\D/g, '');
  if (cuit.length !== 11) return false;
  const weights = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
  const sum = weights.reduce((acc, w, i) => acc + w * Number(cuit[i]), 0);
  let check = 11 - (sum % 11);
  if (check === 11) check = 0;
  if (check === 10) return false;
  return check === Number(cuit[10]);
}
