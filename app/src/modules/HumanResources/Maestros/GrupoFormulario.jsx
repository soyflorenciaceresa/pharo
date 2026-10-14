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

const VERBS = { create: 'Crear', view: 'Visualizar', edit: 'Editar' };
const CHILD_DEFAULT = { key: 'subgrupos', title: 'Subgrupos', noun: 'subgrupo' };
const SUBGRUPO_FIELDS = [
  { key: 'codigo', label: 'Código', type: 'text', required: true },
  { key: 'denominacion', label: 'Denominación', type: 'text', required: true },
  { key: 'activo', label: 'Activo', type: 'check', default: true },
];

// Maestros "Grupos" y "Obras sociales" (Human Resources; la colección hija se configura con `child`). Template M-04a · cabecera + grilla: una
// Form Section (código, denominación, inactivo) y UNA colección hija (Subgrupos:
// código, denominación y activo) como Child Grid Section, editada en Modal.
// Supuestos: Código y Denominación obligatorios; el código del subgrupo no se
// repite dentro del grupo.
export default function GrupoFormulario({ maestro = { href: '/human-resources/grupos', label: 'Grupos' }, sidebar = HUMAN_RESOURCES_SIDEBAR_PROPS, child = CHILD_DEFAULT, truckshiftRows = {}, onSaveTruckshift, onNavigate, onSearch, params = {}, mode = 'create' }) {
  const HREF = maestro.href;
  const rows = truckshiftRows[HREF] ?? [];
  const isView = mode === 'view';
  const isEdit = mode === 'edit';
  const existing = mode !== 'create' ? rows.find((r) => String(r.id) === String(params.id)) : null;
  const navigate = onNavigate ?? ((d) => console.log('navigate', d));

  const [codigo, setCodigo] = useState(existing?.codigo ?? '');
  const [denominacion, setDenominacion] = useState(existing?.denominacion ?? '');
  const [inactivo, setInactivo] = useState(existing?.estado?.label === 'Inactivo');
  const [subgrupos, setSubgrupos] = useState(existing?.[child.key] ?? []);
  const [errors, setErrors] = useState({});
  const [modal, setModal] = useState(null);

  const common = {
    sidebar, activeHref: HREF, onNavigate: navigate, onSearch,
    onCompanyChange: (c) => console.log('company change', c), onLogout: () => console.log('logout'), onToggle: (d) => console.log('toggle', d),
  };
  const goList = () => navigate({ href: HREF, label: maestro.label });

  if (mode !== 'create' && !existing) {
    return (
      <LayoutMaestroBasico {...common} breadcrumb={[{ label: maestro.label }]} title="Registro no encontrado" onCancel={goList} cancelLabel="Volver" formTitle="Datos generales">
        <p className={styles.notFound}>No se encontró el registro solicitado.</p>
      </LayoutMaestroBasico>
    );
  }

  function handleSave() {
    const next = {};
    if (!codigo.trim()) next.codigo = 'Campo requerido';
    else if (rows.some((r) => r.codigo === codigo.trim() && r.id !== existing?.id)) next.codigo = 'Ya existe un registro con este código';
    if (!denominacion.trim()) next.denominacion = 'Campo requerido';
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    onSaveTruckshift?.(HREF, {
      id: existing?.id ?? Date.now(), codigo: codigo.trim(), denominacion: denominacion.trim(),
      estado: inactivo ? { label: 'Inactivo', type: 'neutral' } : { label: 'Activo', type: 'success' }, [child.key]: subgrupos,
    }, isEdit);
  }

  function submitSubgrupo(values) {
    const code = values.codigo.trim();
    if (subgrupos.some((s) => s.codigo === code && s.id !== modal.id)) return 'Ya existe un registro con este código';
    const item = { id: modal.id ?? Date.now(), codigo: code, denominacion: values.denominacion.trim(), activo: values.activo };
    setSubgrupos((prev) => (modal.id ? prev.map((s) => (s.id === modal.id ? item : s)) : [...prev, item]));
    setModal(null);
    return null;
  }

  return (
    <>
      <LayoutMaestroFormulario
        template="M-04a" {...common}
        breadcrumb={[{ label: maestro.label }, { label: mode === 'create' ? 'Crear' : `${VERBS[mode]} ${maestro.label}` }]} title={`${VERBS[mode]} ${maestro.label}`}
        onSave={isView ? undefined : handleSave} onCancel={goList} cancelLabel={isView ? 'Volver' : 'Cancelar'}
        blocks={[
          {
            type: 'form', title: `Datos de ${maestro.label.toLowerCase()}`,
            children: (
              <>
                <FormRow columns={2}>
                  <TextField label="Código *" value={codigo} onChange={(e) => { setCodigo(e.target.value); setErrors((p) => ({ ...p, codigo: undefined })); }} disabled={isView} error={Boolean(errors.codigo)} helperText={errors.codigo} />
                  <TextField label="Denominación *" value={denominacion} onChange={(e) => { setDenominacion(e.target.value); setErrors((p) => ({ ...p, denominacion: undefined })); }} disabled={isView} error={Boolean(errors.denominacion)} helperText={errors.denominacion} />
                </FormRow>
                <Checkbox label="Inactivo" checked={inactivo} onChange={(e) => setInactivo(e.target.checked)} disabled={isView} />
              </>
            ),
          },
          {
            type: 'grid', title: child.title,
            onAdd: isView ? undefined : () => setModal({}),
            columns: [
              { key: 'codigo', label: 'Código', width: 160 },
              { key: 'denominacion', label: 'Denominación' },
              { key: 'activo', label: 'Activo', width: 140, render: (r) => <Badge type={r.activo ? 'success' : 'neutral'}>{r.activo ? 'Activo' : 'Inactivo'}</Badge> },
            ],
            rows: subgrupos, emptyMessage: 'Sin datos para mostrar.',
            actions: isView ? [] : [
              { key: 'edit', icon: 'icon-edit', label: 'Editar', onClick: (row) => setModal(row) },
              { key: 'delete', icon: 'bi-trash', label: 'Eliminar', onClick: (row) => setSubgrupos((prev) => prev.filter((s) => s.id !== row.id)) },
            ],
          },
        ]}
      />
      {modal && <ChildItemModal key={modal.id ?? 'new'} title={child.noun} fields={SUBGRUPO_FIELDS} initial={modal} onClose={() => setModal(null)} onSubmit={submitSubgrupo} />}
    </>
  );
}
