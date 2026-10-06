import { useState } from 'react';
import LayoutMaestroBasico from '../../../templates/LayoutMaestroBasico/LayoutMaestroBasico.jsx';
import LayoutMaestroFormulario from '../../../templates/LayoutMaestroFormulario/LayoutMaestroFormulario.jsx';
import FormRow from '../../../components/FormRow/FormRow.jsx';
import TextField from '../../../components/TextField/TextField.jsx';
import Select from '../../../components/Select/Select.jsx';
import Checkbox from '../../../components/Checkbox/Checkbox.jsx';
import { MAIN_SIDEBAR_PROPS } from '../../../config/sidebars/main.js';
import styles from './EquipoFormulario.module.css';

const TITLES = {
  create: 'Crear Equipo',
  view: 'Visualizar Equipo',
  edit: 'Editar Equipo',
};

// Empresas: las mismas del selector del Sidebar de Main (no un catálogo propio).
const EMPRESA_OPTIONS = MAIN_SIDEBAR_PROPS.companies.map((c) => ({ value: c.id, label: c.name }));

export default function EquipoFormulario({ onNavigate, onSearch, equipos = [], onCreateEquipo, onUpdateEquipo, params = {}, mode = 'create' }) {
  const isView = mode === 'view';
  const isEdit = mode === 'edit';
  const existing = mode !== 'create' ? equipos.find((e) => String(e.id) === String(params.id)) : null;

  const navigate = onNavigate ?? ((d) => console.log('navigate', d));

  const [empresaId, setEmpresaId] = useState(existing?.empresaId ?? '');
  const [ip, setIp] = useState(existing?.ip ?? '');
  const [denominacion, setDenominacion] = useState(existing?.denominacion ?? '');
  const [seguro, setSeguro] = useState(existing?.seguro ?? false);
  const [inactivo, setInactivo] = useState(existing ? !existing.activo : false);
  const [errors, setErrors] = useState({});

  function handleCancel() {
    navigate({ href: '/admin/equipos', label: 'Equipos' });
  }

  // Id inexistente en ver/editar (URL directa): mismo shell sin formulario.
  if (mode !== 'create' && !existing) {
    return (
      <LayoutMaestroBasico
        sidebar={MAIN_SIDEBAR_PROPS}
        activeHref="/admin/equipos"
        onNavigate={navigate}
        onSearch={onSearch}
        onCompanyChange={(c) => console.log('company change', c)}
        onLogout={() => console.log('logout')}
        onToggle={(d) => console.log('toggle', d)}
        breadcrumb={[{ label: 'Equipos' }]}
        title="Equipo no encontrado"
        onCancel={handleCancel}
        cancelLabel="Volver"
        formTitle="Datos del equipo"
      >
        <p className={styles.notFound}>No se encontró el equipo solicitado.</p>
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
    if (!empresaId) nextErrors.empresaId = 'Campo requerido';
    if (!ip.trim()) nextErrors.ip = 'Campo requerido';
    if (!denominacion.trim()) nextErrors.denominacion = 'Campo requerido';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const equipo = {
      id: existing?.id ?? Date.now(),
      empresaId,
      ip: ip.trim(),
      denominacion: denominacion.trim(),
      seguro,
      activo: !inactivo,
    };

    if (isEdit) onUpdateEquipo?.(equipo);
    else onCreateEquipo?.(equipo);
  }

  // Template M-01 (Formulario simple): una sola Form Section. Los checkboxes
  // van al final, SIEMPRE en vertical, con "Inactivo" (estado) último.
  return (
    <LayoutMaestroFormulario
      template="M-01"
      sidebar={MAIN_SIDEBAR_PROPS}
      activeHref="/admin/equipos"
      onNavigate={navigate}
      onSearch={onSearch}
      onCompanyChange={(c) => console.log('company change', c)}
      onLogout={() => console.log('logout')}
      onToggle={(d) => console.log('toggle', d)}
      breadcrumb={[{ label: 'Equipos' }, { label: TITLES[mode] }]}
      title={TITLES[mode]}
      onSave={isView ? undefined : handleSave}
      onCancel={handleCancel}
      cancelLabel={isView ? 'Volver' : 'Cancelar'}
      blocks={[
        {
          type: 'form',
          title: 'Datos del equipo',
          children: (
            <>
              <FormRow>
                <Select
                  label="Empresa"
                  value={empresaId}
                  onChange={updateField(setEmpresaId, 'empresaId')}
                  options={EMPRESA_OPTIONS}
                  placeholder="Seleccionar empresa..."
                  disabled={isView}
                  error={Boolean(errors.empresaId)}
                  helperText={errors.empresaId}
                />
                <TextField
                  label="IP"
                  value={ip}
                  onChange={updateField(setIp, 'ip')}
                  disabled={isView}
                  error={Boolean(errors.ip)}
                  helperText={errors.ip}
                />
                <TextField
                  label="Denominación"
                  value={denominacion}
                  onChange={updateField(setDenominacion, 'denominacion')}
                  disabled={isView}
                  error={Boolean(errors.denominacion)}
                  helperText={errors.denominacion}
                />
              </FormRow>
              <div className={styles.checks}>
                <Checkbox label="Equipo seguro" checked={seguro} onChange={(e) => setSeguro(e.target.checked)} disabled={isView} />
                <Checkbox label="Inactivo" checked={inactivo} onChange={(e) => setInactivo(e.target.checked)} disabled={isView} />
              </div>
            </>
          ),
        },
      ]}
    />
  );
}
