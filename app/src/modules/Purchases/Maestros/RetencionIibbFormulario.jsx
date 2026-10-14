import { useState } from 'react';
import LayoutMaestroFormulario from '../../../templates/LayoutMaestroFormulario/LayoutMaestroFormulario.jsx';
import LayoutMaestroBasico from '../../../templates/LayoutMaestroBasico/LayoutMaestroBasico.jsx';
import FormRow from '../../../components/FormRow/FormRow.jsx';
import Select from '../../../components/Select/Select.jsx';
import Checkbox from '../../../components/Checkbox/Checkbox.jsx';
import Badge from '../../../components/Badge/Badge.jsx';
import Modal from '../../../components/Modal/Modal.jsx';
import ActionGroup from '../../../components/ActionGroup/ActionGroup.jsx';
import { PURCHASES_SIDEBAR_PROPS } from '../../../config/sidebars/purchases.js';
import { PROVEEDORES_OPT } from '../../../config/purchasesMaestros.js';
import styles from './RetencionIibbFormulario.module.css';

const DEFAULTS = {
  maestro: { href: '/purchases/retenciones-de-iibb', label: 'Retenciones de IIBB' },
  sidebar: PURCHASES_SIDEBAR_PROPS,
  party: { label: 'Proveedor', options: PROVEEDORES_OPT },
  zonasHref: '/purchases/zonas-de-entrega-retiro',
  categoriasHref: '/purchases/categorias-de-retenciones',
};
const VERBS = { create: 'Crear', view: 'Visualizar', edit: 'Editar' };
const yesNo = (v) => <Badge type={v ? 'success' : 'neutral'} showDot={false}>{v ? 'Sí' : 'No'}</Badge>;

// Maestros "Retenciones de IIBB" (Purchases) y "Percepciones" (Billing; party = Cliente, ver props). Template M-04a · cabecera +
// grilla: el proveedor arriba y UNA colección hija, las Zonas de entrega/retiro
// del proveedor (con Principal, Activo y Categorías), como Child Grid Section.
// Las filas se agregan/editan en Modal. Zonas y categorías salen de esos
// maestros. Una sola zona puede ser principal. Supuesto: Proveedor obligatorio.
// Para la grilla estándar: Código = código del proveedor, Denominación = su nombre.
export default function RetencionIibbFormulario({ maestro = DEFAULTS.maestro, sidebar = DEFAULTS.sidebar, party = DEFAULTS.party, zonasHref = DEFAULTS.zonasHref, categoriasHref = DEFAULTS.categoriasHref, truckshiftRows = {}, onSaveTruckshift, onNavigate, onSearch, params = {}, mode = 'create' }) {
  const HREF = maestro.href;
  const rows = truckshiftRows[HREF] ?? [];
  const zonasCatalogo = truckshiftRows[zonasHref] ?? [];
  const categoriasCatalogo = truckshiftRows[categoriasHref] ?? [];
  const isView = mode === 'view';
  const isEdit = mode === 'edit';
  const existing = mode !== 'create' ? rows.find((r) => String(r.id) === String(params.id)) : null;
  const navigate = onNavigate ?? ((d) => console.log('navigate', d));

  const [proveedor, setProveedor] = useState(existing?.proveedor ?? '');
  const [zonas, setZonas] = useState(existing?.zonas ?? []); // { id, zonaId, principal, activo, categoriaIds }
  const [error, setError] = useState('');
  const [modal, setModal] = useState(null);

  const common = {
    sidebar,
    activeHref: HREF,
    onNavigate: navigate,
    onSearch,
    onCompanyChange: (c) => console.log('company change', c),
    onLogout: () => console.log('logout'),
    onToggle: (d) => console.log('toggle', d),
  };
  const goList = () => navigate({ href: HREF, label: maestro.label });

  if (mode !== 'create' && !existing) {
    return (
      <LayoutMaestroBasico {...common} breadcrumb={[{ label: maestro.label }]} title="Registro no encontrado" onCancel={goList} cancelLabel="Volver" formTitle="Datos generales">
        <p className={styles.notFound}>No se encontró el registro solicitado.</p>
      </LayoutMaestroBasico>
    );
  }

  function handleSave() {
    if (!proveedor) return setError('Campo requerido');
    if (rows.some((r) => r.proveedor === proveedor && r.id !== existing?.id)) return setError('Ya existe un registro para este valor');
    const [codigo, nombre] = proveedor.split(' · ');
    onSaveTruckshift?.(HREF, {
      id: existing?.id ?? Date.now(),
      codigo,
      denominacion: nombre,
      estado: zonas.some((z) => z.activo) || zonas.length === 0 ? { label: 'Activo', type: 'success' } : { label: 'Inactivo', type: 'neutral' },
      proveedor,
      zonas,
      values: { proveedor },
    }, isEdit);
  }

  const zonaLabel = (id) => zonasCatalogo.find((z) => z.id === id)?.denominacion ?? '—';
  const categoriasLabel = (ids) => ids.map((id) => categoriasCatalogo.find((c) => c.id === id)?.denominacion).filter(Boolean).join(', ') || '—';

  function saveModal() {
    if (!modal.zonaId) return setModal({ ...modal, error: 'Elegí una zona' });
    if (zonas.some((z) => z.zonaId === modal.zonaId && z.id !== modal.id)) return setModal({ ...modal, error: 'Esa zona ya está cargada' });
    const item = { id: modal.id ?? Date.now(), zonaId: modal.zonaId, principal: modal.principal, activo: modal.activo, categoriaIds: modal.categoriaIds };
    setZonas((prev) => {
      const base = modal.id ? prev.map((z) => (z.id === modal.id ? item : z)) : [...prev, item];
      return item.principal ? base.map((z) => (z.id === item.id ? z : { ...z, principal: false })) : base;
    });
    setModal(null);
  }

  const toggleCategoria = (id) =>
    setModal((m) => ({ ...m, categoriaIds: m.categoriaIds.includes(id) ? m.categoriaIds.filter((x) => x !== id) : [...m.categoriaIds, id] }));

  return (
    <>
      <LayoutMaestroFormulario
        template="M-04a"
        {...common}
        breadcrumb={[{ label: maestro.label }, { label: mode === 'create' ? 'Crear' : `${VERBS[mode]} ${maestro.label}` }]}
        title={`${VERBS[mode]} ${maestro.label}`}
        onSave={isView ? undefined : handleSave}
        onCancel={goList}
        cancelLabel={isView ? 'Volver' : 'Cancelar'}
        blocks={[
          {
            type: 'form',
            title: `Datos del ${party.label.toLowerCase()}`,
            children: (
              <FormRow columns={2}>
                <Select label={`${party.label} *`} value={proveedor} onChange={(e) => { setProveedor(e.target.value); setError(''); }} options={party.options} placeholder="Seleccionar..." disabled={isView} error={Boolean(error)} helperText={error} />
              </FormRow>
            ),
          },
          {
            type: 'grid',
            title: 'Zonas de entrega/retiro',
            onAdd: isView ? undefined : () => setModal({ zonaId: '', principal: false, activo: true, categoriaIds: [], error: '' }),
            columns: [
              { key: 'zonaId', label: 'Zona de entrega/retiro', render: (row) => <span>{zonaLabel(row.zonaId)}</span> },
              { key: 'principal', label: 'Principal', width: 120, render: (row) => yesNo(row.principal) },
              { key: 'activo', label: 'Activo', width: 120, render: (row) => yesNo(row.activo) },
              { key: 'categorias', label: 'Categorías', render: (row) => <span>{categoriasLabel(row.categoriaIds)}</span> },
            ],
            rows: zonas,
            emptyMessage: 'Sin datos para mostrar.',
            actions: isView
              ? []
              : [
                  { key: 'edit', icon: 'icon-edit', label: 'Editar', onClick: (row) => setModal({ ...row, error: '' }) },
                  { key: 'delete', icon: 'bi-trash', label: 'Eliminar', onClick: (row) => setZonas((prev) => prev.filter((z) => z.id !== row.id)) },
                ],
          },
        ]}
      />
      <Modal
        open={Boolean(modal)}
        title={modal?.id ? 'Editar zona de entrega/retiro' : 'Agregar zona de entrega/retiro'}
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
            <Select
              label="Zona de entrega/retiro *"
              value={modal.zonaId === '' ? '' : String(modal.zonaId)}
              onChange={(e) => setModal({ ...modal, zonaId: Number(e.target.value), error: '' })}
              options={zonasCatalogo.map((z) => ({ value: String(z.id), label: `${z.codigo} · ${z.denominacion}` }))}
              placeholder="Seleccionar zona..."
              error={Boolean(modal.error)}
              helperText={modal.error}
            />
            <Checkbox label="Principal" checked={modal.principal} onChange={(e) => setModal({ ...modal, principal: e.target.checked })} />
            <Checkbox label="Activo" checked={modal.activo} onChange={(e) => setModal({ ...modal, activo: e.target.checked })} />
            <span className={styles.checksTitle}>Categorías</span>
            {categoriasCatalogo.map((c) => (
              <Checkbox key={c.id} label={c.denominacion} checked={modal.categoriaIds.includes(c.id)} onChange={() => toggleCategoria(c.id)} />
            ))}
          </div>
        )}
      </Modal>
    </>
  );
}
