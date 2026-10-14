import { useState } from 'react';
import LayoutMaestroFormulario from '../../../templates/LayoutMaestroFormulario/LayoutMaestroFormulario.jsx';
import LayoutMaestroBasico from '../../../templates/LayoutMaestroBasico/LayoutMaestroBasico.jsx';
import FormRow from '../../../components/FormRow/FormRow.jsx';
import TextField from '../../../components/TextField/TextField.jsx';
import Select from '../../../components/Select/Select.jsx';
import Checkbox from '../../../components/Checkbox/Checkbox.jsx';
import { BILLING_SIDEBAR_PROPS } from '../../../config/sidebars/billing.js';
import { CONDICIONES_IMPOSITIVAS, CIUDADES, CUENTAS_DEUDORAS, CONDICIONES_VENTA } from '../../../config/billingClientes.js';
import { isValidCuit } from '../../../config/grainsClientes.js';
import styles from './ClienteFormulario.module.css';

const HREF = '/billing/clientes';
const TITLES = { create: 'Crear Cliente', view: 'Visualizar Cliente', edit: 'Editar Cliente' };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Maestro "Clientes" (Billing). Template M-02 · Formulario por secciones: el
// catálogo del kit lista a Clientes como ejemplo de M-02 (varios grupos del
// mismo contexto). El original tenía 4 tabs (Datos Generales | Contabilidad |
// Comercial | Correos) con 1–9 campos cada una; como no hay colecciones hijas
// y en total son ~19 campos, las tabs ocultaban datos sin necesidad: pasan a 4
// Form Section apiladas. Supuestos: Razón social e Identificación fiscal
// obligatorios (el original no marcaba ninguno). Pendientes: selector con
// búsqueda (Condición impositiva, Ciudad, Cuenta, Condición de venta) y campo de
// texto largo para Observaciones.
const EMPTY = {
  razonSocial: '', nombreFantasia: '', idFiscal: '', condicionImpositiva: '', direccion: '', ciudad: '', iibb: '', observaciones: '', inactivo: false,
  cuenta: '', clienteGrande: false,
  contactoNombre: '', contactoTelefono: '', contactoEmail: '', condicionVenta: '',
  emailGeneral: '', emailFacturacion: '', emailCobranzas: '',
};
const EMAIL_FIELDS = { contactoEmail: 'E-mail de contacto', emailGeneral: 'General', emailFacturacion: 'Facturación', emailCobranzas: 'Cobranzas' };

export default function ClienteBillingFormulario({ onNavigate, onSearch, clientesBilling = [], onCreateClienteBilling, onUpdateClienteBilling, params = {}, mode = 'create' }) {
  const isView = mode === 'view';
  const isEdit = mode === 'edit';
  const existing = mode !== 'create' ? clientesBilling.find((c) => String(c.id) === String(params.id)) : null;
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
  const goList = () => navigate({ href: HREF, label: 'Clientes' });

  if (mode !== 'create' && !existing) {
    return (
      <LayoutMaestroBasico {...common} breadcrumb={[{ label: 'Clientes' }]} title="Cliente no encontrado" onCancel={goList} cancelLabel="Volver" formTitle="Datos generales">
        <p className={styles.notFound}>No se encontró el cliente solicitado.</p>
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
    const cuit = values.idFiscal.replace(/\D/g, '');
    if (!values.razonSocial.trim()) next.razonSocial = 'Campo requerido';
    if (!cuit) next.idFiscal = 'Campo requerido';
    else if (!isValidCuit(cuit)) next.idFiscal = 'CUIT inválido: revisá los 11 dígitos';
    else if (clientesBilling.some((c) => c.cuit === cuit && c.id !== existing?.id)) next.idFiscal = 'Ya existe un cliente con este CUIT';
    Object.keys(EMAIL_FIELDS).forEach((k) => {
      if (values[k].trim() && !EMAIL_RE.test(values[k].trim())) next[k] = 'Ingresá un e-mail válido';
    });
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const cliente = {
      id: existing?.id ?? Date.now(),
      cuit,
      codigo: existing?.codigo ?? `CL-${String(clientesBilling.length + 1).padStart(3, '0')}`,
      denominacion: values.razonSocial.trim(),
      estado: values.inactivo ? { label: 'Inactivo', type: 'neutral' } : { label: 'Activo', type: 'success' },
      values: { ...values, idFiscal: cuit },
    };
    if (isEdit) onUpdateClienteBilling?.(cliente);
    else onCreateClienteBilling?.(cliente);
  }

  return (
    <LayoutMaestroFormulario
      template="M-02"
      {...common}
      breadcrumb={[{ label: 'Clientes' }, { label: mode === 'create' ? 'Crear' : TITLES[mode] }]}
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
                {text('razonSocial', 'Razón social *')}
                {text('nombreFantasia', 'Nombre fantasía')}
                {text('idFiscal', 'Identificación fiscal (CUIT) *', { inputMode: 'numeric', maxLength: 13, placeholder: '30-12345678-9' })}
              </FormRow>
              <FormRow>
                {select('condicionImpositiva', 'Condición impositiva', CONDICIONES_IMPOSITIVAS, 'Seleccionar condición...')}
                {text('direccion', 'Dirección')}
                {select('ciudad', 'Ciudad', CIUDADES, 'Seleccionar ciudad...')}
              </FormRow>
              <FormRow>{text('iibb', 'Número de IIBB')}</FormRow>
              {text('observaciones', 'Observaciones')}
              <Checkbox label="Inactivo" checked={values.inactivo} onChange={(e) => set('inactivo', e.target.checked)} disabled={isView} />
            </>
          ),
        },
        {
          type: 'form',
          title: 'Contabilidad',
          children: (
            <>
              <FormRow columns={2}>{select('cuenta', 'Cuenta', CUENTAS_DEUDORAS, 'Seleccionar cuenta...')}</FormRow>
              <Checkbox label="Cliente grande" checked={values.clienteGrande} onChange={(e) => set('clienteGrande', e.target.checked)} disabled={isView} />
            </>
          ),
        },
        {
          type: 'form',
          title: 'Comercial',
          children: (
            <FormRow columns={2}>
              {text('contactoNombre', 'Nombre y apellido de contacto')}
              {text('contactoTelefono', 'Teléfono de contacto', { type: 'tel', inputMode: 'tel' })}
              {text('contactoEmail', 'E-mail de contacto', { type: 'email' })}
              {select('condicionVenta', 'Condición de venta', CONDICIONES_VENTA, 'Seleccionar condición...')}
            </FormRow>
          ),
        },
        {
          type: 'form',
          title: 'Correos',
          children: (
            <FormRow>
              {text('emailGeneral', 'General', { type: 'email' })}
              {text('emailFacturacion', 'Facturación', { type: 'email' })}
              {text('emailCobranzas', 'Cobranzas', { type: 'email' })}
            </FormRow>
          ),
        },
      ]}
    />
  );
}
