import { useState } from 'react';
import LayoutMaestroFormulario from '../../../templates/LayoutMaestroFormulario/LayoutMaestroFormulario.jsx';
import LayoutMaestroBasico from '../../../templates/LayoutMaestroBasico/LayoutMaestroBasico.jsx';
import FormRow from '../../../components/FormRow/FormRow.jsx';
import TextField from '../../../components/TextField/TextField.jsx';
import Select from '../../../components/Select/Select.jsx';
import Checkbox from '../../../components/Checkbox/Checkbox.jsx';
import Modal from '../../../components/Modal/Modal.jsx';
import ActionGroup from '../../../components/ActionGroup/ActionGroup.jsx';
import { SCALES_SIDEBAR_PROPS } from '../../../config/sidebars/scales.js';
import { USUARIOS } from '../../../config/purchasesFondosFijos.js';
import styles from './GrupoBalanzaFormulario.module.css';

const HREF = '/scales/grupos-de-balanzas';
const VERBS = { create: 'Crear', view: 'Visualizar', edit: 'Editar' };
const TIPOS_BALANZA = ['Camiones', 'Vagones', 'Laboratorio', 'Móvil'].map((v) => ({ value: v, label: v }));
const labelOf = (value) => USUARIOS.find((u) => u.value === value)?.label ?? value;

// Maestro "Grupos de balanzas" (Scales). Template M-04a · cabecera + grilla:
// una Form Section (código, denominación, tipo de balanza) y UNA colección hija
// (Usuarios del grupo) como Child Grid Section. Los usuarios se eligen en un
// Modal. Supuesto: Código y Denominación obligatorios. Pendiente: selector con
// búsqueda de usuarios.
export default function GrupoBalanzaFormulario({ truckshiftRows = {}, onSaveTruckshift, onNavigate, onSearch, params = {}, mode = 'create' }) {
  const rows = truckshiftRows[HREF] ?? [];
  const isView = mode === 'view';
  const isEdit = mode === 'edit';
  const existing = mode !== 'create' ? rows.find((r) => String(r.id) === String(params.id)) : null;
  const navigate = onNavigate ?? ((d) => console.log('navigate', d));

  const [values, setValues] = useState({ codigo: existing?.codigo ?? '', denominacion: existing?.denominacion ?? '', tipoBalanza: '', ...(existing?.values ?? {}) });
  const [inactivo, setInactivo] = useState(existing?.estado?.label === 'Inactivo');
  const [usuarios, setUsuarios] = useState(existing?.usuarios ?? []);
  const [errors, setErrors] = useState({});
  const [modal, setModal] = useState(null);

  const common = {
    sidebar: SCALES_SIDEBAR_PROPS,
    activeHref: HREF,
    onNavigate: navigate,
    onSearch,
    onCompanyChange: (c) => console.log('company change', c),
    onLogout: () => console.log('logout'),
    onToggle: (d) => console.log('toggle', d),
  };
  const goList = () => navigate({ href: HREF, label: 'Grupos de balanzas' });

  if (mode !== 'create' && !existing) {
    return (
      <LayoutMaestroBasico {...common} breadcrumb={[{ label: 'Grupos de balanzas' }]} title="Grupo no encontrado" onCancel={goList} cancelLabel="Volver" formTitle="Datos del grupo">
        <p className={styles.notFound}>No se encontró el grupo solicitado.</p>
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
    else if (rows.some((r) => r.codigo === codigo && r.id !== existing?.id)) next.codigo = 'Ya existe un grupo con este código';
    if (!values.denominacion.trim()) next.denominacion = 'Campo requerido';
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    onSaveTruckshift?.(HREF, {
      id: existing?.id ?? Date.now(),
      codigo,
      denominacion: values.denominacion.trim(),
      estado: inactivo ? { label: 'Inactivo', type: 'neutral' } : { label: 'Activo', type: 'success' },
      values: { ...values, codigo, denominacion: values.denominacion.trim() },
      usuarios,
    }, isEdit);
  }

  const available = USUARIOS.filter((u) => !usuarios.includes(u.value));

  function saveModal() {
    if (!modal.valor) return setModal({ ...modal, error: 'Elegí un usuario' });
    setUsuarios((prev) => [...prev, modal.valor]);
    setModal(null);
  }

  return (
    <>
      <LayoutMaestroFormulario
        template="M-04a"
        {...common}
        breadcrumb={[{ label: 'Grupos de balanzas' }, { label: mode === 'create' ? 'Crear' : `${VERBS[mode]} Grupo de balanzas` }]}
        title={`${VERBS[mode]} Grupo de balanzas`}
        onSave={isView ? undefined : handleSave}
        onCancel={goList}
        cancelLabel={isView ? 'Volver' : 'Cancelar'}
        blocks={[
          {
            type: 'form',
            title: 'Datos del grupo',
            children: (
              <>
                <FormRow>
                  <TextField label="Código *" value={values.codigo} onChange={(e) => set('codigo', e.target.value)} disabled={isView} error={Boolean(errors.codigo)} helperText={errors.codigo} />
                  <TextField label="Denominación *" value={values.denominacion} onChange={(e) => set('denominacion', e.target.value)} disabled={isView} error={Boolean(errors.denominacion)} helperText={errors.denominacion} />
                  <Select label="Tipo de balanza" value={values.tipoBalanza} onChange={(e) => set('tipoBalanza', e.target.value)} options={TIPOS_BALANZA} placeholder="Seleccionar..." disabled={isView} />
                </FormRow>
                <Checkbox label="Inactivo" checked={inactivo} onChange={(e) => setInactivo(e.target.checked)} disabled={isView} />
              </>
            ),
          },
          {
            type: 'grid',
            title: 'Usuarios',
            onAdd: isView ? undefined : () => setModal({ valor: '', error: '' }),
            columns: [{ key: 'usuario', label: 'Usuario', render: (row) => <span>{labelOf(row.usuario)}</span> }],
            rows: usuarios.map((u) => ({ id: u, usuario: u })),
            emptyMessage: 'Sin datos para mostrar.',
            actions: isView ? [] : [{ key: 'delete', icon: 'bi-trash', label: 'Quitar', onClick: (row) => setUsuarios((prev) => prev.filter((x) => x !== row.id)) }],
          },
        ]}
      />
      <Modal
        open={Boolean(modal)}
        title="Agregar usuario"
        onClose={() => setModal(null)}
        footer={
          <ActionGroup
            aria-label="Acciones del diálogo"
            primary={{ label: 'Agregar', onClick: saveModal, disabled: available.length === 0 }}
            secondary={[{ label: 'Cancelar', onClick: () => setModal(null) }]}
          />
        }
      >
        {modal && (
          <div className={styles.modalFields}>
            <Select
              label="Usuario *"
              value={modal.valor}
              onChange={(e) => setModal({ ...modal, valor: e.target.value, error: '' })}
              options={available}
              placeholder={available.length ? 'Seleccionar usuario...' : 'No hay más usuarios'}
              error={Boolean(modal.error)}
              helperText={modal.error}
            />
          </div>
        )}
      </Modal>
    </>
  );
}
