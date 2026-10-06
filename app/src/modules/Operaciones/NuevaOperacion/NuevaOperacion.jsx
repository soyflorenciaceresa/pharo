import { useState } from 'react';
import LayoutMaestroFormulario from '../../../templates/LayoutMaestroFormulario/LayoutMaestroFormulario.jsx';
import FormRow from '../../../components/FormRow/FormRow.jsx';
import TextField from '../../../components/TextField/TextField.jsx';
import Select from '../../../components/Select/Select.jsx';
import Message from '../../../components/Message/Message.jsx';
import Modal from '../../../components/Modal/Modal.jsx';
import ActionGroup from '../../../components/ActionGroup/ActionGroup.jsx';
import { OPERACIONES_SIDEBAR_PROPS } from '../../../config/sidebars/operaciones.js';
import styles from './NuevaOperacion.module.css';

// Proceso "Planificar nueva operación" (Ports). Dos fases en la misma ruta:
//  1. Contexto: Movimiento + Tipo de carga + Modo (cada combinación cambia qué
//     datos se piden — ver la nota de "formulario dinámico" más abajo).
//  2. Formulario de la operación, hoy SOLO para Recepción / Graneles / Camión.
//
// ⚠️ Catálogos de ejemplo (opciones de los selectores, productos, envases, tipos
// de turno, clientes) — reemplazar por los reales. No existe la matriz de reglas
// de las demás combinaciones: cuando exista, el formulario debe armarse leyendo
// esas reglas como datos (qué campos/bloques aparecen, obligatorios, filtros) en
// vez de una pantalla por combinación. Hoy hay una sola armada a mano.
const MOVIMIENTOS = [{ value: 'recepcion', label: 'Recepción' }, { value: 'despacho', label: 'Despacho' }, { value: 'transferencia', label: 'Transferencia' }];
const TIPOS_CARGA = [{ value: 'graneles', label: 'Graneles' }, { value: 'contenedores', label: 'Contenedores' }, { value: 'carga-general', label: 'Carga general' }];
const MODOS = [{ value: 'camion', label: 'Camión' }, { value: 'vagon', label: 'Vagón' }, { value: 'buque', label: 'Buque' }];
const PRODUCTOS = [{ value: 'soja', label: 'Soja' }, { value: 'maiz', label: 'Maíz' }, { value: 'trigo', label: 'Trigo' }, { value: 'girasol', label: 'Girasol' }];
const ENVASES = [{ value: 'granel', label: 'A granel' }, { value: 'big-bag', label: 'Big bag' }];
const TIPOS_TURNO = [{ value: 'camion-recepcion', label: 'Turno camión — recepción' }, { value: 'camion-programado', label: 'Turno camión — programado' }];
const CLIENTES = [{ id: 'c1', label: 'Agroexport S.A.' }, { id: 'c2', label: 'Cereales del Sur' }, { id: 'c3', label: 'Molinos Andinos' }, { id: 'c4', label: 'Exportadora Litoral' }];

const labelOf = (options, value) => options.find((o) => o.value === value)?.label ?? '';

export default function NuevaOperacion({ onNavigate, onSearch }) {
  const navigate = onNavigate ?? ((d) => console.log('navigate', d));

  const [started, setStarted] = useState(false);
  const [movimiento, setMovimiento] = useState('');
  const [tipoCarga, setTipoCarga] = useState('');
  const [modo, setModo] = useState('');
  const [producto, setProducto] = useState('');
  const [envase, setEnvase] = useState('');
  const [tipoTurno, setTipoTurno] = useState('');
  const [clientes, setClientes] = useState([]);
  const [notas, setNotas] = useState('');
  const [errors, setErrors] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [modalCliente, setModalCliente] = useState('');
  const [modalCantidad, setModalCantidad] = useState('');

  const contextComplete = Boolean(movimiento && tipoCarga && modo);
  const isRecepcionGranelesCamion = movimiento === 'recepcion' && tipoCarga === 'graneles' && modo === 'camion';

  const common = {
    sidebar: OPERACIONES_SIDEBAR_PROPS,
    activeHref: '/nueva-operacion',
    onNavigate: navigate,
    onSearch,
    onCompanyChange: (c) => console.log('company change', c),
    onLogout: () => console.log('logout'),
    onToggle: (d) => console.log('toggle', d),
  };

  function clearError(key) {
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  const contextSelects = (disabled) => (
    <FormRow>
      <Select label="Movimiento" value={movimiento} onChange={(e) => setMovimiento(e.target.value)} options={MOVIMIENTOS} placeholder="Seleccionar movimiento..." disabled={disabled} />
      <Select label="Tipo de carga" value={tipoCarga} onChange={(e) => setTipoCarga(e.target.value)} options={TIPOS_CARGA} placeholder="Seleccionar tipo de carga..." disabled={disabled} />
      <Select label="Modo" value={modo} onChange={(e) => setModo(e.target.value)} options={MODOS} placeholder="Seleccionar modo..." disabled={disabled} />
    </FormRow>
  );

  // ── Fase 1: contexto (M-01) ────────────────────────────────────────────────
  if (!started) {
    const unsupported = contextComplete && !isRecepcionGranelesCamion;
    return (
      <LayoutMaestroFormulario
        template="M-01"
        {...common}
        breadcrumb={[{ label: 'Procesos' }, { label: 'Nueva Operación' }]}
        title="Planificar nueva operación"
        onSave={() => contextComplete && !unsupported && setStarted(true)}
        saveLabel="Continuar"
        blocks={[
          {
            type: 'form',
            title: 'Tipo de operación',
            children: (
              <>
                {contextSelects(false)}
                {unsupported && <Message icon="bi-star" title="Esta combinación todavía no está disponible" message="Por ahora solo está diseñada la planificación de Recepción · Graneles · Camión." />}
              </>
            ),
          },
        ]}
      />
    );
  }

  // ── Fase 2: Recepción / Graneles / Camión (M-04a) ──────────────────────────
  function handleConfirm() {
    const next = {};
    if (!producto) next.producto = 'Campo requerido';
    if (!envase) next.envase = 'Campo requerido';
    if (!tipoTurno) next.tipoTurno = 'Campo requerido';
    if (clientes.length === 0) next.clientes = true;
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    navigate({ href: '/operaciones', label: 'Ports' });
  }

  function handleAddCliente() {
    if (!modalCliente || !Number(modalCantidad)) return;
    setClientes((prev) => [...prev, { id: modalCliente, cliente: CLIENTES.find((c) => c.id === modalCliente)?.label ?? modalCliente, cantidad: modalCantidad }]);
    setErrors((prev) => ({ ...prev, clientes: undefined }));
    setModalOpen(false);
  }

  const clienteOptions = CLIENTES.filter((c) => !clientes.some((r) => r.id === c.id)).map((c) => ({ value: c.id, label: c.label }));

  return (
    <>
      <LayoutMaestroFormulario
        template="M-04a"
        {...common}
        breadcrumb={[{ label: 'Procesos' }, { label: 'Nueva Operación' }]}
        title="Planificar nueva operación"
        belowHeader={
          <Message
            icon="bi-star"
            title="Tipo de operación"
            message={`Movimiento: ${labelOf(MOVIMIENTOS, movimiento)}\nTipo de carga: ${labelOf(TIPOS_CARGA, tipoCarga)}\nModo: ${labelOf(MODOS, modo)}`}
          />
        }
        onSave={handleConfirm}
        saveLabel="Confirmar"
        onCancel={() => navigate({ href: '/operaciones', label: 'Ports' })}
        blocks={[
          {
            type: 'form',
            title: 'Datos de la operación',
            children: (
              <>
                <FormRow columns={4}>
                <TextField label="Operación" value="1" disabled readOnly />
                <Select label="Producto" value={producto} onChange={(e) => { setProducto(e.target.value); clearError('producto'); }} options={PRODUCTOS} placeholder="Seleccionar producto..." error={Boolean(errors.producto)} helperText={errors.producto} />
                <Select label="Envase" value={envase} onChange={(e) => { setEnvase(e.target.value); clearError('envase'); }} options={ENVASES} placeholder="Seleccionar envase..." error={Boolean(errors.envase)} helperText={errors.envase} />
                <Select label="Tipo de turno" value={tipoTurno} onChange={(e) => { setTipoTurno(e.target.value); clearError('tipoTurno'); }} options={TIPOS_TURNO} placeholder="Seleccionar tipo de turno..." error={Boolean(errors.tipoTurno)} helperText={errors.tipoTurno} />
                </FormRow>
              </>
            ),
          },
          {
            type: 'grid',
            title: 'Clientes',
            onAdd: () => { setModalCliente(''); setModalCantidad(''); setModalOpen(true); },
            columns: [
              { key: 'cliente', label: 'Cliente' },
              { key: 'cantidad', label: 'Cantidad (tn)', width: 160 },
            ],
            rows: clientes,
            emptyMessage: errors.clientes ? 'Agregá al menos un cliente para confirmar.' : 'Todavía no agregaste clientes.',
            actions: [{ key: 'delete', icon: 'icon-delete', label: 'Eliminar', onClick: (row) => setClientes((prev) => prev.filter((r) => r.id !== row.id)) }],
          },
          {
            type: 'accordion',
            title: 'Notas (opcional)',
            children: <TextField label="Notas" value={notas} onChange={(e) => setNotas(e.target.value)} />,
          },
        ]}
      />
      <Modal
        open={modalOpen}
        title="Agregar cliente"
        onClose={() => setModalOpen(false)}
        footer={
          <ActionGroup
            aria-label="Acciones del diálogo"
            primary={{ label: 'Agregar', onClick: handleAddCliente, disabled: !modalCliente || !Number(modalCantidad) }}
            secondary={[{ label: 'Cancelar', onClick: () => setModalOpen(false) }]}
          />
        }
      >
        <div className={styles.modalFields}>
          <Select label="Cliente" value={modalCliente} onChange={(e) => setModalCliente(e.target.value)} options={clienteOptions} placeholder="Seleccionar cliente..." />
          <TextField label="Cantidad (tn)" value={modalCantidad} onChange={(e) => setModalCantidad(e.target.value)} inputMode="decimal" />
        </div>
      </Modal>
    </>
  );
}
