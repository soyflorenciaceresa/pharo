import { useState } from 'react';
import LayoutMaestroFormulario from '../../../templates/LayoutMaestroFormulario/LayoutMaestroFormulario.jsx';
import LayoutMaestroBasico from '../../../templates/LayoutMaestroBasico/LayoutMaestroBasico.jsx';
import FormRow from '../../../components/FormRow/FormRow.jsx';
import TextField from '../../../components/TextField/TextField.jsx';
import Checkbox from '../../../components/Checkbox/Checkbox.jsx';
import Badge from '../../../components/Badge/Badge.jsx';
import ChildItemModal from './ChildItemModal.jsx';
import { HUMAN_RESOURCES_SIDEBAR_PROPS } from '../../../config/sidebars/human-resources.js';
import styles from './Maestro.module.css';

const HREF = '/human-resources/convenios';
const CONCEPTOS_HREF = '/human-resources/conceptos';
const VERBS = { create: 'Crear', view: 'Visualizar', edit: 'Editar' };
const opt = (...labels) => labels.map((label) => ({ value: label, label }));
const UNIDADES = opt('Importe', 'Porcentaje', 'Horas', 'Días');
const TIPOS_CALCULO = opt('Fijo', 'Variable', 'Por novedad');

// Maestro "Convenios" (Human Resources). Template M-04c · cabecera + tabs con
// grilla: una Form Section (código, denominación, horas diarias y mensuales,
// inactivo) y DOS colecciones hijas paralelas — Categorías y Conceptos — como
// tabs. El original llamaba "Convenios" a la primera tab: son los datos de la
// cabecera, siempre visibles. Filas en Modal; los conceptos salen del maestro
// Conceptos. Supuestos: Código y Denominación obligatorios; la grilla de
// Conceptos muestra todos con su Estado (no hay checkbox "Incluir
// deshabilitados": el kit no tiene filtros por grilla).
export default function ConvenioFormulario({ truckshiftRows = {}, onSaveTruckshift, onNavigate, onSearch, params = {}, mode = 'create' }) {
  const rows = truckshiftRows[HREF] ?? [];
  const conceptosCatalogo = truckshiftRows[CONCEPTOS_HREF] ?? [];
  const isView = mode === 'view';
  const isEdit = mode === 'edit';
  const existing = mode !== 'create' ? rows.find((r) => String(r.id) === String(params.id)) : null;
  const navigate = onNavigate ?? ((d) => console.log('navigate', d));

  const [values, setValues] = useState({ codigo: existing?.codigo ?? '', denominacion: existing?.denominacion ?? '', horasDiarias: '0', horasMensuales: '0', ...(existing?.values ?? {}) });
  const [inactivo, setInactivo] = useState(existing?.estado?.label === 'Inactivo');
  const [categorias, setCategorias] = useState(existing?.categorias ?? []);
  const [conceptos, setConceptos] = useState(existing?.conceptos ?? []);
  const [errors, setErrors] = useState({});
  const [modal, setModal] = useState(null); // { kind, ...row }

  const common = {
    sidebar: HUMAN_RESOURCES_SIDEBAR_PROPS, activeHref: HREF, onNavigate: navigate, onSearch,
    onCompanyChange: (c) => console.log('company change', c), onLogout: () => console.log('logout'), onToggle: (d) => console.log('toggle', d),
  };
  const goList = () => navigate({ href: HREF, label: 'Convenios' });

  if (mode !== 'create' && !existing) {
    return (
      <LayoutMaestroBasico {...common} breadcrumb={[{ label: 'Convenios' }]} title="Convenio no encontrado" onCancel={goList} cancelLabel="Volver" formTitle="Datos del convenio">
        <p className={styles.notFound}>No se encontró el convenio solicitado.</p>
      </LayoutMaestroBasico>
    );
  }

  function set(key, value) {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function handleSave() {
    const next = {};
    const codigo = values.codigo.trim();
    if (!codigo) next.codigo = 'Campo requerido';
    else if (rows.some((r) => r.codigo === codigo && r.id !== existing?.id)) next.codigo = 'Ya existe un convenio con este código';
    if (!values.denominacion.trim()) next.denominacion = 'Campo requerido';
    ['horasDiarias', 'horasMensuales'].forEach((k) => { if (!(Number(values[k]) >= 0)) next[k] = 'Ingresá un número válido'; });
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    onSaveTruckshift?.(HREF, {
      id: existing?.id ?? Date.now(), codigo, denominacion: values.denominacion.trim(),
      estado: inactivo ? { label: 'Inactivo', type: 'neutral' } : { label: 'Activo', type: 'success' },
      values: { ...values, codigo, denominacion: values.denominacion.trim() }, categorias, conceptos,
    }, isEdit);
  }

  const conceptoLabel = (id) => conceptosCatalogo.find((c) => c.id === id)?.denominacion ?? '—';
  const DEFS = {
    categoria: {
      title: 'categoría', list: categorias, set: setCategorias, key: (v) => v.codigo.trim(),
      fields: [
        { key: 'codigo', label: 'Código', type: 'text', required: true },
        { key: 'denominacion', label: 'Denominación', type: 'text', required: true },
        { key: 'importe', label: 'Importe bruto mensual', type: 'number', required: true },
      ],
    },
    concepto: {
      title: 'concepto', list: conceptos, set: setConceptos, key: (v) => v.conceptoId,
      fields: [
        { key: 'conceptoId', label: 'Concepto', type: 'select', required: true, options: conceptosCatalogo.map((c) => ({ value: String(c.id), label: `${c.codigo} · ${c.denominacion}` })) },
        { key: 'detalle', label: 'Detalle en recibo', type: 'text' },
        { key: 'unidad', label: 'Unidad', type: 'select', options: UNIDADES },
        { key: 'tipoCalculo', label: 'Tipo de cálculo', type: 'select', options: TIPOS_CALCULO },
        { key: 'habilitado', label: 'Habilitado', type: 'check', default: true },
      ],
    },
  };

  function submit(values) {
    const def = DEFS[modal.kind];
    if (def.list.some((r) => r.id !== modal.id && String(def.key(r)) === String(def.key(values)))) return 'Ya está cargado';
    const item = { ...values, id: modal.id ?? Date.now() };
    def.set((prev) => (modal.id ? prev.map((r) => (r.id === modal.id ? item : r)) : [...prev, item]));
    setModal(null);
    return null;
  }

  const gridBlock = (kind, title, columns) => {
    const def = DEFS[kind];
    return {
      type: 'grid', title,
      onAdd: isView ? undefined : () => setModal({ kind }),
      columns, rows: def.list, emptyMessage: 'Sin datos para mostrar.',
      actions: isView ? [] : [
        { key: 'edit', icon: 'icon-edit', label: 'Editar', onClick: (row) => setModal({ kind, ...row }) },
        { key: 'delete', icon: 'bi-trash', label: 'Eliminar', onClick: (row) => def.set((prev) => prev.filter((r) => r.id !== row.id)) },
      ],
    };
  };

  return (
    <>
      <LayoutMaestroFormulario
        template="M-04c" {...common}
        breadcrumb={[{ label: 'Convenios' }, { label: mode === 'create' ? 'Crear' : `${VERBS[mode]} Convenios` }]} title={`${VERBS[mode]} Convenios`}
        onSave={isView ? undefined : handleSave} onCancel={goList} cancelLabel={isView ? 'Volver' : 'Cancelar'}
        blocks={[
          {
            type: 'form', title: 'Datos del convenio',
            children: (
              <>
                <FormRow columns={2}>
                  <TextField label="Código *" value={values.codigo} onChange={(e) => set('codigo', e.target.value)} disabled={isView} error={Boolean(errors.codigo)} helperText={errors.codigo} />
                  <TextField label="Denominación *" value={values.denominacion} onChange={(e) => set('denominacion', e.target.value)} disabled={isView} error={Boolean(errors.denominacion)} helperText={errors.denominacion} />
                </FormRow>
                <FormRow columns={2}>
                  <TextField label="Horas diarias" value={values.horasDiarias} onChange={(e) => set('horasDiarias', e.target.value)} inputMode="numeric" disabled={isView} error={Boolean(errors.horasDiarias)} helperText={errors.horasDiarias} />
                  <TextField label="Horas mensuales" value={values.horasMensuales} onChange={(e) => set('horasMensuales', e.target.value)} inputMode="numeric" disabled={isView} error={Boolean(errors.horasMensuales)} helperText={errors.horasMensuales} />
                </FormRow>
                <Checkbox label="Inactivo" checked={inactivo} onChange={(e) => setInactivo(e.target.checked)} disabled={isView} />
              </>
            ),
          },
        ]}
        tabs={[
          {
            id: 'categorias', label: 'Categorías',
            blocks: [gridBlock('categoria', 'Categorías', [
              { key: 'codigo', label: 'Código', width: 160 },
              { key: 'denominacion', label: 'Denominación' },
              { key: 'importe', label: 'Importe bruto mensual', width: 220 },
            ])],
          },
          {
            id: 'conceptos', label: 'Conceptos',
            blocks: [gridBlock('concepto', 'Conceptos', [
              { key: 'conceptoId', label: 'Concepto', render: (r) => <span>{conceptoLabel(Number(r.conceptoId))}</span> },
              { key: 'detalle', label: 'Detalle en recibo' },
              { key: 'unidad', label: 'Unidad', width: 130 },
              { key: 'tipoCalculo', label: 'Tipo de cálculo', width: 150 },
              { key: 'habilitado', label: 'Estado', width: 130, render: (r) => <Badge type={r.habilitado ? 'success' : 'neutral'}>{r.habilitado ? 'Habilitado' : 'Deshabilitado'}</Badge> },
            ])],
          },
        ]}
      />
      {modal && (
        <ChildItemModal
          key={`${modal.kind}-${modal.id ?? 'new'}`}
          title={DEFS[modal.kind].title}
          fields={DEFS[modal.kind].fields}
          initial={modal.id ? { ...modal, conceptoId: modal.conceptoId !== undefined ? String(modal.conceptoId) : undefined } : undefined}
          onClose={() => setModal(null)}
          onSubmit={submit}
        />
      )}
    </>
  );
}
