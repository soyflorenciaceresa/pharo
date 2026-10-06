// Catálogos de EJEMPLO para la Solicitud de giro buque (Ports) — reemplazar por
// los maestros reales. `value` es el código del maestro, `label` lo que se ve.
const opt = (value, label, extra = {}) => ({ value, label: `${value} · ${label}`, ...extra });

// Buques del maestro con sus datos técnicos: al elegir uno, la solicitud
// completa esos campos (siguen siendo editables, por si cambian para el viaje).
export const BUQUES_MAESTRO = [
  opt('BQ-001', 'Estrella del Sur', { data: { propietario: 'Naviera del Plata S.A.', tipo: 'Portacontenedores', bandera: 'Argentina', trn: '18200', tbt: '31500', imo: '9321483', eslora: '229,50', manga: '32,20', puntal: '19,10', coeficiente: '0,72', indicativo: 'LWAB', matricula: '01234', tpc: '48,5', lastre: '9200', anio: '2008' } }),
  opt('BQ-002', 'Puerto Norte I', { data: { propietario: 'Transportes Norte S.A.', tipo: 'Carguero', bandera: 'Panamá', trn: '12400', tbt: '21800', imo: '9454436', eslora: '189,90', manga: '28,40', puntal: '16,20', coeficiente: '0,78', indicativo: 'HPXY', matricula: '04567', tpc: '38,2', lastre: '6100', anio: '2011' } }),
  opt('BQ-003', 'Andina Cargo', { data: { propietario: 'Andina Marítima S.A.', tipo: 'Carguero', bandera: 'Liberia', trn: '9800', tbt: '16400', imo: '9632179', eslora: '169,00', manga: '26,00', puntal: '14,50', coeficiente: '0,80', indicativo: 'ELQR', matricula: '07890', tpc: '33,0', lastre: '4800', anio: '2013' } }),
];

// Armadores/explotadores — al elegir uno se completa su domicilio.
export const ARMADORES = [
  opt('AR-01', 'Naviera del Plata S.A.', { domicilio: 'Av. Alem 1050, Buenos Aires' }),
  opt('AR-02', 'Transportes Norte S.A.', { domicilio: 'Bv. Oroño 320, Rosario' }),
  opt('AR-03', 'Andina Marítima S.A.', { domicilio: 'Calle 9 de Julio 780, Santa Fe' }),
];

export const AGENTES_ADUANEROS = [opt('AG-01', 'Agencia Marítima Litoral'), opt('AG-02', 'Despachos Paraná S.R.L.'), opt('AG-03', 'Agentes Portuarios del Sur')];
export const OTROS_AGENTES = [opt('OA-01', 'Servicios Fluviales S.A.'), opt('OA-02', 'Logística Integral del Río')];
export const CLIENTES_FACTURACION = [opt('CL-01', 'Agroexport S.A.'), opt('CL-02', 'Cereales del Sur'), opt('CL-03', 'Molinos Andinos')];
export const PRODUCTOS = [opt('PR-01', 'Soja'), opt('PR-02', 'Maíz'), opt('PR-03', 'Trigo'), opt('PR-04', 'Aceite de girasol')];
export const PUERTOS = [opt('PU-01', 'Rosario'), opt('PU-02', 'San Lorenzo'), opt('PU-03', 'Montevideo'), opt('PU-04', 'Santos')];
export const DESTINOS = [opt('DE-01', 'Rotterdam'), opt('DE-02', 'Shanghái'), opt('DE-03', 'Hamburgo')];
export const MUELLES = [opt('MU-01', 'Muelle 1 — Terminal norte'), opt('MU-02', 'Muelle 2 — Terminal sur')];
