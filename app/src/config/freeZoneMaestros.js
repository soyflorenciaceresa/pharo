// Definición de los formularios de los maestros de Free Zone (misma estructura
// que config/truckshiftMaestros.js; `sections` ⇒ M-02). Referencia: el sistema
// anterior (capturas de cada "Crear"). Catálogos de EJEMPLO. Las capturas no
// marcaban obligatorios: se asumió Código y Denominación/Razón social. Las
// "Observaciones" / "Leyenda" son de una línea (falta el campo de texto largo).
const opt = (...labels) => labels.map((label) => ({ value: label, label }));
const code = { key: 'codigo', label: 'Código', required: true };
const denom = { key: 'denominacion', label: 'Denominación', required: true };
const razon = { key: 'denominacion', label: 'Razón social', required: true };
const PAISES = opt('Argentina', 'Uruguay', 'Paraguay', 'Brasil', 'Chile', 'Bolivia');
const USUARIOS_DIRECTOS = opt('UD-001 · Zona Franca Rosario S.A.', 'UD-002 · Depósitos del Litoral', 'UD-003 · Logística Portuaria S.R.L.');
const USUARIOS_INDIRECTOS = opt('UI-001 · Importadora Andina', 'UI-002 · Exportadora del Sur', 'UI-003 · Textiles del Norte');

// Usuarios directos e indirectos: identificación / domicilio y contacto.
const usuario = (extraChecks = []) => ({
  sections: [
    {
      title: 'Datos generales',
      fields: [code, razon, { key: 'cuit', label: 'CUIT' }, { key: 'nroDisposicion', label: 'Número de disposición' }, { key: 'actividad', label: 'Actividad principal' }],
      checks: extraChecks,
    },
    { title: 'Domicilio y contacto', fields: [{ key: 'direccion', label: 'Dirección' }, { key: 'telefono', label: 'Teléfono' }, { key: 'email', label: 'Correo electrónico', validate: 'email' }, { key: 'observaciones', label: 'Observaciones' }] },
  ],
});

export const FZ_FORMS = {
  'usuarios-directos': usuario(),
  'usuarios-indirectos': usuario([{ key: 'autorizaSalida', label: 'Autorizar salida de mercadería' }]),
  consignatarios: {
    sections: [
      { title: 'Datos del consignatario', fields: [code, razon, { key: 'nroDisposicion', label: 'Número de disposición' }, { key: 'usuarioDirecto', label: 'Usuario directo', type: 'select', options: USUARIOS_DIRECTOS }, { key: 'usuarioIndirecto', label: 'Usuario indirecto', type: 'select', options: USUARIOS_INDIRECTOS }, { key: 'cuit', label: 'CUIT' }] },
      { title: 'Contacto', fields: [{ key: 'cargo', label: 'Cargo' }, { key: 'contacto', label: 'Contacto' }, { key: 'pais', label: 'País', type: 'select', options: PAISES }, { key: 'telefono', label: 'Teléfono' }, { key: 'email', label: 'Correo electrónico', validate: 'email' }] },
      { title: 'Vigencia', fields: [{ key: 'validoDesde', label: 'Válido desde', type: 'date' }, { key: 'validoHasta', label: 'Válido hasta', type: 'date', after: 'validoDesde' }, { key: 'observaciones', label: 'Observaciones' }] },
    ],
  },
  depositos: { fields: [code, denom] },
  // El original no tiene código ni denominación: el código se genera y la denominación es el N.º de disposición.
  contratos: {
    sections: [
      {
        title: 'Datos del contrato',
        fields: [
          { key: 'nroDisposicion', label: 'Número de disposición', required: true },
          { key: 'usuarioDirecto', label: 'Usuario directo', type: 'select', options: USUARIOS_DIRECTOS },
          { key: 'usuarioIndirecto', label: 'Usuario indirecto', type: 'select', options: USUARIOS_INDIRECTOS },
          { key: 'deposito', label: 'Depósito', type: 'select', options: opt('DE-001 · Depósito fiscal 1', 'DE-002 · Depósito fiscal 2', 'DE-003 · Depósito refrigerado') },
          { key: 'ubicacion', label: 'Ubicación' },
          { key: 'estado', label: 'Estado', type: 'select', options: opt('Vigente', 'Vencido', 'Rescindido', 'En trámite') },
          { key: 'cantidadInteres', label: 'Cantidad sobre interés', numeric: true },
          { key: 'leyenda', label: 'Leyenda' },
        ],
      },
      {
        title: 'Fechas',
        fields: [
          { key: 'fechaFirma', label: 'Fecha de firma de contrato', type: 'date' }, { key: 'fechaAprobacion', label: 'Fecha de aprobación', type: 'date' }, { key: 'inicioDisposicion', label: 'Inicio de la disposición', type: 'date' },
          { key: 'fechaFinalizacion', label: 'Fecha de finalización', type: 'date', after: 'inicioDisposicion' }, { key: 'fechaAviso', label: 'Fecha de aviso', type: 'date' }, { key: 'fechaRescision', label: 'Fecha de rescisión', type: 'date' },
        ],
      },
    ],
    autoCode: 'CT',
    denominacion: (v) => v.nroDisposicion,
  },
  compradores: { fields: [code, { key: 'denominacion', label: 'Nombre', required: true }, { key: 'cuit', label: 'CUIT' }, { key: 'pais', label: 'País', type: 'select', options: PAISES }] },
  buques: { fields: [code, { key: 'denominacion', label: 'Nombre', required: true }] },
  puertos: { fields: [code, { key: 'denominacion', label: 'Nombre', required: true }, { key: 'pais', label: 'País', type: 'select', options: PAISES }] },
  'tipos-de-documentos': { fields: [code, denom, { key: 'movimiento', label: 'Movimiento', type: 'select', options: opt('Ingreso', 'Egreso', 'Transferencia') }] },
  embalaje: { fields: [code, denom] },
  'unidades-de-medida': { fields: [code, denom] },
  'familias-de-productos': { fields: [code, denom] },
  productos: { fields: [code, denom, { key: 'unidad', label: 'Unidad de medida', type: 'select', options: opt('UM-001 · Unidad', 'UM-002 · Kilogramo', 'UM-003 · Tonelada') }] },
};
