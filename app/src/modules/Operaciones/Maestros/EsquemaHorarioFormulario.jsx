import { useState } from 'react';
import LayoutMaestroFormulario from '../../../templates/LayoutMaestroFormulario/LayoutMaestroFormulario.jsx';
import LayoutMaestroBasico from '../../../templates/LayoutMaestroBasico/LayoutMaestroBasico.jsx';
import FormRow from '../../../components/FormRow/FormRow.jsx';
import TextField from '../../../components/TextField/TextField.jsx';
import Select from '../../../components/Select/Select.jsx';
import Checkbox from '../../../components/Checkbox/Checkbox.jsx';
import Modal from '../../../components/Modal/Modal.jsx';
import ActionGroup from '../../../components/ActionGroup/ActionGroup.jsx';
import { OPERACIONES_SIDEBAR_PROPS } from '../../../config/sidebars/operaciones.js';
import styles from './EsquemaHorarioFormulario.module.css';

const HREF = '/esquema-de-horarios';
const CATEGORIAS_HREF = '/categoria-de-horarios';
const VERBS = { create: 'Crear', view: 'Visualizar', edit: 'Editar' };
const DIAS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map((d) => ({ value: d, label: d }));

// Maestro "Esquema de horarios" (Ports). Template M-04a · cabecera + grilla: una
// Form Section (código, denominación, categoría de horario de feriados, checks
// Feriados e Inactivo) y UNA colección hija (los tramos horarios: día, inicio,
// fin y categoría) como Child Grid Section. El original la mostraba en una
// segunda tab ("GeneralData | Esquema de horarios"): con una sola colección
// hija el kit no usa tabs. Las categorías salen del maestro Categoría de
// horarios. Supuestos: Código y Denominación obligatorios; fin posterior al
// inicio. Los rótulos en inglés del original ("Holydays", "HolidaysScheduleCategory")
// se tradujeron a "Feriados" y "Categoría de horario de feriados".
export default function EsquemaHorarioFormulario({ truckshiftRows = {}, onSaveTruckshift, onNavigate, onSearch, params = {}, mode = 'create' }) {
  const rows = truckshiftRows[HREF] ?? [];
  const categorias = truckshiftRows[CATEGORIAS_HREF] ?? [];
  const isView = mode === 'view';
  const isEdit = mode === 'edit';
  const existing = mode !== 'create' ? rows.find((r) => String(r.id) === String(params.id)) : null;
  const navigate = onNavigate ?? ((d) => console.log('navigate', d));

  const [values, setValues] = useState({ codigo: existing?.codigo ?? '', denominacion: existing?.denominacion ?? '', categoriaFeriados: '', ...(existing?.values ?? {}) });
  const [feriados, setFeriados] = useState(existing?.feriados ?? false);
  const [inactivo, setInactivo] = useState(existing?.estado?.label === 'Inactivo');
  const [tramos, setTramos] = useState(existing?.tramos ?? []); // { id, dia, inicio, fin, categoriaId }
  const [errors, setErrors] = useState({});
  const [modal, setModal] = useState(null);

  const common = {
    sidebar: OPERACIONES_SIDEBAR_PROPS,
    activeHref: HREF,
    onNavigate: navigate,
    onSearch,
    onCompanyChange: (c) => console.log('company change', c),
    onLogout: () => console.log('logout'),
    onToggle: (d) => console.log('toggle', d),
  };
  const goList = () => navigate({ href: HREF, label: 'Esquema de horarios' });

  if (mode !== 'create' && !existing) {
    return (
      <LayoutMaestroBasico {...common} breadcrumb={[{ label: 'Esquema de horarios' }]} title="Registro no encontrado" onCancel={goList} cancelLabel="Volver" formTitle="Datos generales">
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
      id: existing?.id ?? Date.now(),
      codigo,
      denominacion: values.denominacion.trim(),
      estado: inactivo ? { label: 'Inactivo', type: 'neutral' } : { label: 'Activo', type: 'success' },
      values: { ...values, codigo, denominacion: values.denominacion.trim() },
      feriados,
      tramos,
    }, isEdit);
  }

  const categoriaLabel = (id) => categorias.find((c) => c.id === id)?.denominacion ?? '—';
  const categoriaOptions = categorias.map((c) => ({ value: String(c.id), label: `${c.codigo} · ${c.denominacion}` }));

  function saveModal() {
    if (!modal.dia) return setModal({ ...modal, error: 'Elegí un día' });
    if (!modal.inicio || !modal.fin) return setModal({ ...modal, error: 'Completá el inicio y el fin' });
    if (modal.fin <= modal.inicio) return setModal({ ...modal, error: 'El fin debe ser posterior al inicio' });
    const item = { id: modal.id ?? Date.now(), dia: modal.dia, inicio: modal.inicio, fin: modal.fin, categoriaId: modal.categoriaId ? Number(modal.categoriaId) : '' };
    setTramos((prev) => (modal.id ? prev.map((t) => (t.id === modal.id ? item : t)) : [...prev, item]));
    setModal(null);
  }

  return (
    <>
      <LayoutMaestroFormulario
        template="M-04a"
        {...common}
        breadcrumb={[{ label: 'Esquema de horarios' }, { label: mode === 'create' ? 'Crear' : `${VERBS[mode]} Esquema de horarios` }]}
        title={`${VERBS[mode]} Esquema de horarios`}
        onSave={isView ? undefined : handleSave}
        onCancel={goList}
        cancelLabel={isView ? 'Volver' : 'Cancelar'}
        blocks={[
          {
            type: 'form',
            title: 'Datos del esquema',
            children: (
              <>
                <FormRow>
                  <TextField label="Código *" value={values.codigo} onChange={(e) => set('codigo', e.target.value)} disabled={isView} error={Boolean(errors.codigo)} helperText={errors.codigo} />
                  <TextField label="Denominación *" value={values.denominacion} onChange={(e) => set('denominacion', e.target.value)} disabled={isView} error={Boolean(errors.denominacion)} helperText={errors.denominacion} />
                  <Select label="Categoría de horario de feriados" value={values.categoriaFeriados} onChange={(e) => set('categoriaFeriados', e.target.value)} options={categoriaOptions} placeholder="Seleccionar..." disabled={isView} />
                </FormRow>
                <Checkbox label="Feriados" checked={feriados} onChange={(e) => setFeriados(e.target.checked)} disabled={isView} />
                <Checkbox label="Inactivo" checked={inactivo} onChange={(e) => setInactivo(e.target.checked)} disabled={isView} />
              </>
            ),
          },
          {
            type: 'grid',
            title: 'Esquema de horarios',
            onAdd: isView ? undefined : () => setModal({ dia: '', inicio: '', fin: '', categoriaId: '', error: '' }),
            columns: [
              { key: 'dia', label: 'Día' },
              { key: 'inicio', label: 'Inicio', width: 140 },
              { key: 'fin', label: 'Fin', width: 140 },
              { key: 'categoriaId', label: 'Categoría de horario', render: (row) => <span>{row.categoriaId ? categoriaLabel(row.categoriaId) : '—'}</span> },
            ],
            rows: tramos,
            emptyMessage: 'Sin datos para mostrar.',
            actions: isView
              ? []
              : [
                  { key: 'edit', icon: 'icon-edit', label: 'Editar', onClick: (row) => setModal({ ...row, categoriaId: row.categoriaId ? String(row.categoriaId) : '', error: '' }) },
                  { key: 'delete', icon: 'bi-trash', label: 'Eliminar', onClick: (row) => setTramos((prev) => prev.filter((t) => t.id !== row.id)) },
                ],
          },
        ]}
      />
      <Modal
        open={Boolean(modal)}
        title={modal?.id ? 'Editar horario' : 'Agregar horario'}
        onClose={() => setModal(null)}
        footer={
          <ActionGroup
            aria-label="Acciones del diálogo"
            primary={{ label: modal?.id ? 'Guardar' : 'Agregar', onClick: saveModal }}
            secondary={[{ label: 'Cancelar', onClick: () => setModal(null) }]}
          />
        }
      >
        {modal && (
          <div className={styles.modalFields}>
            <Select label="Día *" value={modal.dia} onChange={(e) => setModal({ ...modal, dia: e.target.value, error: '' })} options={DIAS} placeholder="Seleccionar día..." />
            <TextField label="Inicio *" type="time" value={modal.inicio} onChange={(e) => setModal({ ...modal, inicio: e.target.value, error: '' })} />
            <TextField label="Fin *" type="time" value={modal.fin} onChange={(e) => setModal({ ...modal, fin: e.target.value, error: '' })} error={Boolean(modal.error)} helperText={modal.error} />
            <Select label="Categoría de horario" value={modal.categoriaId} onChange={(e) => setModal({ ...modal, categoriaId: e.target.value })} options={categoriaOptions} placeholder="Seleccionar categoría..." />
          </div>
        )}
      </Modal>
    </>
  );
}
