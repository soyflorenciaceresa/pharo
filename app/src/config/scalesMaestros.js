// Definición de los formularios de los maestros de Scales (misma estructura que
// config/truckshiftMaestros.js). Referencia: el sistema anterior (capturas de
// cada "Crear"). Catálogos de EJEMPLO.
const opt = (...labels) => labels.map((label) => ({ value: label, label }));
const code = { key: 'codigo', label: 'Código', required: true };
const denom = { key: 'denominacion', label: 'Denominación', required: true };

export const SCALES_FORMS = {
  // M-02: identificación/configuración de la balanza + sección de habilitación (contexto distinto: certificación).
  balanzas: {
    sections: [
      {
        title: 'Datos de la balanza',
        fields: [
          code,
          denom,
          { key: 'grupo', label: 'Grupo', type: 'select', options: opt('GB-001 · Balanzas de ingreso', 'GB-002 · Balanzas de egreso', 'GB-003 · Balanzas de vagones', 'GB-005 · Balanzas móviles') },
          { key: 'tomaDatos', label: 'Toma de datos', type: 'select', options: opt('Manual', 'Automática', 'Semiautomática') },
          { key: 'codigoLot', label: 'Código LOT' },
        ],
      },
      {
        title: 'Habilitación',
        fields: [
          { key: 'certificado', label: 'Número de certificado' },
          { key: 'fechaHab', label: 'Fecha de habilitación', type: 'date' },
          { key: 'fechaVto', label: 'Fecha de vencimiento de la habilitación', type: 'date', after: 'fechaHab' },
        ],
      },
    ],
  },
  'unidades-de-medida': { fields: [code, denom] },
  // 'grupos-de-balanzas': pantalla propia (modules/Scales/Maestros/GrupoBalanzaFormulario.jsx, M-04a).
};
