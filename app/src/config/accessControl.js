// Catálogos de EJEMPLO para Access Control → Personas — reemplazar por los reales.
// Cada grupo tiene sus subgrupos (el Subgrupo del formulario depende del Grupo).
export const GRUPOS_PERSONAS = [
  { value: 'personal', label: 'Personal', subgrupos: [{ value: 'unico', label: 'Único' }, { value: 'contratado', label: 'Contratado' }] },
  { value: 'transportistas', label: 'Transportistas', subgrupos: [{ value: 'externos', label: 'Externos' }, { value: 'propios', label: 'Propios' }] },
  { value: 'visitas', label: 'Visitas', subgrupos: [{ value: 'proveedores', label: 'Proveedores' }, { value: 'clientes', label: 'Clientes' }] },
];

export const CIUDADES = [
  { value: 'rosario', label: 'Rosario' },
  { value: 'san-lorenzo', label: 'San Lorenzo' },
  { value: 'santa-fe', label: 'Santa Fe' },
  { value: 'buenos-aires', label: 'Buenos Aires' },
];

export const labelOf = (options, value) => options.find((o) => o.value === value)?.label ?? '';
