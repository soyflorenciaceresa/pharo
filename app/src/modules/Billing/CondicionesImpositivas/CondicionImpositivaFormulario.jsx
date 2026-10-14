import { useState } from 'react';
import LayoutMaestroFormulario from '../../../templates/LayoutMaestroFormulario/LayoutMaestroFormulario.jsx';
import LayoutMaestroBasico from '../../../templates/LayoutMaestroBasico/LayoutMaestroBasico.jsx';
import FormRow from '../../../components/FormRow/FormRow.jsx';
import TextField from '../../../components/TextField/TextField.jsx';
import Select from '../../../components/Select/Select.jsx';
import Checkbox from '../../../components/Checkbox/Checkbox.jsx';
import { BILLING_SIDEBAR_PROPS } from '../../../config/sidebars/billing.js';
import { IMPUESTOS, COMPROBANTES } from '../../../config/billingImpositivas.js';
import styles from './CondicionImpositivaFormulario.module.css';

const HREF = '/billing/condiciones-impositivas';
const TITLES = { create: 'Crear Condición impositiva', view: 'Visualizar Condición impositiva', edit: 'Editar Condición impositiva' };

// Maestro "Condiciones impositivas" (Billing). Template M-02 · Formulario por
// secciones: dos grupos del mismo contexto — "Datos generales" y "Comprobantes
// asociados" (los 6 comprobantes que se emiten con esta condición) — en vez de
// una sola card con 11 campos mezclados. "Inactivo" va al final de la última
// sección (estado del registro). Los comprobantes son `Select` filtrados por tipo
// (el original: código + denominación + lookup); pendiente: selector con búsqueda.
const EMPTY = {
  codigo: '', denominacion: '', impuesto: '', codigoFiscal: '',
  factura: '', facturaMipyme: '', notaCredito: '', notaCreditoMipyme: '', notaDebito: '', notaDebitoMipyme: '',
  inactivo: false,
};

export default function CondicionImpositivaFormulario({ onNavigate, onSearch, condiciones = [], onCreateCondicion, onUpdateCondicion, params = {}, mode = 'create' }) {
  const isView = mode === 'view';
  const isEdit = mode === 'edit';
  const existing = mode !== 'create' ? condiciones.find((c) => String(c.id) === String(params.id)) : null;
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
  const goList = () => navigate({ href: HREF, label: 'Condiciones impositivas' });

  if (mode !== 'create' && !existing) {
    return (
      <LayoutMaestroBasico {...common} breadcrumb={[{ label: 'Condiciones impositivas' }]} title="Condición impositiva no encontrada" onCancel={goList} cancelLabel="Volver" formTitle="Datos generales">
        <p className={styles.notFound}>No se encontró la condición impositiva solicitada.</p>
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
  const comprobante = (key, label) => (
    <Select label={label} value={values[key]} onChange={(e) => set(key, e.target.value)} options={COMPROBANTES[key]} placeholder="Seleccionar comprobante..." disabled={isView} />
  );

  function handleSave() {
    const next = {};
    const codigo = values.codigo.trim();
    if (!codigo) next.codigo = 'Campo requerido';
    else if (condiciones.some((c) => c.codigo.toLowerCase() === codigo.toLowerCase() && c.id !== existing?.id)) next.codigo = 'Ya existe una condición con este código';
    if (!values.denominacion.trim()) next.denominacion = 'Campo requerido';
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const condicion = {
      id: existing?.id ?? Date.now(),
      codigo,
      denominacion: values.denominacion.trim(),
      estado: values.inactivo ? { label: 'Inactivo', type: 'neutral' } : { label: 'Activo', type: 'success' },
      values: { ...values, codigo, denominacion: values.denominacion.trim() },
    };
    if (isEdit) onUpdateCondicion?.(condicion);
    else onCreateCondicion?.(condicion);
  }

  return (
    <LayoutMaestroFormulario
      template="M-02"
      {...common}
      breadcrumb={[{ label: 'Condiciones impositivas' }, { label: mode === 'create' ? 'Crear' : TITLES[mode] }]}
      title={TITLES[mode]}
      onSave={isView ? undefined : handleSave}
      onCancel={goList}
      cancelLabel={isView ? 'Volver' : 'Cancelar'}
      blocks={[
        {
          type: 'form',
          title: 'Datos generales',
          children: (
            <>
              <FormRow>
                {text('codigo', 'Código *')}
                {text('denominacion', 'Denominación *')}
                <Select label="Impuestos" value={values.impuesto} onChange={(e) => set('impuesto', e.target.value)} options={IMPUESTOS} placeholder="Seleccionar impuesto..." disabled={isView} />
              </FormRow>
              <FormRow>{text('codigoFiscal', 'Código fiscal')}</FormRow>
            </>
          ),
        },
        {
          type: 'form',
          title: 'Comprobantes asociados',
          children: (
            <>
              <FormRow>
                {comprobante('factura', 'Comprobante Factura')}
                {comprobante('notaCredito', 'Comprobante Nota de Crédito')}
                {comprobante('notaDebito', 'Comprobante Nota de Débito')}
              </FormRow>
              <FormRow>
                {comprobante('facturaMipyme', 'Comprobante Factura MiPyme')}
                {comprobante('notaCreditoMipyme', 'Comprobante Nota de Crédito MiPyme')}
                {comprobante('notaDebitoMipyme', 'Comprobante Nota de Débito MiPyme')}
              </FormRow>
              <Checkbox label="Inactivo" checked={values.inactivo} onChange={(e) => set('inactivo', e.target.checked)} disabled={isView} />
            </>
          ),
        },
      ]}
    />
  );
}
