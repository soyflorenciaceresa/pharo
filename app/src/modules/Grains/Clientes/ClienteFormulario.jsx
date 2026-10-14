import { useState } from 'react';
import LayoutMaestroFormulario from '../../../templates/LayoutMaestroFormulario/LayoutMaestroFormulario.jsx';
import LayoutMaestroBasico from '../../../templates/LayoutMaestroBasico/LayoutMaestroBasico.jsx';
import FormRow from '../../../components/FormRow/FormRow.jsx';
import TextField from '../../../components/TextField/TextField.jsx';
import Select from '../../../components/Select/Select.jsx';
import Checkbox from '../../../components/Checkbox/Checkbox.jsx';
import Badge from '../../../components/Badge/Badge.jsx';
import Modal from '../../../components/Modal/Modal.jsx';
import ActionGroup from '../../../components/ActionGroup/ActionGroup.jsx';
import { GRAINS_SIDEBAR_PROPS } from '../../../config/sidebars/grains.js';
import {
  ROLES, ACTIVIDADES, TIPOS_DOMICILIO, LOCALIDADES, PAISES_AFIP, CATEGORIAS_IVA, CATEGORIAS_GANANCIAS,
  CONDICIONES_IMPOSITIVAS, TIPOS_EMAIL, CATEGORIAS_SISA, labelOf, isValidCuit,
} from '../../../config/grainsClientes.js';
import styles from './ClienteFormulario.module.css';

const HREF = '/grains/clientes';
const TITLES = { create: 'Crear Cliente', view: 'Visualizar Cliente', edit: 'Editar Cliente' };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const today = () => new Date().toISOString().slice(0, 10);

// Maestro "Clientes" (Grains). Rediseño de una pantalla con 5 tabs
// (Datos Generales | Dominio Fiscal | Contacto | Datos Impositivos | Otros datos)
// siguiendo la regla del kit: las tabs son para colecciones hijas paralelas, no
// para grupos de campos. Resultado — M-04c: cabecera con las 4 Form Section
// (Datos generales, Dominio fiscal, Datos impositivos, Otros datos) + UNA fila de
// tabs, una por colección hija: Teléfonos, Correos electrónicos y Actividad SISA
// (cada una una `ChildGridSection`). Página web (opcional, con usuario/clave) va
// en un `Accordion` al final. Todos los datos del original están.
//
// Mejoras: CUIT validado con dígito verificador y sin duplicados; un solo email
// principal; fecha de baja posterior a la de alta. Pendientes: "Actualizar" de
// Actividad SISA es un placeholder (consulta a SISA), Localidad/País AFIP son
// `Select` (falta el selector con búsqueda), Observaciones es un `TextField` (falta
// campo de texto largo), y guardar la clave de la página web en claro es un
// problema de seguridad a resolver con backend.
const EMPTY = {
  rol: '', cuit: '', razonSocial: '', actividad: '', nombreExtendido: '',
  calle: '', numero: '', piso: '', depto: '', tipoDomicilio: '', localidad: '', nacionalidad: '', paisAfip: '',
  catIva: '', catGanancias: '', alicuotaIibb: '', condicion: '',
  fechaAlta: today(), fechaBaja: '', observaciones: '', inactivo: false,
  web: '', webUsuario: '', webClave: '',
};

export default function ClienteFormulario({ onNavigate, onSearch, clientes = [], onCreateCliente, onUpdateCliente, params = {}, mode = 'create' }) {
  const isView = mode === 'view';
  const isEdit = mode === 'edit';
  const existing = mode !== 'create' ? clientes.find((c) => String(c.id) === String(params.id)) : null;
  const navigate = onNavigate ?? ((d) => console.log('navigate', d));

  const [values, setValues] = useState({ ...EMPTY, ...(existing?.values ?? {}) });
  const [telefonos, setTelefonos] = useState(existing?.telefonos ?? []);
  const [correos, setCorreos] = useState(existing?.correos ?? []);
  const [sisa, setSisa] = useState(existing?.sisa ?? []);
  const [errors, setErrors] = useState({});
  const [modal, setModal] = useState(null); // { kind: 'tel'|'mail'|'sisa', id?, ...campos, error }

  const common = {
    sidebar: GRAINS_SIDEBAR_PROPS,
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
      <LayoutMaestroBasico {...common} breadcrumb={[{ label: 'Clientes' }]} title="Cliente no encontrado" onCancel={goList} cancelLabel="Volver" formTitle="Datos del cliente">
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
    <Select label={label} value={values[key]} onChange={(e) => set(key, e.target.value)} options={options} placeholder={placeholder} disabled={isView} error={Boolean(errors[key])} helperText={errors[key]} />
  );

  function handleSave() {
    const next = {};
    const cuit = values.cuit.replace(/\D/g, '');
    if (!values.rol) next.rol = 'Campo requerido';
    if (!cuit) next.cuit = 'Campo requerido';
    else if (!isValidCuit(cuit)) next.cuit = 'CUIT inválido: revisá los 11 dígitos';
    else if (clientes.some((c) => c.cuit === cuit && c.id !== existing?.id)) next.cuit = 'Ya existe un cliente con este CUIT';
    if (!values.razonSocial.trim()) next.razonSocial = 'Campo requerido';
    if (!values.calle.trim()) next.calle = 'Campo requerido';
    if (!values.numero.trim()) next.numero = 'Campo requerido';
    if (!values.tipoDomicilio) next.tipoDomicilio = 'Campo requerido';
    if (!values.localidad) next.localidad = 'Campo requerido';
    if (!values.paisAfip) next.paisAfip = 'Campo requerido';
    if (!values.condicion) next.condicion = 'Campo requerido';
    if (!values.fechaAlta) next.fechaAlta = 'Campo requerido';
    if (values.fechaAlta && values.fechaBaja && values.fechaBaja < values.fechaAlta) next.fechaBaja = 'La baja debe ser posterior al alta';
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const cliente = {
      id: existing?.id ?? Date.now(),
      cuit,
      razonSocial: values.razonSocial.trim(),
      nombreExtendido: values.nombreExtendido.trim(),
      rol: values.rol,
      activo: !values.inactivo,
      values: { ...values, cuit },
      telefonos,
      correos,
      sisa,
    };
    if (isEdit) onUpdateCliente?.(cliente);
    else onCreateCliente?.(cliente);
  }

  // ── Colecciones hijas (se editan en Modal) ────────────────────────────────
  function saveModal() {
    const m = modal;
    if (m.kind === 'tel') {
      if (!/^[\d\s()+-]{6,}$/.test(m.telefono.trim())) return setModal({ ...m, error: 'Ingresá un teléfono válido' });
      const row = { id: m.id ?? Date.now(), telefono: m.telefono.trim(), comentario: m.comentario.trim() };
      setTelefonos((prev) => (m.id ? prev.map((r) => (r.id === m.id ? row : r)) : [...prev, row]));
    } else if (m.kind === 'mail') {
      if (!EMAIL_RE.test(m.correo.trim())) return setModal({ ...m, error: 'Ingresá un e-mail válido' });
      const principal = m.principal || (correos.length === 0 && !m.id);
      const row = { id: m.id ?? Date.now(), correo: m.correo.trim(), comentario: m.comentario.trim(), tipo: m.tipo, principal };
      // Un solo principal: el nuevo desplaza al anterior.
      setCorreos((prev) => {
        const base = prev.map((r) => (principal ? { ...r, principal: false } : r));
        return m.id ? base.map((r) => (r.id === m.id ? row : r)) : [...base, row];
      });
    } else {
      if (!m.categoria) return setModal({ ...m, error: 'Elegí una categoría' });
      if (sisa.some((r) => r.categoria === m.categoria && r.id !== m.id)) return setModal({ ...m, error: 'Esa categoría ya está cargada' });
      const row = { id: m.id ?? Date.now(), categoria: m.categoria };
      setSisa((prev) => (m.id ? prev.map((r) => (r.id === m.id ? row : r)) : [...prev, row]));
    }
    setModal(null);
  }

  const rowActions = (setter, kind) =>
    isView
      ? []
      : [
          { key: 'edit', icon: 'icon-edit', label: 'Editar', onClick: (row) => setModal({ kind, ...row, error: '' }) },
          { key: 'delete', icon: 'bi-trash', label: 'Eliminar', onClick: (row) => setter((prev) => prev.filter((r) => r.id !== row.id)) },
        ];
  const yesNo = (v) => <Badge type={v ? 'success' : 'neutral'} showDot={false}>{v ? 'Sí' : 'No'}</Badge>;

  const modalTitle = modal ? `${modal.id ? 'Editar' : 'Agregar'} ${{ tel: 'teléfono', mail: 'correo electrónico', sisa: 'actividad SISA' }[modal.kind]}` : '';

  return (
    <>
      <LayoutMaestroFormulario
        template="M-04c"
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
                  {select('rol', 'Rol *', ROLES, 'Seleccionar rol...')}
                  {text('cuit', 'Identificador fiscal (CUIT) *', { inputMode: 'numeric', maxLength: 13, placeholder: '30-12345678-9' })}
                  {text('razonSocial', 'Razón social *')}
                </FormRow>
                <FormRow>
                  {select('actividad', 'Actividad', ACTIVIDADES, 'Seleccionar actividad...')}
                  {text('nombreExtendido', 'Nombre extendido')}
                </FormRow>
              </>
            ),
          },
          {
            type: 'form',
            title: 'Dominio fiscal',
            children: (
              <>
                <FormRow>
                  {text('calle', 'Calle *')}
                  {text('numero', 'Número de calle *')}
                  {text('piso', 'Piso')}
                </FormRow>
                <FormRow>
                  {text('depto', 'Departamento')}
                  {select('tipoDomicilio', 'Tipo de domicilio *', TIPOS_DOMICILIO, 'Seleccionar tipo de domicilio...')}
                  {select('localidad', 'Localidad *', LOCALIDADES, 'Seleccionar localidad...')}
                </FormRow>
                <FormRow>
                  {text('nacionalidad', 'Nacionalidad')}
                  {select('paisAfip', 'País AFIP *', PAISES_AFIP, 'Seleccionar país...')}
                </FormRow>
              </>
            ),
          },
          {
            type: 'form',
            title: 'Datos impositivos',
            children: (
              <>
                <FormRow>
                  {select('catIva', 'Categoría IVA', CATEGORIAS_IVA, 'Seleccionar categoría...')}
                  {select('catGanancias', 'Categoría Ganancias', CATEGORIAS_GANANCIAS, 'Seleccionar categoría...')}
                  {text('alicuotaIibb', 'Alícuota IIBB (%)', { inputMode: 'decimal' })}
                </FormRow>
                <FormRow columns={2}>{select('condicion', 'Condición impositiva *', CONDICIONES_IMPOSITIVAS, 'Seleccionar condición...')}</FormRow>
              </>
            ),
          },
          {
            type: 'form',
            title: 'Otros datos',
            children: (
              <>
                <FormRow columns={2}>
                  {text('fechaAlta', 'Fecha alta *', { type: 'date' })}
                  {text('fechaBaja', 'Fecha baja', { type: 'date' })}
                </FormRow>
                {text('observaciones', 'Observaciones')}
                <Checkbox label="Inactivo" checked={values.inactivo} onChange={(e) => set('inactivo', e.target.checked)} disabled={isView} />
              </>
            ),
          },
          {
            type: 'accordion',
            title: 'Página web (opcional)',
            children: (
              <FormRow>
                {text('web', 'Página web', { type: 'url', placeholder: 'https://' })}
                {text('webUsuario', 'Usuario', { autoComplete: 'off' })}
                {text('webClave', 'Clave', { type: 'password', autoComplete: 'new-password' })}
              </FormRow>
            ),
          },
        ]}
        tabs={[
          {
            id: 'telefonos',
            label: 'Teléfonos',
            blocks: [{
              type: 'grid',
              title: 'Teléfonos',
              onAdd: isView ? undefined : () => setModal({ kind: 'tel', telefono: '', comentario: '', error: '' }),
              columns: [{ key: 'telefono', label: 'Teléfono' }, { key: 'comentario', label: 'Comentario' }],
              rows: telefonos,
              emptyMessage: 'Sin teléfonos cargados.',
              actions: rowActions(setTelefonos, 'tel'),
            }],
          },
          {
            id: 'correos',
            label: 'Correos electrónicos',
            blocks: [{
              type: 'grid',
              title: 'Correos electrónicos',
              onAdd: isView ? undefined : () => setModal({ kind: 'mail', correo: '', comentario: '', tipo: '', principal: false, error: '' }),
              columns: [
                { key: 'correo', label: 'Correo electrónico' },
                { key: 'comentario', label: 'Comentario' },
                { key: 'tipoLabel', label: 'Tipo de email', width: 150, render: (row) => <span>{labelOf(TIPOS_EMAIL, row.tipo)}</span> },
                { key: 'principal', label: 'Email principal', width: 150, render: (row) => yesNo(row.principal) },
              ],
              rows: correos,
              emptyMessage: 'Sin correos cargados.',
              actions: rowActions(setCorreos, 'mail'),
            }],
          },
          {
            id: 'sisa',
            label: 'Actividad SISA',
            blocks: [{
              type: 'grid',
              title: 'Actividad SISA',
              onAdd: isView ? undefined : () => setModal({ kind: 'sisa', categoria: '', error: '' }),
              extraActions: isView ? [] : [{ label: 'Actualizar', iconStart: 'icon-refresh', onClick: () => console.log('actualizar actividad SISA') }],
              columns: [{ key: 'categoriaLabel', label: 'Categoría', render: (row) => <span>{labelOf(CATEGORIAS_SISA, row.categoria)}</span> }],
              rows: sisa,
              emptyMessage: 'Sin actividad SISA cargada.',
              actions: rowActions(setSisa, 'sisa'),
            }],
          },
        ]}
      />
      <Modal
        open={Boolean(modal)}
        title={modalTitle}
        onClose={() => setModal(null)}
        footer={
          <ActionGroup
            aria-label="Acciones del diálogo"
            primary={{ label: modal?.id ? 'Guardar' : 'Agregar', onClick: saveModal }}
            secondary={[{ label: 'Cancelar', onClick: () => setModal(null) }]}
          />
        }
      >
        {modal?.kind === 'tel' && (
          <div className={styles.modalFields}>
            <TextField label="Teléfono *" value={modal.telefono} onChange={(e) => setModal({ ...modal, telefono: e.target.value, error: '' })} inputMode="tel" error={Boolean(modal.error)} helperText={modal.error} />
            <TextField label="Comentario" value={modal.comentario} onChange={(e) => setModal({ ...modal, comentario: e.target.value })} />
          </div>
        )}
        {modal?.kind === 'mail' && (
          <div className={styles.modalFields}>
            <TextField label="Correo electrónico *" value={modal.correo} onChange={(e) => setModal({ ...modal, correo: e.target.value, error: '' })} type="email" error={Boolean(modal.error)} helperText={modal.error} />
            <TextField label="Comentario" value={modal.comentario} onChange={(e) => setModal({ ...modal, comentario: e.target.value })} />
            <Select label="Tipo de email" value={modal.tipo} onChange={(e) => setModal({ ...modal, tipo: e.target.value })} options={TIPOS_EMAIL} placeholder="Seleccionar tipo..." />
            <Checkbox label="Email principal" checked={modal.principal} onChange={(e) => setModal({ ...modal, principal: e.target.checked })} />
          </div>
        )}
        {modal?.kind === 'sisa' && (
          <div className={styles.modalFields}>
            <Select label="Categoría *" value={modal.categoria} onChange={(e) => setModal({ ...modal, categoria: e.target.value, error: '' })} options={CATEGORIAS_SISA} placeholder="Seleccionar categoría..." error={Boolean(modal.error)} helperText={modal.error} />
          </div>
        )}
      </Modal>
    </>
  );
}
