import { useState } from 'react';
import LayoutMaestroFormulario from '../../../templates/LayoutMaestroFormulario/LayoutMaestroFormulario.jsx';
import LayoutMaestroBasico from '../../../templates/LayoutMaestroBasico/LayoutMaestroBasico.jsx';
import FormRow from '../../../components/FormRow/FormRow.jsx';
import TextField from '../../../components/TextField/TextField.jsx';
import Select from '../../../components/Select/Select.jsx';
import Checkbox from '../../../components/Checkbox/Checkbox.jsx';
import FileUpload from '../../../components/FileUpload/FileUpload.jsx';
import Modal from '../../../components/Modal/Modal.jsx';
import ActionGroup from '../../../components/ActionGroup/ActionGroup.jsx';
import { OPERACIONES_SIDEBAR_PROPS } from '../../../config/sidebars/operaciones.js';
import styles from './TipoMovimientoFormulario.module.css';

const HREF = '/tipos-de-movimientos';
const RECURSOS_HREF = '/recursos';
const VERBS = { create: 'Crear', view: 'Visualizar', edit: 'Editar' };
const UTILIZACIONES = ['Recepción', 'Despacho', 'Transferencia', 'Ajuste'].map((v) => ({ value: v, label: v }));
const MAX_BYTES = 5 * 1024 * 1024;

// Maestro "Tipos de movimientos" (Ports). Template M-04a · cabecera + grilla:
// una Form Section (código, denominación, utilización y el documento HSSE) y
// UNA colección hija (Recursos con su cantidad) como Child Grid Section. Los
// recursos salen del maestro de Recursos y se agregan en un Modal. El archivo
// HSSE guarda solo el nombre (sin backend); se valida el máximo de 5 MB.
export default function TipoMovimientoFormulario({ truckshiftRows = {}, onSaveTruckshift, onNavigate, onSearch, params = {}, mode = 'create' }) {
  const rows = truckshiftRows[HREF] ?? [];
  const recursosCatalogo = truckshiftRows[RECURSOS_HREF] ?? [];
  const isView = mode === 'view';
  const isEdit = mode === 'edit';
  const existing = mode !== 'create' ? rows.find((r) => String(r.id) === String(params.id)) : null;
  const navigate = onNavigate ?? ((d) => console.log('navigate', d));

  const [values, setValues] = useState({ codigo: '', denominacion: '', utilizacion: '', documentoHsse: '', ...(existing?.values ?? {}), ...(existing ? { codigo: existing.codigo, denominacion: existing.denominacion } : {}) });
  const [inactivo, setInactivo] = useState(existing?.estado?.label === 'Inactivo');
  const [recursos, setRecursos] = useState(existing?.recursos ?? []); // { id, recursoId, cantidad }
  const [errors, setErrors] = useState({});
  const [modal, setModal] = useState(null);

  const common = {
    sidebar: OPERACIONES_SIDEBAR_PROPS,
    activeHref: HREF,
    onNavigate: navigate,
    onSearch,
    onCompanyChange: (c) => console.log('company change', c),
    onLogout: () => console.log('logout'),
    onToggle: (d) => console.log('toggle', d),
  };
  const goList = () => navigate({ href: HREF, label: 'Tipos de movimientos' });

  if (mode !== 'create' && !existing) {
    return (
      <LayoutMaestroBasico {...common} breadcrumb={[{ label: 'Tipos de movimientos' }]} title="Registro no encontrado" onCancel={goList} cancelLabel="Volver" formTitle="Datos generales">
        <p className={styles.notFound}>No se encontró el registro solicitado.</p>
      </LayoutMaestroBasico>
    );
  }

  function set(key, value) {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return set('documentoHsse', '');
    if (file.size > MAX_BYTES) return setErrors((prev) => ({ ...prev, documentoHsse: 'El archivo supera los 5 MB' }));
    set('documentoHsse', file.name);
  }

  function handleSave() {
    const next = {};
    const codigo = values.codigo.trim();
    if (!codigo) next.codigo = 'Campo requerido';
    else if (rows.some((r) => r.codigo === codigo && r.id !== existing?.id)) next.codigo = 'Ya existe un registro con este código';
    if (!values.denominacion.trim()) next.denominacion = 'Campo requerido';
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    onSaveTruckshift?.(HREF, {
      id: existing?.id ?? Date.now(),
      codigo,
      denominacion: values.denominacion.trim(),
      estado: inactivo ? { label: 'Inactivo', type: 'neutral' } : { label: 'Activo', type: 'success' },
      values: { ...values, codigo, denominacion: values.denominacion.trim() },
      recursos,
    }, isEdit);
  }

  const recursoLabel = (id) => recursosCatalogo.find((r) => r.id === id)?.denominacion ?? '—';
  const availableRecursos = recursosCatalogo.filter((r) => !recursos.some((x) => x.recursoId === r.id && x.id !== modal?.id));

  function saveModal() {
    const cantidad = String(modal.cantidad).trim();
    if (!modal.recursoId) return setModal({ ...modal, error: 'Elegí un recurso' });
    if (!(Number(cantidad) > 0)) return setModal({ ...modal, error: 'Ingresá una cantidad mayor a 0' });
    const item = { id: modal.id ?? Date.now(), recursoId: modal.recursoId, cantidad: Number(cantidad) };
    setRecursos((prev) => (modal.id ? prev.map((r) => (r.id === modal.id ? item : r)) : [...prev, item]));
    setModal(null);
  }

  return (
    <>
      <LayoutMaestroFormulario
        template="M-04a"
        {...common}
        breadcrumb={[{ label: 'Tipos de movimientos' }, { label: mode === 'create' ? 'Crear' : `${VERBS[mode]} Tipos de movimientos` }]}
        title={`${VERBS[mode]} Tipos de movimientos`}
        onSave={isView ? undefined : handleSave}
        onCancel={goList}
        cancelLabel={isView ? 'Volver' : 'Cancelar'}
        blocks={[
          {
            type: 'form',
            title: 'Datos del tipo de movimiento',
            children: (
              <>
                <FormRow>
                  <TextField label="Código *" value={values.codigo} onChange={(e) => set('codigo', e.target.value)} disabled={isView} error={Boolean(errors.codigo)} helperText={errors.codigo} />
                  <TextField label="Denominación *" value={values.denominacion} onChange={(e) => set('denominacion', e.target.value)} disabled={isView} error={Boolean(errors.denominacion)} helperText={errors.denominacion} />
                  <Select label="Utilización" value={values.utilizacion} onChange={(e) => set('utilizacion', e.target.value)} options={UTILIZACIONES} placeholder="Seleccionar..." disabled={isView} />
                </FormRow>
                <FormRow columns={2}>
                  <div>
                    <FileUpload label="Documento HSSE (máx. 5 MB)" value={values.documentoHsse} onChange={handleFile} disabled={isView} />
                    {errors.documentoHsse && <span className={styles.fileError}>{errors.documentoHsse}</span>}
                  </div>
                </FormRow>
                <Checkbox label="Inactivo" checked={inactivo} onChange={(e) => setInactivo(e.target.checked)} disabled={isView} />
              </>
            ),
          },
          {
            type: 'grid',
            title: 'Recursos',
            onAdd: isView ? undefined : () => setModal({ recursoId: '', cantidad: '1', error: '' }),
            columns: [
              { key: 'recursoId', label: 'Recurso', render: (row) => <span>{recursoLabel(row.recursoId)}</span> },
              { key: 'cantidad', label: 'Cantidad', width: 160 },
            ],
            rows: recursos,
            emptyMessage: 'Sin datos para mostrar.',
            actions: isView
              ? []
              : [
                  { key: 'edit', icon: 'icon-edit', label: 'Editar', onClick: (row) => setModal({ ...row, cantidad: String(row.cantidad), error: '' }) },
                  { key: 'delete', icon: 'bi-trash', label: 'Eliminar', onClick: (row) => setRecursos((prev) => prev.filter((r) => r.id !== row.id)) },
                ],
          },
        ]}
      />
      <Modal
        open={Boolean(modal)}
        title={modal?.id ? 'Editar recurso' : 'Agregar recurso'}
        onClose={() => setModal(null)}
        footer={
          <ActionGroup
            aria-label="Acciones del diálogo"
            primary={{ label: modal?.id ? 'Guardar' : 'Agregar', onClick: saveModal }}
            secondary={[{ label: 'Cancelar', onClick: () => setModal(null) }]}
          />
        }
      >
        {modal && (
          <div className={styles.modalFields}>
            <Select
              label="Recurso *"
              value={modal.recursoId === '' ? '' : String(modal.recursoId)}
              onChange={(e) => setModal({ ...modal, recursoId: Number(e.target.value), error: '' })}
              options={availableRecursos.map((r) => ({ value: String(r.id), label: `${r.codigo} · ${r.denominacion}` }))}
              placeholder="Seleccionar recurso..."
            />
            <TextField label="Cantidad *" value={modal.cantidad} onChange={(e) => setModal({ ...modal, cantidad: e.target.value, error: '' })} inputMode="numeric" error={Boolean(modal.error)} helperText={modal.error} />
          </div>
        )}
      </Modal>
    </>
  );
}
