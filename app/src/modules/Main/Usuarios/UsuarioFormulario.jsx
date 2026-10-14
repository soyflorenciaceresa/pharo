import { useState } from 'react';
import LayoutMaestroBasico from '../../../templates/LayoutMaestroBasico/LayoutMaestroBasico.jsx';
import LayoutMaestroFormulario from '../../../templates/LayoutMaestroFormulario/LayoutMaestroFormulario.jsx';
import FormContainer from '../../../components/FormContainer/FormContainer.jsx';
import TextField from '../../../components/TextField/TextField.jsx';
import Select from '../../../components/Select/Select.jsx';
import Checkbox from '../../../components/Checkbox/Checkbox.jsx';
import CheckboxList from '../../../components/CheckboxList/CheckboxList.jsx';
import { MAIN_SIDEBAR_PROPS } from '../../../config/sidebars/main.js';
import { PERFILES } from '../../../config/perfiles.js';
import { ROLES } from '../../../config/roles.js';
import styles from './UsuarioFormulario.module.css';

const TITLES = {
  create: 'Crear Usuario',
  view: 'Visualizar Usuario',
  edit: 'Editar Usuario',
};

const TIPOS_AUTENTICACION = [
  { value: 'local', label: 'Local (usuario y contraseña)' },
  { value: 'ldap', label: 'LDAP / Active Directory' },
  { value: 'sso', label: 'SSO (Single Sign-On)' },
];

// Catálogo de empresas para el tab "Empresas" — reusa las mismas 3 empresas
// del selector de empresa del Sidebar (config/sidebars/main.js), no un
// catálogo propio: son literalmente las mismas empresas del sistema.
const EMPRESAS = MAIN_SIDEBAR_PROPS.companies.map((c) => ({ id: c.id, label: c.name }));

export default function UsuarioFormulario({ onNavigate, onSearch, usuarios = [], onCreateUsuario, onUpdateUsuario, params = {}, mode = 'create' }) {
  const isView = mode === 'view';
  const isEdit = mode === 'edit';
  const existing = mode !== 'create' ? usuarios.find((u) => String(u.id) === String(params.id)) : null;

  const navigate = onNavigate ?? ((d) => console.log('navigate', d));

  const [nombreApellido, setNombreApellido] = useState(existing?.nombreApellido ?? '');
  const [correo, setCorreo] = useState(existing?.correo ?? '');
  const [telefono, setTelefono] = useState(existing?.telefono ?? '');
  const [usuario, setUsuario] = useState(existing?.usuario ?? '');
  const [tipoAutenticacion, setTipoAutenticacion] = useState(existing?.tipoAutenticacion ?? '');
  const [inactivo, setInactivo] = useState(existing ? !existing.activo : false);
  const [bloqueado, setBloqueado] = useState(existing?.bloqueado ?? false);
  const [empresaIds, setEmpresaIds] = useState(existing?.empresaIds ?? []);
  const [perfilIds, setPerfilIds] = useState(existing?.perfilIds ?? []);
  const [rolIds, setRolIds] = useState(existing?.rolIds ?? []);
  const [errors, setErrors] = useState({});

  function handleCancel() {
    navigate({ href: '/admin/usuarios', label: 'Usuarios' });
  }

  // Si se pide ver/editar un usuario que no existe (ej. URL directa con un id
  // inválido), se muestra el mismo shell sin formulario en vez de romper —
  // mismo criterio que BuqueFormulario.
  if (mode !== 'create' && !existing) {
    return (
      <LayoutMaestroBasico
        sidebar={MAIN_SIDEBAR_PROPS}
        activeHref="/admin/usuarios"
        onNavigate={navigate}
        onSearch={onSearch}
        onCompanyChange={(c) => console.log('company change', c)}
        onLogout={() => console.log('logout')}
        onToggle={(d) => console.log('toggle', d)}
        breadcrumb={[{ label: 'Usuarios' }]}
        title="Usuario no encontrado"
        onCancel={handleCancel}
        cancelLabel="Volver"
      >
        <FormContainer title="Datos personales">
          <p className={styles.notFound}>No se encontró el usuario solicitado.</p>
        </FormContainer>
      </LayoutMaestroBasico>
    );
  }

  function updateField(setter, key) {
    return (e) => {
      setter(e.target.value);
      if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
    };
  }

  function handleSave() {
    const nextErrors = {};
    if (!nombreApellido.trim()) nextErrors.nombreApellido = 'Campo requerido';
    if (!correo.trim()) nextErrors.correo = 'Campo requerido';
    if (!usuario.trim()) nextErrors.usuario = 'Campo requerido';
    if (!tipoAutenticacion) nextErrors.tipoAutenticacion = 'Campo requerido';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const usuarioRow = {
      id: existing?.id ?? Date.now(),
      nombreApellido: nombreApellido.trim(),
      correo: correo.trim(),
      telefono: telefono.trim(),
      usuario: usuario.trim(),
      tipoAutenticacion,
      activo: !inactivo,
      bloqueado,
      empresaIds,
      perfilIds,
      rolIds,
    };

    if (isEdit) onUpdateUsuario?.(usuarioRow);
    else onCreateUsuario?.(usuarioRow);
  }

  // Template M-04b (cabecera + tabs de formularios): "Datos personales" y
  // "Credenciales y estado" son la cabecera fija; Empresas/Perfiles/Roles son
  // las tabs, cada una con una Form Section que lleva su CheckboxList.
  const personales = {
    type: 'form',
    title: 'Datos personales',
    children: (
      <div className={styles.fieldsRow}>
        <div className={styles.field}>
          <TextField
            label="Nombre y apellido"
            value={nombreApellido}
            onChange={updateField(setNombreApellido, 'nombreApellido')}
            disabled={isView}
            error={Boolean(errors.nombreApellido)}
            helperText={errors.nombreApellido}
          />
        </div>
        <div className={styles.field}>
          <TextField
            label="Correo electrónico"
            type="email"
            value={correo}
            onChange={updateField(setCorreo, 'correo')}
            disabled={isView}
            error={Boolean(errors.correo)}
            helperText={errors.correo}
          />
        </div>
        <div className={styles.field}>
          <TextField label="Teléfono" value={telefono} onChange={(e) => setTelefono(e.target.value)} disabled={isView} />
        </div>
      </div>
    ),
  };

  const credenciales = {
    type: 'form',
    title: 'Credenciales y estado',
    children: (
      <>
        <div className={styles.fieldsRow}>
          <div className={styles.field}>
            <TextField
              label="Usuario"
              value={usuario}
              onChange={updateField(setUsuario, 'usuario')}
              disabled={isView}
              error={Boolean(errors.usuario)}
              helperText={errors.usuario}
            />
          </div>
          <div className={styles.field}>
            <Select
              label="Tipo de autenticación"
              value={tipoAutenticacion}
              onChange={updateField(setTipoAutenticacion, 'tipoAutenticacion')}
              options={TIPOS_AUTENTICACION}
              disabled={isView}
              error={Boolean(errors.tipoAutenticacion)}
              helperText={errors.tipoAutenticacion}
            />
          </div>
        </div>
        <div className={styles.checksRow}>
          <Checkbox label="Usuario inactivo" checked={inactivo} onChange={(e) => setInactivo(e.target.checked)} disabled={isView} />
          <Checkbox label="Bloqueado" checked={bloqueado} onChange={(e) => setBloqueado(e.target.checked)} disabled={isView} />
        </div>
      </>
    ),
  };

  const accessForm = (items, selectedIds, onChange, searchPlaceholder) => ({
    type: 'form',
    title: 'Accesos y permisos',
    children: (
      <CheckboxList
        items={items}
        selectedIds={selectedIds}
        onChange={onChange}
        searchPlaceholder={searchPlaceholder}
        disabled={isView}
      />
    ),
  });

  return (
    <LayoutMaestroFormulario
      template="M-04b"
      sidebar={MAIN_SIDEBAR_PROPS}
      activeHref="/admin/usuarios"
      onNavigate={navigate}
      onSearch={onSearch}
      onCompanyChange={(c) => console.log('company change', c)}
      onLogout={() => console.log('logout')}
      onToggle={(d) => console.log('toggle', d)}
      breadcrumb={[{ label: 'Usuarios' }, { label: mode === 'create' ? 'Crear' : TITLES[mode] }]}
      title={TITLES[mode]}
      onSave={isView ? undefined : handleSave}
      onCancel={handleCancel}
      cancelLabel={isView ? 'Volver' : 'Cancelar'}
      blocks={[personales, credenciales]}
      tabs={[
        { id: 'empresas', label: 'Empresas', blocks: [accessForm(EMPRESAS, empresaIds, setEmpresaIds, 'Buscar empresa...')] },
        { id: 'perfiles', label: 'Perfiles', blocks: [accessForm(PERFILES, perfilIds, setPerfilIds, 'Buscar perfil...')] },
        { id: 'roles', label: 'Roles', blocks: [accessForm(ROLES, rolIds, setRolIds, 'Buscar rol...')] },
      ]}
    />
  );
}
