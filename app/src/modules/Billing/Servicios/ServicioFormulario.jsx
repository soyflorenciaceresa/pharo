import { useState } from 'react';
import LayoutMaestroFormulario from '../../../templates/LayoutMaestroFormulario/LayoutMaestroFormulario.jsx';
import LayoutMaestroBasico from '../../../templates/LayoutMaestroBasico/LayoutMaestroBasico.jsx';
import FormRow from '../../../components/FormRow/FormRow.jsx';
import TextField from '../../../components/TextField/TextField.jsx';
import Select from '../../../components/Select/Select.jsx';
import Checkbox from '../../../components/Checkbox/Checkbox.jsx';
import { BILLING_SIDEBAR_PROPS } from '../../../config/sidebars/billing.js';
import { IMPUESTOS } from '../../../config/billingImpositivas.js';
import { MONEDAS, UNIDADES, CUENTAS } from '../../../config/billingServicios.js';
import styles from './ServicioFormulario.module.css';

const HREF = '/billing/servicios';
const TITLES = { create: 'Crear Servicio', view: 'Visualizar Servicio', edit: 'Editar Servicio' };

// Maestro "Servicios" (Billing). Template M-01 · Formulario simple: un solo
// grupo de pocos campos del mismo contexto (como Depósitos) — una Form Section
// "Datos del servicio" con tres filas y "Inactivo" al final. Moneda, Unidad de
// medida, Impuesto y Cuenta eran lookups (código + denominación); hoy son `Select`
// (pendiente: selector con búsqueda).
const EMPTY = { codigo: '', denominacion: '', moneda: '', precio: '', unidad: '', impuesto: '', cuenta: '', inactivo: false };
const PRECIO_RE = /^\d+([.,]\d{1,4})?$/;

export default function ServicioFormulario({ onNavigate, onSearch, servicios = [], onCreateServicio, onUpdateServicio, params = {}, mode = 'create' }) {
  const isView = mode === 'view';
  const isEdit = mode === 'edit';
  const existing = mode !== 'create' ? servicios.find((s) => String(s.id) === String(params.id)) : null;
  const navigate = onNavigate ?? ((d) => console.log('navigate', d));

  const [values, setValues] = useState({ ...EMPTY, ...(existing?.values ?? {}) });
  const [errors, setErrors] = useState({});

  const common = {
    sidebar: BILLING_SIDEBAR_PROPS,
    activeHref: HREF,
    onNavigate: navigate,
    onSearch,
    onCompanyChange: (c) => console.log('company change', c),
    onLogout: () => console.log('logout'),
    onToggle: (d) => console.log('toggle', d),
  };
  const goList = () => navigate({ href: HREF, label: 'Servicios' });

  if (mode !== 'create' && !existing) {
    return (
      <LayoutMaestroBasico {...common} breadcrumb={[{ label: 'Servicios' }]} title="Servicio no encontrado" onCancel={goList} cancelLabel="Volver" formTitle="Datos del servicio">
        <p className={styles.notFound}>No se encontró el servicio solicitado.</p>
      </LayoutMaestroBasico>
    );
  }

  function set(key, value) {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }
  const text = (key, label, extra = {}) => (
    <TextField label={label} value={values[key]} onChange={(e) => set(key, e.target.value)} disabled={isView} error={Boolean(errors[key])} helperText={errors[key]} {...extra} />
  );
  const select = (key, label, options, placeholder) => (
    <Select label={label} value={values[key]} onChange={(e) => set(key, e.target.value)} options={options} placeholder={placeholder} disabled={isView} />
  );

  function handleSave() {
    const next = {};
    const codigo = values.codigo.trim();
    if (!codigo) next.codigo = 'Campo requerido';
    else if (servicios.some((s) => s.codigo.toLowerCase() === codigo.toLowerCase() && s.id !== existing?.id)) next.codigo = 'Ya existe un servicio con este código';
    if (!values.denominacion.trim()) next.denominacion = 'Campo requerido';
    if (values.precio.trim() && !PRECIO_RE.test(values.precio.trim())) next.precio = 'Ingresá un número mayor o igual a 0';
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const servicio = {
      id: existing?.id ?? Date.now(),
      codigo,
      denominacion: values.denominacion.trim(),
      estado: values.inactivo ? { label: 'Inactivo', type: 'neutral' } : { label: 'Activo', type: 'success' },
      values: { ...values, codigo, denominacion: values.denominacion.trim() },
    };
    if (isEdit) onUpdateServicio?.(servicio);
    else onCreateServicio?.(servicio);
  }

  return (
    <LayoutMaestroFormulario
      template="M-01"
      {...common}
      breadcrumb={[{ label: 'Servicios' }, { label: mode === 'create' ? 'Crear' : TITLES[mode] }]}
      title={TITLES[mode]}
      onSave={isView ? undefined : handleSave}
      onCancel={goList}
      cancelLabel={isView ? 'Volver' : 'Cancelar'}
      blocks={[
        {
          type: 'form',
          title: 'Datos del servicio',
          children: (
            <>
              <FormRow>
                {text('codigo', 'Código *')}
                {text('denominacion', 'Denominación *')}
                {select('moneda', 'Moneda', MONEDAS, 'Seleccionar moneda...')}
              </FormRow>
              <FormRow>
                {text('precio', values.moneda ? `Precio unitario (${values.moneda})` : 'Precio unitario', { inputMode: 'decimal', placeholder: '0' })}
                {select('unidad', 'Unidad de medida', UNIDADES, 'Seleccionar unidad...')}
                {select('impuesto', 'Impuesto', IMPUESTOS, 'Seleccionar impuesto...')}
              </FormRow>
              <FormRow>{select('cuenta', 'Cuenta', CUENTAS, 'Seleccionar cuenta...')}</FormRow>
              <Checkbox label="Inactivo" checked={values.inactivo} onChange={(e) => set('inactivo', e.target.checked)} disabled={isView} />
            </>
          ),
        },
      ]}
    />
  );
}
