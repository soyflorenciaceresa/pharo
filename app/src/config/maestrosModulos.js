// Maestros de Billing, Grains y Access Control que todavía NO tienen pantalla
// propia. Mismo mecanismo que `maestrosPorts.js`: cada uno se abre con la grilla
// estándar de maestro (Código, Denominación, Estado, Acciones — la de Depósitos)
// con filas de EJEMPLO adaptadas a cada maestro — reemplazar por los catálogos
// reales. De acá salen los ítems del sidebar de cada módulo y las rutas de
// `App.jsx`. Los maestros que ya tienen pantalla real (Grains: Contratos y
// Clientes; Access Control: Personas) NO están acá.
import { maestroRows } from './maestrosPorts.js';

const slug = (label) => label.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[\s/]+/g, '-');
const define = (base) => (label, prefix, items) => ({ label, href: `${base}/${slug(label)}`, prefix, items, icon: 'app-window' });

const billing = define('/billing');
export const MAESTROS_BILLING = [
  billing('Categorías de percepciones', 'CP', ['Percepción IVA', 'Percepción IIBB', 'Percepción Ganancias', 'Percepción aduanera', 'Otras percepciones']),
  billing('Condiciones de venta', 'CV', ['Contado', 'Cuenta corriente 30 días', 'Cuenta corriente 60 días', 'Cheque a 15 días', 'Transferencia anticipada']),
  billing('Impuestos', 'IM', ['IVA 21%', 'IVA 10,5%', 'IVA 27%', 'Ingresos brutos', 'Impuesto a las ganancias']),
  billing('Métodos de pago', 'MP', ['Efectivo', 'Transferencia bancaria', 'Cheque', 'Tarjeta de crédito', 'Echeq']),
  billing('Percepciones', 'PE', ['Percepción IVA 3%', 'Percepción IIBB Santa Fe', 'Percepción IIBB Buenos Aires', 'Percepción Ganancias 2%', 'Percepción aduanera']),
  billing('Productos', 'PR', ['Soja', 'Maíz', 'Trigo', 'Girasol', 'Servicio de almacenaje']),
  billing('Puntos de venta', 'PV', ['Casa central', 'Terminal norte', 'Terminal sur', 'Oficina Rosario', 'Facturación electrónica']),
  billing('Tipos de comprobantes', 'TC', ['Factura A', 'Factura B', 'Factura C', 'Nota de crédito A', 'Nota de débito A']),
  billing('Unidades de medida', 'UM', ['Tonelada', 'Kilogramo', 'Metro cúbico', 'Litro', 'Unidad']),
  billing('Zonas de entrega', 'ZE', ['Zona norte', 'Zona sur', 'Zona centro', 'Zona litoral', 'Exterior']),
];

const grains = define('/grains');
export const MAESTROS_GRAINS = [
  grains('Actividades', 'AC', ['Acopio de cereales', 'Exportación', 'Industria aceitera', 'Producción agropecuaria', 'Corretaje']),
  grains('Cartas de porte', 'CP', ['Carta de porte 0001-00000123', 'Carta de porte 0001-00000124', 'Carta de porte 0002-00000045', 'Carta de porte 0002-00000046', 'Carta de porte 0003-00000009']),
  grains('Categorías', 'CA', ['Productor', 'Acopiador', 'Exportador', 'Industria', 'Corredor']),
  grains('Cosechas', 'CO', ['Campaña 2022/23', 'Campaña 2023/24', 'Campaña 2024/25', 'Campaña 2025/26', 'Campaña 2026/27']),
  grains('Mercados', 'ME', ['Mercado a término', 'Mercado disponible', 'Mercado de futuros', 'Mercado de opciones', 'Mercado spot']),
  grains('Plantas', 'PL', ['Planta Rosario', 'Planta San Lorenzo', 'Planta Bahía Blanca', 'Planta Necochea', 'Planta Timbúes']),
  grains('Productos', 'PR', ['Soja', 'Maíz', 'Trigo', 'Girasol', 'Cebada']),
  grains('Tipos de contrato', 'TC', ['Compraventa', 'Canje', 'Depósito', 'Consignación', 'Fijación de precio']),
  grains('Transportes', 'TR', ['Camión', 'Vagón', 'Barcaza', 'Buque', 'Camión con acoplado']),
  grains('Unidades de medida', 'UM', ['Tonelada', 'Kilogramo', 'Quintal', 'Metro cúbico', 'Unidad']),
];

const access = define('/access-control');
export const MAESTROS_ACCESS_CONTROL = [
  access('Alcoholímetros', 'AL', ['Alcoholímetro portón 1', 'Alcoholímetro portón 2', 'Alcoholímetro acceso norte', 'Alcoholímetro acceso sur', 'Alcoholímetro móvil']),
  access('Dispositivos', 'DI', ['Lector RFID portón 1', 'Lector RFID portón 2', 'Cámara acceso norte', 'Barrera acceso sur', 'Torniquete oficinas']),
  access('Dispositivos GPS', 'GP', ['GPS unidad 101', 'GPS unidad 102', 'GPS unidad 103', 'GPS unidad 104', 'GPS unidad 105']),
  access('Entidades', 'EN', ['Puerto Norte S.A.', 'Del Sur Logística', 'Andina Comercial S.A.', 'Transportes del Litoral', 'Servicios Fluviales']),
  access('Grupos de dispositivos', 'GD', ['Accesos', 'Balanzas', 'Cámaras', 'Barreras', 'Alcoholímetros']),
  access('Grupos de personas', 'GR', ['Personal', 'Transportistas', 'Visitas', 'Contratistas', 'Proveedores']),
  access('Identificadores RFID', 'RF', ['Tarjeta RFID 000123', 'Tarjeta RFID 000124', 'Tarjeta RFID 000125', 'Tarjeta RFID 000126', 'Tarjeta RFID 000127']),
  access('Motivos de autorizaciones', 'MA', ['Ingreso por turno', 'Visita programada', 'Mantenimiento', 'Emergencia', 'Inspección']),
  access('Pantallas', 'PA', ['Pantalla portón 1', 'Pantalla portón 2', 'Pantalla báscula', 'Pantalla oficinas', 'Pantalla acceso sur']),
  access('Recorridos', 'RC', ['Recorrido norte', 'Recorrido sur', 'Recorrido muelle', 'Recorrido silos', 'Recorrido administración']),
  access('Vehículos', 'VE', ['Camión AB123CD', 'Camión AC456EF', 'Acoplado AD789GH', 'Utilitario AE012IJ', 'Camioneta AF345KL']),
];

const truckshift = define('/truckshift');
export const MAESTROS_TRUCKSHIFT = [
  truckshift('Puertas de ingreso', 'PI', ['Portón 1', 'Portón 2', 'Acceso norte', 'Acceso sur', 'Ingreso peatonal']),
  truckshift('Líneas de carga', 'LC', ['Línea 1 · Graneles', 'Línea 2 · Graneles', 'Línea 3 · Contenedores', 'Línea 4 · Líquidos', 'Línea 5 · Carga general']),
  truckshift('Depósitos', 'DE', ['Depósito central', 'Depósito norte', 'Depósito sur', 'Silo 1', 'Silo 2']),
  truckshift('Vehículos', 'VE', ['Camión AB123CD', 'Camión AC456EF', 'Acoplado AD789GH', 'Camión AE012IJ', 'Bitren AF345KL']),
  truckshift('Choferes', 'CH', ['Juan Pérez', 'María Gómez', 'Carlos López', 'Ana Torres', 'Luis Fernández']),
  truckshift('Motivos de rechazo', 'MR', ['Documentación vencida', 'Carga no declarada', 'Vehículo en mal estado', 'Fuera de turno', 'Chofer no habilitado']),
  truckshift('Transportistas', 'TR', ['Transportes del Litoral', 'Logística Andina', 'Fletes del Sur', 'Cargas Rosario', 'Transporte Fluvial S.A.']),
  truckshift('Playas de camiones', 'PL', ['Playa norte', 'Playa sur', 'Playa de espera 1', 'Playa de espera 2', 'Playa de emergencia']),
  truckshift('Clasificación de comisiones', 'CC', ['Comisión estándar', 'Comisión preferencial', 'Comisión por volumen', 'Comisión especial', 'Sin comisión']),
  truckshift('Motivos de permisos de ingreso', 'MP', ['Descarga programada', 'Carga programada', 'Mantenimiento', 'Inspección', 'Emergencia']),
  truckshift('Cupos diarios de camiones', 'CU', ['Cupo lunes', 'Cupo martes', 'Cupo miércoles', 'Cupo jueves', 'Cupo viernes']),
];

const scales = define('/scales');
export const MAESTROS_SCALES = [
  scales('Balanzas', 'BA', ['Balanza camiones 1', 'Balanza camiones 2', 'Balanza vagones', 'Balanza de laboratorio', 'Balanza de acceso norte']),
  scales('Unidades de medida', 'UM', ['Tonelada', 'Kilogramo', 'Gramo', 'Quintal', 'Libra']),
  scales('Grupos de balanzas', 'GB', ['Balanzas de ingreso', 'Balanzas de egreso', 'Balanzas de vagones', 'Balanzas de laboratorio', 'Balanzas móviles']),
];

// Purchases: Proveedores y Habilitación de fondos fijos tienen pantalla propia y NO están acá.
const purchases = define('/purchases');
export const MAESTROS_PURCHASES = [
  purchases('Áreas', 'AR', ['Compras', 'Administración', 'Operaciones', 'Mantenimiento', 'Sistemas']),
  purchases('Categorías de retenciones', 'CR', ['Ganancias', 'IVA', 'Ingresos brutos', 'Seguridad social', 'Otras retenciones']),
  purchases('Conceptos de compra', 'CC', ['Insumos', 'Servicios', 'Mantenimiento', 'Equipamiento', 'Fletes']),
  purchases('Conceptos de retención IVA', 'RV', ['Retención IVA 10,5%', 'Retención IVA 21%', 'Retención IVA 50%', 'Retención IVA 100%', 'Retención IVA exportación']),
  purchases('Conceptos de retenciones', 'CT', ['Locaciones de obra', 'Locaciones de servicio', 'Honorarios', 'Alquileres', 'Comisiones']),
  purchases('Condiciones de compra', 'CD', ['Contado', 'Cuenta corriente 30 días', 'Cuenta corriente 60 días', 'Cheque a 30 días', 'Transferencia anticipada']),
  purchases('Condiciones impositivas', 'CI', ['Responsable inscripto', 'Monotributo', 'Exento', 'No alcanzado', 'Proveedor del exterior']),
  purchases('Impuestos', 'IM', ['IVA 21%', 'IVA 10,5%', 'IVA 27%', 'Impuestos internos', 'Percepción IIBB']),
  purchases('Métodos de pago', 'MP', ['Efectivo', 'Transferencia bancaria', 'Cheque', 'Tarjeta corporativa', 'Echeq']),
  purchases('Retenciones de Ganancias', 'RG', ['Ganancias inscripto 2%', 'Ganancias inscripto 6%', 'Ganancias no inscripto 28%', 'Ganancias honorarios', 'Ganancias alquileres']),
  purchases('Retenciones de IIBB', 'RB', ['IIBB Santa Fe', 'IIBB Buenos Aires', 'IIBB Córdoba', 'IIBB CABA', 'IIBB Convenio multilateral']),
  purchases('Retenciones IVA', 'RI', ['Retención IVA general', 'Retención IVA servicios', 'Retención IVA bienes', 'Retención IVA obra', 'Retención IVA exenta']),
  purchases('Tipos de comprobantes', 'TC', ['Factura A', 'Factura B', 'Factura C', 'Nota de crédito A', 'Nota de débito A']),
  purchases('Unidades de medida', 'UM', ['Unidad', 'Kilogramo', 'Litro', 'Metro', 'Caja']),
  purchases('Zonas de entrega/retiro', 'ZE', ['Depósito central', 'Planta Rosario', 'Planta San Lorenzo', 'Retiro en proveedor', 'Puerto Norte']),
];

const hr = define('/human-resources');
export const MAESTROS_HUMAN_RESOURCES = [
  hr('Actividades', 'AC', ['Administración', 'Operaciones', 'Mantenimiento', 'Seguridad e higiene', 'Logística']),
  hr('Adicionales', 'AD', ['Presentismo', 'Antigüedad', 'Título', 'Zona desfavorable', 'Producción']),
  hr('Bancos', 'BA', ['Banco Nación', 'Banco Santa Fe', 'Banco Galicia', 'Banco Macro', 'Banco Santander']),
  hr('Categorías de conceptos', 'CC', ['Remunerativos', 'No remunerativos', 'Descuentos', 'Aportes', 'Contribuciones']),
  hr('Códigos AFIP', 'CA', ['011000 · Sueldo', '012000 · Horas extras', '013000 · SAC', '014000 · Vacaciones', '015000 · Adicionales']),
  hr('Condiciones', 'CO', ['Efectivo', 'A prueba', 'Contratado', 'Eventual', 'Pasante']),
  hr('Conceptos', 'CN', ['Sueldo básico', 'Horas extras 50%', 'Horas extras 100%', 'Presentismo', 'Aporte jubilatorio']),
  hr('Convenios', 'CV', ['Convenio portuario', 'Convenio de camioneros', 'Convenio administrativo', 'Fuera de convenio', 'Convenio de seguridad']),
  hr('Estados diarios', 'ED', ['Presente', 'Ausente', 'Licencia por enfermedad', 'Vacaciones', 'Feriado']),
  hr('Grupos', 'GR', ['Operativo', 'Administrativo', 'Gerencial', 'Mantenimiento', 'Seguridad']),
  hr('Modalidades de contratación', 'MC', ['Tiempo indeterminado', 'Plazo fijo', 'Eventual', 'Por temporada', 'Pasantía']),
  hr('Formas de pago', 'FP', ['Efectivo', 'Transferencia bancaria', 'Cheque', 'Depósito en cuenta', 'Billetera virtual']),
  hr('Lugares operativos', 'LO', ['Muelle norte', 'Muelle sur', 'Playa de camiones', 'Planta de silos', 'Oficinas administrativas']),
  hr('Obras sociales', 'OS', ['OSDE', 'Swiss Medical', 'Sancor Salud', 'Galeno', 'Medicus']),
  hr('Regímenes', 'RG', ['Régimen general', 'Régimen especial portuario', 'Régimen de jornada reducida', 'Régimen por temporada', 'Régimen de convenio']),
  hr('Situaciones', 'SI', ['Activo', 'Licencia', 'Suspendido', 'Jubilado', 'Baja']),
  hr('Códigos de siniestrados', 'CS', ['Accidente in itinere', 'Accidente en el puesto', 'Enfermedad profesional', 'Reagravación', 'Sin siniestro']),
  hr('Tipos de pagos', 'TP', ['Sueldo mensual', 'Anticipo', 'Aguinaldo', 'Liquidación final', 'Premio']),
  hr('Turnos', 'TU', ['Turno mañana', 'Turno tarde', 'Turno noche', 'Turno rotativo', 'Turno de guardia']),
  hr('Zonas geográficas', 'ZG', ['Zona norte', 'Zona sur', 'Zona centro', 'Zona litoral', 'Zona patagónica']),
  hr('Personal', 'PE', ['PÉREZ, Juan', 'GÓMEZ, María', 'LÓPEZ, Carlos', 'TORRES, Ana', 'FERNÁNDEZ, Luis']),
];

const fz = define('/free-zone');
export const MAESTROS_FREE_ZONE = [
  fz('Usuarios directos', 'UD', ['Zona Franca Rosario S.A.', 'Depósitos del Litoral', 'Logística Portuaria S.R.L.', 'Terminal Fluvial S.A.', 'Almacenes del Plata']),
  fz('Usuarios indirectos', 'UI', ['Importadora Andina', 'Exportadora del Sur', 'Textiles del Norte', 'Electrónica Global', 'Insumos Médicos S.A.']),
  fz('Consignatarios', 'CN', ['Consignaciones Paraná', 'Agencia Marítima Litoral', 'Despachos del Plata', 'Gestión Aduanera Norte', 'Consignataria Atlántica']),
  fz('Depósitos', 'DE', ['Depósito fiscal 1', 'Depósito fiscal 2', 'Depósito refrigerado', 'Depósito de contenedores', 'Playa descubierta']),
  fz('Contratos', 'CT', ['Disposición 2026-001', 'Disposición 2026-002', 'Disposición 2026-003', 'Disposición 2026-004', 'Disposición 2026-005']),
  fz('Compradores', 'CO', ['Comercial Andina S.A.', 'Importaciones del Sur', 'Distribuidora Central', 'Mercosur Trading', 'Grupo Pampa']),
  fz('Buques', 'BU', ['MV Atlántico', 'MV Río de la Plata', 'MV Paraná', 'MV Uruguay', 'MV Santa Fe']),
  fz('Puertos', 'PU', ['Rosario', 'Buenos Aires', 'Montevideo', 'Santos', 'Asunción']),
  fz('Tipos de documentos', 'TD', ['Remito de ingreso', 'Remito de egreso', 'Manifiesto', 'Documento de transporte', 'Factura comercial']),
  fz('Embalaje', 'EM', ['Pallet', 'Caja de cartón', 'Contenedor 20"', 'Contenedor 40"', 'A granel']),
  fz('Unidades de medida', 'UM', ['Unidad', 'Kilogramo', 'Tonelada', 'Litro', 'Metro cúbico']),
  fz('Familias de productos', 'FP', ['Electrónica', 'Textiles', 'Alimentos', 'Maquinaria', 'Insumos médicos']),
  fz('Productos', 'PR', ['Notebook 15"', 'Tela de algodón', 'Aceite de oliva', 'Repuesto industrial', 'Guantes descartables']),
];

const accounting = define('/accounting');
export const MAESTROS_ACCOUNTING = [
  accounting('Centros de costo', 'CC', ['Administración', 'Operaciones', 'Mantenimiento', 'Comercial', 'Sistemas']),
  accounting('Plan de cuentas', 'PC', ['1 · Activo', '2 · Pasivo', '3 · Patrimonio neto', '4 · Ingresos', '5 · Egresos']),
  accounting('Ejercicios contables', 'EJ', ['Ejercicio 2023', 'Ejercicio 2024', 'Ejercicio 2025', 'Ejercicio 2026', 'Ejercicio 2027']),
  accounting('Legajos', 'LE', ['Legajo 1001', 'Legajo 1002', 'Legajo 1003', 'Legajo 1004', 'Legajo 1005']),
  accounting('Esquemas de cuentas', 'EC', ['Esquema general', 'Esquema de ventas', 'Esquema de compras', 'Esquema de tesorería', 'Esquema de sueldos']),
  accounting('Esquemas de cuentas detalles', 'ED', ['Detalle ventas nacionales', 'Detalle ventas exterior', 'Detalle compras nacionales', 'Detalle compras exterior', 'Detalle gastos varios']),
];

export { maestroRows };
