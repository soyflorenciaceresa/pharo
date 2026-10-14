import { useState } from 'react';
import LayoutMaestroBasico from '../../../templates/LayoutMaestroBasico/LayoutMaestroBasico.jsx';
import FormContainer from '../../../components/FormContainer/FormContainer.jsx';
import Accordion from '../../../components/Accordion/Accordion.jsx';
import TextField from '../../../components/TextField/TextField.jsx';
import Select from '../../../components/Select/Select.jsx';
import Checkbox from '../../../components/Checkbox/Checkbox.jsx';
import Tabs from '../../../components/Tabs/Tabs.jsx';
import { GRAINS_SIDEBAR_PROPS } from '../../../config/sidebars/grains.js';
import styles from './ContratoFormulario.module.css';

const TITLES = {
  create: 'Crear Contrato',
  view: 'Visualizar Contrato',
  edit: 'Editar Contrato',
};

const TABS = [
  { id: 'principal', label: 'Principal' },
  { id: 'relacionar', label: 'Relacionar' },
  { id: 'boleto', label: 'Boleto' },
  { id: 'aplicaciones', label: 'Aplicaciones' },
];

const ACTIVIDAD_SISA_OPTIONS = [
  { value: 'productor', label: 'Productor' },
  { value: 'acopiador', label: 'Acopiador' },
  { value: 'corredor', label: 'Corredor' },
  { value: 'exportador', label: 'Exportador' },
  { value: 'industrial', label: 'Industrial' },
  { value: 'otro', label: 'Otro' },
];

// Contenido pendiente de definir — placeholder, ver nota de ContratoFormulario.jsx.
const OTHER_PRINCIPAL_ACCORDIONS = [];

export default function ContratoFormulario({ onNavigate, onSearch, contratos = [], onCreateContrato, onUpdateContrato, params = {}, mode = 'create' }) {
  const isView = mode === 'view';
  const isEdit = mode === 'edit';
  const existing = mode !== 'create' ? contratos.find((r) => String(r.id) === String(params.id)) : null;

  const navigate = onNavigate ?? ((d) => console.log('navigate', d));

  const [codigoContrato, setCodigoContrato] = useState(existing?.codigoContrato ?? '');
  const [codigoReferencia, setCodigoReferencia] = useState(existing?.codigoReferencia ?? '');
  const [fechaConcertacion, setFechaConcertacion] = useState(existing?.fechaConcertacion ?? '');
  const [fechaNegocio, setFechaNegocio] = useState(existing?.fechaNegocio ?? '');
  const [tipoContrato, setTipoContrato] = useState(existing?.tipoContrato ?? '');
  const [tipoMercado, setTipoMercado] = useState(existing?.tipoMercado ?? '');
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState('principal');

  const [vendedor, setVendedor] = useState(existing?.vendedor ?? '');
  const [actividadSisa, setActividadSisa] = useState(existing?.actividadSisa ?? '');
  const [sucursal, setSucursal] = useState(existing?.sucursal ?? '');
  const [direccion, setDireccion] = useState(existing?.direccion ?? '');
  const [localidades, setLocalidades] = useState(existing?.localidades ?? '');

  const [corredor, setCorredor] = useState(existing?.corredor ?? '');
  const [grabaCtaCteCorredor, setGrabaCtaCteCorredor] = useState(existing?.grabaCtaCteCorredor ?? false);
  const [liquidaCorredor, setLiquidaCorredor] = useState(existing?.liquidaCorredor ?? false);
  const [nroInterno, setNroInterno] = useState(existing?.nroInterno ?? '');

  const [comprador, setComprador] = useState(existing?.comprador ?? '');
  const [actividadSisaComprador, setActividadSisaComprador] = useState(existing?.actividadSisaComprador ?? '');
  const [sucursalComprador, setSucursalComprador] = useState(existing?.sucursalComprador ?? '');
  const [direccionComprador, setDireccionComprador] = useState(existing?.direccionComprador ?? '');
  const [localidadesComprador, setLocalidadesComprador] = useState(existing?.localidadesComprador ?? '');

  const [cabFechaNegocio, setCabFechaNegocio] = useState(existing?.cabFechaNegocio ?? '');
  const [cabTipoMercado, setCabTipoMercado] = useState(existing?.cabTipoMercado ?? '');
  const [observaciones, setObservaciones] = useState(existing?.observaciones ?? '');
  const [planta, setPlanta] = useState(existing?.planta ?? '');
  const [canje, setCanje] = useState(existing?.canje ?? false);
  const [contratoDeposito, setContratoDeposito] = useState(existing?.contratoDeposito ?? false);
  const [precio, setPrecio] = useState(existing?.precio ?? '');
  const [fechaFijacionDesde, setFechaFijacionDesde] = useState(existing?.fechaFijacionDesde ?? '');
  const [fechaFijacionHasta, setFechaFijacionHasta] = useState(existing?.fechaFijacionHasta ?? '');
  const [cantidad, setCantidad] = useState(existing?.cantidad ?? '');
  const [toleranciaEntrega, setToleranciaEntrega] = useState(existing?.toleranciaEntrega ?? '');
  const [um, setUm] = useState(existing?.um ?? '');
  const [ajusteCantidad, setAjusteCantidad] = useState(existing?.ajusteCantidad ?? '');
  const [porcentaje, setPorcentaje] = useState(existing?.porcentaje ?? '');
  const [cantCamiones, setCantCamiones] = useState(existing?.cantCamiones ?? '');
  const [condicionCalidad, setCondicionCalidad] = useState(existing?.condicionCalidad ?? '');
  const [entregasRecibosDesde, setEntregasRecibosDesde] = useState(existing?.entregasRecibosDesde ?? '');
  const [entregasRecibosHasta, setEntregasRecibosHasta] = useState(existing?.entregasRecibosHasta ?? '');
  const [cabFechaConcertacion, setCabFechaConcertacion] = useState(existing?.cabFechaConcertacion ?? '');
  const [numeroSioGranos, setNumeroSioGranos] = useState(existing?.numeroSioGranos ?? '');
  const [provinciaInstrumentacion, setProvinciaInstrumentacion] = useState(existing?.provinciaInstrumentacion ?? '');
  const [adhiereFondoFederal, setAdhiereFondoFederal] = useState(existing?.adhiereFondoFederal ?? false);

  const [producto, setProducto] = useState(existing?.producto ?? '');
  const [cosecha, setCosecha] = useState(existing?.cosecha ?? '');
  const [kgPromedio, setKgPromedio] = useState(existing?.kgPromedio ?? '');
  const [fechaImpCartaGar, setFechaImpCartaGar] = useState(existing?.fechaImpCartaGar ?? '');
  const [transporte, setTransporte] = useState(existing?.transporte ?? '');
  const [cumplido, setCumplido] = useState(existing?.cumplido ?? '');
  const [procedencia, setProcedencia] = useState(existing?.procedencia ?? '');
  const [destino, setDestino] = useState(existing?.destino ?? '');

  const [fechaInfoPago, setFechaInfoPago] = useState(existing?.fechaInfoPago ?? '');
  const [condicionPago, setCondicionPago] = useState(existing?.condicionPago ?? '');
  const [lugarPago, setLugarPago] = useState(existing?.lugarPago ?? '');
  const [corredorPorcentajePago, setCorredorPorcentajePago] = useState(existing?.corredorPorcentajePago ?? '');
  const [mercaderiaProduccionPropia, setMercaderiaProduccionPropia] = useState(existing?.mercaderiaProduccionPropia ?? '');

  const [moneda, setMoneda] = useState(existing?.moneda ?? '');
  const [comisionVendedor, setComisionVendedor] = useState(existing?.comisionVendedor ?? '');
  const [comisionCorredor, setComisionCorredor] = useState(existing?.comisionCorredor ?? '');
  const [comisionComprador, setComisionComprador] = useState(existing?.comisionComprador ?? '');
  const [llevaLiquidacionParcial, setLlevaLiquidacionParcial] = useState(existing?.llevaLiquidacionParcial ?? false);
  const [servicio, setServicio] = useState(existing?.servicio ?? '');
  const [puntoVenta, setPuntoVenta] = useState(existing?.puntoVenta ?? '');

  function handleCancel() {
    navigate({ href: '/grains/contratos', label: 'Contratos' });
  }

  // Si se pide ver/editar un contrato que no existe (ej. URL directa con un
  // id inválido), se muestra el mismo shell sin formulario en vez de romper.
  if (mode !== 'create' && !existing) {
    return (
      <LayoutMaestroBasico
        sidebar={GRAINS_SIDEBAR_PROPS}
        activeHref="/grains/contratos"
        onNavigate={navigate}
        onSearch={onSearch}
        onCompanyChange={(c) => console.log('company change', c)}
        onLogout={() => console.log('logout')}
        onToggle={(d) => console.log('toggle', d)}
        breadcrumb={[{ label: 'Contratos' }]}
        title="Contrato no encontrado"
        onCancel={handleCancel}
        cancelLabel="Volver"
        formTitle="Datos del contrato"
        fullWidth
      >
        <p className={styles.notFound}>No se encontró el contrato solicitado.</p>
      </LayoutMaestroBasico>
    );
  }

  function updateField(setter, key) {
    return (e) => {
      setter(e.target.value);
      if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
    };
  }

  function handleSave() {
    const nextErrors = {};
    if (!codigoContrato.trim()) nextErrors.codigoContrato = 'Campo requerido';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const contrato = {
      id: existing?.id ?? Date.now(),
      codigoContrato: codigoContrato.trim(),
      codigoReferencia: codigoReferencia.trim(),
      fechaConcertacion,
      fechaNegocio,
      tipoContrato: tipoContrato.trim(),
      tipoMercado: tipoMercado.trim(),
      vendedor: vendedor.trim(),
      actividadSisa,
      sucursal: sucursal.trim(),
      direccion: direccion.trim(),
      localidades: localidades.trim(),
      corredor: corredor.trim(),
      grabaCtaCteCorredor,
      liquidaCorredor,
      nroInterno: nroInterno.trim(),
      comprador: comprador.trim(),
      actividadSisaComprador,
      sucursalComprador: sucursalComprador.trim(),
      direccionComprador: direccionComprador.trim(),
      localidadesComprador: localidadesComprador.trim(),
      cabFechaNegocio,
      cabTipoMercado: cabTipoMercado.trim(),
      observaciones: observaciones.trim(),
      planta: planta.trim(),
      canje,
      contratoDeposito,
      precio: precio.trim(),
      fechaFijacionDesde,
      fechaFijacionHasta,
      cantidad: cantidad.trim(),
      toleranciaEntrega: toleranciaEntrega.trim(),
      um: um.trim(),
      ajusteCantidad: ajusteCantidad.trim(),
      porcentaje: porcentaje.trim(),
      cantCamiones: cantCamiones.trim(),
      condicionCalidad: condicionCalidad.trim(),
      entregasRecibosDesde: entregasRecibosDesde.trim(),
      entregasRecibosHasta: entregasRecibosHasta.trim(),
      cabFechaConcertacion,
      numeroSioGranos: numeroSioGranos.trim(),
      provinciaInstrumentacion: provinciaInstrumentacion.trim(),
      adhiereFondoFederal,
      producto: producto.trim(),
      cosecha: cosecha.trim(),
      kgPromedio: kgPromedio.trim(),
      fechaImpCartaGar,
      transporte: transporte.trim(),
      cumplido,
      procedencia: procedencia.trim(),
      destino: destino.trim(),
      fechaInfoPago,
      condicionPago: condicionPago.trim(),
      lugarPago: lugarPago.trim(),
      corredorPorcentajePago: corredorPorcentajePago.trim(),
      mercaderiaProduccionPropia: mercaderiaProduccionPropia.trim(),
      moneda: moneda.trim(),
      comisionVendedor: comisionVendedor.trim(),
      comisionCorredor: comisionCorredor.trim(),
      comisionComprador: comisionComprador.trim(),
      llevaLiquidacionParcial,
      servicio: servicio.trim(),
      puntoVenta: puntoVenta.trim(),
    };

    if (isEdit) onUpdateContrato?.(contrato);
    else onCreateContrato?.(contrato);
  }

  return (
    <LayoutMaestroBasico
      sidebar={GRAINS_SIDEBAR_PROPS}
      activeHref="/grains/contratos"
      onNavigate={navigate}
      onSearch={onSearch}
      onCompanyChange={(c) => console.log('company change', c)}
      onLogout={() => console.log('logout')}
      onToggle={(d) => console.log('toggle', d)}
      breadcrumb={[{ label: 'Contratos' }, { label: mode === 'create' ? 'Crear' : TITLES[mode] }]}
      title={TITLES[mode]}
      onSave={isView ? undefined : handleSave}
      onCancel={handleCancel}
      cancelLabel={isView ? 'Volver' : 'Cancelar'}
      fullWidth
    >
      <FormContainer title="Datos del contrato">
        <div className={styles.fieldsRow}>
          <div className={styles.field}>
            <TextField
              label="Código de contrato"
              value={codigoContrato}
              onChange={updateField(setCodigoContrato, 'codigoContrato')}
              disabled={isView}
              error={Boolean(errors.codigoContrato)}
              helperText={errors.codigoContrato}
            />
          </div>
          <div className={styles.field}>
            <TextField label="Código de referencia" value={codigoReferencia} onChange={(e) => setCodigoReferencia(e.target.value)} disabled={isView} />
          </div>
          <div className={styles.field}>
            <TextField label="Fecha de concertación" type="date" value={fechaConcertacion} onChange={(e) => setFechaConcertacion(e.target.value)} disabled={isView} />
          </div>
        </div>
        <div className={styles.fieldsRow}>
          <div className={styles.field}>
            <TextField label="Fecha del negocio" type="date" value={fechaNegocio} onChange={(e) => setFechaNegocio(e.target.value)} disabled={isView} />
          </div>
          <div className={styles.field}>
            <TextField label="Tipo de contrato" value={tipoContrato} onChange={(e) => setTipoContrato(e.target.value)} disabled={isView} />
          </div>
          <div className={styles.field}>
            <TextField label="Tipo de mercado" value={tipoMercado} onChange={(e) => setTipoMercado(e.target.value)} disabled={isView} />
          </div>
        </div>
      </FormContainer>

      <Tabs items={TABS} value={activeTab} onChange={setActiveTab} />

      {activeTab === 'principal' && (
        <div className={styles.accordionList}>
          <Accordion title="Datos del vendedor" defaultExpanded={false}>
            <div className={styles.fieldsRow}>
              <div className={styles.field}>
                <TextField label="Vendedor" value={vendedor} onChange={(e) => setVendedor(e.target.value)} disabled={isView} />
              </div>
              <div className={styles.field}>
                <Select
                  label="Actividad SISA"
                  value={actividadSisa}
                  onChange={(e) => setActividadSisa(e.target.value)}
                  options={ACTIVIDAD_SISA_OPTIONS}
                  disabled={isView}
                />
              </div>
              <div className={styles.field}>
                <TextField label="Sucursal" value={sucursal} onChange={(e) => setSucursal(e.target.value)} disabled={isView} />
              </div>
            </div>
            <div className={styles.fieldsRow}>
              <div className={styles.field}>
                <TextField label="Dirección" value={direccion} onChange={(e) => setDireccion(e.target.value)} disabled={isView} />
              </div>
              <div className={styles.field}>
                <TextField label="Localidades" value={localidades} onChange={(e) => setLocalidades(e.target.value)} disabled={isView} />
              </div>
            </div>
          </Accordion>

          <Accordion title="Corredor/Otros" defaultExpanded={false}>
            <div className={styles.fieldsRow}>
              <div className={styles.field}>
                <TextField label="Corredor" value={corredor} onChange={(e) => setCorredor(e.target.value)} disabled={isView} />
              </div>
              <div className={styles.field}>
                <TextField label="Nro interno" value={nroInterno} onChange={(e) => setNroInterno(e.target.value)} disabled={isView} />
              </div>
            </div>
            <Checkbox label="Graba Cta Cte Corredor" checked={grabaCtaCteCorredor} onChange={(e) => setGrabaCtaCteCorredor(e.target.checked)} disabled={isView} />
            <Checkbox label="Liquida corredor" checked={liquidaCorredor} onChange={(e) => setLiquidaCorredor(e.target.checked)} disabled={isView} />
          </Accordion>

          <Accordion title="Datos del comprador" defaultExpanded={false}>
            <div className={styles.fieldsRow}>
              <div className={styles.field}>
                <TextField label="Comprador" value={comprador} onChange={(e) => setComprador(e.target.value)} disabled={isView} />
              </div>
              <div className={styles.field}>
                <Select
                  label="Actividad SISA"
                  value={actividadSisaComprador}
                  onChange={(e) => setActividadSisaComprador(e.target.value)}
                  options={ACTIVIDAD_SISA_OPTIONS}
                  disabled={isView}
                />
              </div>
              <div className={styles.field}>
                <TextField label="Sucursal" value={sucursalComprador} onChange={(e) => setSucursalComprador(e.target.value)} disabled={isView} />
              </div>
            </div>
            <div className={styles.fieldsRow}>
              <div className={styles.field}>
                <TextField label="Dirección" value={direccionComprador} onChange={(e) => setDireccionComprador(e.target.value)} disabled={isView} />
              </div>
              <div className={styles.field}>
                <TextField label="Localidades" value={localidadesComprador} onChange={(e) => setLocalidadesComprador(e.target.value)} disabled={isView} />
              </div>
            </div>
          </Accordion>

          <Accordion title="Cabecera del contrato" defaultExpanded={false}>
            <div className={styles.fieldsRow}>
              <div className={styles.field}>
                <TextField label="Fecha negocio" type="date" value={cabFechaNegocio} onChange={(e) => setCabFechaNegocio(e.target.value)} disabled={isView} />
              </div>
              <div className={styles.field}>
                <TextField label="Tipo de mercado" value={cabTipoMercado} onChange={(e) => setCabTipoMercado(e.target.value)} disabled={isView} />
              </div>
              <div className={styles.field}>
                <TextField label="Observaciones" value={observaciones} onChange={(e) => setObservaciones(e.target.value)} disabled={isView} />
              </div>
            </div>
            <div className={styles.fieldsRow}>
              <div className={styles.field}>
                <TextField label="Planta" value={planta} onChange={(e) => setPlanta(e.target.value)} disabled={isView} />
              </div>
              <div className={styles.field}>
                <TextField label="Precio" value={precio} onChange={(e) => setPrecio(e.target.value)} disabled={isView} />
              </div>
              <div className={styles.field}>
                <TextField label="Cantidad" value={cantidad} onChange={(e) => setCantidad(e.target.value)} disabled={isView} />
              </div>
            </div>
            <div className={styles.fieldsRow}>
              <div className={styles.field}>
                <TextField label="Fecha fijación (desde)" type="date" value={fechaFijacionDesde} onChange={(e) => setFechaFijacionDesde(e.target.value)} disabled={isView} />
              </div>
              <div className={styles.field}>
                <TextField label="Fecha fijación (hasta)" type="date" value={fechaFijacionHasta} onChange={(e) => setFechaFijacionHasta(e.target.value)} disabled={isView} />
              </div>
              <div className={styles.field}>
                <TextField label="Tolerancia de entrega" value={toleranciaEntrega} onChange={(e) => setToleranciaEntrega(e.target.value)} disabled={isView} />
              </div>
            </div>
            <div className={styles.fieldsRow}>
              <div className={styles.field}>
                <TextField label="UM" value={um} onChange={(e) => setUm(e.target.value)} disabled={isView} />
              </div>
              <div className={styles.field}>
                <TextField label="Ajuste de cantidad" value={ajusteCantidad} onChange={(e) => setAjusteCantidad(e.target.value)} disabled={isView} />
              </div>
              <div className={styles.field}>
                <TextField label="Porcentaje +/-" value={porcentaje} onChange={(e) => setPorcentaje(e.target.value)} disabled={isView} />
              </div>
            </div>
            <div className={styles.fieldsRow}>
              <div className={styles.field}>
                <TextField label="Cant. camiones" value={cantCamiones} onChange={(e) => setCantCamiones(e.target.value)} disabled={isView} />
              </div>
              <div className={styles.field}>
                <TextField label="Condición de calidad" value={condicionCalidad} onChange={(e) => setCondicionCalidad(e.target.value)} disabled={isView} />
              </div>
              <div className={styles.field}>
                <TextField label="Entregas y recibos (desde)" value={entregasRecibosDesde} onChange={(e) => setEntregasRecibosDesde(e.target.value)} disabled={isView} />
              </div>
            </div>
            <div className={styles.fieldsRow}>
              <div className={styles.field}>
                <TextField label="Entregas y recibos (hasta)" value={entregasRecibosHasta} onChange={(e) => setEntregasRecibosHasta(e.target.value)} disabled={isView} />
              </div>
              <div className={styles.field}>
                <TextField label="Fecha de concertación" type="date" value={cabFechaConcertacion} onChange={(e) => setCabFechaConcertacion(e.target.value)} disabled={isView} />
              </div>
              <div className={styles.field}>
                <TextField label="Número de SIO Granos" value={numeroSioGranos} onChange={(e) => setNumeroSioGranos(e.target.value)} disabled={isView} />
              </div>
            </div>
            <div className={styles.fieldsRow}>
              <div className={styles.field}>
                <TextField label="Provincia de instrumentación" value={provinciaInstrumentacion} onChange={(e) => setProvinciaInstrumentacion(e.target.value)} disabled={isView} />
              </div>
            </div>
            <Checkbox label="Canje" checked={canje} onChange={(e) => setCanje(e.target.checked)} disabled={isView} />
            <Checkbox label="Contrato depósito (Madre/Hijo)" checked={contratoDeposito} onChange={(e) => setContratoDeposito(e.target.checked)} disabled={isView} />
            <Checkbox label="Adhiere fondo federal agropecuario" checked={adhiereFondoFederal} onChange={(e) => setAdhiereFondoFederal(e.target.checked)} disabled={isView} />
          </Accordion>

          <Accordion title="Mercadería" defaultExpanded={false}>
            <div className={styles.fieldsRow}>
              <div className={styles.field}>
                <TextField label="Producto" value={producto} onChange={(e) => setProducto(e.target.value)} disabled={isView} />
              </div>
              <div className={styles.field}>
                <TextField label="Cosecha" value={cosecha} onChange={(e) => setCosecha(e.target.value)} disabled={isView} />
              </div>
              <div className={styles.field}>
                <TextField label="Kg promedio" value={kgPromedio} onChange={(e) => setKgPromedio(e.target.value)} disabled={isView} />
              </div>
            </div>
            <div className={styles.fieldsRow}>
              <div className={styles.field}>
                <TextField label="Fec. Imp. Carta Gar" type="date" value={fechaImpCartaGar} onChange={(e) => setFechaImpCartaGar(e.target.value)} disabled={isView} />
              </div>
              <div className={styles.field}>
                <TextField label="Transporte" value={transporte} onChange={(e) => setTransporte(e.target.value)} disabled={isView} />
              </div>
              <div className={styles.field}>
                <TextField label="Cumplido" type="date" value={cumplido} onChange={(e) => setCumplido(e.target.value)} disabled={isView} />
              </div>
            </div>
            <div className={styles.fieldsRow}>
              <div className={styles.field}>
                <TextField label="Procedencia" value={procedencia} onChange={(e) => setProcedencia(e.target.value)} disabled={isView} />
              </div>
              <div className={styles.field}>
                <TextField label="Destino" value={destino} onChange={(e) => setDestino(e.target.value)} disabled={isView} />
              </div>
            </div>
          </Accordion>

          <Accordion title="Información sobre pagos" defaultExpanded={false}>
            <div className={styles.fieldsRow}>
              <div className={styles.field}>
                <TextField label="Fecha" type="date" value={fechaInfoPago} onChange={(e) => setFechaInfoPago(e.target.value)} disabled={isView} />
              </div>
              <div className={styles.field}>
                <TextField label="Condición de pago" value={condicionPago} onChange={(e) => setCondicionPago(e.target.value)} disabled={isView} />
              </div>
              <div className={styles.field}>
                <TextField label="Lugar de pago" value={lugarPago} onChange={(e) => setLugarPago(e.target.value)} disabled={isView} />
              </div>
            </div>
            <div className={styles.fieldsRow}>
              <div className={styles.field}>
                <TextField label="Corredor % pago" value={corredorPorcentajePago} onChange={(e) => setCorredorPorcentajePago(e.target.value)} disabled={isView} />
              </div>
              <div className={styles.field}>
                <TextField label="Mercadería de producción propia del vendedor" value={mercaderiaProduccionPropia} onChange={(e) => setMercaderiaProduccionPropia(e.target.value)} disabled={isView} />
              </div>
            </div>
          </Accordion>

          <Accordion title="Facturación" defaultExpanded={false}>
            <div className={styles.fieldsRow}>
              <div className={styles.field}>
                <TextField label="Moneda" value={moneda} onChange={(e) => setMoneda(e.target.value)} disabled={isView} />
              </div>
              <div className={styles.field}>
                <TextField label="Comisión vendedor" value={comisionVendedor} onChange={(e) => setComisionVendedor(e.target.value)} disabled={isView} />
              </div>
              <div className={styles.field}>
                <TextField label="Comisión corredor" value={comisionCorredor} onChange={(e) => setComisionCorredor(e.target.value)} disabled={isView} />
              </div>
            </div>
            <div className={styles.fieldsRow}>
              <div className={styles.field}>
                <TextField label="Comisión comprador" value={comisionComprador} onChange={(e) => setComisionComprador(e.target.value)} disabled={isView} />
              </div>
              <div className={styles.field}>
                <TextField label="Servicio" value={servicio} onChange={(e) => setServicio(e.target.value)} disabled={isView} />
              </div>
              <div className={styles.field}>
                <TextField label="Punto de venta" value={puntoVenta} onChange={(e) => setPuntoVenta(e.target.value)} disabled={isView} />
              </div>
            </div>
            <Checkbox label="Lleva liquidación parcial" checked={llevaLiquidacionParcial} onChange={(e) => setLlevaLiquidacionParcial(e.target.checked)} disabled={isView} />
          </Accordion>

          {OTHER_PRINCIPAL_ACCORDIONS.map((title) => (
            <Accordion key={title} title={title}>
              <p className={styles.accordionPlaceholder}>Contenido pendiente de definir.</p>
            </Accordion>
          ))}
        </div>
      )}
    </LayoutMaestroBasico>
  );
}
