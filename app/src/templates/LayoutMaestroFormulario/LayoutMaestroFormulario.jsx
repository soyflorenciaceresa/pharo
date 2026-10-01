import { useState } from 'react';
import LayoutBase from '../LayoutBase/LayoutBase.jsx';
import PageHeader from '../../components/PageHeader/PageHeader.jsx';
import FormContainer from '../../components/FormContainer/FormContainer.jsx';
import ChildGridSection from '../../components/ChildGridSection/ChildGridSection.jsx';
import Accordion from '../../components/Accordion/Accordion.jsx';
import Tabs from '../../components/Tabs/Tabs.jsx';
import styles from './LayoutMaestroFormulario.module.css';

// Un único template para los formularios de Maestros (Figma, páginas
// "Templates"/"Maestros": M-01, M-02, M-03, M-04a/b/c — numeración vigente
// desde la actualización del 30/09/2026). La pantalla elige el patrón con
// `template` y le carga sus datos:
//
//   blocks → piezas apiladas. Si hay `tabs`, son la cabecera (siempre visible).
//   tabs   → [{ id, label, blocks }] — UNA sola fila de tabs por pantalla.
//
// Cada bloque es:
//   { type: 'form', title, children }                      → Form Section
//   { type: 'grid', title, columns, rows, actions, onAdd } → Child Grid Section
//   { type: 'accordion', title, children, defaultExpanded } → Accordion
//        (bloque opcional/secundario, SOLO con información no obligatoria; va
//        AL FINAL, colapsado por defecto, con título que diga "(opcional)".
//        Se puede usar en TODOS los templates, 1–2 por pantalla)
//
// Qué acepta cada template (las reglas salen de los frames Spec de Figma; si
// la pantalla las rompe, en desarrollo se avisa por consola, pero se renderiza
// igual):
// (en todos, además: 0–2 accordion al final de `blocks`)
//   M-01  blocks: 1 form                                  sin tabs
//   M-02  blocks: 2+ forms                                sin tabs
//   M-03  sin forms en blocks; tabs (≥2), una form por tab
//   M-04a blocks: forms + grid al final                   sin tabs
//   M-04b blocks: forms (cabecera); tabs (≥2) con forms
//   M-04c blocks: forms (cabecera); tabs (≥2) con grid
// El catálogo con "cuándo usar / cuándo no" y las reglas de composición está
// en `templates/maestros.js`. El Listado NO va acá: es `LayoutMaestroDataGrid`.
const RULES = {
  'M-01': { blocks: 'required', tabs: 'none', exactForms: 1, grid: 'none' },
  'M-02': { blocks: 'required', tabs: 'none', minForms: 2, grid: 'none' },
  'M-03': { blocks: 'none', tabs: 'required', grid: 'none', oneFormPerTab: true },
  'M-04a': { blocks: 'required', tabs: 'none', grid: 'last' },
  'M-04b': { blocks: 'required', tabs: 'required', grid: 'none' },
  'M-04c': { blocks: 'required', tabs: 'required', grid: 'inTabs' },
};

// Accordion: permitido en todos los templates (siempre que no contenga
// información obligatoria — eso no se puede validar desde acá, es criterio de
// la pantalla). Va al final, colapsado, máximo 2.
const MAX_ACCORDIONS = 2;

function validate(template, blocks, tabs) {
  const rule = RULES[template];
  if (!rule) return [`template "${template}" no existe. Opciones: ${Object.keys(RULES).join(', ')}.`];
  const problems = [];
  const accordions = blocks.filter((b) => b.type === 'accordion');
  const grids = blocks.filter((b) => b.type === 'grid');
  const forms = blocks.filter((b) => b.type !== 'grid' && b.type !== 'accordion');
  const tabBlocks = tabs.flatMap((t) => t.blocks ?? []);

  if (rule.blocks === 'none' && blocks.some((b) => b.type !== 'accordion')) problems.push('no usa `blocks`, todo va dentro de `tabs`.');
  if (rule.blocks === 'required' && !blocks.some((b) => b.type !== 'accordion')) problems.push('requiere `blocks`.');
  if (rule.tabs === 'none' && tabs.length) problems.push('no admite `tabs`.');
  if (rule.tabs === 'required' && tabs.length < 2) problems.push('una sola tab no tiene sentido: usá M-01/M-02 (mínimo 2 tabs).');
  if (rule.exactForms && forms.length !== rule.exactForms) problems.push(`lleva exactamente ${rule.exactForms} Form Section; con varios grupos usá M-02.`);
  if (rule.minForms && forms.length < rule.minForms) problems.push(`lleva ${rule.minForms} o más Form Section; con una sola usá M-01.`);
  if (rule.oneFormPerTab && tabs.some((t) => (t.blocks ?? []).filter((b) => b.type === 'form').length !== 1)) problems.push('lleva una Form Section por cada tab.');
  if (rule.grid === 'none' && (grids.length || tabBlocks.some((b) => b.type === 'grid'))) problems.push('no admite Child Grid Section (usá M-04).');
  if (rule.grid === 'last' && (!grids.length || blocks.filter((b) => b.type !== 'accordion').at(-1)?.type !== 'grid')) problems.push('la Child Grid Section va al final, después de las Form Section.');
  if (rule.grid === 'inTabs' && (grids.length || tabs.some((t) => !(t.blocks ?? []).some((b) => b.type === 'grid')))) problems.push('cada tab lleva una Child Grid Section (M-04b es para tabs con formularios).');

  if (tabBlocks.some((b) => b.type === 'accordion')) problems.push('el Accordion va al final de la pantalla, no dentro de una tab.');
  const firstAcc = blocks.findIndex((b) => b.type === 'accordion');
  if (firstAcc !== -1 && blocks.slice(firstAcc).some((b) => b.type !== 'accordion')) problems.push('el Accordion va al final de la pantalla, después de las demás piezas.');
  if (accordions.length > MAX_ACCORDIONS) problems.push(`máximo ${MAX_ACCORDIONS} Accordion por pantalla; con más grupos de peso parecido usá M-03. [Supuesto — validar]`);
  if (accordions.some((b) => b.defaultExpanded)) problems.push('el Accordion va colapsado por defecto.');
  return problems;
}

function renderBlock(block, key) {
  if (block.type === 'accordion') {
    return (
      <Accordion key={key} title={block.title} defaultExpanded={block.defaultExpanded ?? false} onToggle={block.onToggle}>
        {block.children}
      </Accordion>
    );
  }
  if (block.type === 'grid') {
    return (
      <ChildGridSection
        key={key}
        title={block.title}
        addLabel={block.addLabel}
        onAdd={block.onAdd}
        columns={block.columns}
        rows={block.rows}
        actions={block.actions}
        searchable={block.searchable}
        emptyMessage={block.emptyMessage}
      />
    );
  }
  return (
    <FormContainer key={key} title={block.title}>
      {block.children}
    </FormContainer>
  );
}

export default function LayoutMaestroFormulario({
  template,
  sidebar,
  activeHref,
  onNavigate,
  onCompanyChange,
  onLogout,
  onToggle,
  onSearch,
  breadcrumb = [],
  title,
  onSave,
  saveLabel = 'Guardar',
  onCancel,
  cancelLabel = 'Cancelar',
  blocks = [],
  tabs = [],
  defaultTab,
  onTabChange,
}) {
  const [activeTab, setActiveTab] = useState(defaultTab ?? tabs[0]?.id);

  if (import.meta.env.DEV) {
    validate(template, blocks, tabs).forEach((p) => console.warn(`LayoutMaestroFormulario ${template}: ${p}`));
  }

  function handleTabChange(id) {
    setActiveTab(id);
    onTabChange?.(id);
  }

  const current = tabs.find((t) => t.id === activeTab) ?? tabs[0];

  return (
    <LayoutBase onSearch={onSearch} sidebarProps={{ ...sidebar, defaultActiveHref: activeHref, onNavigate, onCompanyChange, onLogout, onToggle }}>
      <div className={styles.root} data-template={template}>
        <PageHeader
          type="form"
          title={title}
          breadcrumb={breadcrumb}
          actions={{
            label: 'Acciones del formulario',
            primary: onSave ? { label: saveLabel, iconStart: 'icon-check2', onClick: onSave } : undefined,
            secondary: onCancel ? [{ label: cancelLabel, iconStart: 'icon-close', onClick: onCancel }] : [],
          }}
        />

        {blocks.filter((b) => b.type !== 'accordion').map((block, i) => renderBlock(block, `b${i}`))}

        {tabs.length > 0 && (
          <>
            <div className={styles.tabs}>
              <Tabs items={tabs.map(({ id, label }) => ({ id, label }))} value={current?.id} onChange={handleTabChange} />
            </div>
            {(current?.blocks ?? []).map((block, i) => renderBlock(block, `${current.id}-${i}`))}
          </>
        )}

        {/* El Accordion (bloque opcional) siempre va al final de la pantalla, después de las tabs. */}
        {blocks.filter((b) => b.type === 'accordion').map((block, i) => renderBlock(block, `a${i}`))}
      </div>
    </LayoutBase>
  );
}
