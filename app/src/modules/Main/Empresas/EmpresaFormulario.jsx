import { useState } from 'react';
import LayoutMaestroBasico from '../../../templates/LayoutMaestroBasico/LayoutMaestroBasico.jsx';
import FormContainer from '../../../components/FormContainer/FormContainer.jsx';
import Accordion from '../../../components/Accordion/Accordion.jsx';
import TextField from '../../../components/TextField/TextField.jsx';
import Select from '../../../components/Select/Select.jsx';
import Checkbox from '../../../components/Checkbox/Checkbox.jsx';
import FileUpload from '../../../components/FileUpload/FileUpload.jsx';
import { MAIN_SIDEBAR_PROPS } from '../../../config/sidebars/main.js';
import styles from './EmpresaFormulario.module.css';

const TITLES = {
  create: 'Crear Empresa',
  view: 'Visualizar Empresa',
  edit: 'Editar Empresa',
};

const PAISES = [
  { value: 'AR', label: 'Argentina' },
  { value: 'UY', label: 'Uruguay' },
  { value: 'PY', label: 'Paraguay' },
  { value: 'BR', label: 'Brasil' },
  { value: 'CL', label: 'Chile' },
];

const ZONAS_HORARIAS = [
  { value: 'america-argentina-buenos_aires', label: 'América/Argentina/Buenos Aires (GMT-3)' },
  { value: 'america-sao_paulo', label: 'América/São Paulo (GMT-3)' },
  { value: 'america-asuncion', label: 'América/Asunción (GMT-4)' },
  { value: 'america-montevideo', label: 'América/Montevideo (GMT-3)' },
  { value: 'america-santiago', label: 'América/Santiago (GMT-4)' },
];

export default function EmpresaFormulario({ onNavigate, onSearch, empresas = [], onCreateEmpresa, onUpdateEmpresa, params = {}, mode = 'create' }) {
  const isView = mode === 'view';
  const isEdit = mode === 'edit';
  const existing = mode !== 'create' ? empresas.find((e) => String(e.id) === String(params.id)) : null;

  const navigate = onNavigate ?? ((d) => console.log('navigate', d));

  // Datos de la empresa
  const [codigo, setCodigo] = useState(existing?.codigo ?? '');
  const [nombreLegal, setNombreLegal] = useState(existing?.nombreLegal ?? '');
  const [nombreComercial, setNombreComercial] = useState(existing?.nombreComercial ?? '');
  const [inactivo, setInactivo] = useState(existing ? !existing.activo : false);

  // Datos fiscales
  const [identificacionFiscal, setIdentificacionFiscal] = useState(existing?.identificacionFiscal ?? '');
  const [ingresosBrutos, setIngresosBrutos] = useState(existing?.ingresosBrutos ?? '');
  const [fechaInicioActividad, setFechaInicioActividad] = useState(existing?.fechaInicioActividad ?? '');

  // Domicilio y contacto
  const [pais, setPais] = useState(existing?.pais ?? '');
  const [cp, setCp] = useState(existing?.cp ?? '');
  const [localidad, setLocalidad] = useState(existing?.localidad ?? '');
  const [domicilio, setDomicilio] = useState(existing?.domicilio ?? '');
  const [zonaHoraria, setZonaHoraria] = useState(existing?.zonaHoraria ?? '');
  const [telefono, setTelefono] = useState(existing?.telefono ?? '');
  const [email, setEmail] = useState(existing?.email ?? '');

  // Certificados y documentos
  const [logoFileName, setLogoFileName] = useState(existing?.logoFileName ?? '');
  const [certificadoAfipFileName, setCertificadoAfipFileName] = useState(existing?.certificadoAfipFileName ?? '');
  const [tieneClaveCertificado, setTieneClaveCertificado] = useState(existing?.tieneClaveCertificado ?? false);
  const [claveCertificado, setClaveCertificado] = useState(existing?.claveCertificado ?? '');

  const [errors, setErrors] = useState({});

  function handleCancel() {
    navigate({ href: '/admin/empresas', label: 'Empresas' });
  }

  // Si se pide ver/editar una empresa que no existe (ej. URL directa con un
  // id inválido), se muestra el mismo shell sin formulario en vez de romper
  // — mismo criterio que BuqueFormulario/UsuarioFormulario/PerfilFormulario.
  if (mode !== 'create' && !existing) {
    return (
      <LayoutMaestroBasico
        sidebar={MAIN_SIDEBAR_PROPS}
        activeHref="/admin/empresas"
        onNavigate={navigate}
        onSearch={onSearch}
        onCompanyChange={(c) => console.log('company change', c)}
        onLogout={() => console.log('logout')}
        onToggle={(d) => console.log('toggle', d)}
        breadcrumb={[{ label: 'Empresas' }]}
        title="Empresa no encontrada"
        onCancel={handleCancel}
        cancelLabel="Volver"
      >
        <FormContainer title="Datos de la empresa">
          <p className={styles.notFound}>No se encontró la empresa solicitada.</p>
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
    if (!codigo.trim()) nextErrors.codigo = 'Campo requerido';
    if (!nombreLegal.trim()) nextErrors.nombreLegal = 'Campo requerido';
    if (!identificacionFiscal.trim()) nextErrors.identificacionFiscal = 'Campo requerido';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const empresa = {
      id: existing?.id ?? Date.now(),
      codigo: codigo.trim(),
      nombreLegal: nombreLegal.trim(),
      nombreComercial: nombreComercial.trim(),
      activo: !inactivo,
      identificacionFiscal: identificacionFiscal.trim(),
      ingresosBrutos: ingresosBrutos.trim(),
      fechaInicioActividad,
      pais,
      cp: cp.trim(),
      localidad: localidad.trim(),
      domicilio: domicilio.trim(),
      zonaHoraria,
      telefono: telefono.trim(),
      email: email.trim(),
      logoFileName,
      certificadoAfipFileName,
      tieneClaveCertificado,
      claveCertificado: tieneClaveCertificado ? claveCertificado : '',
    };

    if (isEdit) onUpdateEmpresa?.(empresa);
    else onCreateEmpresa?.(empresa);
  }

  return (
    <LayoutMaestroBasico
      sidebar={MAIN_SIDEBAR_PROPS}
      activeHref="/admin/empresas"
      onNavigate={navigate}
      onSearch={onSearch}
      onCompanyChange={(c) => console.log('company change', c)}
      onLogout={() => console.log('logout')}
      onToggle={(d) => console.log('toggle', d)}
      breadcrumb={[{ label: 'Empresas' }, { label: mode === 'create' ? 'Crear' : TITLES[mode] }]}
      title={TITLES[mode]}
      onSave={isView ? undefined : handleSave}
      onCancel={handleCancel}
      cancelLabel={isView ? 'Volver' : 'Cancelar'}
    >
      <FormContainer title="Datos de la empresa">
        <div className={styles.fieldsRow}>
          <div className={styles.field}>
            <TextField
              label="Código"
              value={codigo}
              onChange={updateField(setCodigo, 'codigo')}
              disabled={isView}
              error={Boolean(errors.codigo)}
              helperText={errors.codigo}
            />
          </div>
          <div className={styles.field}>
            <TextField
              label="Nombre legal"
              value={nombreLegal}
              onChange={updateField(setNombreLegal, 'nombreLegal')}
              disabled={isView}
              error={Boolean(errors.nombreLegal)}
              helperText={errors.nombreLegal}
            />
          </div>
          <div className={styles.field}>
            <TextField label="Nombre comercial" value={nombreComercial} onChange={(e) => setNombreComercial(e.target.value)} disabled={isView} />
          </div>
        </div>
        <Checkbox label="Inactivo" checked={inactivo} onChange={(e) => setInactivo(e.target.checked)} disabled={isView} />
      </FormContainer>

      <FormContainer title="Datos fiscales">
        <div className={styles.fieldsRow}>
          <div className={styles.field}>
            <TextField
              label="Número de identificación fiscal"
              value={identificacionFiscal}
              onChange={updateField(setIdentificacionFiscal, 'identificacionFiscal')}
              disabled={isView}
              error={Boolean(errors.identificacionFiscal)}
              helperText={errors.identificacionFiscal}
            />
          </div>
          <div className={styles.field}>
            <TextField label="Número de ingresos brutos" value={ingresosBrutos} onChange={(e) => setIngresosBrutos(e.target.value)} disabled={isView} />
          </div>
          <div className={styles.field}>
            <TextField
              label="Fecha de inicio de actividad"
              type="date"
              value={fechaInicioActividad}
              onChange={(e) => setFechaInicioActividad(e.target.value)}
              disabled={isView}
            />
          </div>
        </div>
      </FormContainer>

      <FormContainer title="Domicilio y contacto">
        <div className={styles.fieldsRow}>
          <div className={styles.field}>
            <Select label="País" value={pais} onChange={(e) => setPais(e.target.value)} options={PAISES} disabled={isView} />
          </div>
          <div className={styles.field}>
            <TextField label="CP" value={cp} onChange={(e) => setCp(e.target.value)} disabled={isView} />
          </div>
          <div className={styles.field}>
            <TextField label="Localidad" value={localidad} onChange={(e) => setLocalidad(e.target.value)} disabled={isView} />
          </div>
        </div>
        <TextField label="Domicilio" value={domicilio} onChange={(e) => setDomicilio(e.target.value)} disabled={isView} />
        <div className={styles.fieldsRow}>
          <div className={styles.field}>
            <Select label="Zona horaria" value={zonaHoraria} onChange={(e) => setZonaHoraria(e.target.value)} options={ZONAS_HORARIAS} disabled={isView} />
          </div>
          <div className={styles.field}>
            <TextField label="Teléfono" value={telefono} onChange={(e) => setTelefono(e.target.value)} disabled={isView} />
          </div>
          <div className={styles.field}>
            <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isView} />
          </div>
        </div>
      </FormContainer>

      <Accordion title="Certificados y documentos" defaultExpanded={false}>
        <div className={styles.fieldsRow}>
          <div className={styles.field}>
            <FileUpload
              label="Logo"
              value={logoFileName}
              onChange={(e) => setLogoFileName(e.target.files[0]?.name ?? '')}
              accept="image/*"
              disabled={isView}
            />
          </div>
          <div className={styles.field}>
            <FileUpload
              label="Certificado AFIP"
              value={certificadoAfipFileName}
              onChange={(e) => setCertificadoAfipFileName(e.target.files[0]?.name ?? '')}
              disabled={isView}
            />
          </div>
        </div>
        <Checkbox
          label="Tiene clave de certificado"
          checked={tieneClaveCertificado}
          onChange={(e) => setTieneClaveCertificado(e.target.checked)}
          disabled={isView}
        />
        {tieneClaveCertificado && (
          <div className={styles.fieldsRow}>
            <div className={styles.field}>
              <TextField
                label="Clave del certificado"
                type="password"
                value={claveCertificado}
                onChange={(e) => setClaveCertificado(e.target.value)}
                disabled={isView}
              />
            </div>
          </div>
        )}
      </Accordion>
    </LayoutMaestroBasico>
  );
}
