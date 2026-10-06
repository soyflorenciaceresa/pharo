import { useState } from 'react';
import LayoutMaestroFormulario from '../../../templates/LayoutMaestroFormulario/LayoutMaestroFormulario.jsx';
import LayoutMaestroBasico from '../../../templates/LayoutMaestroBasico/LayoutMaestroBasico.jsx';
import FormRow from '../../../components/FormRow/FormRow.jsx';
import TextField from '../../../components/TextField/TextField.jsx';
import SelectWithOther, { OTHER_VALUE } from '../../../components/SelectWithOther/SelectWithOther.jsx';
import SectionIndex from '../../../components/SectionIndex/SectionIndex.jsx';
import Message from '../../../components/Message/Message.jsx';
import { OPERACIONES_SIDEBAR_PROPS } from '../../../config/sidebars/operaciones.js';
import {
  BUQUES_MAESTRO, ARMADORES, AGENTES_ADUANEROS, OTROS_AGENTES, CLIENTES_FACTURACION,
  PRODUCTOS, PUERTOS, DESTINOS, MUELLES,
} from '../../../config/giroBuque.js';
import styles from './SolicitudGiro.module.css';

const TITLES = { create: 'Solicitud de giro buque', view: 'Visualizar solicitud de giro', edit: 'Editar solicitud de giro' };

// Solicitud de giro buque (Ports → Giro buque). Rediseño de un proceso del
// sistema anterior, con TODOS sus campos (no se quitó ninguno). Una sola página
// (plantilla M-02 + 2 Accordion opcionales) con un índice de secciones fijo que
// da orientación y progreso — alternativa al wizard, que no conviene mientras
// el formulario también se use para editar/duplicar borradores.
//
// ⚠️ Supuestos a confirmar con el área: (1) obligatorios — Buque, F/H arribo rada
// Rosario, F/H estimativa zarpada, Producto, Agente marítimo aduanero, E-mail;
// (2) cuáles datos del buque salen del maestro y cuáles son por viaje (hoy: se
// autocompletan desde el maestro pero siguen siendo editables); (3) el texto
// COMPLETO de los Art. 193 y 194 de la Ley 20094 (hoy: solo el rótulo original);
// (4) quién la completa. Catálogos en config/giroBuque.js (de ejemplo).

const EMPTY = {
  idViaje: '', fhRecalada: '', fhFondeo: '', fhRada: '', fhZarpada: '',
  buque: '', buqueOtro: '', propietario: '', tipoBuque: '', capitan: '', armador: '', armadorOtro: '', domicilioArmador: '', bandera: '',
  imo: '', indicativo: '', matricula: '', anio: '', trn: '', tbt: '', tpc: '', lastre: '', eslora: '', manga: '', puntal: '', coeficiente: '',
  agente193: '', agente193Otro: '', agente194: '', agente194Otro: '', clienteFact: '', clienteFactOtro: '',
  producto: '', productoOtro: '', puertoProc: '', puertoProcOtro: '', procedenciaCarga: '', destino: '', destinoOtro: '',
  caladoEntProa: '', caladoEntPopa: '', caladoSalProa: '', caladoSalPopa: '',
  muelles: '', muellesOtro: '', lugar: '',
  email: '', observaciones: '',
};

const NUMERIC_FIELDS = ['trn', 'tbt', 'tpc', 'lastre', 'eslora', 'manga', 'puntal', 'coeficiente', 'caladoEntProa', 'caladoEntPopa', 'caladoSalProa', 'caladoSalPopa'];
const NUMERIC_RE = /^\d+([.,]\d+)?$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Un campo de maestro con "Otro" está completo si eligió algo y, si fue "Otro", escribió el texto.
const lookupFilled = (v, key) => Boolean(v[key]) && (v[key] !== OTHER_VALUE || v[`${key}Otro`].trim());

// Qué campos pertenecen a cada sección (para errores y estado del índice).
const SECTION_FIELDS = {
  viaje: ['fhRada', 'fhZarpada'],
  buque: ['buque', ...NUMERIC_FIELDS.slice(0, 8)],
  agentes: ['agente193'],
  carga: ['producto'],
  calados: ['caladoEntProa', 'caladoEntPopa', 'caladoSalProa', 'caladoSalPopa'],
  solicitante: ['email'],
};

function validate(v) {
  const e = {};
  if (!v.fhRada) e.fhRada = 'Campo requerido';
  if (!v.fhZarpada) e.fhZarpada = 'Campo requerido';
  if (v.fhRada && v.fhZarpada && v.fhZarpada <= v.fhRada) e.fhZarpada = 'La zarpada debe ser posterior al arribo a rada Rosario';
  if (!lookupFilled(v, 'buque')) e.buque = v.buque === OTHER_VALUE ? 'Escribí el nombre del buque' : 'Elegí un buque o escribilo en Otro';
  if (!lookupFilled(v, 'agente193')) e.agente193 = v.agente193 === OTHER_VALUE ? 'Escribí el agente' : 'Elegí un agente o escribilo en Otro';
  if (!lookupFilled(v, 'producto')) e.producto = v.producto === OTHER_VALUE ? 'Escribí el producto' : 'Elegí un producto o escribilo en Otro';
  if (!v.email.trim()) e.email = 'Campo requerido';
  else if (!EMAIL_RE.test(v.email.trim())) e.email = 'Ingresá un e-mail válido';
  NUMERIC_FIELDS.forEach((k) => {
    if (v[k].trim() && !NUMERIC_RE.test(v[k].trim())) e[k] = 'Ingresá un número';
  });
  return e;
}

export default function SolicitudGiro({ onNavigate, onSearch, giros = [], onCreateGiro, onUpdateGiro, params = {}, mode = 'create' }) {
  const isView = mode === 'view';
  const isEdit = mode === 'edit';
  const existing = mode !== 'create' ? giros.find((g) => String(g.id) === String(params.id)) : null;
  const navigate = onNavigate ?? ((d) => console.log('navigate', d));

  const [values, setValues] = useState({ ...EMPTY, email: OPERACIONES_SIDEBAR_PROPS.user.email, ...(existing?.values ?? {}) });
  const [errors, setErrors] = useState({});
  const [attempted, setAttempted] = useState(false);

  const common = {
    sidebar: OPERACIONES_SIDEBAR_PROPS,
    activeHref: '/giros',
    onNavigate: navigate,
    onSearch,
    onCompanyChange: (c) => console.log('company change', c),
    onLogout: () => console.log('logout'),
    onToggle: (d) => console.log('toggle', d),
  };
  const goList = () => navigate({ href: '/giros', label: 'Giros' });

  if (mode !== 'create' && !existing) {
    return (
      <LayoutMaestroBasico {...common} breadcrumb={[{ label: 'Giros' }]} title="Solicitud no encontrada" onCancel={goList} cancelLabel="Volver" formTitle="Solicitud de giro buque">
        <p className={styles.notFound}>No se encontró la solicitud pedida.</p>
      </LayoutMaestroBasico>
    );
  }

  function set(key, value) {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function setBuque(value) {
    const found = BUQUES_MAESTRO.find((b) => b.value === value);
    setValues((prev) => ({
      ...prev,
      buque: value,
      ...(found ? {
        propietario: found.data.propietario, tipoBuque: found.data.tipo, bandera: found.data.bandera, imo: found.data.imo, indicativo: found.data.indicativo,
        matricula: found.data.matricula, anio: found.data.anio, trn: found.data.trn, tbt: found.data.tbt, tpc: found.data.tpc, lastre: found.data.lastre,
        eslora: found.data.eslora, manga: found.data.manga, puntal: found.data.puntal, coeficiente: found.data.coeficiente,
      } : {}),
    }));
    if (errors.buque) setErrors((prev) => ({ ...prev, buque: undefined }));
  }

  function setArmador(value) {
    const found = ARMADORES.find((a) => a.value === value);
    setValues((prev) => ({ ...prev, armador: value, ...(found ? { domicilioArmador: found.domicilio } : {}) }));
  }

  // ── Campos ────────────────────────────────────────────────────────────────
  const text = (key, label, extra = {}) => (
    <TextField label={label} value={values[key]} onChange={(e) => set(key, e.target.value)} disabled={isView} error={Boolean(errors[key])} helperText={errors[key]} {...extra} />
  );
  const lookup = (key, label, options, extra = {}) => (
    <SelectWithOther
      label={label}
      options={options}
      value={values[key]}
      onChange={(v) => (key === 'buque' ? setBuque(v) : key === 'armador' ? setArmador(v) : set(key, v))}
      otherValue={values[`${key}Otro`]}
      onOtherChange={(t) => set(`${key}Otro`, t)}
      disabled={isView}
      error={Boolean(errors[key])}
      helperText={errors[key]}
      {...extra}
    />
  );

  // ── Estado de cada sección (índice) ───────────────────────────────────────
  const filledSection = {
    viaje: Boolean(values.fhRada && values.fhZarpada),
    buque: lookupFilled(values, 'buque'),
    agentes: lookupFilled(values, 'agente193'),
    carga: lookupFilled(values, 'producto'),
    calados: SECTION_FIELDS.calados.every((k) => values[k].trim()),
    solicitante: Boolean(values.email.trim()),
  };
  const sectionStatus = (id) => {
    if (attempted && SECTION_FIELDS[id].some((k) => errors[k])) return 'error';
    return filledSection[id] ? 'complete' : 'pending';
  };
  const SECTIONS = [
    { id: 'sec-viaje', key: 'viaje', label: 'Datos del viaje' },
    { id: 'sec-buque', key: 'buque', label: 'Información del buque' },
    { id: 'sec-agentes', key: 'agentes', label: 'Agentes y responsables' },
    { id: 'sec-carga', key: 'carga', label: 'Operación y carga' },
    { id: 'sec-calados', key: 'calados', label: 'Calados' },
    { id: 'sec-solicitante', key: 'solicitante', label: 'Solicitante' },
  ];

  // ── Guardar / enviar ──────────────────────────────────────────────────────
  function buildGiro(estado) {
    const buqueLabel = values.buque === OTHER_VALUE ? values.buqueOtro : BUQUES_MAESTRO.find((b) => b.value === values.buque)?.label ?? '';
    return { id: existing?.id ?? Date.now(), idViaje: values.idViaje || '—', buqueLabel: buqueLabel || '—', zarpada: values.fhZarpada ? values.fhZarpada.replace('T', ' ') : '—', estado, values };
  }
  const persist = (giro) => (isEdit ? onUpdateGiro?.(giro) : onCreateGiro?.(giro));

  function handleDraft() {
    persist(buildGiro('Borrador')); // el borrador no se valida
  }

  function handleSend() {
    const next = validate(values);
    setErrors(next);
    setAttempted(true);
    if (Object.keys(next).length > 0) {
      const firstSection = SECTIONS.find((s) => SECTION_FIELDS[s.key].some((k) => next[k]));
      document.getElementById(firstSection?.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    persist(buildGiro('Enviada'));
  }

  const errorCount = Object.values(errors).filter(Boolean).length;
  const fromMaster = BUQUES_MAESTRO.some((b) => b.value === values.buque);

  const belowHeader = (
    <>
      <SectionIndex sections={SECTIONS.map((s) => ({ id: s.id, label: s.label, status: sectionStatus(s.key) }))} />
      {attempted && errorCount > 0 && (
        <Message icon="bi-star" title={`Hay ${errorCount} ${errorCount === 1 ? 'campo' : 'campos'} para revisar`} message="Los marcamos en rojo en cada sección. La solicitud no se envía hasta corregirlos." />
      )}
    </>
  );

  return (
    <LayoutMaestroFormulario
      template="M-02"
      {...common}
      breadcrumb={[{ label: 'Giros' }, { label: TITLES[mode] }]}
      title={TITLES[mode]}
      onSave={isView ? undefined : handleSend}
      saveLabel="Enviar solicitud"
      secondaryActions={isView ? [] : [{ label: 'Guardar borrador', onClick: handleDraft }]}
      onCancel={goList}
      cancelLabel={isView ? 'Volver' : 'Cancelar'}
      belowHeader={belowHeader}
      blocks={[
        {
          id: 'sec-viaje', type: 'form', title: 'Datos del viaje',
          children: (
            <>
              <FormRow>
                {text('idViaje', 'ID de viaje')}
                {text('fhRecalada', 'F/H arribo estacionamiento práctico de recalada', { type: 'datetime-local' })}
                {text('fhFondeo', 'F/H arribo/fondeo zona común', { type: 'datetime-local' })}
              </FormRow>
              <FormRow>
                {text('fhRada', 'F/H arribo rada Rosario *', { type: 'datetime-local' })}
                {text('fhZarpada', 'F/H estimativa zarpada *', { type: 'datetime-local' })}
              </FormRow>
            </>
          ),
        },
        {
          id: 'sec-buque', type: 'form', title: 'Información del buque',
          children: (
            <>
              {fromMaster && <Message icon="bi-star" title="Datos completados desde el maestro" message="Podés ajustarlos para este viaje." />}
              <FormRow>
                {lookup('buque', 'Buque *', BUQUES_MAESTRO, { placeholder: 'Seleccionar buque...' })}
                {text('propietario', 'Propietario del buque')}
                {text('tipoBuque', 'Tipo buque ingresado')}
              </FormRow>
              <FormRow>
                {text('capitan', 'Capitán del buque')}
                {lookup('armador', 'Armadores y/o explotadores del buque', ARMADORES, { placeholder: 'Seleccionar armador...' })}
                {text('domicilioArmador', 'Domicilio del armador')}
              </FormRow>
              <FormRow>
                {text('bandera', 'Bandera ingresada')}
                {text('imo', 'IMO')}
                {text('indicativo', 'Indicativo de llamada')}
              </FormRow>
              <FormRow>
                {text('matricula', 'Matrícula')}
                {text('anio', 'Año de construcción', { inputMode: 'numeric', maxLength: 4 })}
                {text('trn', 'TRN (tn)', { inputMode: 'decimal' })}
              </FormRow>
              <FormRow>
                {text('tbt', 'TBT (tn)', { inputMode: 'decimal' })}
                {text('tpc', 'TPC (t/cm)', { inputMode: 'decimal' })}
                {text('lastre', 'Lastre (tn)', { inputMode: 'decimal' })}
              </FormRow>
              <FormRow>
                {text('eslora', 'Eslora (m)', { inputMode: 'decimal' })}
                {text('manga', 'Manga (m)', { inputMode: 'decimal' })}
                {text('puntal', 'Puntal (m)', { inputMode: 'decimal' })}
              </FormRow>
              <FormRow>{text('coeficiente', 'Coeficiente', { inputMode: 'decimal' })}</FormRow>
            </>
          ),
        },
        {
          id: 'sec-agentes', type: 'form', title: 'Agentes y responsables',
          children: (
            <>
              <FormRow columns={2}>
                {lookup('agente193', 'Agente marítimo aduanero (conforme al Art. 193 Ley 20094) *', AGENTES_ADUANEROS, { placeholder: 'Seleccionar agente...' })}
                {lookup('agente194', 'Otros agentes de conformidad con lo dispuesto con el Art. 194 Ley 20094', OTROS_AGENTES, { placeholder: 'Seleccionar agente...' })}
              </FormRow>
              <FormRow columns={2}>
                {lookup('clienteFact', 'Cliente de facturación', CLIENTES_FACTURACION, { placeholder: 'Seleccionar cliente...' })}
              </FormRow>
            </>
          ),
        },
        {
          id: 'sec-carga', type: 'form', title: 'Operación y carga',
          children: (
            <>
              <FormRow>
                {lookup('producto', 'Producto *', PRODUCTOS, { placeholder: 'Seleccionar producto...' })}
                {lookup('puertoProc', 'Puerto de procedencia', PUERTOS, { placeholder: 'Seleccionar puerto...' })}
                {lookup('destino', 'Destino de la carga', DESTINOS, { placeholder: 'Seleccionar destino...' })}
              </FormRow>
              <FormRow columns={2}>{text('procedenciaCarga', 'Procedencia de la carga')}</FormRow>
            </>
          ),
        },
        {
          id: 'sec-calados', type: 'form', title: 'Calados',
          children: (
            <FormRow columns={4}>
              {text('caladoEntProa', 'Calado de entrada · Proa (m)', { inputMode: 'decimal' })}
              {text('caladoEntPopa', 'Calado de entrada · Popa (m)', { inputMode: 'decimal' })}
              {text('caladoSalProa', 'Calado de salida · Proa (m)', { inputMode: 'decimal' })}
              {text('caladoSalPopa', 'Calado de salida · Popa (m)', { inputMode: 'decimal' })}
            </FormRow>
          ),
        },
        {
          id: 'sec-solicitante', type: 'form', title: 'Solicitante',
          children: <FormRow columns={2}>{text('email', 'E-mail solicitante *', { type: 'email' })}</FormRow>,
        },
        {
          type: 'accordion', title: 'Otros muelles o puertos (opcional)',
          children: (
            <FormRow columns={2}>
              {lookup('muelles', 'Otros muelles/puertos donde operará', MUELLES, { placeholder: 'Seleccionar muelle...' })}
              {text('lugar', 'Lugar')}
            </FormRow>
          ),
        },
        {
          type: 'accordion', title: 'Observaciones (opcional)',
          children: text('observaciones', 'Observaciones'),
        },
      ]}
    />
  );
}
