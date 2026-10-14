import { useState } from 'react';
import LayoutMaestroFormulario from '../../../templates/LayoutMaestroFormulario/LayoutMaestroFormulario.jsx';
import LayoutMaestroBasico from '../../../templates/LayoutMaestroBasico/LayoutMaestroBasico.jsx';
import FormRow from '../../../components/FormRow/FormRow.jsx';
import TextField from '../../../components/TextField/TextField.jsx';
import Select from '../../../components/Select/Select.jsx';
import Checkbox from '../../../components/Checkbox/Checkbox.jsx';
import FileUpload from '../../../components/FileUpload/FileUpload.jsx';
import Badge from '../../../components/Badge/Badge.jsx';
import Modal from '../../../components/Modal/Modal.jsx';
import ActionGroup from '../../../components/ActionGroup/ActionGroup.jsx';
import { ACCESS_CONTROL_SIDEBAR_PROPS } from '../../../config/sidebars/access-control.js';
import { GRUPOS_PERSONAS, CIUDADES } from '../../../config/accessControl.js';
import styles from './PersonaFormulario.module.css';

const HREF = '/access-control/personas';
const TITLES = { create: 'Crear Persona', view: 'Visualizar Persona', edit: 'Editar Persona' };

// Maestro "Personas" (Access Control). Rediseño de una pantalla del sistema
// anterior con TODOS sus datos. Patrón M-04a: Form Sections + la grilla hija
// "Razón social" al final. Mejora respecto del original: se quitaron las tabs
// (Datos generales | Razón social) porque, según la regla del kit, con UNA sola
// colección hija no hacen falta tabs — así los datos y las razones sociales se
// ven juntos. Pendientes: dropzone de imagen (hoy `FileUpload`), campo de texto
// largo para Observaciones (hoy `TextField`), selector con búsqueda para Ciudad,
// y la tercera acción de fila del listado original (ícono de credencial).
const EMPTY = {
  dni: '', nombre: '', apellido: '', direccion: '', ciudad: '',
  grupo: '', subgrupo: '', tarjetaRfid: '', imagen: '',
  docux: false, rrhh: false, turnos: false, inactivo: false,
  suspInicio: '', suspFin: '', observaciones: '',
};

const GRUPO_OPTIONS = GRUPOS_PERSONAS.map(({ value, label }) => ({ value, label }));
const CUIT_RE = /^\d{11}$/;

export default function PersonaFormulario({ onNavigate, onSearch, personas = [], onCreatePersona, onUpdatePersona, params = {}, mode = 'create' }) {
  const isView = mode === 'view';
  const isEdit = mode === 'edit';
  const existing = mode !== 'create' ? personas.find((p) => String(p.id) === String(params.id)) : null;
  const navigate = onNavigate ?? ((d) => console.log('navigate', d));

  const [values, setValues] = useState({ ...EMPTY, ...(existing?.values ?? {}) });
  const [razones, setRazones] = useState(existing?.razones ?? []);
  const [errors, setErrors] = useState({});
  const [modal, setModal] = useState(null); // { id?, razon, cuit, activo, error }

  const common = {
    sidebar: ACCESS_CONTROL_SIDEBAR_PROPS,
    activeHref: HREF,
    onNavigate: navigate,
    onSearch,
    onCompanyChange: (c) => console.log('company change', c),
    onLogout: () => console.log('logout'),
    onToggle: (d) => console.log('toggle', d),
  };
  const goList = () => navigate({ href: HREF, label: 'Personas' });

  if (mode !== 'create' && !existing) {
    return (
      <LayoutMaestroBasico {...common} breadcrumb={[{ label: 'Personas' }]} title="Persona no encontrada" onCancel={goList} cancelLabel="Volver" formTitle="Datos de la persona">
        <p className={styles.notFound}>No se encontró la persona solicitada.</p>
      </LayoutMaestroBasico>
    );
  }

  function set(key, value) {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  const subgrupoOptions = GRUPOS_PERSONAS.find((g) => g.value === values.grupo)?.subgrupos ?? [];
  const denominacion = values.apellido || values.nombre ? `${values.apellido.trim().toUpperCase()}${values.apellido && values.nombre ? ', ' : ''}${values.nombre.trim()}` : '';

  const text = (key, label, extra = {}) => (
    <TextField label={label} value={values[key]} onChange={(e) => set(key, e.target.value)} disabled={isView} error={Boolean(errors[key])} helperText={errors[key]} {...extra} />
  );

  function handleSave() {
    const next = {};
    const dni = values.dni.trim();
    if (!dni) next.dni = 'Campo requerido';
    else if (!/^\d{7,8}$/.test(dni)) next.dni = 'Ingresá un DNI de 7 u 8 dígitos';
    else if (personas.some((p) => p.dni === dni && p.id !== existing?.id)) next.dni = 'Ya existe una persona con este DNI';
    if (!values.nombre.trim()) next.nombre = 'Campo requerido';
    if (!values.apellido.trim()) next.apellido = 'Campo requerido';
    if (!values.grupo) next.grupo = 'Campo requerido';
    if (!values.subgrupo) next.subgrupo = 'Campo requerido';
    if (!values.tarjetaRfid.trim()) next.tarjetaRfid = 'Campo requerido';
    if (values.suspInicio && values.suspFin && values.suspFin < values.suspInicio) next.suspFin = 'La fecha fin debe ser posterior al inicio';
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const persona = {
      id: existing?.id ?? Date.now(),
      dni,
      denominacion,
      grupo: values.grupo,
      subgrupo: values.subgrupo,
      docux: values.docux,
      rrhh: values.rrhh,
      turnos: values.turnos,
      activo: !values.inactivo,
      values,
      razones,
    };
    if (isEdit) onUpdatePersona?.(persona);
    else onCreatePersona?.(persona);
  }

  // ── Razón social (grilla hija, se edita en Modal) ─────────────────────────
  function saveRazon() {
    const cuit = modal.cuit.replace(/\D/g, '');
    if (!modal.razon.trim()) return setModal({ ...modal, error: 'La razón social es obligatoria' });
    if (!CUIT_RE.test(cuit)) return setModal({ ...modal, error: 'El CUIT debe tener 11 dígitos' });
    const row = { id: modal.id ?? Date.now(), razon: modal.razon.trim(), cuit, activo: modal.activo };
    setRazones((prev) => (modal.id ? prev.map((r) => (r.id === modal.id ? row : r)) : [...prev, row]));
    setModal(null);
  }

  const fileField = (
    <FileUpload label="Imagen" value={values.imagen} onChange={(e) => set('imagen', e.target.files[0]?.name ?? '')} accept="image/*" disabled={isView} />
  );

  return (
    <>
      <LayoutMaestroFormulario
        template="M-04a"
        {...common}
        breadcrumb={[{ label: 'Personas' }, { label: mode === 'create' ? 'Crear' : TITLES[mode] }]}
        title={TITLES[mode]}
        onSave={isView ? undefined : handleSave}
        onCancel={goList}
        cancelLabel={isView ? 'Volver' : 'Cancelar'}
        blocks={[
          {
            type: 'form',
            title: 'Datos personales',
            children: (
              <>
                <FormRow>
                  {text('dni', 'DNI *', { inputMode: 'numeric', maxLength: 8 })}
                  {text('nombre', 'Nombre *')}
                  {text('apellido', 'Apellido *')}
                </FormRow>
                <FormRow>
                  <TextField label="Denominación" value={denominacion} disabled readOnly placeholder="Se completa con apellido y nombre" />
                  {text('direccion', 'Dirección')}
                  <Select label="Ciudad" value={values.ciudad} onChange={(e) => set('ciudad', e.target.value)} options={CIUDADES} placeholder="Seleccionar ciudad..." disabled={isView} />
                </FormRow>
              </>
            ),
          },
          {
            type: 'form',
            title: 'Credencial y acceso',
            children: (
              <>
                <FormRow>
                  <Select
                    label="Grupo *"
                    value={values.grupo}
                    onChange={(e) => setValues((prev) => ({ ...prev, grupo: e.target.value, subgrupo: '' }))}
                    options={GRUPO_OPTIONS}
                    placeholder="Seleccionar grupo..."
                    disabled={isView}
                    error={Boolean(errors.grupo)}
                    helperText={errors.grupo}
                  />
                  <Select
                    label="Subgrupo *"
                    value={values.subgrupo}
                    onChange={(e) => set('subgrupo', e.target.value)}
                    options={subgrupoOptions}
                    placeholder={values.grupo ? 'Seleccionar subgrupo...' : 'Elegí primero un grupo'}
                    disabled={isView || !values.grupo}
                    error={Boolean(errors.subgrupo)}
                    helperText={errors.subgrupo}
                  />
                  {text('tarjetaRfid', 'Tarjeta RFID *')}
                </FormRow>
                <FormRow columns={2}>{fileField}</FormRow>
              </>
            ),
          },
          {
            type: 'form',
            title: 'Permisos y estado',
            children: (
              <div className={styles.checks}>
                <Checkbox label="DocUX" checked={values.docux} onChange={(e) => set('docux', e.target.checked)} disabled={isView} />
                <Checkbox label="Recursos humanos" checked={values.rrhh} onChange={(e) => set('rrhh', e.target.checked)} disabled={isView} />
                <Checkbox label="Turnos de camiones" checked={values.turnos} onChange={(e) => set('turnos', e.target.checked)} disabled={isView} />
                <div className={styles.statusCheck}>
                  <Checkbox label="Inactivo" checked={values.inactivo} onChange={(e) => set('inactivo', e.target.checked)} disabled={isView} />
                </div>
              </div>
            ),
          },
          {
            type: 'grid',
            title: 'Razón social',
            onAdd: isView ? undefined : () => setModal({ razon: '', cuit: '', activo: true, error: '' }),
            columns: [
              { key: 'razon', label: 'Razón social' },
              { key: 'cuit', label: 'CUIT', width: 160 },
              { key: 'activo', label: 'Activo', width: 120, render: (row) => <Badge type={row.activo ? 'success' : 'neutral'}>{row.activo ? 'Activo' : 'Inactivo'}</Badge> },
            ],
            rows: razones,
            emptyMessage: 'Sin razones sociales asociadas.',
            actions: isView
              ? []
              : [
                  { key: 'edit', icon: 'icon-edit', label: 'Editar', onClick: (row) => setModal({ ...row, error: '' }) },
                  { key: 'delete', icon: 'bi-trash', label: 'Eliminar', onClick: (row) => setRazones((prev) => prev.filter((r) => r.id !== row.id)) },
                ],
          },
          {
            type: 'accordion',
            title: 'Suspensión (opcional)',
            children: (
              <FormRow columns={2}>
                {text('suspInicio', 'Fecha inicio de suspensión', { type: 'date' })}
                {text('suspFin', 'Fecha fin de suspensión', { type: 'date' })}
              </FormRow>
            ),
          },
          {
            type: 'accordion',
            title: 'Observaciones (opcional)',
            children: text('observaciones', 'Observaciones'),
          },
        ]}
      />
      <Modal
        open={Boolean(modal)}
        title={modal?.id ? 'Editar razón social' : 'Agregar razón social'}
        onClose={() => setModal(null)}
        footer={
          <ActionGroup
            aria-label="Acciones del diálogo"
            primary={{ label: modal?.id ? 'Guardar' : 'Agregar', onClick: saveRazon }}
            secondary={[{ label: 'Cancelar', onClick: () => setModal(null) }]}
          />
        }
      >
        {modal && (
          <div className={styles.modalFields}>
            <TextField label="Razón social *" value={modal.razon} onChange={(e) => setModal({ ...modal, razon: e.target.value, error: '' })} />
            <TextField label="CUIT *" value={modal.cuit} onChange={(e) => setModal({ ...modal, cuit: e.target.value, error: '' })} inputMode="numeric" maxLength={13} error={Boolean(modal.error)} helperText={modal.error} />
            <Checkbox label="Activo" checked={modal.activo} onChange={(e) => setModal({ ...modal, activo: e.target.checked })} />
          </div>
        )}
      </Modal>
    </>
  );
}
