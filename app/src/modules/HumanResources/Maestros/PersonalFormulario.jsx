import { useState } from 'react';
import LayoutMaestroFormulario from '../../../templates/LayoutMaestroFormulario/LayoutMaestroFormulario.jsx';
import LayoutMaestroBasico from '../../../templates/LayoutMaestroBasico/LayoutMaestroBasico.jsx';
import FormRow from '../../../components/FormRow/FormRow.jsx';
import TextField from '../../../components/TextField/TextField.jsx';
import Select from '../../../components/Select/Select.jsx';
import Checkbox from '../../../components/Checkbox/Checkbox.jsx';
import FileUpload from '../../../components/FileUpload/FileUpload.jsx';
import Badge from '../../../components/Badge/Badge.jsx';
import ChildItemModal from './ChildItemModal.jsx';
import { HUMAN_RESOURCES_SIDEBAR_PROPS } from '../../../config/sidebars/human-resources.js';
import { USUARIOS } from '../../../config/purchasesFondosFijos.js';
import styles from './Maestro.module.css';

const HREF = '/human-resources/personal';
const GRUPOS_HREF = '/human-resources/grupos';
const VERBS = { create: 'Crear', view: 'Visualizar', edit: 'Editar' };
const opt = (...labels) => labels.map((label) => ({ value: label, label }));
const LOCALIDADES = opt('Rosario', 'San Lorenzo', 'Santa Fe', 'Buenos Aires');
const ESTADOS_CIVILES = opt('Soltero/a', 'Casado/a', 'Divorciado/a', 'Viudo/a', 'Unión convivencial');
const SEXOS = opt('Femenino', 'Masculino', 'No binario', 'Prefiere no indicar');
const OBRAS_SOCIALES = opt('OS-001 · OSDE', 'OS-002 · Swiss Medical', 'OS-003 · Sancor Salud');
const PLANES = opt('Plan 210', 'Plan 310', 'Plan 410');
const FUNCIONES = opt('Operario', 'Supervisor', 'Administrativo', 'Chofer', 'Balancero');
const PARENTESCOS = opt('Cónyuge', 'Hijo/a', 'Padre', 'Madre', 'Otro');
const BANCOS = opt('BA-001 · Banco Nación', 'BA-002 · Banco Santa Fe', 'BA-003 · Banco Galicia');
const TIPOS_CUENTA = opt('Caja de ahorro', 'Cuenta corriente');
const MONEDAS = opt('Peso argentino', 'Dólar estadounidense');

const EMPTY = {
  nombre: '', apellido: '', documento: '', cuil: '', legajo: '', nacimiento: '', estadoCivil: '', sexo: '', imagen: '',
  direccion: '', localidad: '', correo: '', telefono: '', observaciones: '',
  grupo: '', domicilioLaboral: '', tarjetaRfid: '', obraSocial: '', planCobertura: '', usuario: '',
  suspensionInicio: '', suspensionFin: '', suspensionMotivo: '',
  banco: '', numeroCuenta: '', identificacionBancaria: '', sucursal: '', tipoCuenta: '', moneda: '', defaultNomina: false,
};
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Maestro "Personal" (Human Resources). Template M-04c · cabecera + tabs con
// grilla. El original tenía 5 tabs; según la regla del kit las tabs son para
// colecciones hijas paralelas, no para grupos de campos: quedan como tabs solo
// Función y Grupo familiar (las dos colecciones). "Información personal" se
// reparte en 3 Form Section (Datos personales, Domicilio y contacto, Datos
// laborales) y lo opcional pasa a 2 Accordion al final: Suspensión (ex "Datos
// adicionales") y Cuenta bancaria para nómina (ex tab "Cuentas bancarias" +
// checkbox "Cargar una cuenta bancaria opcional"). Supuestos: Nombre, Apellido
// y Documento obligatorios (el original no marcaba ninguno). Pendientes:
// selector con búsqueda, dropzone de imagen, texto largo para Observaciones y
// Motivo, y el botón "Crear" usuario vinculado.
export default function PersonalFormulario({ truckshiftRows = {}, onSaveTruckshift, onNavigate, onSearch, params = {}, mode = 'create' }) {
  const rows = truckshiftRows[HREF] ?? [];
  const grupos = truckshiftRows[GRUPOS_HREF] ?? [];
  const isView = mode === 'view';
  const isEdit = mode === 'edit';
  const existing = mode !== 'create' ? rows.find((r) => String(r.id) === String(params.id)) : null;
  const navigate = onNavigate ?? ((d) => console.log('navigate', d));

  // Las filas de ejemplo solo traen "APELLIDO, Nombre": se separan para precargar el formulario.
  const [apellidoSeed, nombreSeed] = existing && !existing.values ? existing.denominacion.split(', ') : ['', ''];
  const [values, setValues] = useState({ ...EMPTY, ...(existing && !existing.values ? { apellido: apellidoSeed.charAt(0) + apellidoSeed.slice(1).toLowerCase(), nombre: nombreSeed ?? '', legajo: existing.codigo } : {}), ...(existing?.values ?? {}) });
  const [inactivo, setInactivo] = useState(existing?.estado?.label === 'Inactivo');
  const [funciones, setFunciones] = useState(existing?.funciones ?? []);
  const [familia, setFamilia] = useState(existing?.familia ?? []);
  const [errors, setErrors] = useState({});
  const [modal, setModal] = useState(null);

  const common = {
    sidebar: HUMAN_RESOURCES_SIDEBAR_PROPS, activeHref: HREF, onNavigate: navigate, onSearch,
    onCompanyChange: (c) => console.log('company change', c), onLogout: () => console.log('logout'), onToggle: (d) => console.log('toggle', d),
  };
  const goList = () => navigate({ href: HREF, label: 'Personal' });

  if (mode !== 'create' && !existing) {
    return (
      <LayoutMaestroBasico {...common} breadcrumb={[{ label: 'Personal' }]} title="Empleado no encontrado" onCancel={goList} cancelLabel="Volver" formTitle="Datos personales">
        <p className={styles.notFound}>No se encontró el empleado solicitado.</p>
      </LayoutMaestroBasico>
    );
  }

  function set(key, value) {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }
  const text = (key, label, extra = {}) => <TextField label={label} value={values[key]} onChange={(e) => set(key, e.target.value)} disabled={isView} error={Boolean(errors[key])} helperText={errors[key]} {...extra} />;
  const select = (key, label, options) => <Select label={label} value={values[key]} onChange={(e) => set(key, e.target.value)} options={options} placeholder="Seleccionar..." disabled={isView} />;

  function handleSave() {
    const next = {};
    const documento = values.documento.replace(/\D/g, '');
    if (!values.nombre.trim()) next.nombre = 'Campo requerido';
    if (!values.apellido.trim()) next.apellido = 'Campo requerido';
    if (!documento) next.documento = 'Campo requerido';
    else if (!/^\d{7,8}$/.test(documento)) next.documento = 'El documento debe tener 7 u 8 dígitos';
    else if (rows.some((r) => r.values?.documento === documento && r.id !== existing?.id)) next.documento = 'Ya existe un empleado con este documento';
    if (values.correo.trim() && !EMAIL_RE.test(values.correo.trim())) next.correo = 'Ingresá un e-mail válido';
    if (values.suspensionInicio && values.suspensionFin && values.suspensionFin < values.suspensionInicio) next.suspensionFin = 'Debe ser posterior al inicio';
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    onSaveTruckshift?.(HREF, {
      id: existing?.id ?? Date.now(),
      codigo: values.legajo.trim() || documento,
      denominacion: `${values.apellido.trim().toUpperCase()}, ${values.nombre.trim()}`,
      estado: inactivo ? { label: 'Inactivo', type: 'neutral' } : { label: 'Activo', type: 'success' },
      values: { ...values, documento }, funciones, familia,
    }, isEdit);
  }

  const DEFS = {
    funcion: {
      title: 'función', list: funciones, set: setFunciones,
      fields: [{ key: 'funcion', label: 'Función', type: 'select', required: true, options: FUNCIONES }, { key: 'principal', label: 'Función principal', type: 'check' }, { key: 'activo', label: 'Activo', type: 'check', default: true }],
      same: (a, b) => a.funcion === b.funcion,
    },
    familiar: {
      title: 'familiar', list: familia, set: setFamilia,
      fields: [
        { key: 'parentesco', label: 'Parentesco', type: 'select', required: true, options: PARENTESCOS },
        { key: 'nombre', label: 'Nombre', type: 'text', required: true },
        { key: 'apellido', label: 'Apellido', type: 'text', required: true },
        { key: 'documento', label: 'Número de documento', type: 'text' },
        { key: 'nacimiento', label: 'Fecha de nacimiento', type: 'date' },
        { key: 'activo', label: 'Activo', type: 'check', default: true },
      ],
      same: () => false,
    },
  };

  function submit(v) {
    const def = DEFS[modal.kind];
    if (def.list.some((r) => r.id !== modal.id && def.same(r, v))) return 'Ya está cargado';
    let item = { ...v, id: modal.id ?? Date.now() };
    def.set((prev) => {
      const base = modal.id ? prev.map((r) => (r.id === modal.id ? item : r)) : [...prev, item];
      return modal.kind === 'funcion' && item.principal ? base.map((r) => (r.id === item.id ? r : { ...r, principal: false })) : base;
    });
    setModal(null);
    return null;
  }

  const yesNo = (v) => <Badge type={v ? 'success' : 'neutral'} showDot={false}>{v ? 'Sí' : 'No'}</Badge>;
  const gridBlock = (kind, title, columns) => {
    const def = DEFS[kind];
    return {
      type: 'grid', title, onAdd: isView ? undefined : () => setModal({ kind }),
      columns, rows: def.list, emptyMessage: 'Sin datos para mostrar.',
      actions: isView ? [] : [
        { key: 'edit', icon: 'icon-edit', label: 'Editar', onClick: (row) => setModal({ kind, ...row }) },
        { key: 'delete', icon: 'bi-trash', label: 'Eliminar', onClick: (row) => def.set((prev) => prev.filter((r) => r.id !== row.id)) },
      ],
    };
  };

  return (
    <>
      <LayoutMaestroFormulario
        template="M-04c" {...common}
        breadcrumb={[{ label: 'Personal' }, { label: mode === 'create' ? 'Crear' : `${VERBS[mode]} Personal` }]} title={`${VERBS[mode]} Personal`}
        onSave={isView ? undefined : handleSave} onCancel={goList} cancelLabel={isView ? 'Volver' : 'Cancelar'}
        blocks={[
          {
            type: 'form', title: 'Datos personales',
            children: (
              <>
                <FormRow columns={2}>{text('nombre', 'Nombre *')}{text('apellido', 'Apellido *')}</FormRow>
                <FormRow>{text('documento', 'Documento *', { inputMode: 'numeric', maxLength: 8 })}{text('cuil', 'Identificación fiscal')}{text('legajo', 'Legajo')}</FormRow>
                <FormRow>{text('nacimiento', 'Fecha de nacimiento', { type: 'date' })}{select('estadoCivil', 'Estado civil', ESTADOS_CIVILES)}{select('sexo', 'Sexo', SEXOS)}</FormRow>
                <FormRow columns={2}><FileUpload label="Imagen" value={values.imagen} onChange={(e) => set('imagen', e.target.files?.[0]?.name ?? '')} accept="image/*" disabled={isView} /></FormRow>
                <Checkbox label="Inactivo" checked={inactivo} onChange={(e) => setInactivo(e.target.checked)} disabled={isView} />
              </>
            ),
          },
          {
            type: 'form', title: 'Domicilio y contacto',
            children: (
              <>
                <FormRow columns={2}>{text('direccion', 'Dirección')}{select('localidad', 'Localidad', LOCALIDADES)}</FormRow>
                <FormRow>{text('correo', 'Correo electrónico', { type: 'email' })}{text('telefono', 'Teléfono', { type: 'tel', inputMode: 'tel' })}</FormRow>
                {text('observaciones', 'Observaciones')}
              </>
            ),
          },
          {
            type: 'form', title: 'Datos laborales',
            children: (
              <>
                <FormRow>
                  {select('grupo', 'Grupo / Subgrupo', grupos.map((g) => ({ value: `${g.codigo} · ${g.denominacion}`, label: `${g.codigo} · ${g.denominacion}` })))}
                  {text('tarjetaRfid', 'Tarjeta RFID')}
                  {select('usuario', 'Usuario vinculado', USUARIOS)}
                </FormRow>
                <FormRow>{select('obraSocial', 'Obra social', OBRAS_SOCIALES)}{select('planCobertura', 'Plan de cobertura', PLANES)}{text('domicilioLaboral', 'Domicilio laboral')}</FormRow>
              </>
            ),
          },
          {
            type: 'accordion', title: 'Suspensión (opcional)',
            children: (
              <>
                <FormRow columns={2}>{text('suspensionInicio', 'Fecha de inicio de suspensión', { type: 'date' })}{text('suspensionFin', 'Fecha de fin de suspensión', { type: 'date' })}</FormRow>
                {text('suspensionMotivo', 'Motivo de suspensión')}
              </>
            ),
          },
          {
            type: 'accordion', title: 'Cuenta bancaria para nómina (opcional)',
            children: (
              <>
                <FormRow>{select('banco', 'Banco', BANCOS)}{text('numeroCuenta', 'Número de cuenta')}{text('sucursal', 'Sucursal')}</FormRow>
                <FormRow>{text('identificacionBancaria', 'Identificación bancaria')}{select('tipoCuenta', 'Tipo de cuenta', TIPOS_CUENTA)}{select('moneda', 'Moneda', MONEDAS)}</FormRow>
                <Checkbox label="Default para nómina" checked={values.defaultNomina} onChange={(e) => set('defaultNomina', e.target.checked)} disabled={isView} />
              </>
            ),
          },
        ]}
        tabs={[
          { id: 'funcion', label: 'Función', blocks: [gridBlock('funcion', 'Función', [{ key: 'funcion', label: 'Función' }, { key: 'principal', label: 'Función principal', width: 180, render: (r) => yesNo(r.principal) }, { key: 'activo', label: 'Activo', width: 130, render: (r) => yesNo(r.activo) }])] },
          { id: 'familia', label: 'Grupo familiar', blocks: [gridBlock('familiar', 'Grupo familiar', [{ key: 'parentesco', label: 'Parentesco', width: 130 }, { key: 'nombre', label: 'Nombre' }, { key: 'apellido', label: 'Apellido' }, { key: 'documento', label: 'Número de documento', width: 170 }, { key: 'nacimiento', label: 'Fecha de nacimiento', width: 170 }, { key: 'activo', label: 'Activo', width: 110, render: (r) => yesNo(r.activo) }])] },
        ]}
      />
      {modal && <ChildItemModal key={`${modal.kind}-${modal.id ?? 'new'}`} title={DEFS[modal.kind].title} fields={DEFS[modal.kind].fields} initial={modal.id ? modal : undefined} onClose={() => setModal(null)} onSubmit={submit} />}
    </>
  );
}
