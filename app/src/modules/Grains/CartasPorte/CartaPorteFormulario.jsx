import { useState } from 'react';
import LayoutMaestroFormulario from '../../../templates/LayoutMaestroFormulario/LayoutMaestroFormulario.jsx';
import LayoutMaestroBasico from '../../../templates/LayoutMaestroBasico/LayoutMaestroBasico.jsx';
import FormRow from '../../../components/FormRow/FormRow.jsx';
import TextField from '../../../components/TextField/TextField.jsx';
import Select from '../../../components/Select/Select.jsx';
import Badge from '../../../components/Badge/Badge.jsx';
import ChildItemModal from '../../HumanResources/Maestros/ChildItemModal.jsx';
import { GRAINS_SIDEBAR_PROPS } from '../../../config/sidebars/grains.js';
import styles from './CartaPorteFormulario.module.css';

const HREF = '/grains/cartas-de-porte';
const VERBS = { create: 'Crear', view: 'Visualizar', edit: 'Editar' };
const today = () => new Date().toISOString().slice(0, 10);
const opt = (...labels) => labels.map((label) => ({ value: label, label }));
const PARTES = opt('Agroexport S.A.', 'Cereales del Sur', 'Molinos Andinos', 'Exportadora Litoral', 'Aceitera del Río');
const LUGARES = opt('Rosario', 'San Lorenzo', 'Venado Tuerto', 'Rufino', 'Bahía Blanca', 'Timbúes');
const num = (v) => (v === '' || v === undefined ? 0 : Number(v));
const fmt = (n) => n.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const EMPTY = {
  ctg: '', nroCarta: '', fechaEmision: today(), fechaDescarga: today(), producto: '', cosecha: '', entregador: '', comprador: '', intermediario: '',
  procedencia: '', plantaProcedencia: '', destino: '', plantaDestino: '', titular: '', comercialPrimaria: '', comercialSecundaria: '', corredorPrimaria: '', corredorSecundaria: '', observaciones: '',
  transportista: '', patentes: '', fechaPartida: '', distancia: '', chofer: '', tarifaFlete: '', pagadorFlete: '', patenteCamion: '', patenteAcoplado: '',
  kgProcedencia: '0', kgDescargados: '0', kgTara: '0',
};

// Definición de las 4 colecciones hijas (una tab cada una). Mermas comunes y de
// servicios comparten columnas; las de calidad suman bonificación, rebaja y precio.
const MERMA_FIELDS = [
  { key: 'descripcion', label: 'Descripción', type: 'text', required: true },
  { key: 'porcentaje', label: 'Porcentaje (%)', type: 'number' },
  { key: 'kg', label: 'Kg', type: 'number' },
  { key: 'obligatorio', label: 'Obligatorio', type: 'check' },
];
const COLLECTIONS = {
  comunes: { title: 'merma común', fields: MERMA_FIELDS },
  servicios: { title: 'merma de servicio', fields: MERMA_FIELDS },
  calidad: {
    title: 'merma de calidad',
    fields: [
      { key: 'descripcion', label: 'Descripción', type: 'text', required: true },
      { key: 'porcentaje', label: 'Porcentaje (%)', type: 'number' },
      { key: 'bonificacion', label: 'Bonificación', type: 'number' },
      { key: 'rebaja', label: 'Rebaja', type: 'number' },
      { key: 'kg', label: 'Kg', type: 'number' },
      { key: 'precio', label: 'Precio', type: 'number' },
      { key: 'obligatorio', label: 'Obligatorio', type: 'check' },
    ],
  },
  aplicaciones: {
    title: 'aplicación',
    fields: [
      { key: 'contratoAsociado', label: 'Contrato asociado', type: 'text', required: true },
      { key: 'contratoRelacionado', label: 'Contrato relacionado', type: 'text' },
      { key: 'operacion', label: 'Operación de contrato', type: 'text' },
      { key: 'kgTotales', label: 'Kilos totales', type: 'number', required: true },
      { key: 'kgAplicados', label: 'Kg aplicados', type: 'number', required: true },
    ],
  },
};

// Maestro "Cartas de porte" (Grains). Template M-04c · cabecera + tabs con
// grilla. El original tenía 5 tabs (Carta de porte | Mermas | Transporte |
// Aplicaciones | Comprobantes): según la regla del kit las tabs son para
// colecciones hijas, no para grupos de campos. "Carta de porte" y "Transporte"
// pasan a Form Section de la cabecera (Datos generales, Procedencia y destino,
// Participantes, Transporte, Mercadería); y quedan como tabs las colecciones:
// Mermas comunes, Mermas de servicios, Mermas de calidad y Aplicaciones. Los
// Kg netos se calculan (descargados − mermas − tara) y el resumen de
// aplicaciones (Total / Aplicado / Saldo) también. Supuestos: obligatorios los
// que traían `*`; el código de la grilla es el CTG. ⚠️ La tab "Comprobantes"
// no tenía captura: falta. Pendientes: selectores con búsqueda y texto largo
// para Observaciones.
export default function CartaPorteFormulario({ truckshiftRows = {}, onSaveTruckshift, onNavigate, onSearch, params = {}, mode = 'create' }) {
  const rows = truckshiftRows[HREF] ?? [];
  const catalog = (slug) => (truckshiftRows[`/grains/${slug}`] ?? []).map((r) => ({ value: `${r.codigo} · ${r.denominacion}`, label: `${r.codigo} · ${r.denominacion}` }));
  const isView = mode === 'view';
  const isEdit = mode === 'edit';
  const existing = mode !== 'create' ? rows.find((r) => String(r.id) === String(params.id)) : null;
  const navigate = onNavigate ?? ((d) => console.log('navigate', d));

  const [values, setValues] = useState({ ...EMPTY, ...(existing?.values ?? {}), ...(existing && !existing.values ? { ctg: existing.codigo } : {}) });
  const [items, setItems] = useState(existing?.items ?? { comunes: [], servicios: [], calidad: [], aplicaciones: [] });
  const [errors, setErrors] = useState({});
  const [modal, setModal] = useState(null);

  const common = {
    sidebar: GRAINS_SIDEBAR_PROPS, activeHref: HREF, onNavigate: navigate, onSearch,
    onCompanyChange: (c) => console.log('company change', c), onLogout: () => console.log('logout'), onToggle: (d) => console.log('toggle', d),
  };
  const goList = () => navigate({ href: HREF, label: 'Cartas de porte' });

  if (mode !== 'create' && !existing) {
    return (
      <LayoutMaestroBasico {...common} breadcrumb={[{ label: 'Cartas de porte' }]} title="Carta de porte no encontrada" onCancel={goList} cancelLabel="Volver" formTitle="Datos generales">
        <p className={styles.notFound}>No se encontró la carta de porte solicitada.</p>
      </LayoutMaestroBasico>
    );
  }

  function set(key, value) {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }
  const text = (key, label, extra = {}) => <TextField label={label} value={values[key]} onChange={(e) => set(key, e.target.value)} disabled={isView} error={Boolean(errors[key])} helperText={errors[key]} {...extra} />;
  const select = (key, label, options) => <Select label={label} value={values[key]} onChange={(e) => set(key, e.target.value)} options={options} placeholder="Seleccionar..." disabled={isView} error={Boolean(errors[key])} helperText={errors[key]} />;

  const mermasKg = ['comunes', 'servicios', 'calidad'].reduce((sum, k) => sum + items[k].reduce((s, r) => s + num(r.kg), 0), 0);
  const kgNetos = num(values.kgDescargados) - mermasKg - num(values.kgTara);
  const totalAplicable = kgNetos;
  const aplicado = items.aplicaciones.reduce((s, r) => s + num(r.kgAplicados), 0);

  function handleSave() {
    const next = {};
    const required = { ctg: 'CTG', nroCarta: 'Nro. carta de porte', fechaEmision: 'Fecha emisión', fechaDescarga: 'Fecha descarga', producto: 'Producto', cosecha: 'Cosecha', entregador: 'Entregador', procedencia: 'Procedencia', destino: 'Destino', plantaDestino: 'Planta destino', observaciones: 'Observaciones' };
    Object.keys(required).forEach((k) => { if (!String(values[k]).trim()) next[k] = 'Campo requerido'; });
    if (values.ctg.trim() && rows.some((r) => r.codigo === values.ctg.trim() && r.id !== existing?.id)) next.ctg = 'Ya existe una carta de porte con este CTG';
    if (values.fechaDescarga && values.fechaEmision && values.fechaDescarga < values.fechaEmision) next.fechaDescarga = 'No puede ser anterior a la emisión';
    ['kgProcedencia', 'kgDescargados', 'kgTara'].forEach((k) => { if (!(Number(values[k]) >= 0)) next[k] = 'Ingresá un número válido'; });
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    onSaveTruckshift?.(HREF, {
      id: existing?.id ?? Date.now(), codigo: values.ctg.trim(), denominacion: `Carta de porte ${values.nroCarta.trim()}`,
      estado: { label: 'Activo', type: 'success' }, values: { ...values, ctg: values.ctg.trim() }, items,
    }, isEdit);
  }

  function submit(v) {
    const def = COLLECTIONS[modal.kind];
    const item = { ...v, id: modal.id ?? Date.now() };
    setItems((prev) => ({ ...prev, [modal.kind]: modal.id ? prev[modal.kind].map((r) => (r.id === modal.id ? item : r)) : [...prev[modal.kind], item] }));
    setModal(null);
    return null;
  }

  const yesNo = (v) => <Badge type={v ? 'success' : 'neutral'} showDot={false}>{v ? 'Sí' : 'No'}</Badge>;
  const gridBlock = (kind, title, columns) => ({
    type: 'grid', title, onAdd: isView ? undefined : () => setModal({ kind }),
    columns, rows: items[kind], emptyMessage: 'Sin datos para mostrar.',
    actions: isView ? [] : [
      { key: 'edit', icon: 'icon-edit', label: 'Editar', onClick: (row) => setModal({ kind, ...row }) },
      { key: 'delete', icon: 'bi-trash', label: 'Eliminar', onClick: (row) => setItems((prev) => ({ ...prev, [kind]: prev[kind].filter((r) => r.id !== row.id) })) },
    ],
  });
  const mermaCols = [
    { key: 'descripcion', label: 'Descripción' }, { key: 'porcentaje', label: 'Porcentaje', width: 130 }, { key: 'kg', label: 'Kg', width: 120 },
    { key: 'obligatorio', label: 'Obligatorio', width: 130, render: (r) => yesNo(r.obligatorio) },
  ];

  return (
    <>
      <LayoutMaestroFormulario
        template="M-04c" {...common}
        breadcrumb={[{ label: 'Cartas de porte' }, { label: mode === 'create' ? 'Crear' : `${VERBS[mode]} Cartas de porte` }]} title={`${VERBS[mode]} Cartas de porte`}
        onSave={isView ? undefined : handleSave} onCancel={goList} cancelLabel={isView ? 'Volver' : 'Cancelar'}
        blocks={[
          {
            type: 'form', title: 'Datos generales',
            children: (
              <>
                <FormRow>{text('ctg', 'CTG *')}{text('nroCarta', 'Nro. carta de porte *')}{text('fechaEmision', 'Fecha emisión *', { type: 'date' })}</FormRow>
                <FormRow>{text('fechaDescarga', 'Fecha descarga *', { type: 'date' })}{select('producto', 'Producto *', catalog('productos'))}{select('cosecha', 'Cosecha *', catalog('cosechas'))}</FormRow>
                <FormRow>{select('entregador', 'Entregador *', PARTES)}{select('comprador', 'Comprador', PARTES)}{text('intermediario', 'Intermediario')}</FormRow>
              </>
            ),
          },
          {
            type: 'form', title: 'Procedencia y destino',
            children: (
              <>
                <FormRow columns={2}>{select('procedencia', 'Procedencia *', LUGARES)}{select('plantaProcedencia', 'Planta procedencia', catalog('plantas'))}</FormRow>
                <FormRow columns={2}>{select('destino', 'Destino *', LUGARES)}{select('plantaDestino', 'Planta destino *', catalog('plantas'))}</FormRow>
              </>
            ),
          },
          {
            type: 'form', title: 'Participantes de la carta de porte',
            children: (
              <>
                <FormRow>{select('titular', 'Titular', PARTES)}{select('comercialPrimaria', 'Comercial venta primaria', PARTES)}{select('comercialSecundaria', 'Comercial venta secundaria', PARTES)}</FormRow>
                <FormRow columns={2}>{select('corredorPrimaria', 'Corredor venta primaria', PARTES)}{select('corredorSecundaria', 'Corredor venta secundaria', PARTES)}</FormRow>
                {text('observaciones', 'Observaciones *')}
              </>
            ),
          },
          {
            type: 'form', title: 'Datos del transporte',
            children: (
              <>
                <FormRow>{select('transportista', 'Transportista', catalog('transportes'))}{text('patentes', 'Patentes')}{text('fechaPartida', 'Fecha y hora de partida', { type: 'datetime-local' })}</FormRow>
                <FormRow>{text('distancia', 'Distancia (km)', { inputMode: 'decimal' })}{text('chofer', 'Chofer')}{text('tarifaFlete', 'Tarifa flete', { inputMode: 'decimal' })}</FormRow>
                <FormRow>{select('pagadorFlete', 'Pagador flete', PARTES)}{text('patenteCamion', 'Patente del camión')}{text('patenteAcoplado', 'Patente del acoplado')}</FormRow>
              </>
            ),
          },
          {
            type: 'form', title: 'Mercadería y saldo',
            children: (
              <>
                <FormRow columns={4}>
                  {text('kgProcedencia', 'Kg procedencia', { inputMode: 'decimal' })}
                  {text('kgDescargados', 'Kg descargados', { inputMode: 'decimal' })}
                  {text('kgTara', 'Kg tara', { inputMode: 'decimal' })}
                  <TextField label="Kg mermas (calculado)" value={fmt(mermasKg)} disabled />
                </FormRow>
                <FormRow columns={4}>
                  <TextField label="Kg netos (calculado)" value={fmt(kgNetos)} disabled />
                  <TextField label="Total aplicable" value={fmt(totalAplicable)} disabled />
                  <TextField label="Aplicado" value={fmt(aplicado)} disabled />
                  <TextField label="Saldo" value={fmt(totalAplicable - aplicado)} disabled />
                </FormRow>
              </>
            ),
          },
        ]}
        tabs={[
          { id: 'comunes', label: 'Mermas comunes', blocks: [gridBlock('comunes', 'Mermas comunes', mermaCols)] },
          { id: 'servicios', label: 'Mermas de servicios', blocks: [gridBlock('servicios', 'Mermas de servicios', mermaCols)] },
          {
            id: 'calidad', label: 'Mermas de calidad',
            blocks: [gridBlock('calidad', 'Mermas de calidad', [
              { key: 'descripcion', label: 'Descripción' }, { key: 'porcentaje', label: 'Porcentaje', width: 110 }, { key: 'bonificacion', label: 'Bonificación', width: 120 },
              { key: 'rebaja', label: 'Rebaja', width: 100 }, { key: 'kg', label: 'Kg', width: 90 }, { key: 'precio', label: 'Precio', width: 100 },
              { key: 'obligatorio', label: 'Obligatorio', width: 120, render: (r) => yesNo(r.obligatorio) },
            ])],
          },
          {
            id: 'aplicaciones', label: 'Aplicaciones',
            blocks: [gridBlock('aplicaciones', 'Aplicaciones', [
              { key: 'contratoAsociado', label: 'Contrato asociado' }, { key: 'contratoRelacionado', label: 'Contrato relacionado' }, { key: 'operacion', label: 'Operación de contrato' },
              { key: 'kgTotales', label: 'Kilos totales', width: 120 }, { key: 'kgAplicados', label: 'Kg aplicados', width: 120 },
              { key: 'kgDisponibles', label: 'Kg disponibles', width: 130, render: (r) => <span>{fmt(num(r.kgTotales) - num(r.kgAplicados))}</span> },
            ])],
          },
        ]}
      />
      {modal && <ChildItemModal key={`${modal.kind}-${modal.id ?? 'new'}`} title={COLLECTIONS[modal.kind].title} fields={COLLECTIONS[modal.kind].fields} initial={modal.id ? modal : undefined} onClose={() => setModal(null)} onSubmit={submit} />}
    </>
  );
}
