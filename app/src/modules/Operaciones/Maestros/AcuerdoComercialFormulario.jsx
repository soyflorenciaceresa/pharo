import { useState } from 'react';
import LayoutMaestroFormulario from '../../../templates/LayoutMaestroFormulario/LayoutMaestroFormulario.jsx';
import LayoutMaestroBasico from '../../../templates/LayoutMaestroBasico/LayoutMaestroBasico.jsx';
import FormRow from '../../../components/FormRow/FormRow.jsx';
import TextField from '../../../components/TextField/TextField.jsx';
import Select from '../../../components/Select/Select.jsx';
import Checkbox from '../../../components/Checkbox/Checkbox.jsx';
import Modal from '../../../components/Modal/Modal.jsx';
import ActionGroup from '../../../components/ActionGroup/ActionGroup.jsx';
import { OPERACIONES_SIDEBAR_PROPS } from '../../../config/sidebars/operaciones.js';
import styles from './AcuerdoComercialFormulario.module.css';

const HREF = '/acuerdos-comerciales';
const VERBS = { create: 'Crear', view: 'Visualizar', edit: 'Editar' };
const today = () => new Date().toISOString().slice(0, 10);

// Colecciones hijas (una tab cada una). `ref` = maestro del que sale el valor.
const COLLECTIONS = {
  familia: { label: 'Familia de producto', fields: [{ key: 'familiaId', label: 'Familia de producto', ref: '/familias-de-productos' }] },
  producto: { label: 'Producto', fields: [{ key: 'productoId', label: 'Producto', ref: '/productos' }, { key: 'cantidad', label: 'Cantidad', number: true }] },
  envase: { label: 'Envase', fields: [{ key: 'envaseId', label: 'Envase', ref: '/envases' }] },
  servicio: {
    label: 'Servicio',
    fields: [
      { key: 'servicioId', label: 'Servicio', ref: '/servicios' },
      { key: 'tipoMovimientoId', label: 'Tipo de movimiento', ref: '/tipos-de-movimientos', optional: true },
      { key: 'productoId', label: 'Producto', ref: '/productos', optional: true },
      { key: 'envaseId', label: 'Envase', ref: '/envases', optional: true },
      { key: 'cantidad', label: 'Cantidad', number: true, optional: true },
      { key: 'precio', label: 'Precio', number: true },
    ],
  },
};

// Maestro "Acuerdos comerciales" (Ports; en el original "Contratos"). Template
// M-04c · cabecera + tabs con grilla: una Form Section (cliente, denominación,
// vigencia) y CUATRO colecciones hijas paralelas — Familia de producto,
// Producto, Envase y Servicio — como tabs de Child Grid Section. El original
// llamaba "GeneralData" a la primera tab: acá son los datos de la cabecera,
// siempre visibles. Las filas se agregan/editan en Modal; los valores salen de
// los maestros respectivos. Supuestos: Cliente y Denominación obligatorios;
// vigencia hasta no anterior a la de inicio; el código se genera (AC-001…).
export default function AcuerdoComercialFormulario({ truckshiftRows = {}, onSaveTruckshift, onNavigate, onSearch, params = {}, mode = 'create' }) {
  const rows = truckshiftRows[HREF] ?? [];
  const isView = mode === 'view';
  const isEdit = mode === 'edit';
  const existing = mode !== 'create' ? rows.find((r) => String(r.id) === String(params.id)) : null;
  const navigate = onNavigate ?? ((d) => console.log('navigate', d));

  const catalog = (href) => truckshiftRows[href] ?? [];
  const refLabel = (href, id) => catalog(href).find((r) => r.id === id)?.denominacion ?? '—';

  const [cliente, setCliente] = useState(existing?.clienteId ? String(existing.clienteId) : '');
  const [denominacion, setDenominacion] = useState(existing?.denominacion ?? '');
  const [desde, setDesde] = useState(existing?.values?.desde ?? (existing ? '' : today()));
  const [hasta, setHasta] = useState(existing?.values?.hasta ?? '');
  const [inactivo, setInactivo] = useState(existing?.estado?.label === 'Inactivo');
  const [items, setItems] = useState(existing?.items ?? { familia: [], producto: [], envase: [], servicio: [] });
  const [errors, setErrors] = useState({});
  const [modal, setModal] = useState(null); // { kind, id?, values, error }

  const common = {
    sidebar: OPERACIONES_SIDEBAR_PROPS,
    activeHref: HREF,
    onNavigate: navigate,
    onSearch,
    onCompanyChange: (c) => console.log('company change', c),
    onLogout: () => console.log('logout'),
    onToggle: (d) => console.log('toggle', d),
  };
  const goList = () => navigate({ href: HREF, label: 'Acuerdos comerciales' });

  if (mode !== 'create' && !existing) {
    return (
      <LayoutMaestroBasico {...common} breadcrumb={[{ label: 'Acuerdos comerciales' }]} title="Acuerdo no encontrado" onCancel={goList} cancelLabel="Volver" formTitle="Datos del acuerdo">
        <p className={styles.notFound}>No se encontró el acuerdo solicitado.</p>
      </LayoutMaestroBasico>
    );
  }

  function clear(key) {
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function handleSave() {
    const next = {};
    if (!cliente) next.cliente = 'Campo requerido';
    if (!denominacion.trim()) next.denominacion = 'Campo requerido';
    if (desde && hasta && hasta < desde) next.hasta = 'Debe ser posterior a la fecha de inicio';
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    const maxN = rows.reduce((m, r) => Math.max(m, Number(String(r.codigo).replace(/\D/g, '')) || 0), 0);
    onSaveTruckshift?.(HREF, {
      id: existing?.id ?? Date.now(),
      codigo: existing?.codigo ?? `AC-${String(maxN + 1).padStart(3, '0')}`,
      denominacion: denominacion.trim(),
      estado: inactivo ? { label: 'Inactivo', type: 'neutral' } : { label: 'Activo', type: 'success' },
      clienteId: Number(cliente),
      values: { desde, hasta },
      items,
    }, isEdit);
  }

  // ── Colecciones hijas ─────────────────────────────────────────────────────
  function saveModal() {
    const { kind, id, values } = modal;
    const def = COLLECTIONS[kind];
    for (const f of def.fields) {
      const v = String(values[f.key] ?? '').trim();
      if (!f.optional && !v) return setModal({ ...modal, error: `Completá "${f.label}"` });
      if (f.number && v && !(Number(v) >= 0)) return setModal({ ...modal, error: `"${f.label}" debe ser un número válido` });
    }
    const sameKey = (r) => def.fields.every((f) => String(r[f.key] ?? '') === String(values[f.key] ?? ''));
    if (items[kind].some((r) => r.id !== id && sameKey(r))) return setModal({ ...modal, error: 'Ya está cargado' });
    const item = { id: id ?? Date.now(), ...Object.fromEntries(def.fields.map((f) => [f.key, f.number ? (values[f.key] === '' ? '' : Number(values[f.key])) : values[f.key] === '' ? '' : Number(values[f.key])])) };
    setItems((prev) => ({ ...prev, [kind]: id ? prev[kind].map((r) => (r.id === id ? item : r)) : [...prev[kind], item] }));
    setModal(null);
  }

  const gridBlock = (kind) => {
    const def = COLLECTIONS[kind];
    return {
      type: 'grid',
      title: def.label,
      onAdd: isView ? undefined : () => setModal({ kind, values: Object.fromEntries(def.fields.map((f) => [f.key, ''])), error: '' }),
      columns: def.fields.map((f) => ({
        key: f.key,
        label: f.label,
        ...(f.number ? { width: 140 } : {}),
        render: (row) => <span>{f.ref ? (row[f.key] ? refLabel(f.ref, row[f.key]) : '—') : row[f.key] === '' ? '—' : row[f.key]}</span>,
      })),
      rows: items[kind],
      emptyMessage: 'Sin datos para mostrar.',
      actions: isView
        ? []
        : [
            { key: 'edit', icon: 'icon-edit', label: 'Editar', onClick: (row) => setModal({ kind, id: row.id, values: Object.fromEntries(def.fields.map((f) => [f.key, String(row[f.key] ?? '')])), error: '' }) },
            { key: 'delete', icon: 'bi-trash', label: 'Eliminar', onClick: (row) => setItems((prev) => ({ ...prev, [kind]: prev[kind].filter((r) => r.id !== row.id) })) },
          ],
    };
  };

  const current = modal ? COLLECTIONS[modal.kind] : null;
  const setModalValue = (key, value) => setModal((m) => ({ ...m, values: { ...m.values, [key]: value }, error: '' }));

  return (
    <>
      <LayoutMaestroFormulario
        template="M-04c"
        {...common}
        breadcrumb={[{ label: 'Acuerdos comerciales' }, { label: mode === 'create' ? 'Crear' : `${VERBS[mode]} Acuerdos comerciales` }]}
        title={`${VERBS[mode]} Acuerdos comerciales`}
        onSave={isView ? undefined : handleSave}
        onCancel={goList}
        cancelLabel={isView ? 'Volver' : 'Cancelar'}
        blocks={[
          {
            type: 'form',
            title: 'Datos del acuerdo',
            children: (
              <>
                <FormRow columns={2}>
                  <Select label="Cliente *" value={cliente} onChange={(e) => { setCliente(e.target.value); clear('cliente'); }} options={catalog('/clientes').map((c) => ({ value: String(c.id), label: `${c.codigo} · ${c.denominacion}` }))} placeholder="Seleccionar cliente..." disabled={isView} error={Boolean(errors.cliente)} helperText={errors.cliente} />
                  <TextField label="Denominación *" value={denominacion} onChange={(e) => { setDenominacion(e.target.value); clear('denominacion'); }} disabled={isView} error={Boolean(errors.denominacion)} helperText={errors.denominacion} />
                </FormRow>
                <FormRow columns={2}>
                  <TextField label="Fecha de vigencia desde" type="date" value={desde} onChange={(e) => setDesde(e.target.value)} disabled={isView} />
                  <TextField label="Fecha de vigencia hasta" type="date" value={hasta} onChange={(e) => { setHasta(e.target.value); clear('hasta'); }} disabled={isView} error={Boolean(errors.hasta)} helperText={errors.hasta} />
                </FormRow>
                <Checkbox label="Inactivo" checked={inactivo} onChange={(e) => setInactivo(e.target.checked)} disabled={isView} />
              </>
            ),
          },
        ]}
        tabs={Object.entries(COLLECTIONS).map(([kind, def]) => ({ id: kind, label: def.label, blocks: [gridBlock(kind)] }))}
      />
      <Modal
        open={Boolean(modal)}
        title={current ? `${modal.id ? 'Editar' : 'Agregar'} ${current.label.toLowerCase()}` : ''}
        onClose={() => setModal(null)}
        footer={
          <ActionGroup
            aria-label="Acciones del diálogo"
            primary={{ label: modal?.id ? 'Guardar' : 'Agregar', onClick: saveModal }}
            secondary={[{ label: 'Cancelar', onClick: () => setModal(null) }]}
          />
        }
      >
        {current && (
          <div className={styles.modalFields}>
            {current.fields.map((f, i) =>
              f.ref ? (
                <Select
                  key={f.key}
                  label={f.optional ? f.label : `${f.label} *`}
                  value={modal.values[f.key]}
                  onChange={(e) => setModalValue(f.key, e.target.value)}
                  options={catalog(f.ref).map((r) => ({ value: String(r.id), label: `${r.codigo} · ${r.denominacion}` }))}
                  placeholder="Seleccionar..."
                />
              ) : (
                <TextField
                  key={f.key}
                  label={f.optional ? f.label : `${f.label} *`}
                  value={modal.values[f.key]}
                  onChange={(e) => setModalValue(f.key, e.target.value)}
                  inputMode="decimal"
                  error={Boolean(modal.error) && i === current.fields.length - 1}
                  helperText={i === current.fields.length - 1 ? modal.error : undefined}
                />
              ),
            )}
            {modal.error && !current.fields[current.fields.length - 1].number && <span className={styles.fileError}>{modal.error}</span>}
          </div>
        )}
      </Modal>
    </>
  );
}
