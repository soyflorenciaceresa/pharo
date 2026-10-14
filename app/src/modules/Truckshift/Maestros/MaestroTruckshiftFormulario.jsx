import { Fragment, useState } from 'react';
import LayoutMaestroFormulario from '../../../templates/LayoutMaestroFormulario/LayoutMaestroFormulario.jsx';
import LayoutMaestroBasico from '../../../templates/LayoutMaestroBasico/LayoutMaestroBasico.jsx';
import FormRow from '../../../components/FormRow/FormRow.jsx';
import TextField from '../../../components/TextField/TextField.jsx';
import Select from '../../../components/Select/Select.jsx';
import Checkbox from '../../../components/Checkbox/Checkbox.jsx';
import { TRUCKSHIFT_SIDEBAR_PROPS } from '../../../config/sidebars/truckshift.js';
import { TRUCKSHIFT_FORMS } from '../../../config/truckshiftMaestros.js';
import { isValidCuit } from '../../../config/grainsClientes.js';
import styles from './MaestroTruckshiftFormulario.module.css';

const VERBS = { create: 'Crear', view: 'Visualizar', edit: 'Editar' };

// Formulario genérico de los maestros de Truckshift y Scales, armado a partir de
// `TRUCKSHIFT_FORMS` (config/truckshiftMaestros.js). Template M-01 · Formulario
// simple (un solo grupo de pocos campos); checkboxes en vertical, "Inactivo" al
// final. Pendiente: selector con búsqueda en lugar del `Select` nativo
// (Depósito, Clasificación, Planta, Cliente eran lookups código + denominación).
export default function MaestroTruckshiftFormulario({ maestro, sidebar = TRUCKSHIFT_SIDEBAR_PROPS, forms = TRUCKSHIFT_FORMS, truckshiftRows = {}, onSaveTruckshift, onNavigate, onSearch, params = {}, mode = 'create' }) {
  const form = forms[maestro.href.split('/').pop()] ?? { fields: [] };
  // M-01: una sola sección; con `sections` (2+) es M-02. "Inactivo" va al final de la primera.
  const sections = form.sections ?? [{ title: `Datos de ${maestro.label.toLowerCase()}`, fields: form.fields, checks: form.checks, checksTitle: form.checksTitle }];
  const allFields = sections.flatMap((sec) => sec.fields);
  const rows = truckshiftRows[maestro.href] ?? [];
  const isView = mode === 'view';
  const isEdit = mode === 'edit';
  const existing = mode !== 'create' ? rows.find((r) => String(r.id) === String(params.id)) : null;
  const navigate = onNavigate ?? ((d) => console.log('navigate', d));

  const initial = {};
  allFields.forEach((f) => { initial[f.key] = existing?.values?.[f.key] ?? (f.key === 'codigo' ? existing?.codigo : undefined) ?? (f.key === 'denominacion' ? existing?.denominacion : undefined) ?? f.default ?? ''; });
  sections.flatMap((sec) => sec.checks ?? []).forEach((c) => { initial[c.key] = existing?.values?.[c.key] ?? false; });

  const [values, setValues] = useState(initial);
  const [inactivo, setInactivo] = useState(existing?.estado?.label === 'Inactivo');
  const [errors, setErrors] = useState({});

  const common = {
    sidebar,
    activeHref: maestro.href,
    onNavigate: navigate,
    onSearch,
    onCompanyChange: (c) => console.log('company change', c),
    onLogout: () => console.log('logout'),
    onToggle: (d) => console.log('toggle', d),
  };
  const goList = () => navigate({ href: maestro.href, label: maestro.label });

  if (mode !== 'create' && !existing) {
    return (
      <LayoutMaestroBasico {...common} breadcrumb={[{ label: maestro.label }]} title="Registro no encontrado" onCancel={goList} cancelLabel="Volver" formTitle="Datos generales">
        <p className={styles.notFound}>No se encontró el registro solicitado.</p>
      </LayoutMaestroBasico>
    );
  }

  function set(key, value) {
    // Los campos que dependen de este (ej. Tipo según Categoría) se limpian al cambiarlo.
    const dependents = Object.fromEntries(allFields.filter((f) => f.dependsOn === key).map((f) => [f.key, '']));
    setValues((prev) => ({ ...prev, ...dependents, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function handleSave() {
    const next = {};
    allFields.forEach((f) => {
      const v = String(values[f.key] ?? '').trim();
      if (f.required && !v) next[f.key] = 'Campo requerido';
      else if (f.numeric && v && !(Number(v) >= 0)) next[f.key] = 'Ingresá un número válido';
      else if (f.validate === 'cuit' && v && !isValidCuit(v.replace(/\D/g, ''))) next[f.key] = 'CUIT inválido: revisá los 11 dígitos';
      else if (f.validate === 'email' && v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) next[f.key] = 'Ingresá un e-mail válido';
      else if (f.after && v && values[f.after] && v < values[f.after]) next[f.key] = 'Debe ser posterior a la fecha de habilitación';
    });
    if (allFields.some((f) => f.key === 'codigo') && values.codigo?.trim() && rows.some((r) => r.codigo === values.codigo.trim() && r.id !== existing?.id)) next.codigo = 'Ya existe un registro con este código';
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const trimmed = Object.fromEntries(Object.entries(values).map(([k, v]) => [k, typeof v === 'string' ? v.trim() : v]));
    const codigo = form.autoCode
      ? existing?.codigo ?? `${form.autoCode}-${String(rows.length + 1).padStart(3, '0')}`
      : trimmed.codigo;
    const row = {
      id: existing?.id ?? Date.now(),
      codigo,
      denominacion: form.denominacion ? form.denominacion({ ...trimmed, codigo }) : trimmed.denominacion,
      estado: inactivo ? { label: 'Inactivo', type: 'neutral' } : { label: 'Activo', type: 'success' },
      values: trimmed,
    };
    onSaveTruckshift?.(maestro.href, row, isEdit);
  }

  const renderField = (f) => {
    const common = { label: f.required ? `${f.label} *` : f.label, value: values[f.key], disabled: isView || f.type === 'readonly', error: Boolean(errors[f.key]), helperText: errors[f.key] };
    if (f.type === 'select') {
      const options = f.dependsOn ? f.optionsByParent[values[f.dependsOn]] ?? [] : f.options;
      return <Select key={f.key} {...common} disabled={common.disabled || (f.dependsOn && !values[f.dependsOn])} onChange={(e) => set(f.key, e.target.value)} options={options} placeholder="Seleccionar..." />;
    }
    return <TextField key={f.key} {...common} onChange={(e) => set(f.key, e.target.value)} type={f.type === 'date' || f.type === 'time' ? f.type : undefined} inputMode={f.numeric ? 'numeric' : undefined} />;
  };

  return (
    <LayoutMaestroFormulario
      template={sections.length > 1 ? 'M-02' : 'M-01'}
      {...common}
      breadcrumb={[{ label: maestro.label }, { label: mode === 'create' ? 'Crear' : `${VERBS[mode]} ${maestro.label}` }]}
      title={`${VERBS[mode]} ${maestro.label}`}
      onSave={isView ? undefined : handleSave}
      onCancel={goList}
      cancelLabel={isView ? 'Volver' : 'Cancelar'}
      blocks={sections.map((sec, i) => ({
        type: 'form',
        title: sec.title,
        children: (
          <>
            {sec.fields.length > 0 && <FormRow>{sec.fields.map(renderField)}</FormRow>}
            {sec.checksTitle && <span className={styles.checksTitle}>{sec.checksTitle}</span>}
            {(sec.checks ?? []).map((c, ci, all) => (
              <Fragment key={c.key}>
                {c.groupTitle && c.groupTitle !== all[ci - 1]?.groupTitle && <span className={styles.checksTitle}>{c.groupTitle}</span>}
                <Checkbox label={c.label} checked={values[c.key]} onChange={(e) => set(c.key, e.target.checked)} disabled={isView} />
              </Fragment>
            ))}
            {i === 0 && <Checkbox label="Inactivo" checked={inactivo} onChange={(e) => setInactivo(e.target.checked)} disabled={isView} />}
          </>
        ),
      }))}
    />
  );
}
