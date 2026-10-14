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
import { TRUCKSHIFT_SIDEBAR_PROPS } from '../../../config/sidebars/truckshift.js';
import styles from './MaestroTruckshiftFormulario.module.css';

const HREF = '/truckshift/choferes';
const TRANSPORTISTAS_HREF = '/truckshift/transportistas';
const VERBS = { create: 'Crear', view: 'Visualizar', edit: 'Editar' };

// Maestro "Choferes" (Truckshift). Template M-04a · Compuesto, cabecera +
// grilla: una Form Section con los datos del chofer y UNA colección hija
// (Transportistas) como Child Grid Section al final. El original la mostraba en
// una segunda tab ("Datos generales | Transportistas"): con una sola colección
// hija el kit no usa tabs. Los transportistas se eligen del maestro de
// Transportistas (en un Modal). Supuestos: DNI, Nombre y Apellido obligatorios
// (el original no marcaba ninguno). Pendiente: selector con búsqueda.
export default function ChoferFormulario({ truckshiftRows = {}, onSaveTruckshift, onNavigate, onSearch, params = {}, mode = 'create' }) {
  const rows = truckshiftRows[HREF] ?? [];
  const transportistas = truckshiftRows[TRANSPORTISTAS_HREF] ?? [];
  const isView = mode === 'view';
  const isEdit = mode === 'edit';
  const existing = mode !== 'create' ? rows.find((r) => String(r.id) === String(params.id)) : null;
  const navigate = onNavigate ?? ((d) => console.log('navigate', d));

  const [values, setValues] = useState({ dni: existing?.codigo ?? '', nombre: '', apellido: '', telefono: '', ...(existing?.values ?? {}) });
  const [inactivo, setInactivo] = useState(existing?.estado?.label === 'Inactivo');
  const [transportistaIds, setTransportistaIds] = useState(existing?.transportistaIds ?? []);
  const [errors, setErrors] = useState({});
  const [modal, setModal] = useState(null); // { id?, valor, error }

  const common = {
    sidebar: TRUCKSHIFT_SIDEBAR_PROPS,
    activeHref: HREF,
    onNavigate: navigate,
    onSearch,
    onCompanyChange: (c) => console.log('company change', c),
    onLogout: () => console.log('logout'),
    onToggle: (d) => console.log('toggle', d),
  };
  const goList = () => navigate({ href: HREF, label: 'Choferes' });

  if (mode !== 'create' && !existing) {
    return (
      <LayoutMaestroBasico {...common} breadcrumb={[{ label: 'Choferes' }]} title="Chofer no encontrado" onCancel={goList} cancelLabel="Volver" formTitle="Datos del chofer">
        <p className={styles.notFound}>No se encontró el chofer solicitado.</p>
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

  function handleSave() {
    const next = {};
    const dni = values.dni.replace(/\D/g, '');
    if (!dni) next.dni = 'Campo requerido';
    else if (!/^\d{7,8}$/.test(dni)) next.dni = 'El DNI debe tener 7 u 8 dígitos';
    else if (rows.some((r) => r.codigo === dni && r.id !== existing?.id)) next.dni = 'Ya existe un chofer con este DNI';
    if (!values.nombre.trim()) next.nombre = 'Campo requerido';
    if (!values.apellido.trim()) next.apellido = 'Campo requerido';
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const nombre = values.nombre.trim();
    const apellido = values.apellido.trim();
    onSaveTruckshift?.(HREF, {
      id: existing?.id ?? Date.now(),
      codigo: dni,
      denominacion: `${apellido.toUpperCase()}, ${nombre}`,
      estado: inactivo ? { label: 'Inactivo', type: 'neutral' } : { label: 'Activo', type: 'success' },
      values: { ...values, dni, nombre, apellido, telefono: values.telefono.trim() },
      transportistaIds,
    }, isEdit);
  }

  // ── Transportistas del chofer (se eligen en Modal) ────────────────────────
  const assigned = transportistaIds.map((id) => transportistas.find((t) => t.id === id)).filter(Boolean);
  const available = transportistas.filter((t) => !transportistaIds.includes(t.id) || t.id === modal?.id);

  function saveModal() {
    if (!modal.valor) return setModal({ ...modal, error: 'Elegí un transportista' });
    const id = Number(modal.valor);
    setTransportistaIds((prev) => (modal.id ? prev.map((x) => (x === modal.id ? id : x)) : [...prev, id]));
    setModal(null);
  }

  return (
    <>
      <LayoutMaestroFormulario
        template="M-04a"
        {...common}
        breadcrumb={[{ label: 'Choferes' }, { label: mode === 'create' ? 'Crear' : `${VERBS[mode]} Chofer` }]}
        title={`${VERBS[mode]} Chofer`}
        onSave={isView ? undefined : handleSave}
        onCancel={goList}
        cancelLabel={isView ? 'Volver' : 'Cancelar'}
        blocks={[
          {
            type: 'form',
            title: 'Datos del chofer',
            children: (
              <>
                <FormRow>
                  {text('dni', 'DNI del chofer *', { inputMode: 'numeric', maxLength: 8 })}
                  {text('nombre', 'Nombre *')}
                  {text('apellido', 'Apellido *')}
                </FormRow>
                <FormRow>{text('telefono', 'Teléfono', { type: 'tel', inputMode: 'tel' })}</FormRow>
                <Checkbox label="Inactivo" checked={inactivo} onChange={(e) => setInactivo(e.target.checked)} disabled={isView} />
              </>
            ),
          },
          {
            type: 'grid',
            title: 'Transportistas',
            onAdd: isView ? undefined : () => setModal({ valor: '', error: '' }),
            columns: [
              { key: 'codigo', label: 'Número de identificación fiscal', width: 240 },
              { key: 'denominacion', label: 'Denominación' },
              { key: 'estado', label: 'Activo', width: 120, render: (row) => <Badge type={row.estado.type}>{row.estado.label}</Badge> },
            ],
            rows: assigned,
            emptyMessage: 'Sin datos para mostrar.',
            actions: isView
              ? []
              : [{ key: 'delete', icon: 'bi-trash', label: 'Quitar', onClick: (row) => setTransportistaIds((prev) => prev.filter((x) => x !== row.id)) }],
          },
        ]}
      />
      <Modal
        open={Boolean(modal)}
        title="Agregar transportista"
        onClose={() => setModal(null)}
        footer={
          <ActionGroup
            aria-label="Acciones del diálogo"
            primary={{ label: 'Agregar', onClick: saveModal, disabled: available.length === 0 }}
            secondary={[{ label: 'Cancelar', onClick: () => setModal(null) }]}
          />
        }
      >
        {modal && (
          <div className={styles.modalFields}>
            <Select
              label="Transportista *"
              value={modal.valor}
              onChange={(e) => setModal({ ...modal, valor: e.target.value, error: '' })}
              options={available.map((t) => ({ value: String(t.id), label: `${t.codigo} · ${t.denominacion}` }))}
              placeholder={available.length ? 'Seleccionar transportista...' : 'No hay más transportistas'}
              error={Boolean(modal.error)}
              helperText={modal.error}
            />
          </div>
        )}
      </Modal>
    </>
  );
}
