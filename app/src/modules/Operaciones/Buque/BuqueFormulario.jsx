import { useState } from 'react';
import LayoutMaestroBasico from '../../../templates/LayoutMaestroBasico/LayoutMaestroBasico.jsx';
import TextField from '../../../components/TextField/TextField.jsx';
import Checkbox from '../../../components/Checkbox/Checkbox.jsx';
import { OPERACIONES_SIDEBAR_PROPS } from '../../../config/sidebars/operaciones.js';
import styles from './BuqueFormulario.module.css';

const TITLES = {
  create: 'Crear Buque',
  view: 'Visualizar Buque',
  edit: 'Editar Buque',
};

export default function BuqueFormulario({ onNavigate, rows = [], onCreate, onUpdate, params = {}, mode = 'create' }) {
  const isView = mode === 'view';
  const isEdit = mode === 'edit';
  const existing = mode !== 'create' ? rows.find((r) => String(r.id) === String(params.id)) : null;

  const navigate = onNavigate ?? ((d) => console.log('navigate', d));

  const [codigo, setCodigo] = useState(existing?.codigo ?? '');
  const [denominacion, setDenominacion] = useState(existing?.denominacion ?? '');
  const [tipo, setTipo] = useState(existing?.tipo ?? '');
  const [inactivo, setInactivo] = useState(existing?.estado?.label === 'Inactivo');
  const [errors, setErrors] = useState({});

  function handleCancel() {
    navigate({ href: '/buques', label: 'Buque' });
  }

  // Si se pide ver/editar un buque que no existe (ej. URL directa con un id
  // inválido), se muestra el mismo shell sin formulario en vez de romper.
  if (mode !== 'create' && !existing) {
    return (
      <LayoutMaestroBasico
        sidebar={OPERACIONES_SIDEBAR_PROPS}
        activeHref="/buques"
        onNavigate={navigate}
        onCompanyChange={(c) => console.log('company change', c)}
        onLogout={() => console.log('logout')}
        onToggle={(d) => console.log('toggle', d)}
        breadcrumb={[{ label: 'Buque' }]}
        title="Buque no encontrado"
        onCancel={handleCancel}
        cancelLabel="Volver"
        formIcon="icon-pencil-square"
        formTitle="Datos del buque"
      >
        <p className={styles.notFound}>No se encontró el buque solicitado.</p>
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

    const buque = {
      id: existing?.id ?? Date.now(),
      codigo: codigo.trim(),
      denominacion: denominacion.trim(),
      tipo: tipo.trim(),
      estado: inactivo ? { label: 'Inactivo', tone: 'neutral' } : { label: 'Activo', tone: 'success' },
    };

    if (isEdit) onUpdate?.(buque);
    else onCreate?.(buque);
  }

  return (
    <LayoutMaestroBasico
      sidebar={OPERACIONES_SIDEBAR_PROPS}
      activeHref="/buques"
      onNavigate={navigate}
      onCompanyChange={(c) => console.log('company change', c)}
      onLogout={() => console.log('logout')}
      onToggle={(d) => console.log('toggle', d)}
      breadcrumb={[{ label: 'Buque' }, { label: TITLES[mode] }]}
      title={TITLES[mode]}
      onSave={isView ? undefined : handleSave}
      onCancel={handleCancel}
      cancelLabel={isView ? 'Volver' : 'Cancelar'}
      formIcon="icon-pencil-square"
      formTitle="Datos del buque"
    >
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
        <div className={styles.field}>
          <TextField label="Tipo" value={tipo} onChange={(e) => setTipo(e.target.value)} disabled={isView} />
        </div>
      </div>
      <Checkbox label="Inactivo" checked={inactivo} onChange={(e) => setInactivo(e.target.checked)} disabled={isView} />
    </LayoutMaestroBasico>
  );
}
