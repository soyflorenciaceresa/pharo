import { useState } from 'react';
import LayoutMaestroFormulario from '../../../templates/LayoutMaestroFormulario/LayoutMaestroFormulario.jsx';
import LayoutMaestroBasico from '../../../templates/LayoutMaestroBasico/LayoutMaestroBasico.jsx';
import FormRow from '../../../components/FormRow/FormRow.jsx';
import Select from '../../../components/Select/Select.jsx';
import Checkbox from '../../../components/Checkbox/Checkbox.jsx';
import Modal from '../../../components/Modal/Modal.jsx';
import ActionGroup from '../../../components/ActionGroup/ActionGroup.jsx';
import { PURCHASES_SIDEBAR_PROPS } from '../../../config/sidebars/purchases.js';
import { USUARIOS, SUBCENTROS_COSTOS, LEGAJOS } from '../../../config/purchasesFondosFijos.js';
import styles from './HabilitacionFormulario.module.css';

const HREF = '/purchases/habilitacion-de-fondos-fijos';
const TITLES = { create: 'Crear Habilitación de fondo fijo', view: 'Visualizar Habilitación de fondo fijo', edit: 'Editar Habilitación de fondo fijo' };
const labelOf = (list, value) => list.find((o) => o.value === value)?.label ?? value;

// Maestro "Habilitación de fondos fijos" (Purchases). Template M-04c ·
// Compuesto, cabecera + tabs con grilla: una cabecera (usuario, quién autoriza,
// permisos, estado) y DOS colecciones hijas paralelas — Subcentro de costos y
// Legajo — que en el original eran dos grillas apiladas y pasan a una fila de
// tabs. Las filas se agregan/editan en Modal (no hay Drawer todavía).
// Supuesto: Usuario obligatorio (el único con *). Pendientes: selector con
// búsqueda (Usuario, Usuario que autoriza, Subcentro, Legajo — hoy `Select`).
export default function HabilitacionFormulario({ onNavigate, onSearch, habilitaciones = [], onCreateHabilitacion, onUpdateHabilitacion, params = {}, mode = 'create' }) {
  const isView = mode === 'view';
  const isEdit = mode === 'edit';
  const existing = mode !== 'create' ? habilitaciones.find((h) => String(h.id) === String(params.id)) : null;
  const navigate = onNavigate ?? ((d) => console.log('navigate', d));

  const [usuario, setUsuario] = useState(existing?.usuario ?? '');
  const [autoriza, setAutoriza] = useState(existing?.autoriza ?? '');
  const [gastoPropio, setGastoPropio] = useState(existing?.gastoPropio ?? false);
  const [gastoOtro, setGastoOtro] = useState(existing?.gastoOtro ?? false);
  const [inactivo, setInactivo] = useState(existing?.estado?.label === 'Inactivo');
  const [subcentros, setSubcentros] = useState(existing?.subcentros ?? []);
  const [legajos, setLegajos] = useState(existing?.legajos ?? []);
  const [errors, setErrors] = useState({});
  const [modal, setModal] = useState(null); // { kind: 'sub'|'leg', id?, valor, error }

  const common = {
    sidebar: PURCHASES_SIDEBAR_PROPS,
    activeHref: HREF,
    onNavigate: navigate,
    onSearch,
    onCompanyChange: (c) => console.log('company change', c),
    onLogout: () => console.log('logout'),
    onToggle: (d) => console.log('toggle', d),
  };
  const goList = () => navigate({ href: HREF, label: 'Habilitación de fondos fijos' });

  if (mode !== 'create' && !existing) {
    return (
      <LayoutMaestroBasico {...common} breadcrumb={[{ label: 'Habilitación de fondos fijos' }]} title="Habilitación no encontrada" onCancel={goList} cancelLabel="Volver" formTitle="Datos generales">
        <p className={styles.notFound}>No se encontró la habilitación solicitada.</p>
      </LayoutMaestroBasico>
    );
  }

  function handleSave() {
    const next = {};
    if (!usuario) next.usuario = 'Campo requerido';
    else if (habilitaciones.some((h) => h.usuario === usuario && h.id !== existing?.id)) next.usuario = 'Este usuario ya tiene una habilitación';
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const habilitacion = {
      id: existing?.id ?? Date.now(),
      usuario,
      autoriza,
      codigo: usuario,
      denominacion: labelOf(USUARIOS, usuario).split(' · ')[1] ?? usuario,
      gastoPropio,
      gastoOtro,
      subcentros,
      legajos,
      estado: inactivo ? { label: 'Inactivo', type: 'neutral' } : { label: 'Activo', type: 'success' },
    };
    if (isEdit) onUpdateHabilitacion?.(habilitacion);
    else onCreateHabilitacion?.(habilitacion);
  }

  // ── Colecciones hijas (se editan en Modal) ────────────────────────────────
  const COLLECTIONS = {
    sub: { list: subcentros, setList: setSubcentros, options: SUBCENTROS_COSTOS, label: 'Subcentro de costos', noun: 'subcentro de costos' },
    leg: { list: legajos, setList: setLegajos, options: LEGAJOS, label: 'Legajo', noun: 'legajo' },
  };

  function saveModal() {
    const { kind, id, valor } = modal;
    const { list, setList } = COLLECTIONS[kind];
    if (!valor) return setModal({ ...modal, error: 'Campo requerido' });
    if (list.some((r) => r.valor === valor && r.id !== id)) return setModal({ ...modal, error: 'Ya está cargado' });
    if (id) setList((prev) => prev.map((r) => (r.id === id ? { ...r, valor } : r)));
    else setList((prev) => [...prev, { id: Date.now(), valor }]);
    setModal(null);
  }

  const gridBlock = (kind) => {
    const { list, setList, options, label } = COLLECTIONS[kind];
    return {
      type: 'grid',
      title: label,
      onAdd: isView ? undefined : () => setModal({ kind, valor: '', error: '' }),
      columns: [{ key: 'valor', label, render: (row) => <span>{labelOf(options, row.valor)}</span> }],
      rows: list,
      emptyMessage: 'Sin datos para mostrar.',
      actions: isView
        ? []
        : [
            { key: 'edit', icon: 'icon-edit', label: 'Editar', onClick: (row) => setModal({ kind, ...row, error: '' }) },
            { key: 'delete', icon: 'bi-trash', label: 'Eliminar', onClick: (row) => setList((prev) => prev.filter((r) => r.id !== row.id)) },
          ],
    };
  };

  const current = modal ? COLLECTIONS[modal.kind] : null;

  return (
    <>
      <LayoutMaestroFormulario
        template="M-04c"
        {...common}
        breadcrumb={[{ label: 'Habilitación de fondos fijos' }, { label: mode === 'create' ? 'Crear' : TITLES[mode] }]}
        title={TITLES[mode]}
        onSave={isView ? undefined : handleSave}
        onCancel={goList}
        cancelLabel={isView ? 'Volver' : 'Cancelar'}
        blocks={[
          {
            type: 'form',
            title: 'Datos de la habilitación',
            children: (
              <>
                <FormRow columns={2}>
                  <Select
                    label="Usuario *"
                    value={usuario}
                    onChange={(e) => { setUsuario(e.target.value); setErrors((p) => ({ ...p, usuario: undefined })); }}
                    options={USUARIOS}
                    placeholder="Seleccionar usuario..."
                    disabled={isView}
                    error={Boolean(errors.usuario)}
                    helperText={errors.usuario}
                  />
                  <Select label="Usuario que autoriza" value={autoriza} onChange={(e) => setAutoriza(e.target.value)} options={USUARIOS} placeholder="Seleccionar usuario..." disabled={isView} />
                </FormRow>
                <Checkbox label="Permite carga de gasto propio" checked={gastoPropio} onChange={(e) => setGastoPropio(e.target.checked)} disabled={isView} />
                <Checkbox label="Permite carga de gasto a otro usuario" checked={gastoOtro} onChange={(e) => setGastoOtro(e.target.checked)} disabled={isView} />
                <Checkbox label="Inactivo" checked={inactivo} onChange={(e) => setInactivo(e.target.checked)} disabled={isView} />
              </>
            ),
          },
        ]}
        tabs={[
          { id: 'subcentros', label: 'Subcentro de costos', blocks: [gridBlock('sub')] },
          { id: 'legajos', label: 'Legajo', blocks: [gridBlock('leg')] },
        ]}
      />
      <Modal
        open={Boolean(modal)}
        title={current ? `${modal.id ? 'Editar' : 'Agregar'} ${current.noun}` : ''}
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
            <Select
              label={`${current.label} *`}
              value={modal.valor}
              onChange={(e) => setModal({ ...modal, valor: e.target.value, error: '' })}
              options={current.options}
              placeholder="Seleccionar..."
              error={Boolean(modal.error)}
              helperText={modal.error}
            />
          </div>
        )}
      </Modal>
    </>
  );
}
