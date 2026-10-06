import { useState } from 'react';
import LayoutMaestroBasico from '../../../templates/LayoutMaestroBasico/LayoutMaestroBasico.jsx';
import FormContainer from '../../../components/FormContainer/FormContainer.jsx';
import TextField from '../../../components/TextField/TextField.jsx';
import Checkbox from '../../../components/Checkbox/Checkbox.jsx';
import CheckboxList from '../../../components/CheckboxList/CheckboxList.jsx';
import ChildGridSection from '../../../components/ChildGridSection/ChildGridSection.jsx';
import ActionGroup from '../../../components/ActionGroup/ActionGroup.jsx';
import Select from '../../../components/Select/Select.jsx';
import Modal from '../../../components/Modal/Modal.jsx';
import { MAIN_SIDEBAR_PROPS } from '../../../config/sidebars/main.js';
import { ALL_MODULES } from '../../../config/modules.js';
import { CONCESIONARIOS } from '../../../config/concesionarios.js';
import styles from './PerfilFormulario.module.css';

const TITLES = {
  create: 'Crear Perfil',
  view: 'Visualizar Perfil',
  edit: 'Editar Perfil',
};

// Catálogo de módulos para el checklist "Módulos" — mismo catálogo que usa
// Main/Modulos para habilitar módulos por empresa (config/modules.js), acá
// mapeado a {id,label,description} para CheckboxList (label = title).
const MODULOS = ALL_MODULES.map((m) => ({ id: m.id, label: m.title, description: m.description }));

const CONCESIONARIOS_COLUMNS = [{ key: 'denominacion', label: 'Denominación' }];

export default function PerfilFormulario({ onNavigate, onSearch, perfiles = [], onCreatePerfil, onUpdatePerfil, params = {}, mode = 'create' }) {
  const isView = mode === 'view';
  const isEdit = mode === 'edit';
  const existing = mode !== 'create' ? perfiles.find((p) => String(p.id) === String(params.id)) : null;

  const navigate = onNavigate ?? ((d) => console.log('navigate', d));

  const [codigo, setCodigo] = useState(existing?.codigo ?? '');
  const [denominacion, setDenominacion] = useState(existing?.denominacion ?? '');
  const [inactivo, setInactivo] = useState(existing ? !existing.activo : false);
  const [moduloIds, setModuloIds] = useState(existing?.moduloIds ?? []);
  const [concesionarioIds, setConcesionarioIds] = useState(existing?.concesionarioIds ?? []);
  const [errors, setErrors] = useState({});

  const [modalOpen, setModalOpen] = useState(false);
  const [modalSelection, setModalSelection] = useState('');

  function handleCancel() {
    navigate({ href: '/admin/roles-y-perfiles', label: 'Roles y perfiles' });
  }

  // Si se pide ver/editar un perfil que no existe (ej. URL directa con un id
  // inválido), se muestra el mismo shell sin formulario en vez de romper —
  // mismo criterio que BuqueFormulario/UsuarioFormulario.
  if (mode !== 'create' && !existing) {
    return (
      <LayoutMaestroBasico
        sidebar={MAIN_SIDEBAR_PROPS}
        activeHref="/admin/roles-y-perfiles"
        onNavigate={navigate}
        onSearch={onSearch}
        onCompanyChange={(c) => console.log('company change', c)}
        onLogout={() => console.log('logout')}
        onToggle={(d) => console.log('toggle', d)}
        breadcrumb={[{ label: 'Roles y perfiles' }]}
        title="Perfil no encontrado"
        onCancel={handleCancel}
        cancelLabel="Volver"
      >
        <FormContainer title="Datos del perfil">
          <p className={styles.notFound}>No se encontró el perfil solicitado.</p>
        </FormContainer>
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
    if (!codigo.trim()) nextErrors.codigo = 'Campo requerido';
    if (!denominacion.trim()) nextErrors.denominacion = 'Campo requerido';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const perfil = {
      id: existing?.id ?? Date.now(),
      codigo: codigo.trim(),
      denominacion: denominacion.trim(),
      activo: !inactivo,
      moduloIds,
      concesionarioIds,
    };

    if (isEdit) onUpdatePerfil?.(perfil);
    else onCreatePerfil?.(perfil);
  }

  function handleRemoveConcesionario(id) {
    setConcesionarioIds((prev) => prev.filter((cId) => cId !== id));
  }

  function handleOpenModal() {
    setModalSelection('');
    setModalOpen(true);
  }

  function handleConfirmAddConcesionario() {
    if (!modalSelection) return;
    setConcesionarioIds((prev) => [...prev, modalSelection]);
    setModalOpen(false);
  }

  const concesionarioRows = concesionarioIds.map((id) => ({
    id,
    denominacion: CONCESIONARIOS.find((c) => c.id === id)?.label ?? id,
  }));
  const concesionarioOptions = CONCESIONARIOS.filter((c) => !concesionarioIds.includes(c.id)).map((c) => ({
    value: c.id,
    label: c.label,
  }));

  return (
    <LayoutMaestroBasico
      sidebar={MAIN_SIDEBAR_PROPS}
      activeHref="/admin/roles-y-perfiles"
      onNavigate={navigate}
      onSearch={onSearch}
      onCompanyChange={(c) => console.log('company change', c)}
      onLogout={() => console.log('logout')}
      onToggle={(d) => console.log('toggle', d)}
      breadcrumb={[{ label: 'Roles y perfiles' }, { label: TITLES[mode] }]}
      title={TITLES[mode]}
      onSave={isView ? undefined : handleSave}
      onCancel={handleCancel}
      cancelLabel={isView ? 'Volver' : 'Cancelar'}
    >
      <FormContainer title="Datos del perfil">
        <div className={styles.fieldsRow}>
          <div className={styles.field}>
            <TextField
              label="Código"
              value={codigo}
              onChange={updateField(setCodigo, 'codigo')}
              disabled={isView}
              error={Boolean(errors.codigo)}
              helperText={errors.codigo}
            />
          </div>
          <div className={styles.field}>
            <TextField
              label="Denominación"
              value={denominacion}
              onChange={updateField(setDenominacion, 'denominacion')}
              disabled={isView}
              error={Boolean(errors.denominacion)}
              helperText={errors.denominacion}
            />
          </div>
        </div>
        <Checkbox label="Inactivo" checked={inactivo} onChange={(e) => setInactivo(e.target.checked)} disabled={isView} />
      </FormContainer>

      <FormContainer title="Módulos">
        <CheckboxList
          items={MODULOS}
          selectedIds={moduloIds}
          onChange={setModuloIds}
          searchPlaceholder="Buscar módulo..."
          disabled={isView}
          columns={2}
        />
      </FormContainer>

      <ChildGridSection
        title="Concesionarios"
        onAdd={isView ? undefined : handleOpenModal}
        columns={CONCESIONARIOS_COLUMNS}
        rows={concesionarioRows}
        emptyMessage="No hay concesionarios asignados."
        actions={
          isView
            ? []
            : [{ key: 'delete', icon: 'icon-delete', label: 'Eliminar', onClick: (row) => handleRemoveConcesionario(row.id) }]
        }
      />

      <Modal
        open={modalOpen}
        title="Agregar concesionario"
        onClose={() => setModalOpen(false)}
        footer={
          // Regla del Action Group: el primario siempre va a la izquierda
          // (antes Cancelar iba a la izquierda y Agregar a la derecha).
          <ActionGroup
            aria-label="Acciones del diálogo"
            primary={{ label: 'Agregar', onClick: handleConfirmAddConcesionario, disabled: !modalSelection }}
            secondary={[{ label: 'Cancelar', onClick: () => setModalOpen(false) }]}
          />
        }
      >
        <Select
          label="Concesionario"
          value={modalSelection}
          onChange={(e) => setModalSelection(e.target.value)}
          options={concesionarioOptions}
          placeholder="Seleccionar concesionario..."
        />
      </Modal>
    </LayoutMaestroBasico>
  );
}
