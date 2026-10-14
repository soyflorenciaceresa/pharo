import { useState } from 'react';
import LayoutMaestroFormulario from '../../../templates/LayoutMaestroFormulario/LayoutMaestroFormulario.jsx';
import LayoutMaestroBasico from '../../../templates/LayoutMaestroBasico/LayoutMaestroBasico.jsx';
import FormRow from '../../../components/FormRow/FormRow.jsx';
import TextField from '../../../components/TextField/TextField.jsx';
import Select from '../../../components/Select/Select.jsx';
import Checkbox from '../../../components/Checkbox/Checkbox.jsx';
import { PURCHASES_SIDEBAR_PROPS } from '../../../config/sidebars/purchases.js';
import { CONDICIONES_IMPOSITIVAS, LOCALIDADES, CONCEPTOS_COMPRA, CUENTAS_CONTABLES } from '../../../config/purchasesProveedores.js';
import { isValidCuit } from '../../../config/grainsClientes.js';
import styles from './ProveedorFormulario.module.css';

const HREF = '/purchases/proveedores';
const TITLES = { create: 'Crear Proveedor', view: 'Visualizar Proveedor', edit: 'Editar Proveedor' };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Maestro "Proveedores" (Purchases). Template M-02 · Formulario por secciones:
// ~20 campos del mismo contexto, sin colecciones hijas. El original los
// mostraba en una sola grilla plana; pasan a 4 Form Section apiladas (Datos
// generales, Datos fiscales y contables, Domicilio y contacto, Correos).
// Supuestos: Código, Denominación, CUIT, Condición impositiva y Cuenta
// contable obligatorios (los que traía con *). Pendientes: selector con
// búsqueda (Condición, Localidad, Concepto, Cuenta) y texto largo para
// Observaciones.
const EMPTY = {
  nombre: '', observaciones: '', inactivo: false,
  cuit: '', condicionImpositiva: '', iibb: '', convenioMultilateral: false, cuentaContable: '', conceptoCompra: '',
  domicilio: '', localidad: '', contactoNombre: '', celular: '', correo: '',
  emailGeneral: '', emailFacturacion: '', emailCobranza: '',
};
const EMAIL_FIELDS = { correo: 'Correo', emailGeneral: 'Email general', emailFacturacion: 'Email facturación', emailCobranza: 'Email cobranza' };

export default function ProveedorFormulario({ onNavigate, onSearch, proveedores = [], onCreateProveedor, onUpdateProveedor, params = {}, mode = 'create' }) {
  const isView = mode === 'view';
  const isEdit = mode === 'edit';
  const existing = mode !== 'create' ? proveedores.find((p) => String(p.id) === String(params.id)) : null;
  const navigate = onNavigate ?? ((d) => console.log('navigate', d));

  const [codigo, setCodigo] = useState(existing?.codigo ?? '');
  const [denominacion, setDenominacion] = useState(existing?.denominacion ?? '');
  const [values, setValues] = useState({ ...EMPTY, ...(existing?.values ?? {}) });
  const [errors, setErrors] = useState({});

  const common = {
    sidebar: PURCHASES_SIDEBAR_PROPS,
    activeHref: HREF,
    onNavigate: navigate,
    onSearch,
    onCompanyChange: (c) => console.log('company change', c),
    onLogout: () => console.log('logout'),
    onToggle: (d) => console.log('toggle', d),
  };
  const goList = () => navigate({ href: HREF, label: 'Proveedores' });

  if (mode !== 'create' && !existing) {
    return (
      <LayoutMaestroBasico {...common} breadcrumb={[{ label: 'Proveedores' }]} title="Proveedor no encontrado" onCancel={goList} cancelLabel="Volver" formTitle="Datos generales">
        <p className={styles.notFound}>No se encontró el proveedor solicitado.</p>
      </LayoutMaestroBasico>
    );
  }

  function clearError(key) {
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }
  function set(key, value) {
    setValues((prev) => ({ ...prev, [key]: value }));
    clearError(key);
  }
  const text = (key, label, extra = {}) => (
    <TextField label={label} value={values[key]} onChange={(e) => set(key, e.target.value)} disabled={isView} error={Boolean(errors[key])} helperText={errors[key]} {...extra} />
  );
  const select = (key, label, options, placeholder) => (
    <Select label={label} value={values[key]} onChange={(e) => set(key, e.target.value)} options={options} placeholder={placeholder} disabled={isView} error={Boolean(errors[key])} helperText={errors[key]} />
  );

  function handleSave() {
    const next = {};
    const cuit = values.cuit.replace(/\D/g, '');
    if (!codigo.trim()) next.codigo = 'Campo requerido';
    else if (proveedores.some((p) => p.codigo === codigo.trim() && p.id !== existing?.id)) next.codigo = 'Ya existe un proveedor con este código';
    if (!denominacion.trim()) next.denominacion = 'Campo requerido';
    if (!cuit) next.cuit = 'Campo requerido';
    else if (!isValidCuit(cuit)) next.cuit = 'CUIT inválido: revisá los 11 dígitos';
    else if (proveedores.some((p) => p.cuit === cuit && p.id !== existing?.id)) next.cuit = 'Ya existe un proveedor con este CUIT';
    if (!values.condicionImpositiva) next.condicionImpositiva = 'Campo requerido';
    if (!values.cuentaContable) next.cuentaContable = 'Campo requerido';
    Object.keys(EMAIL_FIELDS).forEach((k) => {
      if (values[k].trim() && !EMAIL_RE.test(values[k].trim())) next[k] = 'Ingresá un e-mail válido';
    });
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const proveedor = {
      id: existing?.id ?? Date.now(),
      cuit,
      codigo: codigo.trim(),
      denominacion: denominacion.trim(),
      estado: values.inactivo ? { label: 'Inactivo', type: 'neutral' } : { label: 'Activo', type: 'success' },
      values: { ...values, cuit },
    };
    if (isEdit) onUpdateProveedor?.(proveedor);
    else onCreateProveedor?.(proveedor);
  }

  return (
    <LayoutMaestroFormulario
      template="M-02"
      {...common}
      breadcrumb={[{ label: 'Proveedores' }, { label: mode === 'create' ? 'Crear' : TITLES[mode] }]}
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
                <TextField label="Código *" value={codigo} onChange={(e) => { setCodigo(e.target.value); clearError('codigo'); }} disabled={isView} error={Boolean(errors.codigo)} helperText={errors.codigo} />
                <TextField label="Denominación *" value={denominacion} onChange={(e) => { setDenominacion(e.target.value); clearError('denominacion'); }} disabled={isView} error={Boolean(errors.denominacion)} helperText={errors.denominacion} />
                {text('nombre', 'Nombre')}
              </FormRow>
              {text('observaciones', 'Observaciones')}
              <Checkbox label="Inactivo" checked={values.inactivo} onChange={(e) => set('inactivo', e.target.checked)} disabled={isView} />
            </>
          ),
        },
        {
          type: 'form',
          title: 'Datos fiscales y contables',
          children: (
            <>
              <FormRow>
                {text('cuit', 'CUIT *', { inputMode: 'numeric', maxLength: 13, placeholder: '30-12345678-9' })}
                {select('condicionImpositiva', 'Condición impositiva *', CONDICIONES_IMPOSITIVAS, 'Seleccionar condición...')}
                {text('iibb', 'Número de IIBB')}
              </FormRow>
              <FormRow>
                {select('cuentaContable', 'Cuenta contable *', CUENTAS_CONTABLES, 'Seleccionar cuenta...')}
                {select('conceptoCompra', 'Concepto de compra por defecto', CONCEPTOS_COMPRA, 'Seleccionar concepto...')}
              </FormRow>
              <Checkbox label="Tiene convenio multilateral" checked={values.convenioMultilateral} onChange={(e) => set('convenioMultilateral', e.target.checked)} disabled={isView} />
            </>
          ),
        },
        {
          type: 'form',
          title: 'Domicilio y contacto',
          children: (
            <>
              <FormRow>
                {text('domicilio', 'Domicilio')}
                {select('localidad', 'Localidad', LOCALIDADES, 'Seleccionar localidad...')}
              </FormRow>
              <FormRow>
                {text('contactoNombre', 'Nombre y apellido')}
                {text('celular', 'Celular', { type: 'tel', inputMode: 'tel' })}
                {text('correo', 'Correo', { type: 'email' })}
              </FormRow>
            </>
          ),
        },
        {
          type: 'form',
          title: 'Correos',
          children: (
            <FormRow>
              {text('emailGeneral', 'Email general', { type: 'email' })}
              {text('emailFacturacion', 'Email facturación', { type: 'email' })}
              {text('emailCobranza', 'Email cobranza', { type: 'email' })}
            </FormRow>
          ),
        },
      ]}
    />
  );
}
