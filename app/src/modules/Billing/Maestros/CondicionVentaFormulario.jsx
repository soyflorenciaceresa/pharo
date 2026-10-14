import { useState } from 'react';
import LayoutMaestroFormulario from '../../../templates/LayoutMaestroFormulario/LayoutMaestroFormulario.jsx';
import LayoutMaestroBasico from '../../../templates/LayoutMaestroBasico/LayoutMaestroBasico.jsx';
import FormRow from '../../../components/FormRow/FormRow.jsx';
import TextField from '../../../components/TextField/TextField.jsx';
import Select from '../../../components/Select/Select.jsx';
import Checkbox from '../../../components/Checkbox/Checkbox.jsx';
import ChildItemModal from '../../HumanResources/Maestros/ChildItemModal.jsx';
import { BILLING_SIDEBAR_PROPS } from '../../../config/sidebars/billing.js';
import styles from './CondicionVentaFormulario.module.css';

const HREF = '/billing/condiciones-de-venta';
const VERBS = { create: 'Crear', view: 'Visualizar', edit: 'Editar' };
const TIPOS = ['Contado', 'Cuenta corriente', 'Cheque', 'Tarjeta'].map((v) => ({ value: v, label: v }));
const CUOTA_FIELDS = [
  { key: 'cuotas', label: 'Cuotas', type: 'number', required: true },
  { key: 'dias', label: 'Días', type: 'number', required: true },
  { key: 'porcentaje', label: 'Porcentaje (%)', type: 'number', required: true },
];

// Maestro "Condiciones de venta" (Billing). Template M-04a · cabecera + grilla:
// una Form Section (código, denominación, tipo, inactivo) y UNA colección hija
// (Cuotas: cuotas, días y porcentaje) como Child Grid Section, en Modal.
// Validaciones: código único y que el porcentaje de cada cuota esté entre 0 y 100.
// Supuesto: Código y Denominación obligatorios.
export default function CondicionVentaFormulario({ truckshiftRows = {}, onSaveTruckshift, onNavigate, onSearch, params = {}, mode = 'create' }) {
  const rows = truckshiftRows[HREF] ?? [];
  const isView = mode === 'view';
  const isEdit = mode === 'edit';
  const existing = mode !== 'create' ? rows.find((r) => String(r.id) === String(params.id)) : null;
  const navigate = onNavigate ?? ((d) => console.log('navigate', d));

  const [values, setValues] = useState({ codigo: existing?.codigo ?? '', denominacion: existing?.denominacion ?? '', tipo: '', ...(existing?.values ?? {}) });
  const [inactivo, setInactivo] = useState(existing?.estado?.label === 'Inactivo');
  const [cuotas, setCuotas] = useState(existing?.cuotas ?? []);
  const [errors, setErrors] = useState({});
  const [modal, setModal] = useState(null);

  const common = {
    sidebar: BILLING_SIDEBAR_PROPS, activeHref: HREF, onNavigate: navigate, onSearch,
    onCompanyChange: (c) => console.log('company change', c), onLogout: () => console.log('logout'), onToggle: (d) => console.log('toggle', d),
  };
  const goList = () => navigate({ href: HREF, label: 'Condiciones de venta' });

  if (mode !== 'create' && !existing) {
    return (
      <LayoutMaestroBasico {...common} breadcrumb={[{ label: 'Condiciones de venta' }]} title="Registro no encontrado" onCancel={goList} cancelLabel="Volver" formTitle="Datos generales">
        <p className={styles.notFound}>No se encontró el registro solicitado.</p>
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
    else if (rows.some((r) => r.codigo === codigo && r.id !== existing?.id)) next.codigo = 'Ya existe un registro con este código';
    if (!values.denominacion.trim()) next.denominacion = 'Campo requerido';
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    onSaveTruckshift?.(HREF, {
      id: existing?.id ?? Date.now(), codigo, denominacion: values.denominacion.trim(),
      estado: inactivo ? { label: 'Inactivo', type: 'neutral' } : { label: 'Activo', type: 'success' },
      values: { ...values, codigo, denominacion: values.denominacion.trim() }, cuotas,
    }, isEdit);
  }

  function submit(v) {
    if (Number(v.porcentaje) > 100) return 'El porcentaje no puede superar 100';
    const item = { ...v, id: modal.id ?? Date.now() };
    setCuotas((prev) => (modal.id ? prev.map((c) => (c.id === modal.id ? item : c)) : [...prev, item]));
    setModal(null);
    return null;
  }

  return (
    <>
      <LayoutMaestroFormulario
        template="M-04a" {...common}
        breadcrumb={[{ label: 'Condiciones de venta' }, { label: mode === 'create' ? 'Crear' : `${VERBS[mode]} Condiciones de venta` }]} title={`${VERBS[mode]} Condiciones de venta`}
        onSave={isView ? undefined : handleSave} onCancel={goList} cancelLabel={isView ? 'Volver' : 'Cancelar'}
        blocks={[
          {
            type: 'form', title: 'Datos de la condición de venta',
            children: (
              <>
                <FormRow>
                  <TextField label="Código *" value={values.codigo} onChange={(e) => set('codigo', e.target.value)} disabled={isView} error={Boolean(errors.codigo)} helperText={errors.codigo} />
                  <TextField label="Denominación *" value={values.denominacion} onChange={(e) => set('denominacion', e.target.value)} disabled={isView} error={Boolean(errors.denominacion)} helperText={errors.denominacion} />
                  <Select label="Tipo" value={values.tipo} onChange={(e) => set('tipo', e.target.value)} options={TIPOS} placeholder="Seleccionar..." disabled={isView} />
                </FormRow>
                <Checkbox label="Inactivo" checked={inactivo} onChange={(e) => setInactivo(e.target.checked)} disabled={isView} />
              </>
            ),
          },
          {
            type: 'grid', title: 'Cuotas',
            onAdd: isView ? undefined : () => setModal({}),
            columns: [{ key: 'cuotas', label: 'Cuotas' }, { key: 'dias', label: 'Días' }, { key: 'porcentaje', label: 'Porcentaje (%)' }],
            rows: cuotas, emptyMessage: 'Sin datos para mostrar.',
            actions: isView ? [] : [
              { key: 'edit', icon: 'icon-edit', label: 'Editar', onClick: (row) => setModal(row) },
              { key: 'delete', icon: 'bi-trash', label: 'Eliminar', onClick: (row) => setCuotas((prev) => prev.filter((c) => c.id !== row.id)) },
            ],
          },
        ]}
      />
      {modal && <ChildItemModal key={modal.id ?? 'new'} title="cuota" fields={CUOTA_FIELDS} initial={modal.id ? modal : undefined} onClose={() => setModal(null)} onSubmit={submit} />}
    </>
  );
}
