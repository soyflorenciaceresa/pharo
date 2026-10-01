import { useState } from 'react';
import LayoutMaestroBasico from '../../../templates/LayoutMaestroBasico/LayoutMaestroBasico.jsx';
import LayoutMaestroFormulario from '../../../templates/LayoutMaestroFormulario/LayoutMaestroFormulario.jsx';
import FormRow from '../../../components/FormRow/FormRow.jsx';
import TextField from '../../../components/TextField/TextField.jsx';
import Checkbox from '../../../components/Checkbox/Checkbox.jsx';
import { OPERACIONES_SIDEBAR_PROPS } from '../../../config/sidebars/operaciones.js';
import styles from './DepositoFormulario.module.css';

const TITLES = {
  create: 'Crear Depósito',
  view: 'Visualizar Depósito',
  edit: 'Editar Depósito',
};

export default function DepositoFormulario({ onNavigate, onSearch, depositos = [], onCreateDeposito, onUpdateDeposito, params = {}, mode = 'create' }) {
  const isView = mode === 'view';
  const isEdit = mode === 'edit';
  const existing = mode !== 'create' ? depositos.find((d) => String(d.id) === String(params.id)) : null;

  const navigate = onNavigate ?? ((d) => console.log('navigate', d));

  const [codigo, setCodigo] = useState(existing?.codigo ?? '');
  const [denominacion, setDenominacion] = useState(existing?.denominacion ?? '');
  const [codigoLot, setCodigoLot] = useState(existing?.codigoLot ?? '');
  const [actualizaStock, setActualizaStock] = useState(existing?.actualizaStock ?? false);
  const [depositoFiscal, setDepositoFiscal] = useState(existing?.depositoFiscal ?? false);
  const [trabajaSectorizacion, setTrabajaSectorizacion] = useState(existing?.trabajaSectorizacion ?? false);
  const [inactivo, setInactivo] = useState(existing?.estado?.label === 'Inactivo');
  const [errors, setErrors] = useState({});

  function handleCancel() {
    navigate({ href: '/depositos', label: 'Depósitos' });
  }

  // Id inexistente en ver/editar (URL directa): mismo shell sin formulario,
  // igual que BuqueFormulario.
  if (mode !== 'create' && !existing) {
    return (
      <LayoutMaestroBasico
        sidebar={OPERACIONES_SIDEBAR_PROPS}
        activeHref="/depositos"
        onNavigate={navigate}
        onSearch={onSearch}
        onCompanyChange={(c) => console.log('company change', c)}
        onLogout={() => console.log('logout')}
        onToggle={(d) => console.log('toggle', d)}
        breadcrumb={[{ label: 'Depósitos' }]}
        title="Depósito no encontrado"
        onCancel={handleCancel}
        cancelLabel="Volver"
        formTitle="Datos del depósito"
      >
        <p className={styles.notFound}>No se encontró el depósito solicitado.</p>
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

    const deposito = {
      id: existing?.id ?? Date.now(),
      codigo: codigo.trim(),
      denominacion: denominacion.trim(),
      codigoLot: codigoLot.trim(),
      actualizaStock,
      depositoFiscal,
      trabajaSectorizacion,
      estado: inactivo ? { label: 'Inactivo', type: 'neutral' } : { label: 'Activo', type: 'success' },
    };

    if (isEdit) onUpdateDeposito?.(deposito);
    else onCreateDeposito?.(deposito);
  }

  // Template M-01 (Formulario simple): una sola Form Section. Los checkboxes
  // van al final de la misma sección, SIEMPRE en vertical (regla del kit).
  return (
    <LayoutMaestroFormulario
      template="M-01"
      sidebar={OPERACIONES_SIDEBAR_PROPS}
      activeHref="/depositos"
      onNavigate={navigate}
      onSearch={onSearch}
      onCompanyChange={(c) => console.log('company change', c)}
      onLogout={() => console.log('logout')}
      onToggle={(d) => console.log('toggle', d)}
      breadcrumb={[{ label: 'Depósitos' }, { label: TITLES[mode] }]}
      title={TITLES[mode]}
      onSave={isView ? undefined : handleSave}
      onCancel={handleCancel}
      cancelLabel={isView ? 'Volver' : 'Cancelar'}
      blocks={[
        {
          type: 'form',
          title: 'Datos del depósito',
          children: (
            <>
              <FormRow>
                <TextField
                  label="Código"
                  value={codigo}
                  onChange={updateField(setCodigo, 'codigo')}
                  disabled={isView}
                  error={Boolean(errors.codigo)}
                  helperText={errors.codigo}
                />
                <TextField
                  label="Denominación"
                  value={denominacion}
                  onChange={updateField(setDenominacion, 'denominacion')}
                  disabled={isView}
                  error={Boolean(errors.denominacion)}
                  helperText={errors.denominacion}
                />
                <TextField label="Código LOT" value={codigoLot} onChange={(e) => setCodigoLot(e.target.value)} disabled={isView} />
              </FormRow>
              <div className={styles.checksRow}>
                <Checkbox label="Actualiza Stock" checked={actualizaStock} onChange={(e) => setActualizaStock(e.target.checked)} disabled={isView} />
                <Checkbox label="Depósito Fiscal" checked={depositoFiscal} onChange={(e) => setDepositoFiscal(e.target.checked)} disabled={isView} />
                <Checkbox label="Trabaja con sectorización" checked={trabajaSectorizacion} onChange={(e) => setTrabajaSectorizacion(e.target.checked)} disabled={isView} />
                <div className={styles.statusCheck}>
                  <Checkbox label="Inactivo" checked={inactivo} onChange={(e) => setInactivo(e.target.checked)} disabled={isView} />
                </div>
              </div>
            </>
          ),
        },
      ]}
    />
  );
}
