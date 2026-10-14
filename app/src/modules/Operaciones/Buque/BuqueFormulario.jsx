import { useState } from 'react';
import LayoutMaestroBasico from '../../../templates/LayoutMaestroBasico/LayoutMaestroBasico.jsx';
import LayoutMaestroFormulario from '../../../templates/LayoutMaestroFormulario/LayoutMaestroFormulario.jsx';
import FormRow from '../../../components/FormRow/FormRow.jsx';
import TextField from '../../../components/TextField/TextField.jsx';
import Checkbox from '../../../components/Checkbox/Checkbox.jsx';
import { OPERACIONES_SIDEBAR_PROPS } from '../../../config/sidebars/operaciones.js';
import styles from './BuqueFormulario.module.css';

const TITLES = {
  create: 'Crear Buque',
  view: 'Visualizar Buque',
  edit: 'Editar Buque',
};

const EMPTY = {
  codigo: '', denominacion: '', imo: '',
  tipoCodigo: '', tipoDenominacion: '',
  banderaCodigo: '', banderaDenominacion: '',
  navieraCodigo: '', navieraDenominacion: '',
  eslora: '', manga: '', puntal: '', coeficiente: '',
  vrn: '', trn: '', tbt: '', tpc: '', lastre: '',
  caladoEntrada: '', caladoSalida: '', anioConstruccion: '', indicativoLlamada: '', matricula: '',
};

// Campo "código + denominación" (Tipo, Bandera, Naviera). No existe todavía un
// componente de selector con búsqueda (el diseño original tiene un ícono para
// abrir el catálogo) — por ahora son dos TextField sueltos bajo una misma
// etiqueta. Pendiente: componente real de lookup.
function LookupField({ label, codigo, denominacion, onCodigo, onDenominacion, disabled }) {
  return (
    <div className={styles.lookup} role="group" aria-label={label}>
      <span className={styles.lookupLabel}>{label}</span>
      <div className={styles.lookupInputs}>
        <div className={styles.lookupCodigo}>
          <TextField placeholder="Código" aria-label={`${label} — código`} value={codigo} onChange={onCodigo} disabled={disabled} />
        </div>
        <div className={styles.lookupDenominacion}>
          <TextField placeholder="Denominación" aria-label={`${label} — denominación`} value={denominacion} onChange={onDenominacion} disabled={disabled} />
        </div>
      </div>
    </div>
  );
}

export default function BuqueFormulario({ onNavigate, onSearch, rows = [], onCreate, onUpdate, params = {}, mode = 'create' }) {
  const isView = mode === 'view';
  const isEdit = mode === 'edit';
  const existing = mode !== 'create' ? rows.find((r) => String(r.id) === String(params.id)) : null;

  const navigate = onNavigate ?? ((d) => console.log('navigate', d));

  // `tipo` (string) es el dato original de las filas; ahora el tipo es un
  // par código + denominación, y la denominación hereda ese valor.
  const [values, setValues] = useState({
    ...EMPTY,
    ...existing,
    tipoDenominacion: existing?.tipoDenominacion ?? existing?.tipo ?? '',
  });
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
        onSearch={onSearch}
        onCompanyChange={(c) => console.log('company change', c)}
        onLogout={() => console.log('logout')}
        onToggle={(d) => console.log('toggle', d)}
        breadcrumb={[{ label: 'Buque' }]}
        title="Buque no encontrado"
        onCancel={handleCancel}
        cancelLabel="Volver"
        formTitle="Datos del buque"
      >
        <p className={styles.notFound}>No se encontró el buque solicitado.</p>
      </LayoutMaestroBasico>
    );
  }

  function set(key) {
    return (e) => {
      const { value } = e.target;
      setValues((prev) => ({ ...prev, [key]: value }));
      if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
    };
  }

  // Campo de texto simple de la pantalla: value/onChange/disabled ya resueltos.
  const field = (key, label, extra = {}) => (
    <TextField label={label} value={values[key]} onChange={set(key)} disabled={isView} {...extra} />
  );
  const numeric = { inputMode: 'decimal' };

  const lookup = (key, label) => (
    <LookupField
      label={label}
      codigo={values[`${key}Codigo`]}
      denominacion={values[`${key}Denominacion`]}
      onCodigo={set(`${key}Codigo`)}
      onDenominacion={set(`${key}Denominacion`)}
      disabled={isView}
    />
  );

  function handleSave() {
    const nextErrors = {};
    if (!values.codigo.trim()) nextErrors.codigo = 'Campo requerido';
    if (!values.denominacion.trim()) nextErrors.denominacion = 'Campo requerido';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const trimmed = Object.fromEntries(Object.keys(EMPTY).map((k) => [k, String(values[k] ?? '').trim()]));
    const buque = {
      id: existing?.id ?? Date.now(),
      ...trimmed,
      tipo: trimmed.tipoDenominacion, // compatibilidad con las filas originales
      estado: inactivo ? { label: 'Inactivo', type: 'neutral' } : { label: 'Activo', type: 'success' },
    };

    if (isEdit) onUpdate?.(buque);
    else onCreate?.(buque);
  }

  // Template M-02 (Formulario por secciones): varios grupos del mismo
  // contexto, todos expandidos, y los datos opcionales en un Accordion
  // colapsado al final. Agrupación:
  //  - Datos generales: identificación + clasificación (tipo, bandera, naviera) + estado.
  //  - Dimensiones: medidas del casco.
  //  - Tonelaje y capacidad: registros de tonelaje, capacidad y lastre. ⚠️ Grupo
  //    inferido a partir de la pantalla de referencia (no figura en Figma) — validar.
  return (
    <LayoutMaestroFormulario
      template="M-02"
      sidebar={OPERACIONES_SIDEBAR_PROPS}
      activeHref="/buques"
      onNavigate={navigate}
      onSearch={onSearch}
      onCompanyChange={(c) => console.log('company change', c)}
      onLogout={() => console.log('logout')}
      onToggle={(d) => console.log('toggle', d)}
      breadcrumb={[{ label: 'Buque' }, { label: mode === 'create' ? 'Crear' : TITLES[mode] }]}
      title={TITLES[mode]}
      onSave={isView ? undefined : handleSave}
      onCancel={handleCancel}
      cancelLabel={isView ? 'Volver' : 'Cancelar'}
      blocks={[
        {
          type: 'form',
          title: 'Datos generales',
          children: (
            <>
              <FormRow>
                {field('codigo', 'Código', { error: Boolean(errors.codigo), helperText: errors.codigo })}
                {field('denominacion', 'Denominación', { error: Boolean(errors.denominacion), helperText: errors.denominacion })}
                {field('imo', 'IMO')}
              </FormRow>
              <FormRow>
                {lookup('tipo', 'Tipo')}
                {lookup('bandera', 'Bandera')}
                {lookup('naviera', 'Naviera')}
              </FormRow>
              <Checkbox label="Inactivo" checked={inactivo} onChange={(e) => setInactivo(e.target.checked)} disabled={isView} />
            </>
          ),
        },
        {
          type: 'form',
          title: 'Dimensiones',
          children: (
            <>
              <FormRow>
                {field('eslora', 'Eslora', numeric)}
                {field('manga', 'Manga', numeric)}
                {field('puntal', 'Puntal', numeric)}
              </FormRow>
              <FormRow>{field('coeficiente', 'Coeficiente', numeric)}</FormRow>
            </>
          ),
        },
        {
          type: 'form',
          title: 'Tonelaje y capacidad',
          children: (
            <>
              <FormRow>
                {field('vrn', 'VRN')}
                {field('trn', 'TRN')}
                {field('tbt', 'TBT', numeric)}
              </FormRow>
              <FormRow>
                {field('tpc', 'TPC', numeric)}
                {field('lastre', 'Lastre', numeric)}
              </FormRow>
            </>
          ),
        },
        {
          type: 'accordion',
          title: 'Datos adicionales (opcional)',
          children: (
            <>
              <FormRow>
                {field('caladoEntrada', 'Calado de entrada', numeric)}
                {field('caladoSalida', 'Calado de salida', numeric)}
                {field('anioConstruccion', 'Año de construcción', { inputMode: 'numeric', maxLength: 4 })}
              </FormRow>
              <FormRow>
                {field('indicativoLlamada', 'Indicativo de llamada')}
                {field('matricula', 'Matrícula')}
              </FormRow>
            </>
          ),
        },
      ]}
    />
  );
}
